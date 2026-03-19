import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ==========================================
// API GET: LẤY DANH SÁCH ĐÁNH GIÁ CỦA TOUR
// ==========================================
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const tourId = searchParams.get('tourId');

        if (!tourId) {
            return NextResponse.json(
                { message: 'Tour ID là bắt buộc' },
                { status: 400 }
            );
        }

        const reviews = await prisma.review.findMany({
            where: { tourId },
            include: {
                user: {
                    select: { email: true, customerProfile: { select: { fullName: true } } }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json(reviews, { status: 200 });
    } catch (error) {
        console.error('Lỗi GET reviews:', error);
        return NextResponse.json({ message: 'Lỗi hệ thống' }, { status: 500 });
    }
}

// ==========================================
// API POST: TẠO ĐÁNH GIÁ MỚI
// ==========================================
export async function POST(request: Request) {
    try {
        const session = await getServerSession();

        if (!session || !session.user?.email) {
            return NextResponse.json(
                { message: 'Chưa đăng nhập' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { tourId, rating, comment } = body;

        if (!tourId || !rating || rating < 1 || rating > 5) {
            return NextResponse.json(
                { message: 'Tour ID và rating (1-5) là bắt buộc' },
                { status: 400 }
            );
        }

        // Lấy user từ email
        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        });

        if (!user) {
            return NextResponse.json(
                { message: 'Người dùng không tồn tại' },
                { status: 404 }
            );
        }

        // Kiểm tra user đã đặt tour này chưa
        const booking = await prisma.booking.findFirst({
            where: {
                userId: user.id,
                tourId,
                status: 'HOAN_THANH'
            }
        });

        if (!booking) {
            return NextResponse.json(
                { message: 'Bạn chỉ có thể đánh giá tour sau khi hoàn thành chuyến đi' },
                { status: 403 }
            );
        }

        // Kiểm tra đã đánh giá chưa
        const existingReview = await prisma.review.findFirst({
            where: {
                userId: user.id,
                tourId
            }
        });

        if (existingReview) {
            return NextResponse.json(
                { message: 'Bạn đã đánh giá tour này rồi' },
                { status: 409 }
            );
        }

        const newReview = await prisma.review.create({
            data: {
                userId: user.id,
                tourId,
                rating: parseInt(rating),
                comment: comment || null
            }
        });

        return NextResponse.json(
            { success: true, review: newReview },
            { status: 201 }
        );
    } catch (error) {
        console.error('Lỗi POST review:', error);
        return NextResponse.json({ error: 'Lỗi hệ thống' }, { status: 500 });
    }
}

// ==========================================
// API PUT: CẬP NHẬT ĐÁNH GIÁ
// ==========================================
export async function PUT(req: Request) {
    try {
        const session = await getServerSession();

        if (!session || !session.user?.email) {
            return NextResponse.json(
                { message: 'Chưa đăng nhập' },
                { status: 401 }
            );
        }

        const body = await req.json();
        const { reviewId, rating, comment } = body;

        if (!reviewId) {
            return NextResponse.json(
                { message: 'Review ID là bắt buộc' },
                { status: 400 }
            );
        }

        // Lấy user từ email
        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        });

        if (!user) {
            return NextResponse.json(
                { message: 'Người dùng không tồn tại' },
                { status: 404 }
            );
        }

        // Kiểm tra review thuộc về user
        const review = await prisma.review.findUnique({
            where: { id: reviewId }
        });

        if (!review || review.userId !== user.id) {
            return NextResponse.json(
                { message: 'Bạn không có quyền cập nhật đánh giá này' },
                { status: 403 }
            );
        }

        const updatedReview = await prisma.review.update({
            where: { id: reviewId },
            data: {
                ...(rating && { rating: parseInt(rating) }),
                ...(comment !== undefined && { comment })
            }
        });

        return NextResponse.json(
            { success: true, review: updatedReview },
            { status: 200 }
        );
    } catch (error) {
        console.error('Lỗi PUT review:', error);
        return NextResponse.json({ error: 'Lỗi hệ thống' }, { status: 500 });
    }
}

// ==========================================
// API DELETE: XÓA ĐÁNH GIÁ
// ==========================================
export async function DELETE(req: Request) {
    try {
        const session = await getServerSession();

        if (!session || !session.user?.email) {
            return NextResponse.json(
                { message: 'Chưa đăng nhập' },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(req.url);
        const reviewId = searchParams.get('id');

        if (!reviewId) {
            return NextResponse.json(
                { message: 'Review ID là bắt buộc' },
                { status: 400 }
            );
        }

        // Lấy user từ email
        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        });

        if (!user) {
            return NextResponse.json(
                { message: 'Người dùng không tồn tại' },
                { status: 404 }
            );
        }

        // Kiểm tra review thuộc về user
        const review = await prisma.review.findUnique({
            where: { id: reviewId }
        });

        if (!review || review.userId !== user.id) {
            return NextResponse.json(
                { message: 'Bạn không có quyền xóa đánh giá này' },
                { status: 403 }
            );
        }

        await prisma.review.delete({
            where: { id: reviewId }
        });

        return NextResponse.json(
            { success: true, message: 'Xóa đánh giá thành công' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Lỗi DELETE review:', error);
        return NextResponse.json({ error: 'Lỗi hệ thống' }, { status: 500 });
    }
}