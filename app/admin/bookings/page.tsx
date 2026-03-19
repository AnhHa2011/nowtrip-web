'use client';

import { useState, useEffect } from 'react';
import imageCompression from 'browser-image-compression';

// 1. TỪ ĐIỂN MÀU SẮC TRẠNG THÁI (Đồng bộ 100% với Schema)
const STATUS_MAP: Record<string, { label: string; color: string }> = {
    TU_VAN: { label: '🔴 Cần tư vấn', color: 'bg-red-100 text-red-700' },
    DA_TU_VAN: { label: '🔵 Đã tư vấn', color: 'bg-blue-100 text-blue-700' },
    CHO_XAC_NHAN_CK: { label: '⏳ Chờ xác nhận CK', color: 'bg-cyan-100 text-cyan-800' },
    DA_COC: { label: '🟡 Đã cọc', color: 'bg-yellow-100 text-yellow-800' },
    DA_THANH_TOAN: { label: '🟢 Đã thanh toán', color: 'bg-green-100 text-green-700' },
    HOAN_THANH: { label: '🟣 Hoàn thành', color: 'bg-purple-100 text-purple-700' },
    YEU_CAU_HUY: { label: '🟠 Yêu cầu hủy', color: 'bg-orange-100 text-orange-800' },
    CHO_HOAN_TIEN: { label: '🌸 Chờ hoàn tiền', color: 'bg-pink-100 text-pink-700' },
    DA_HOAN_TIEN: { label: '💸 Đã hoàn tiền', color: 'bg-teal-100 text-teal-700' },
    DA_HUY: { label: '⚫ Đã hủy', color: 'bg-gray-100 text-gray-500' },
    BAO_LUU: { label: '⏸️ Bảo lưu', color: 'bg-indigo-100 text-indigo-700' },
};
// LUỒNG CHUYỂN TRẠNG THÁI BẮT BUỘC (STATE MACHINE)
const ALLOWED_TRANSITIONS: Record<string, string[]> = {
    // 1. Luồng Sale
    TU_VAN: ['DA_TU_VAN', 'DA_HUY'], // Chỉ được chuyển sang Đã tư vấn hoặc Khách không đi (Hủy)
    DA_TU_VAN: ['CHO_XAC_NHAN_CK', 'DA_HUY'],

    // 2. Luồng Tài chính (Nhận tiền)
    CHO_XAC_NHAN_CK: ['DA_COC', 'DA_THANH_TOAN', 'DA_TU_VAN'], // Nếu bill lỗi, lùi về Đã tư vấn
    DA_COC: ['DA_THANH_TOAN', 'YEU_CAU_HUY'], // Đã cọc xong thì chờ Thanh toán, hoặc khách báo hủy
    DA_THANH_TOAN: ['HOAN_THANH', 'YEU_CAU_HUY'], // Đi tour xong -> Hoàn thành

    // 3. Luồng Xử lý sự cố & Hoàn tiền (Theo chính sách NowTrip)
    YEU_CAU_HUY: ['CHO_HOAN_TIEN', 'BAO_LUU', 'DA_HUY'], // Chờ hoàn tiền, Dời ngày, hoặc Mất cọc
    CHO_HOAN_TIEN: ['DA_HOAN_TIEN'], // Kế toán chi tiền xong -> Đã hoàn tiền

    // 4. Các trạng thái ĐÓNG (Không cho phép đổi nữa)
    HOAN_THANH: [],
    DA_HUY: [],
    DA_HOAN_TIEN: [],
    BAO_LUU: []
};
export default function AdminBookingsPage() {
    const [bookings, setBookings] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    // 2. LẤY DANH SÁCH ĐƠN HÀNG TỪ API
    const fetchBookings = async () => {
        try {
            const res = await fetch('/api/admin/bookings');
            const data = await res.json();
            setBookings(data);
        } catch (error) {
            console.error('Lỗi khi tải đơn hàng:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    // 3. HÀM NÉN ẢNH VÀ CHUYỂN THÀNH BASE64 Ở FRONTEND
    const convertAndCompressFile = async (file: File): Promise<string> => {
        const options = {
            maxSizeMB: 1, // Nén tối đa 1MB
            maxWidthOrHeight: 1920,
            useWebWorker: true,
        };
        const compressedFile = await imageCompression(file, options);
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(compressedFile);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = error => reject(error);
        });
    };

    // 4. HÀM CẬP NHẬT TRẠNG THÁI VÀ UPLOAD HÓA ĐƠN
    const handleUpdate = async (bookingId: string, newStatus: string, file?: File) => {
        setUpdatingId(bookingId); // Hiển thị trạng thái "Đang xử lý..." cho đơn hàng này
        let imageBase64 = null;

        try {
            if (file) {
                imageBase64 = await convertAndCompressFile(file);
            }

            const res = await fetch('/api/admin/bookings', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: bookingId, status: newStatus, imageBase64 }),
            });

            if (res.ok) {
                alert('Đã cập nhật đơn hàng thành công!');
                fetchBookings(); // Tải lại dữ liệu mới (có kèm link ảnh)
            } else {
                alert('Có lỗi xảy ra khi cập nhật!');
            }
        } catch (error) {
            console.error(error);
            alert('Lỗi quá trình upload/cập nhật!');
        } finally {
            setUpdatingId(null);
        }
    };

    if (isLoading) return <div className="p-8 font-bold text-gray-500">Đang tải dữ liệu đơn hàng...</div>;

    return (
        <div className="p-6 sm:p-10 bg-gray-50 min-h-screen">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Quản lý Đơn Đặt Tour</h1>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4">Khách hàng</th>
                                <th className="px-6 py-4">Liên hệ</th>
                                <th className="px-6 py-4">Tour & Số lượng</th>
                                <th className="px-6 py-4">Trạng thái & Chứng từ</th>
                                <th className="px-6 py-4">Ngày đặt</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {bookings.map((booking) => (
                                <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                                    {/* CỘT KHÁCH HÀNG */}
                                    <td className="px-6 py-4">
                                        <p className="font-bold text-gray-900">{booking.customerName}</p>
                                    </td>

                                    {/* CỘT LIÊN HỆ */}
                                    <td className="px-6 py-4">
                                        <p className="text-gray-900">{booking.customerPhone}</p>
                                        <p className="text-gray-500 text-xs">{booking.customerEmail}</p>
                                    </td>

                                    {/* CỘT TOUR */}
                                    <td className="px-6 py-4">
                                        <p className="font-semibold text-blue-600 line-clamp-1">{booking.tour?.title}</p>
                                        <p className="text-gray-500 text-xs mt-1">Số lượng: <b>{booking.pax} người</b></p>
                                    </td>

                                    {/* CỘT TRẠNG THÁI VÀ CHỨNG TỪ (QUAN TRỌNG NHẤT) */}
                                    <td className="px-6 py-4">
                                        {updatingId === booking.id ? (
                                            <span className="text-orange-500 font-bold animate-pulse">Đang xử lý...</span>
                                        ) : (
                                            <div className="flex flex-col gap-2">
                                                {/* THẺ HIỂN THỊ TRẠNG THÁI HIỆN TẠI */}
                                                <span className={`inline-flex w-fit px-3 py-1 rounded-full text-xs font-bold ${STATUS_MAP[booking.status]?.color}`}>
                                                    {STATUS_MAP[booking.status]?.label}
                                                </span>

                                                {/* CHỈ HIỂN THỊ NÚT CHUYỂN TIẾP NẾU CÒN BƯỚC TIẾP THEO */}
                                                {ALLOWED_TRANSITIONS[booking.status]?.length > 0 && (
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="text-xs text-gray-400">Chuyển sang:</span>
                                                        <select
                                                            value="" // Luôn để trống để ép Admin phải click chọn
                                                            onChange={(e) => handleUpdate(booking.id, e.target.value)}
                                                            className="px-2 py-1 rounded border border-gray-200 text-xs font-semibold cursor-pointer outline-none hover:border-blue-400"
                                                        >
                                                            <option value="" disabled>-- Chọn bước tiếp --</option>
                                                            {ALLOWED_TRANSITIONS[booking.status].map(nextStatus => (
                                                                <option key={nextStatus} value={nextStatus}>
                                                                    {STATUS_MAP[nextStatus].label}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                )}

                                                {/* KHU VỰC CHỨNG TỪ: CHỈ HIỂN THỊ NÚT CAMERA KHI Ở BƯỚC LIÊN QUAN ĐẾN TIỀN */}
                                                {(['CHO_XAC_NHAN_CK', 'DA_COC', 'CHO_HOAN_TIEN'].includes(booking.status)) && (
                                                    <label className="flex items-center gap-1 cursor-pointer text-blue-600 hover:text-blue-800 transition text-xs font-bold mt-1 bg-blue-50 w-fit px-2 py-1 rounded">
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            className="hidden"
                                                            onChange={(e) => {
                                                                if (e.target.files && e.target.files.length > 0) {
                                                                    // Gửi file ảnh lên NHƯNG VẪN GIỮ NGUYÊN trạng thái hiện tại
                                                                    handleUpdate(booking.id, booking.status, e.target.files[0]);
                                                                }
                                                            }}
                                                        />
                                                        📸 Tải chứng từ lên
                                                    </label>
                                                )}

                                                {/* HIỂN THỊ LINK XEM BILL NẾU ĐÃ CÓ */}
                                                {booking.paymentProof && (
                                                    <a
                                                        href={booking.paymentProof}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="text-xs font-bold text-teal-600 underline hover:text-teal-800"
                                                    >
                                                        ✓ Xem chứng từ
                                                    </a>
                                                )}
                                            </div>
                                        )}
                                    </td>

                                    {/* CỘT NGÀY TẠO */}
                                    <td className="px-6 py-4 text-xs text-gray-500">
                                        {new Date(booking.createdAt).toLocaleDateString('vi-VN', {
                                            hour: '2-digit', minute: '2-digit'
                                        })}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {bookings.length === 0 && (
                        <div className="p-8 text-center text-gray-500">Chưa có đơn đặt tour nào.</div>
                    )}
                </div>
            </div>
        </div>
    );
}