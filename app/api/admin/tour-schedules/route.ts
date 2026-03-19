import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ==========================================
// API GET: LẤY DANH SÁCH LỊCH TOUR
// ==========================================
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const tourId = searchParams.get('tourId');

        const where: any = {};
        if (tourId) where.tourId = tourId;

        const schedules = await prisma.tourSchedule.findMany({
            where,
            include: {
                tour: true,
                _count: {
                    select: { bookings: true }
                }
            },
            orderBy: { startDate: 'desc' }
        });

        return NextResponse.json(schedules, { status: 200 });
    } catch (error) {
        console.error('Lỗi GET danh sách lịch tour:', error);
        return NextResponse.json({ message: 'Lỗi hệ thống' }, { status: 500 });
    }
}

// ==========================================
// API POST: TẠO LỊCH TOUR MỚI
// ==========================================
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { tourId, startDate, endDate, totalSlots, price } = body;

        if (!tourId || !startDate || !endDate || !totalSlots) {
            return NextResponse.json(
                { message: 'Các trường bắt buộc: tourId, startDate, endDate, totalSlots' },
                { status: 400 }
            );
        }

        // Kiểm tra tour tồn tại
        const tour = await prisma.tour.findUnique({
            where: { id: tourId }
        });

        if (!tour) {
            return NextResponse.json(
                { message: 'Tour không tồn tại' },
                { status: 404 }
            );
        }

        const newSchedule = await prisma.tourSchedule.create({
            data: {
                tourId,
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                totalSlots: parseInt(totalSlots),
                price: price || null,
                isActive: true
            }
        });

        return NextResponse.json(
            { message: 'Tạo lịch tour thành công', schedule: newSchedule },
            { status: 201 }
        );
    } catch (error) {
        console.error('Lỗi POST lịch tour:', error);
        return NextResponse.json({ message: 'Lỗi khi tạo lịch tour' }, { status: 500 });
    }
}

// ==========================================
// API PUT: CẬP NHẬT LỊCH TOUR
// ==========================================
export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const { id, startDate, endDate, totalSlots, price, isActive } = body;

        if (!id) {
            return NextResponse.json(
                { message: 'ID lịch tour là bắt buộc' },
                { status: 400 }
            );
        }

        const updatedSchedule = await prisma.tourSchedule.update({
            where: { id },
            data: {
                ...(startDate && { startDate: new Date(startDate) }),
                ...(endDate && { endDate: new Date(endDate) }),
                ...(totalSlots && { totalSlots: parseInt(totalSlots) }),
                ...(price !== undefined && { price }),
                ...(isActive !== undefined && { isActive })
            }
        });

        return NextResponse.json(
            { message: 'Cập nhật lịch tour thành công', schedule: updatedSchedule },
            { status: 200 }
        );
    } catch (error) {
        console.error('Lỗi PUT lịch tour:', error);
        return NextResponse.json({ message: 'Lỗi khi cập nhật lịch tour' }, { status: 500 });
    }
}

// ==========================================
// API DELETE: XÓA LỊCH TOUR
// ==========================================
export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { message: 'ID lịch tour là bắt buộc' },
                { status: 400 }
            );
        }

        // Kiểm tra có booking liên kết không
        const bookingCount = await prisma.booking.count({
            where: { tourScheduleId: id }
        });

        if (bookingCount > 0) {
            return NextResponse.json(
                { message: 'Không thể xóa lịch tour đã có đơn đặt' },
                { status: 409 }
            );
        }

        await prisma.tourSchedule.delete({
            where: { id }
        });

        return NextResponse.json(
            { message: 'Xóa lịch tour thành công' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Lỗi DELETE lịch tour:', error);
        return NextResponse.json({ message: 'Lỗi khi xóa lịch tour' }, { status: 500 });
    }
}