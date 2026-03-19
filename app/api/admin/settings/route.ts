import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { encrypt } from '@/lib/encryption';

const prisma = new PrismaClient();

// ==========================================
// API GET: LẤY TẤT CẢ CÀI ĐẶT HỆ THỐNG
// ==========================================
export async function GET() {
    try {
        const settings = await prisma.systemSetting.findMany({
            orderBy: { key: 'asc' }
        });

        return NextResponse.json(settings, { status: 200 });
    } catch (error) {
        console.error('Lỗi GET cài đặt:', error);
        return NextResponse.json({ message: 'Lỗi hệ thống' }, { status: 500 });
    }
}

// ==========================================
// API POST: TẠO HOẶC CẬP NHẬT CÀI ĐẶT
// ==========================================
export async function POST(req: Request) {
    try {
        const { key, value } = await req.json();
        let finalValue = value;

        // KÍCH HOẠT BẢO MẬT: Nếu dữ liệu gửi lên là Mật khẩu Email, tiến hành mã hóa 2 chiều
        if (key === 'SMTP_PASSWORD' && value) {
            finalValue = encrypt(value);
        }

        // Lưu vào bảng SystemSetting
        const result = await prisma.systemSetting.upsert({
            where: { key: key },
            update: { value: finalValue },
            create: {
                key: key,
                value: finalValue,
                description: 'Cập nhật từ Admin Dashboard'
            }
        });

        return NextResponse.json({ message: 'Cập nhật cấu hình thành công!', setting: result }, { status: 200 });
    } catch (error) {
        console.error("Lỗi lưu cấu hình:", error);
        return NextResponse.json({ message: 'Đã xảy ra lỗi hệ thống!' }, { status: 500 });
    }
}

// ==========================================
// API PUT: CẬP NHẬT CÀI ĐẶT HỆ THỐNG
// ==========================================
export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const { key, value, description } = body;

        if (!key || value === undefined) {
            return NextResponse.json(
                { message: 'Key và Value là bắt buộc' },
                { status: 400 }
            );
        }

        let finalValue = value;
        if (key === 'SMTP_PASSWORD' && value) {
            finalValue = encrypt(value);
        }

        const result = await prisma.systemSetting.upsert({
            where: { key },
            update: {
                value: finalValue,
                description: description || undefined
            },
            create: {
                key,
                value: finalValue,
                description: description || ''
            }
        });

        return NextResponse.json(
            { message: 'Cập nhật cài đặt thành công', setting: result },
            { status: 200 }
        );
    } catch (error) {
        console.error('Lỗi PUT cài đặt:', error);
        return NextResponse.json({ message: 'Lỗi khi cập nhật cài đặt' }, { status: 500 });
    }
}

// ==========================================
// API DELETE: XÓA CÀI ĐẶT HỆ THỐNG
// ==========================================
export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const key = searchParams.get('key');

        if (!key) {
            return NextResponse.json(
                { message: 'Key là bắt buộc' },
                { status: 400 }
            );
        }

        await prisma.systemSetting.delete({
            where: { key }
        });

        return NextResponse.json(
            { message: 'Xóa cài đặt thành công' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Lỗi DELETE cài đặt:', error);
        return NextResponse.json({ message: 'Lỗi khi xóa cài đặt' }, { status: 500 });
    }
}