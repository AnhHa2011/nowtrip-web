import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ==========================================
// API GET: LẤY DANH SÁCH TẤT CẢ TOUR
// ==========================================
export async function GET() {
    try {
        const tours = await prisma.tour.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                _count: {
                    select: { bookings: true } // Đếm số lượng đơn đặt của từng tour
                }
            }
        });

        return NextResponse.json(tours, { status: 200 });
    } catch (error) {
        console.error('Lỗi GET danh sách Tour:', error);
        return NextResponse.json({ message: 'Lỗi hệ thống' }, { status: 500 });
    }
}

// ==========================================
// API POST: TẠO TOUR MỚI
// ==========================================
export async function POST(req: Request) {
    try {
        const body = await req.json();

        // Tạo tour mới lưu vào Database Prisma
        const newTour = await prisma.tour.create({
            data: {
                title: body.title,
                slug: body.slug,
                image: body.image || null,
                price: body.price,
                duration: body.duration,
                distance: body.distance,
                difficulty: body.difficulty,
                badge: body.badge || null,
                description: body.description || null,
                // Ép kiểu các mảng Dịch vụ/Lịch trình sang chuẩn JSON theo đúng schema.prisma
                itinerary: body.itinerary || [],
                included: body.included || [],
                excluded: body.excluded || [],
                checklist: body.checklist || [],
                isActive: true, // Mặc định mở bán ngay khi tạo
            }
        });

        return NextResponse.json({ message: 'Tạo tour thành công', tour: newTour }, { status: 201 });
    } catch (error) {
        console.error('Lỗi POST Tour:', error);
        return NextResponse.json({ message: 'Lỗi khi tạo tour, có thể Slug (đường dẫn) đã tồn tại!' }, { status: 500 });
    }
}