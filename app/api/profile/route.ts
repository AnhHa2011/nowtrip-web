import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
    try {
        const session = await getServerSession();

        if (!session || !session.user?.email) {
            return NextResponse.json(
                { message: 'Chưa đăng nhập' },
                { status: 401 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            include: {
                customerProfile: true,
                bookings: {
                    orderBy: { createdAt: 'desc' },
                    include: {
                        tour: {
                            select: { title: true, slug: true, image: true, duration: true }
                        }
                    }
                }
            }
        });

        if (!user) {
            return NextResponse.json(
                { message: 'Người dùng không tồn tại' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            id: user.id,
            email: user.email,
            phone: user.phone,
            role: user.role,
            customerProfile: user.customerProfile,
            bookings: user.bookings
        }, { status: 200 });
    } catch (error) {
        console.error('Lỗi GET profile:', error);
        return NextResponse.json(
            { message: 'Lỗi hệ thống' },
            { status: 500 }
        );
    }
}