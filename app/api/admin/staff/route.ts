import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ==========================================
// API GET: LẤY DANH SÁCH NHÂN VIÊN
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

        const staff = await prisma.staffProfile.findMany({
            include: {
                user: {
                    select: { id: true, email: true, phone: true, isActive: true }
                }
            },
            orderBy: { hireDate: 'desc' }
        });

        return NextResponse.json(staff, { status: 200 });
    } catch (error) {
        console.error('Lỗi GET staff:', error);
        return NextResponse.json({ message: 'Lỗi hệ thống' }, { status: 500 });
    }
}

// ==========================================
// API PUT: CẬP NHẬT THÔNG TIN NHÂN VIÊN
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
        const { id, fullName, position, department, phone, address, isActive } = body;

        if (!id) {
            return NextResponse.json(
                { message: 'ID nhân viên là bắt buộc' },
                { status: 400 }
            );
        }

        const updatedStaff = await prisma.staffProfile.update({
            where: { id },
            data: {
                ...(fullName && { fullName }),
                ...(position && { position }),
                ...(department && { department }),
                ...(phone && { phone }),
                ...(address && { address }),
                ...(isActive !== undefined && { isActive })
            }
        });

        return NextResponse.json(
            { message: 'Cập nhật thông tin nhân viên thành công', staff: updatedStaff },
            { status: 200 }
        );
    } catch (error) {
        console.error('Lỗi PUT staff:', error);
        return NextResponse.json({ message: 'Lỗi hệ thống' }, { status: 500 });
    }
}