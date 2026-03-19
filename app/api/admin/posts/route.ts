import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ==========================================
// API GET: LẤY DANH SÁCH TẤT CẢ BÀI VIẾT
// ==========================================
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const category = searchParams.get('category');
        const search = searchParams.get('search');

        const where: any = {};
        if (category) where.category = category;
        if (search) {
            where.OR = [
                { title: { contains: search } },
                { content: { contains: search } }
            ];
        }

        const posts = await prisma.post.findMany({
            where,
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json(posts, { status: 200 });
    } catch (error) {
        console.error('Lỗi GET danh sách bài viết:', error);
        return NextResponse.json({ message: 'Lỗi hệ thống' }, { status: 500 });
    }
}

// ==========================================
// API POST: TẠO BÀI VIẾT MỚI
// ==========================================
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { title, slug, category, content, thumbnail } = body;

        if (!title || !slug || !category || !content) {
            return NextResponse.json(
                { message: 'Tiêu đề, slug, danh mục và nội dung là bắt buộc' },
                { status: 400 }
            );
        }

        // Kiểm tra slug đã tồn tại
        const existingPost = await prisma.post.findUnique({
            where: { slug }
        });

        if (existingPost) {
            return NextResponse.json(
                { message: 'Slug này đã tồn tại' },
                { status: 409 }
            );
        }

        const newPost = await prisma.post.create({
            data: {
                title,
                slug,
                category,
                content,
                thumbnail: thumbnail || null,
                isActive: true
            }
        });

        return NextResponse.json(
            { message: 'Tạo bài viết thành công', post: newPost },
            { status: 201 }
        );
    } catch (error) {
        console.error('Lỗi POST bài viết:', error);
        return NextResponse.json({ message: 'Lỗi khi tạo bài viết' }, { status: 500 });
    }
}

// ==========================================
// API PUT: CẬP NHẬT BÀI VIẾT
// ==========================================
export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const { id, title, slug, category, content, thumbnail, isActive } = body;

        if (!id) {
            return NextResponse.json(
                { message: 'ID bài viết là bắt buộc' },
                { status: 400 }
            );
        }

        // Kiểm tra slug đã tồn tại (ngoại trừ bài viết hiện tại)
        if (slug) {
            const existingPost = await prisma.post.findUnique({
                where: { slug }
            });

            if (existingPost && existingPost.id !== id) {
                return NextResponse.json(
                    { message: 'Slug này đã tồn tại' },
                    { status: 409 }
                );
            }
        }

        const updatedPost = await prisma.post.update({
            where: { id },
            data: {
                ...(title && { title }),
                ...(slug && { slug }),
                ...(category && { category }),
                ...(content && { content }),
                ...(thumbnail !== undefined && { thumbnail }),
                ...(isActive !== undefined && { isActive })
            }
        });

        return NextResponse.json(
            { message: 'Cập nhật bài viết thành công', post: updatedPost },
            { status: 200 }
        );
    } catch (error) {
        console.error('Lỗi PUT bài viết:', error);
        return NextResponse.json({ message: 'Lỗi khi cập nhật bài viết' }, { status: 500 });
    }
}

// ==========================================
// API DELETE: XÓA BÀI VIẾT (Soft Delete)
// ==========================================
export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { message: 'ID bài viết là bắt buộc' },
                { status: 400 }
            );
        }

        // Soft delete: chỉ đặt isActive = false
        await prisma.post.update({
            where: { id },
            data: { isActive: false }
        });

        return NextResponse.json(
            { message: 'Xóa bài viết thành công' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Lỗi DELETE bài viết:', error);
        return NextResponse.json({ message: 'Lỗi khi xóa bài viết' }, { status: 500 });
    }
}