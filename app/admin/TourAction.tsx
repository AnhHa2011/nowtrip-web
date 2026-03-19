'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function TourActions({ tourId, isActive }: { tourId: string, isActive: boolean }) {
    const router = useRouter();

    const handleToggleActive = async () => {
        // 1. HỘP THOẠI CONFIRM XÁC NHẬN
        const actionText = isActive ? 'ẨN (Tạm ngưng)' : 'HIỆN (Mở bán)';
        if (!window.confirm(`⚠️ Bạn có chắc chắn muốn ${actionText} tour này trên website không?`)) {
            return;
        }

        // 2. GỌI API ĐỂ CẬP NHẬT TRẠNG THÁI
        try {
            const res = await fetch(`/api/admin/tours/${tourId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isActive: !isActive }) // Đảo ngược trạng thái hiện tại
            });

            if (res.ok) {
                router.refresh(); // Tải lại trang ngay lập tức để cập nhật UI
            } else {
                alert('Có lỗi xảy ra, vui lòng thử lại!');
            }
        } catch (error) {
            console.error(error);
            alert('Lỗi kết nối máy chủ!');
        }
    };

    return (
        <div className="flex gap-3 items-center">
            {/* Nút Sửa (Chuyển hướng sang Form Edit) */}
            <Link href={`/admin/tours/${tourId}/edit`}>
                <button className="text-blue-600 hover:text-blue-900 font-semibold text-sm transition bg-blue-50 px-3 py-1.5 rounded-md hover:bg-blue-100">
                    ✏️ Sửa
                </button>
            </Link>

            {/* Nút Ẩn/Hiện */}
            <button
                onClick={handleToggleActive}
                className={`font-semibold text-sm transition px-3 py-1.5 rounded-md ${isActive
                    ? 'text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100'
                    : 'text-green-600 hover:text-green-900 bg-green-50 hover:bg-green-100'
                    }`}
            >
                {isActive ? '🚫 Ẩn' : '✅ Hiện'}
            </button>
        </div>
    );
}