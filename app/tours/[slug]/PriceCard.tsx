'use client';
import { useState } from 'react';

export default function PriceCard({ tourId, price }: { tourId: string; price: string }) {
    const [formData, setFormData] = useState({ name: '', phone: '', pax: 5 });
    const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

    const handleBooking = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        const res = await fetch('/api/bookings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tourId, customerName: formData.name, customerPhone: formData.phone, pax: formData.pax }),
        });
        if (res.ok) setStatus('success');
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <div className="text-3xl font-bold text-red-500 mb-2">{price}</div>
            <p className="text-sm text-gray-500 mb-6">/khách (Nhóm từ 5 - 20 người)</p>

            {status === 'success' ? (
                <div className="bg-green-100 text-green-700 p-4 rounded-lg">🎉 Đặt tour thành công! NowTrip sẽ liên hệ sớm nhất.</div>
            ) : (
                <form onSubmit={handleBooking} className="space-y-4">
                    <input required type="text" placeholder="Họ và tên" className="w-full border p-2 rounded" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                    <input required type="tel" placeholder="Số điện thoại" className="w-full border p-2 rounded" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                    <input required type="number" min="1" max="20" className="w-full border p-2 rounded" value={formData.pax} onChange={e => setFormData({ ...formData, pax: parseInt(e.target.value) })} />
                    <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded">
                        {status === 'loading' ? 'Đang xử lý...' : 'ĐẶT TOUR NGAY'}
                    </button>
                </form>
            )}
        </div>
    );
}