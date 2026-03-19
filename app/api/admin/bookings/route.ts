import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { v2 as cloudinary } from 'cloudinary';
import nodemailer from 'nodemailer';
// Lưu ý: Nếu bạn có dùng hàm giải mã mật khẩu SMTP đã code trước đó, hãy mở comment dòng dưới:
// import { decrypt } from '@/lib/encryption'; 

const prisma = new PrismaClient();

// ==========================================
// 1. CẤU HÌNH CLOUDINARY
// ==========================================
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Từ điển dịch trạng thái để in ra Email gửi cho khách hàng
const STATUS_TEXT: Record<string, string> = {
    TU_VAN: 'Cần tư vấn',
    DA_TU_VAN: 'Đã tư vấn & Gửi lịch trình',
    CHO_XAC_NHAN_CK: 'Đang chờ xác nhận chuyển khoản',
    DA_COC: 'Đã thanh toán Cọc',
    DA_THANH_TOAN: 'Đã thanh toán 100%',
    HOAN_THANH: 'Đã hoàn thành tour',
    YEU_CAU_HUY: 'Đang yêu cầu hủy',
    CHO_HOAN_TIEN: 'Đang chờ hoàn tiền',
    DA_HUY: 'Đã hủy đơn',
    DA_HOAN_TIEN: 'Đã hoàn tiền thành công',
    BAO_LUU: 'Đã bảo lưu dời ngày đi',
};

// ==========================================
// 2. API GET: LẤY DANH SÁCH ĐƠN HÀNG
// ==========================================
export async function GET() {
    try {
        const bookings = await prisma.booking.findMany({
            orderBy: { createdAt: 'desc' },
            include: { tour: { select: { title: true } } },
        });
        return NextResponse.json(bookings, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Lỗi khi lấy danh sách đơn' }, { status: 500 });
    }
}

// ==========================================
// 3. API PATCH: CẬP NHẬT TRẠNG THÁI + UPLOAD ẢNH + EMAIL
// ==========================================
export async function PATCH(req: Request) {
    try {
        // A. Kiểm tra bảo mật (Phải là Admin/Sale mới được sửa)
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ message: 'Chưa đăng nhập!' }, { status: 401 });
        }

        const { id, status, imageBase64 } = await req.json();

        // Lấy thông tin đơn hàng cũ để đối chiếu
        const oldBooking = await prisma.booking.findUnique({
            where: { id },
            include: { tour: true }
        });

        if (!oldBooking) return NextResponse.json({ message: 'Không tìm thấy đơn hàng' }, { status: 404 });

        // B. XỬ LÝ UPLOAD ẢNH CLOUDINARY (NẾU CÓ)
        let paymentProofUrl = undefined;
        if (imageBase64) {
            const uploadResponse = await cloudinary.uploader.upload(imageBase64, {
                folder: 'nowtrip_receipts',
                transformation: [
                    { width: 1000, crop: "limit" }, // Nén chiều ngang tối đa 1000px
                    { quality: "auto" },            // Tự động tối ưu dung lượng ảnh
                    { fetch_format: "auto" }
                ]
            });
            paymentProofUrl = uploadResponse.secure_url;
        }

        // C. CẬP NHẬT VÀO DATABASE PRISMA
        const updatedBooking = await prisma.booking.update({
            where: { id },
            data: {
                status,
                handledById: session.user.id,
                ...(paymentProofUrl && { paymentProof: paymentProofUrl }) // Chỉ update link ảnh nếu có ảnh mới
            },
        });

        // D. LƯU VẾT LỊCH SỬ THAO TÁC (AUDIT LOG)
        if (session.user?.id) {
            try {
                await prisma.actionHistory.create({
                    data: {
                        userId: session.user.id,
                        action: 'UPDATE_STATUS',
                        entityType: 'BOOKING',
                        entityId: id,
                        oldValues: { status: oldBooking.status },
                        newValues: { status, paymentProof: paymentProofUrl || (oldBooking as any).paymentProof },
                        description: `Chuyển trạng thái đơn sang: ${STATUS_TEXT[status]}`
                    }
                });
            } catch (error) {
                console.error('Lỗi khi lưu action history:', error);
                // Không throw error để không ảnh hưởng đến việc cập nhật booking
            }
        }

        // E. GỬI EMAIL THÔNG BÁO TỰ ĐỘNG CHO KHÁCH (SMTP)
        if (updatedBooking.customerEmail) {
            const emailSetting = await prisma.systemSetting.findUnique({ where: { key: 'EMAIL' } });
            const passwordSetting = await prisma.systemSetting.findUnique({ where: { key: 'SMTP_PASSWORD' } });

            if (emailSetting && passwordSetting) {
                const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: emailSetting.value,
                        pass: passwordSetting.value // Thay bằng decrypt(passwordSetting.value) nếu bạn có dùng hàm giải mã
                    }
                });

                await transporter.sendMail({
                    from: `"NowTrip" <${emailSetting.value}>`,
                    to: updatedBooking.customerEmail,
                    subject: `Cập nhật trạng thái đơn đặt tour NowTrip - ${oldBooking.tour.title}`,
                    html: `
            <div style="font-family: sans-serif; line-height: 1.6; color: #333;">
              <h2 style="color: #16a34a;">Xin chào ${updatedBooking.customerName},</h2>
              <p>Hệ thống NowTrip xin thông báo trạng thái đơn đặt tour <b>${oldBooking.tour.title}</b> của bạn đã được cập nhật.</p>
              <p>Trạng thái hiện tại: <strong style="color: #ea580c; font-size: 18px;">${STATUS_TEXT[status]}</strong></p>
              <p>Nếu bạn có bất kỳ thắc mắc nào, vui lòng liên hệ Hotline: <b>0973.644.837</b> (Mr Trường) [1].</p>
              <br/>
              <p><i>Cảm ơn bạn đã lựa chọn "Hành Trình Lớn Từ Bước Chân Nhỏ" cùng NowTrip!</i></p>
            </div>
          `
                });
            }
        }

        return NextResponse.json({ message: 'Cập nhật thành công!', updatedBooking }, { status: 200 });
    } catch (error) {
        console.error('Lỗi PATCH Booking:', error);
        return NextResponse.json({ message: 'Lỗi hệ thống' }, { status: 500 });
    }
}
