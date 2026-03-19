'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
    const router = useRouter();
    const [step, setStep] = useState(1); // QUAN TRỌNG: Quản lý Bước 1 (Đăng ký) và Bước 2 (Nhập OTP)
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [otp, setOtp] = useState(''); // State lưu mã OTP người dùng nhập

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // HÀM 1: XỬ LÝ ĐĂNG KÝ VÀ GỬI MAIL
    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage({ type: '', text: '' });

        if (formData.password !== formData.confirmPassword) {
            setMessage({ type: 'error', text: 'Mật khẩu xác nhận không khớp!' });
            setIsLoading(false);
            return;
        }

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const result = await res.json();

            if (!res.ok) {
                setMessage({ type: 'error', text: result.message });
            } else {
                setMessage({ type: 'success', text: result.message });
                // ĐĂNG KÝ THÀNH CÔNG -> BẬT GIAO DIỆN NHẬP OTP LÊN
                setStep(2);
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Lỗi kết nối máy chủ!' });
        } finally {
            setIsLoading(false);
        }
    };

    // HÀM 2: XỬ LÝ GỬI MÃ OTP LÊN SERVER ĐỂ XÁC THỰC
    const handleVerifyOTP = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const res = await fetch('/api/auth/verify-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: formData.email, otp: otp }),
            });

            const result = await res.json();

            if (!res.ok) {
                setMessage({ type: 'error', text: result.message });
                setIsLoading(false);
            } else {
                setMessage({ type: 'success', text: '🎉 Xác thực thành công! Đang chuyển hướng đăng nhập...' });
                setTimeout(() => router.push('/login'), 2000);
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Lỗi kết nối máy chủ!' });
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
                <Link href="/" className="text-4xl font-black text-green-700 tracking-tighter">
                    NowTrip<span className="text-orange-500">.</span>
                </Link>
                <p className="mt-2 text-sm text-gray-600 font-bold uppercase tracking-widest">
                    Hành Trình Lớn Từ Bước Chân Nhỏ
                </p>
                <h2 className="mt-6 text-center text-3xl font-black text-gray-900">
                    {step === 1 ? 'Tạo tài khoản mới' : 'Xác thực Email'}
                </h2>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow-xl sm:rounded-3xl sm:px-10 border border-gray-100">

                    {message.text && (
                        <div className={`mb-6 p-4 rounded-xl text-sm font-bold ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'
                            }`}>
                            {message.text}
                        </div>
                    )}

                    {/* ================= BƯỚC 1: FORM ĐĂNG KÝ ================= */}
                    {step === 1 && (
                        <form className="space-y-4" onSubmit={handleRegister}>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Họ và tên *</label>
                                <input name="fullName" type="text" required value={formData.fullName} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-green-500 focus:border-green-500 outline-none" placeholder="VD: Nguyễn Văn A" />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Số điện thoại *</label>
                                <input name="phone" type="tel" required value={formData.phone} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-green-500 focus:border-green-500 outline-none" placeholder="VD: 0909xxxxxx" />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Email *</label>
                                <input name="email" type="email" required value={formData.email} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-green-500 focus:border-green-500 outline-none" placeholder="VD: email@gmail.com" />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Mật khẩu *</label>
                                <input name="password" type="password" required value={formData.password} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-green-500 focus:border-green-500 outline-none" placeholder="••••••••" />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Xác nhận mật khẩu *</label>
                                <input name="confirmPassword" type="password" required value={formData.confirmPassword} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-green-500 focus:border-green-500 outline-none" placeholder="••••••••" />
                            </div>

                            <button type="submit" disabled={isLoading} className="w-full mt-2 py-3.5 px-4 rounded-xl text-sm font-black text-white bg-green-600 hover:bg-green-700 transition-all">
                                {isLoading ? 'Đang xử lý...' : 'ĐĂNG KÝ TÀI KHOẢN'}
                            </button>
                        </form>
                    )}

                    {/* ================= BƯỚC 2: FORM NHẬP OTP SẼ HIỆN RA Ở ĐÂY ================= */}
                    {step === 2 && (
                        <form className="space-y-6" onSubmit={handleVerifyOTP}>
                            <div className="text-center">
                                <span className="inline-block p-4 rounded-full bg-green-50 text-green-600 mb-4">
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                                </span>
                                <p className="text-sm text-gray-600 font-medium mb-2">
                                    Chúng tôi đã gửi một mã OTP gồm 6 chữ số đến email:
                                </p>
                                <p className="text-base font-black text-gray-900 mb-6">{formData.email}</p>
                            </div>

                            <div>
                                <input
                                    type="text"
                                    maxLength={6}
                                    required
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    placeholder="Nhập 6 số OTP"
                                    className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-green-500 focus:border-green-500 outline-none text-center tracking-[0.5em] font-black text-2xl text-gray-900"
                                />
                            </div>

                            <button type="submit" disabled={isLoading} className="w-full py-3.5 px-4 rounded-xl text-sm font-black text-white bg-green-600 hover:bg-green-700 transition-all">
                                {isLoading ? 'Đang kiểm tra...' : 'XÁC THỰC EMAIL'}
                            </button>

                            <div className="text-center mt-4">
                                <button type="button" onClick={() => alert('Vui lòng kiểm tra cả hộp thư rác (Spam).')} className="text-sm font-bold text-gray-500 hover:text-green-600 transition-colors">
                                    Bạn chưa nhận được mã?
                                </button>
                            </div>
                        </form>
                    )}

                    {step === 1 && (
                        <div className="mt-6 text-center text-sm font-medium">
                            Đã có tài khoản? <Link href="/login" className="font-bold text-green-600">Đăng nhập ngay</Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}