import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
    try {
        const { tourId, userId, rating, comment } = await request.json();
        if (!userId) return NextResponse.json({ error: 'Chưa đăng nhập' }, { status: 401 });

        const newReview = await prisma.review.create({
            data: { tourId, userId, rating, comment },
        });

        return NextResponse.json({ success: true, review: newReview }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Lỗi hệ thống' }, { status: 500 });
    }
}