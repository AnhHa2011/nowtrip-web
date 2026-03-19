import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import { decrypt } from '@/lib/encryption'; // Import hàm giải mã đã tạo

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { fullName, email, phone, password, confirmPassword } = body;

    // 1. KIỂM TRA ĐẦU VÀO (BẮT BUỘC EMAIL VÀ ĐỒNG BỘ MẬT KHẨU)
    if (!fullName || !email || !phone || !password) {
      return NextResponse.json({ message: 'Vui lòng điền đầy đủ thông tin bắt buộc!' }, { status: 400 });
    }

    if (password !== confirmPassword) {
      return NextResponse.json({ message: 'Mật khẩu xác nhận không khớp!' }, { status: 400 });
    }

    // 2. KIỂM TRA TRÙNG LẶP TÀI KHOẢN
    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ email: email }, { phone: phone }] }
    });

    if (existingUser) {
      return NextResponse.json({ message: 'Email hoặc Số điện thoại đã được sử dụng!' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo mã OTP ngẫu nhiên 6 số
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    // 3. TRANSACTION: TẠO TÀI KHOẢN & ĐỒNG BỘ ĐƠN HÀNG CŨ
    const result = await prisma.$transaction(async (tx) => {
      // Tạo User với trạng thái chờ xác thực (isEmailVerified: false)
      const newUser = await tx.user.create({
        data: {
          email: email,
          phone: phone,
          password: hashedPassword,
          role: 'MEMBER',
          isEmailVerified: false,
          verificationToken: otpCode, // Lưu mã OTP vào database để đối chiếu
          customerProfile: { create: { fullName: fullName } }
        }
      });

      // Quét và gom các đơn tour vãng lai cũ bằng SĐT hoặc Email
      await tx.booking.updateMany({
        where: { userId: null, OR: [{ customerPhone: phone }, { customerEmail: email }] },
        data: { userId: newUser.id }
      });

      return newUser;
    });

    // =========================================================
    // 4. BẢO MẬT & CẤU HÌNH GỬI EMAIL ĐỘNG TỪ DATABASE
    // =========================================================
    const emailSetting = await prisma.systemSetting.findUnique({ where: { key: 'EMAIL' } });
    const passwordSetting = await prisma.systemSetting.findUnique({ where: { key: 'SMTP_PASSWORD' } });
    const templateSetting = await prisma.systemSetting.findUnique({ where: { key: 'EMAIL_OTP_TEMPLATE' } });

    // Kiểm tra xem Admin đã nhập cấu hình chưa
    if (!emailSetting || !passwordSetting) {
      console.error("Lỗi: Chưa cấu hình Email gửi đi trong SystemSetting!");
      return NextResponse.json({ message: 'Tài khoản đã tạo nhưng lỗi hệ thống gửi mail. Vui lòng báo Admin!' }, { status: 500 });
    }

    // GIẢI MÃ: Biến chuỗi ngoằn ngoèo trong Database thành mật khẩu thật
    const decryptedPassword = decrypt(passwordSetting.value);

    if (!decryptedPassword) {
      console.error("Lỗi: Quá trình giải mã mật khẩu Email thất bại!");
      return NextResponse.json({ message: 'Lỗi cấu hình mật khẩu Email. Vui lòng báo Admin!' }, { status: 500 });
    }

    // Khởi tạo Nodemailer với thông tin đã giải mã
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: emailSetting.value,
        pass: decryptedPassword
      }
    });

    // Lấy giao diện HTML từ DB, nếu trống thì dùng giao diện mặc định
    let emailHtmlTemplate = templateSetting?.value || `
      <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #15803d; text-align: center;">Chào mừng bạn đến với NowTrip!</h2>
        <p style="color: #374151; font-size: 16px;">Mã xác thực (OTP) của bạn là:</p>
        <div style="text-align: center; margin: 30px 0;">
          <h1 style="color: #ea580c; letter-spacing: 8px; font-size: 36px; background-color: #fff7ed; padding: 15px; border-radius: 8px; display: inline-block; margin: 0;">{{OTP_CODE}}</h1>
        </div>
        <p style="color: #374151; font-size: 16px;">Vui lòng nhập mã này vào trang đăng ký để kích hoạt tài khoản.</p>
      </div>
    `;

    // Thay thế biến {{OTP_CODE}} bằng mã 6 số thực tế
    const finalHtmlContent = emailHtmlTemplate.replace('{{OTP_CODE}}', otpCode);

    // 5. TIẾN HÀNH GỬI EMAIL OTP
    await transporter.sendMail({
      from: `"NowTrip" <${emailSetting.value}>`,
      to: email,
      subject: 'Mã xác thực tài khoản NowTrip',
      html: finalHtmlContent
    });

    // Trả về báo cáo thành công cho giao diện Frontend trượt sang bước nhập OTP
    return NextResponse.json({
      message: 'Vui lòng kiểm tra Email để nhận mã xác thực!',
      email: email
    }, { status: 201 });

  } catch (error: any) {
    console.error("Lỗi Đăng ký:", error);
    return NextResponse.json({ message: 'Đã xảy ra lỗi hệ thống!' }, { status: 500 });
  }
}