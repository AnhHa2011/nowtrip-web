'use client';

export default function CancelRequestButton() {
    const handleCancel = () => {
        // Thông báo chính sách hoàn hủy của NowTrip [1, 2]
        alert("Theo chính sách của NowTrip, vui lòng gọi Hotline 0973.644.837 để yêu cầu hủy tour và kiểm tra mức hoàn phí (100% nếu trước 15 ngày, 50% nếu 7-14 ngày).");
    };

    return (
        <button
            onClick={handleCancel}
            className="px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
            Yêu cầu hủy
        </button>
    );
}