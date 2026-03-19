'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

function VerifyEmailForm() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Tự động lấy Email từ đường dẫn URL nếu có (VD: /verify-email?email=abc@gmail.com)
    useEffect(() => {
        const urlEmail = searchParams.get('email');
        if (urlEmail) setEmail(urlEmail);
    }, [searchParams]);

    // HÀM 1: XÁC THỰC MÃ OTP
    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const res = await fetch('/api/auth/verify-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp }),
            });
            const result = await res.json();

            if (res.ok) {
                setMessage({ type: 'success', text: '🎉 Xác thực thành công! Đang chuyển hướng...' });
                setTimeout(() => router.push('/login'), 2000);
            } else {
                setMessage({ type: 'error', text: result.message });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Lỗi kết nối máy chủ!' });
        } finally {
            setIsLoading(false);
        }
    };

    // HÀM 2: GỬI LẠI MÃ MỚI
    const handleResend = async () => {
        if (!email) {
            setMessage({ type: 'error', text: 'Vui lòng nhập Email để hệ thống gửi lại mã!' });
            return;
        }
        setIsLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const res = await fetch('/api/auth/resend-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            const result = await res.json();
            setMessage({ type: res.ok ? 'success' : 'error', text: result.message });
        } catch (error) {
            setMessage({ type: 'error', text: 'Lỗi kết nối máy chủ!' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-3xl sm:px-10 border border-gray-100 max-w-md w-full mx-auto mt-20">
            <div className="text-center mb-6">
                <h2 className="text-3xl font-black text-gray-900 mb-2">Xác thực tài khoản</h2>
                <p className="text-sm text-gray-500">Vui lòng nhập mã OTP được gửi đến email của bạn.</p>
            </div>

            {message.text && (
                <div className={`mb-6 p-4 rounded-xl text-sm font-bold ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleVerify} className="space-y-4">
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Email của bạn</label>
                    <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 border rounded-xl" placeholder="abc@gmail.com" />
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Mã xác thực (6 số)</label>
                    <input type="text" maxLength={6} required value={otp} onChange={(e) => setOtp(e.target.value)} className="w-full px-4 py-3 border rounded-xl text-center text-2xl tracking-[0.5em] font-black" />
                </div>
                <button type="submit" disabled={isLoading} className="w-full py-3.5 px-4 rounded-xl text-sm font-black text-white bg-green-600 hover:bg-green-700">
                    {isLoading ? 'Đang xử lý...' : 'XÁC THỰC EMAIL'}
                </button>
            </form>

            <div className="mt-6 text-center">
                <button onClick={handleResend} type="button" className="text-sm font-bold text-gray-500 hover:text-orange-600">
                    Chưa nhận được mã? Gửi lại ngay
                </button>
            </div>
            <div className="mt-4 text-center">
                <Link href="/login" className="text-sm font-bold text-green-600 hover:underline">Quay lại Đăng nhập</Link>
            </div>
        </div>
    );
}

export default function VerifyEmailPage() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col py-12 px-4 sm:px-6 lg:px-8">
            <Suspense fallback={<div>Đang tải...</div>}>
                <VerifyEmailForm />
            </Suspense>
        </div>
    );
}