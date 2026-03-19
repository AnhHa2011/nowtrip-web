import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ==========================================
// API GET: LẤY DANH SÁCH LỊCH SỬ HÀNH ĐỘNG
// ==========================================
export async function GET(req: Request) {
    try {
        const session = await getServerSession();

        if (!session || (session.user as any)?.role !== 'ADMIN') {
            return NextResponse.json(
                { message: 'Chỉ admin mới có quyền xem' },
                { status: 403 }
            );
        }

        const { searchParams } = new URL(req.url);
        const action = searchParams.get('action');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '50');

        const where: any = {};
        if (action) where.action = action;

        const [history, total] = await Promise.all([
            prisma.actionHistory.findMany({
                where,
                include: {
                    user: {
                        select: { email: true, customerProfile: { select: { fullName: true } } }
                    }
                },
                orderBy: { createdAt: 'desc' },
                skip: (page - 1) * limit,
                take: limit
            }),
            prisma.actionHistory.count({ where })
        ]);

        return NextResponse.json({
            data: history,
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit)
            }
        }, { status: 200 });
    } catch (error) {
        console.error('Lỗi GET action history:', error);
        return NextResponse.json({ message: 'Lỗi hệ thống' }, { status: 500 });
    }
}

// ==========================================
// API POST: GHI LẠI HÀNH ĐỘNG
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
        const { action, entityType, entityId, details } = body;

        if (!action || !entityType) {
            return NextResponse.json(
                { message: 'Action và entityType là bắt buộc' },
                { status: 400 }
            );
        }

        const admin = await prisma.user.findUnique({
            where: { email: session.user?.email as string }
        });

        if (!admin) {
            return NextResponse.json(
                { message: 'Admin không tồn tại' },
                { status: 404 }
            );
        }

        const record = await prisma.actionHistory.create({
            data: {
                userId: admin.id,
                action,
                entityType,
                entityId: entityId || null,
                description: details || null
            }
        });

        return NextResponse.json(
            { message: 'Ghi lại hành động thành công', record },
            { status: 201 }
        );
    } catch (error) {
        console.error('Lỗi POST action history:', error);
        return NextResponse.json({ message: 'Lỗi hệ thống' }, { status: 500 });
    }
}