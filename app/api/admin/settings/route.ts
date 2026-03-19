import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { encrypt } from '@/lib/encryption';

const prisma = new PrismaClient();

export async function POST(req: Request) {
    try {
        const { key, value } = await req.json();
        let finalValue = value;

        // KÍCH HOẠT BẢO MẬT: Nếu dữ liệu gửi lên là Mật khẩu Email, tiến hành mã hóa 2 chiều
        if (key === 'SMTP_PASSWORD' && value) {
            finalValue = encrypt(value);
        }

        // Lưu vào bảng SystemSetting
        await prisma.systemSetting.upsert({
            where: { key: key },
            update: { value: finalValue },
            create: {
                key: key,
                value: finalValue,
                description: 'Cập nhật từ Admin Dashboard'
            }
        });

        return NextResponse.json({ message: 'Cập nhật cấu hình thành công!' }, { status: 200 });
    } catch (error) {
        console.error("Lỗi lưu cấu hình:", error);
        return NextResponse.json({ message: 'Đã xảy ra lỗi hệ thống!' }, { status: 500 });
    }
}