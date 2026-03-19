'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

// Định nghĩa kiểu dữ liệu truyền vào từ trang Chi tiết Tour
type Schedule = {
    id: string;
    startDate: Date;
    totalSlots: number;
    bookedSlots: number;
    price?: string | null;
};

type BookingFormProps = {
    tourId: string;
    basePrice: number; // Ví dụ: 2800000
    schedules: Schedule[];
};

export default function BookingForm({ tourId, basePrice, schedules }: BookingFormProps) {
    const { data: session } = useSession();
    const router = useRouter();

    const [selectedScheduleId, setSelectedScheduleId] = useState('');
    const [pax, setPax] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Tìm lịch trình đang được chọn để lấy số chỗ trống
    const selectedSchedule = schedules.find(s => s.id === selectedScheduleId);
    const availableSlots = selectedSchedule ? selectedSchedule.totalSlots - selectedSchedule.bookedSlots : 0;

    // Tính tổng tiền
    const totalPrice = pax * basePrice;

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage({ type: '', text: '' });

        const form = e.currentTarget;
        const formData = new FormData(form);

        const data = {
            tourId,
            tourScheduleId: selectedScheduleId,
            customerName: formData.get('customerName'),
            customerPhone: formData.get('customerPhone'),
            customerEmail: formData.get('customerEmail'),
            pax: Number(formData.get('pax')),
            userId: (session?.user as any)?.id || null,
        };

        try {
            const res = await fetch('/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            const result = await res.json();

            if (!res.ok) {
                setMessage({ type: 'error', text: result.message });
            } else {
                setMessage({ type: 'success', text: '🎉 Đặt tour thành công! Chúng tôi sẽ liên hệ với bạn sớm nhất.' });

                // 2. GỌI form.reset() THAY VÌ e.currentTarget.reset()
                form.reset();
                setSelectedScheduleId('');
                setPax(1);
                router.refresh();
            }
        } catch (error) {
            console.error("Lỗi giao diện:", error); // Bật log này để sau này dễ dò lỗi hơn
            setMessage({ type: 'error', text: 'Lỗi kết nối đến máy chủ.' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-3xl shadow-xl border border-gray-100 sticky top-28">
            <h3 className="text-2xl font-black text-gray-900 mb-6">Đặt Tour Ngay</h3>

            {message.text && (
                <div className={`p-4 rounded-xl mb-6 text-sm font-bold ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-600 border border-red-200'}`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">

                {/* 1. CHỌN NGÀY KHỞI HÀNH (TOUR SCHEDULE) */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Ngày khởi hành *</label>
                    <select
                        required
                        value={selectedScheduleId}
                        onChange={(e) => {
                            setSelectedScheduleId(e.target.value);
                            setPax(1); // Reset số lượng người về 1 khi đổi ngày
                        }}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-green-500 focus:border-green-500 bg-gray-50 outline-none"
                    >
                        <option value="" disabled>-- Chọn lịch trình --</option>
                        {schedules.map((schedule) => {
                            const slots = schedule.totalSlots - schedule.bookedSlots;
                            const dateStr = new Date(schedule.startDate).toLocaleDateString('vi-VN');
                            return (
                                <option key={schedule.id} value={schedule.id} disabled={slots === 0}>
                                    {dateStr} {slots === 0 ? '(Đã kín chỗ)' : `- Còn ${slots} chỗ`}
                                </option>
                            );
                        })}
                    </select>
                </div>

                {/* 2. SỐ LƯỢNG KHÁCH (PAX) */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Số lượng khách *</label>
                    <input
                        type="number"
                        name="pax"
                        min="1"
                        max={availableSlots || 1}
                        value={pax}
                        onChange={(e) => setPax(Number(e.target.value))}
                        disabled={!selectedScheduleId}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-green-500 focus:border-green-500 outline-none disabled:bg-gray-100 disabled:text-gray-400"
                    />
                </div>

                <hr className="border-gray-100" />

                {/* 3. THÔNG TIN LIÊN HỆ */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Họ và tên *</label>
                    <input
                        type="text"
                        name="customerName"
                        defaultValue={session?.user?.name || ''}
                        required
                        placeholder="Nguyễn Văn A"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-green-500 focus:border-green-500 outline-none"
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Số điện thoại *</label>
                    <input
                        type="tel"
                        name="customerPhone"
                        defaultValue={(session?.user as any)?.phone || ''}
                        required
                        placeholder="0909xxxxxx"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-green-500 focus:border-green-500 outline-none"
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
                    <input
                        type="email"
                        name="customerEmail"
                        defaultValue={session?.user?.email || ''}
                        placeholder="example@gmail.com"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-green-500 focus:border-green-500 outline-none"
                    />
                </div>

                {/* 4. TỔNG TIỀN & NÚT SUBMIT */}
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 mt-6">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-gray-600 font-bold">Tổng tạm tính:</span>
                        <span className="text-2xl font-black text-green-700">
                            {totalPrice.toLocaleString('vi-VN')}đ
                        </span>
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading || !selectedScheduleId || availableSlots === 0}
                        className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl font-black text-lg transition-all shadow-md transform hover:-translate-y-1 disabled:bg-gray-400 disabled:transform-none"
                    >
                        {isLoading ? 'Đang xử lý...' : 'XÁC NHẬN ĐẶT TOUR'}
                    </button>
                </div>
            </form>
        </div>
    );
}