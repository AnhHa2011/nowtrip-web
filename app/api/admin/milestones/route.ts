import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ==========================================
// API GET: LẤY DANH SÁCH MỐC THỜI GIAN CÔNG TY
// ==========================================
export async function GET() {
    try {
        const milestones = await prisma.milestone.findMany({
            orderBy: { period: 'desc' }
        });

        return NextResponse.json(milestones, { status: 200 });
    } catch (error) {
        console.error('Lỗi GET milestones:', error);
        return NextResponse.json({ message: 'Lỗi hệ thống' }, { status: 500 });
    }
}

// ==========================================
// API POST: TẠO MỐC THỜI GIAN MỚI
// ==========================================
export async function POST(req: Request) {
    try {
        const session = await getServerSession();

        if (!session || (session.user as any)?.role !== 'ADMIN') {
            return NextResponse.json(
                { message: 'Chỉ admin mới có quyền' },
                { status: 403 }
            );
        }

        const body = await req.json();
        const { year, title, description, icon } = body;

        if (!year || !title) {
            return NextResponse.json(
                { message: 'Year và title là bắt buộc' },
                { status: 400 }
            );
        }

        const newMilestone = await prisma.milestone.create({
            data: {
                period: year,
                title,
                description: description || null,
            }
        });

        return NextResponse.json(
            { message: 'Tạo mốc thời gian thành công', milestone: newMilestone },
            { status: 201 }
        );
    } catch (error) {
        console.error('Lỗi POST milestone:', error);
        return NextResponse.json({ message: 'Lỗi hệ thống' }, { status: 500 });
    }
}

// ==========================================
// API PUT: CẬP NHẬT MỐC THỜI GIAN
// ==========================================
export async function PUT(req: Request) {
    try {
        const session = await getServerSession();

        if (!session || (session.user as any)?.role !== 'ADMIN') {
            return NextResponse.json(
                { message: 'Chỉ admin mới có quyền' },
                { status: 403 }
            );
        }

        const body = await req.json();
        const { id, year, title, description, icon } = body;

        if (!id) {
            return NextResponse.json(
                { message: 'ID mốc thời gian là bắt buộc' },
                { status: 400 }
            );
        }

        const updatedMilestone = await prisma.milestone.update({
            where: { id },
            data: {
                ...(year && { year: parseInt(year) }),
                ...(title && { title }),
                ...(description !== undefined && { description }),
                ...(icon !== undefined && { icon })
            }
        });

        return NextResponse.json(
            { message: 'Cập nhật mốc thời gian thành công', milestone: updatedMilestone },
            { status: 200 }
        );
    } catch (error) {
        console.error('Lỗi PUT milestone:', error);
        return NextResponse.json({ message: 'Lỗi hệ thống' }, { status: 500 });
    }
}

// ==========================================
// API DELETE: XÓA MỐC THỜI GIAN
// ==========================================
export async function DELETE(req: Request) {
    try {
        const session = await getServerSession();

        if (!session || (session.user as any)?.role !== 'ADMIN') {
            return NextResponse.json(
                { message: 'Chỉ admin mới có quyền' },
                { status: 403 }
            );
        }

        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { message: 'ID mốc thời gian là bắt buộc' },
                { status: 400 }
            );
        }

        await prisma.milestone.delete({
            where: { id }
        });

        return NextResponse.json(
            { message: 'Xóa mốc thời gian thành công' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Lỗi DELETE milestone:', error);
        return NextResponse.json({ message: 'Lỗi hệ thống' }, { status: 500 });
    }
}