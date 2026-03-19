import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import nodemailer from 'nodemailer';
import { decrypt } from '@/lib/encryption';

const prisma = new PrismaClient();

export async function POST(req: Request) {
    try {
        const { email } = await req.json();

        if (!email) return NextResponse.json({ message: 'Vui lòng cung cấp email!' }, { status: 400 });

        // 1. Kiểm tra tài khoản trong Database
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return NextResponse.json({ message: 'Không tìm thấy tài khoản!' }, { status: 404 });
        if (user.isEmailVerified) return NextResponse.json({ message: 'Tài khoản này đã được xác thực rồi!' }, { status: 400 });

        // 2. Tạo mã OTP mới
        const newOtpCode = Math.floor(100000 + Math.random() * 900000).toString();

        // 3. Cập nhật mã mới vào Database
        await prisma.user.update({
            where: { email },
            data: { verificationToken: newOtpCode }
        });

        // 4. Lấy cấu hình Email từ Database
        const emailSetting = await prisma.systemSetting.findUnique({ where: { key: 'EMAIL' } });
        const passwordSetting = await prisma.systemSetting.findUnique({ where: { key: 'SMTP_PASSWORD' } });

        if (!emailSetting || !passwordSetting) throw new Error("Chưa cấu hình Email");
        const decryptedPassword = decrypt(passwordSetting.value);

        // 5. Gửi lại Email
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: { user: emailSetting.value, pass: decryptedPassword }
        });

        await transporter.sendMail({
            from: `"NowTrip" <${emailSetting.value}>`,
            to: email,
            subject: 'Mã xác thực tài khoản NowTrip (Gửi lại)',
            html: `<h3>Mã xác thực mới của bạn là: <b style="color: #ea580c; font-size: 24px;">${newOtpCode}</b></h3>`
        });

        return NextResponse.json({ message: 'Đã gửi lại mã OTP. Vui lòng kiểm tra Email!' }, { status: 200 });
    } catch (error) {
        console.error("Lỗi gửi lại OTP:", error);
        return NextResponse.json({ message: 'Đã xảy ra lỗi hệ thống!' }, { status: 500 });
    }
}