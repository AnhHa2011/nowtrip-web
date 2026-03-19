'use client';
import { useState } from 'react';

export default function ReviewSection({ tourId, currentUser, reviews }: any) {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await fetch('/api/reviews', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tourId, userId: currentUser.id, rating, comment }),
        });
        window.location.reload();
    };

    return (
        <div className="mt-12 pt-8 border-t">
            <h2 className="text-2xl font-bold mb-6">Đánh giá & Bình luận</h2>

            {currentUser ? (
                <form onSubmit={handleSubmit} className="mb-10 bg-white p-6 rounded-lg shadow-sm border">
                    <select value={rating} onChange={e => setRating(Number(e.target.value))} className="border p-2 rounded mb-4 w-full">
                        <option value="5">5 Sao - Tuyệt vời</option>
                        <option value="4">4 Sao - Rất tốt</option>
                    </select>
                    <textarea required rows={4} className="w-full border p-3 rounded mb-4" placeholder="Chia sẻ trải nghiệm..." value={comment} onChange={e => setComment(e.target.value)}></textarea>
                    <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded font-bold">Gửi bình luận</button>
                </form>
            ) : (
                <div className="bg-blue-50 text-blue-700 p-4 rounded-lg mb-10 text-center">
                    Bạn cần đăng nhập với tư cách là Thành viên chính thức để có thể bình luận
                </div>
            )}

            <div className="space-y-6">
                {reviews?.map((rev: any, index: number) => (
                    <div key={index} className="border-b pb-4">
                        <div className="font-bold">{rev.user.customerProfile?.fullName || 'Khách hàng'} <span className="text-yellow-500">{'★'.repeat(rev.rating)}</span></div>
                        <p className="text-gray-700">{rev.comment}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}