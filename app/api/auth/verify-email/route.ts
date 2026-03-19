import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, otp } = body;

        // 1. Kiểm tra dữ liệu đầu vào
        if (!email || !otp) {
            return NextResponse.json({ message: 'Vui lòng nhập đầy đủ mã xác thực!' }, { status: 400 });
        }

        // 2. Tìm tài khoản trong Database
        const user = await prisma.user.findUnique({
            where: { email: email }
        });

        if (!user) {
            return NextResponse.json({ message: 'Không tìm thấy tài khoản với email này!' }, { status: 404 });
        }

        if (user.isEmailVerified) {
            return NextResponse.json({ message: 'Tài khoản này đã được xác thực trước đó!' }, { status: 400 });
        }

        // 3. Đối chiếu mã OTP
        if (user.verificationToken !== otp) {
            return NextResponse.json({ message: 'Mã xác thực không chính xác. Vui lòng thử lại!' }, { status: 400 });
        }

        // 3. KIỂM TRA HẾT HẠN
        // Nếu thời gian hiện tại (new Date()) lớn hơn thời gian lưu trong DB -> Đã hết hạn
        if (user.otpExpiresAt && new Date() > user.otpExpiresAt) {
            return NextResponse.json({ message: 'Mã xác thực đã hết hạn! Vui lòng bấm gửi lại mã.' }, { status: 400 });
        }

        // 4. XÁC THỰC THÀNH CÔNG -> XÓA SẠCH MÃ VÀ HẠN SỬ DỤNG ĐỂ KHÔNG BỊ DÙNG LẠI

        await prisma.user.update({
            where: { email: email },
            data: {
                isEmailVerified: true,
                verificationToken: null, // Xóa mã OTP sau khi sử dụng xong
            }
        });

        return NextResponse.json({ message: 'Xác thực tài khoản thành công!' }, { status: 200 });

    } catch (error: any) {
        console.error("Lỗi xác thực Email:", error);
        return NextResponse.json({ message: 'Đã xảy ra lỗi hệ thống!' }, { status: 500 });
    }
}
