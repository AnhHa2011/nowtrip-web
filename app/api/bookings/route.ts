import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ==========================================
// API GET: LẤY DANH SÁCH ĐƠN ĐẶT CỦA NGƯỜI DÙNG
// ==========================================
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
            where: { email: session.user.email }
        });

        if (!user) {
            return NextResponse.json(
                { message: 'Người dùng không tồn tại' },
                { status: 404 }
            );
        }

        const bookings = await prisma.booking.findMany({
            where: { userId: user.id },
            include: {
                tour: {
                    select: { id: true, title: true, slug: true, image: true }
                },
                tourSchedule: {
                    select: { startDate: true, endDate: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json(bookings, { status: 200 });
    } catch (error) {
        console.error('Lỗi GET bookings:', error);
        return NextResponse.json(
            { message: 'Lỗi hệ thống' },
            { status: 500 }
        );
    }
}

// ==========================================
// API POST: TẠO ĐƠN ĐẶT TOUR MỚI
// ==========================================
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { tourId, tourScheduleId, customerName, customerPhone, customerEmail, pax, userId } = body;

        // Kiểm tra dữ liệu đầu vào
        if (!tourId || !tourScheduleId || !customerName || !customerPhone || !pax) {
            return NextResponse.json({ message: 'Vui lòng điền đầy đủ thông tin bắt buộc!' }, { status: 400 });
        }

        // Sử dụng Transaction để đảm bảo tính toàn vẹn dữ liệu (Nếu 1 bước lỗi, toàn bộ sẽ rollback)
        const result = await prisma.$transaction(async (tx) => {
            // 1. Lấy thông tin Lịch khởi hành
            const schedule = await tx.tourSchedule.findUnique({
                where: { id: tourScheduleId }
            });

            if (!schedule || !schedule.isActive) {
                throw new Error('Lịch khởi hành này không tồn tại hoặc đã đóng.');
            }

            // 2. Tính toán số chỗ còn trống
            const availableSlots = schedule.totalSlots - schedule.bookedSlots;
            if (pax > availableSlots) {
                throw new Error(`Rất tiếc! Lịch này chỉ còn trống ${availableSlots} chỗ.`);
            }

            // 3. Tạo đơn đặt tour (Booking)
            const newBooking = await tx.booking.create({
                data: {
                    tourId,
                    tourScheduleId,
                    customerName,
                    customerPhone,
                    customerEmail,
                    pax: Number(pax),
                    userId: userId || null,
                    status: 'TU_VAN', // Trạng thái mặc định khi mới đặt
                }
            });

            // 4. Cập nhật số chỗ đã đặt vào TourSchedule
            await tx.tourSchedule.update({
                where: { id: tourScheduleId },
                data: {
                    bookedSlots: schedule.bookedSlots + Number(pax)
                }
            });

            return newBooking;
        });

        return NextResponse.json({ message: 'Đặt tour thành công!', booking: result }, { status: 201 });

    } catch (error: any) {
        console.error("Lỗi đặt tour:", error);
        return NextResponse.json(
            { message: error.message || 'Đã xảy ra lỗi hệ thống, vui lòng thử lại sau!' },
            { status: 500 }
        );
    }
}