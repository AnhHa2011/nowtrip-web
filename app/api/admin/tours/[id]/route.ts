import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ==========================================
// 1. API GET: LẤY THÔNG TIN 1 TOUR ĐỂ ĐIỀN VÀO FORM SỬA
// ==========================================
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const resolvedParams = await params;
        const tourId = resolvedParams.id;

        const tour = await prisma.tour.findUnique({
            where: { id: tourId },
        });

        if (!tour) {
            return NextResponse.json({ message: 'Không tìm thấy tour' }, { status: 404 });
        }

        return NextResponse.json(tour, { status: 200 });
    } catch (error) {
        console.error('Lỗi GET chi tiết Tour:', error);
        return NextResponse.json({ message: 'Lỗi hệ thống' }, { status: 500 });
    }
}

// ==========================================
// 2. API PATCH: LƯU CẬP NHẬT TOUR HOẶC ẨN/HIỆN
// ==========================================
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const resolvedParams = await params;
        const tourId = resolvedParams.id;
        const body = await req.json();

        // Prisma thông minh tự động chỉ cập nhật những trường được gửi lên trong biến "body"
        const updatedTour = await prisma.tour.update({
            where: { id: tourId },
            data: body,
        });

        return NextResponse.json({ message: 'Cập nhật thành công', tour: updatedTour }, { status: 200 });
    } catch (error) {
        console.error('Lỗi PATCH Tour:', error);
        return NextResponse.json({ message: 'Lỗi hệ thống' }, { status: 500 });
    }
}

// ==========================================
// 3. API DELETE: XÓA TOUR (NẾU CẦN)
// ==========================================
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const resolvedParams = await params;
        const tourId = resolvedParams.id;

        await prisma.tour.delete({
            where: { id: tourId },
        });

        return NextResponse.json({ message: 'Xóa tour thành công' }, { status: 200 });
    } catch (error) {
        console.error('Lỗi DELETE Tour:', error);
        return NextResponse.json({ message: 'Lỗi hệ thống' }, { status: 500 });
    }
}
