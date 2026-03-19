import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// Chuẩn Next.js 15+: params là một Promise
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const resolvedParams = await params;
        const bookingId = resolvedParams.id;

        // Lấy trạng thái mới từ Client gửi lên
        const body = await request.json();
        const { status } = body;

        // Cập nhật vào Database MySQL
        const updatedBooking = await prisma.booking.update({
            where: { id: bookingId },
            data: { status: status }
        });

        return NextResponse.json({ message: 'Cập nhật thành công', booking: updatedBooking });
    } catch (error) {
        console.error('Lỗi cập nhật đơn hàng:', error);
        return NextResponse.json({ error: 'Lỗi máy chủ' }, { status: 500 });
    }
}