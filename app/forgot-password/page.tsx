'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // State cho Bước 1
    const [username, setUsername] = useState('');

    // State cho Bước 2
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Xử lý Gửi mã OTP (Bước 1)
    const handleRequestOTP = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage({ type: '', text: '' });

        // Tạm lập trình giả lập API gửi OTP
        setTimeout(() => {
            setIsLoading(false);
            setMessage({ type: 'success', text: 'Mã xác thực (OTP) đã được gửi đến thiết bị của bạn!' });
            setStep(2); // Chuyển sang bước 2
        }, 1500);
    };

    // Xử lý Đặt lại mật khẩu (Bước 2)
    const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage({ type: '', text: '' });

        if (newPassword !== confirmPassword) {
            setMessage({ type: 'error', text: 'Mật khẩu xác nhận không khớp!' });
            setIsLoading(false);
            return;
        }

        // Tạm lập trình giả lập API đổi mật khẩu
        setTimeout(() => {
            setIsLoading(false);
            setMessage({ type: 'success', text: '🎉 Đổi mật khẩu thành công! Bạn có thể đăng nhập bằng mật khẩu mới.' });
            setStep(3); // Bước hoàn thành
        }, 1500);
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
                    Khôi phục mật khẩu
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

                    {/* BƯỚC 1: YÊU CẦU OTP */}
                    {step === 1 && (
                        <form className="space-y-6" onSubmit={handleRequestOTP}>
                            <p className="text-sm text-gray-500 font-medium">
                                Vui lòng nhập Số điện thoại hoặc Email đã đăng ký. Chúng tôi sẽ gửi một mã xác thực (OTP) để giúp bạn lấy lại mật khẩu.
                            </p>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Số điện thoại / Email</label>
                                <input
                                    type="text"
                                    required
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="VD: 0909xxxxxx"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-green-500 focus:border-green-500 outline-none"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-3.5 px-4 rounded-xl text-sm font-black text-white bg-green-600 hover:bg-green-700 transition-all"
                            >
                                {isLoading ? 'Đang gửi mã...' : 'GỬI MÃ XÁC THỰC'}
                            </button>
                        </form>
                    )}

                    {/* BƯỚC 2: NHẬP OTP VÀ MẬT KHẨU MỚI */}
                    {step === 2 && (
                        <form className="space-y-4" onSubmit={handleResetPassword}>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Mã xác thực (OTP) *</label>
                                <input
                                    type="text"
                                    required
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    placeholder="Nhập 6 số OTP"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-green-500 focus:border-green-500 outline-none text-center tracking-widest font-black text-lg"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Mật khẩu mới *</label>
                                <input
                                    type="password"
                                    required
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-green-500 focus:border-green-500 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Xác nhận mật khẩu mới *</label>
                                <input
                                    type="password"
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-green-500 focus:border-green-500 outline-none"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full mt-2 py-3.5 px-4 rounded-xl text-sm font-black text-white bg-green-600 hover:bg-green-700 transition-all"
                            >
                                {isLoading ? 'Đang xử lý...' : 'ĐẶT LẠI MẬT KHẨU'}
                            </button>
                        </form>
                    )}

                    {/* BƯỚC 3: HOÀN THÀNH */}
                    {step === 3 && (
                        <div className="text-center mt-4">
                            <Link href="/login" className="inline-block w-full py-3.5 px-4 rounded-xl text-sm font-black text-green-700 bg-green-50 hover:bg-green-100 transition-all border border-green-200">
                                QUAY LẠI TRANG ĐĂNG NHẬP
                            </Link>
                        </div>
                    )}

                    {step !== 3 && (
                        <div className="mt-8 text-center text-sm font-medium">
                            <Link href="/login" className="font-bold text-gray-500 hover:text-gray-800">
                                Quay lại đăng nhập
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}