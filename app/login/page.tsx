'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const res = await signIn('credentials', {
                redirect: false,
                username: formData.username,
                password: formData.password,
            });

            if (res?.error) {
                setMessage({ type: 'error', text: res.error });
                setIsLoading(false);
            } else {
                setMessage({ type: 'success', text: '🎉 Đăng nhập thành công! Đang chuyển hướng...' });
                router.refresh();
                setTimeout(() => {
                    router.push('/');
                }, 1000);
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Lỗi kết nối đến máy chủ.' });
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
                    Đăng nhập hệ thống
                </h2>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow-xl sm:rounded-3xl sm:px-10 border border-gray-100">

                    {message.text && message.text.includes('chưa được xác thực') && (
                        <div className="mb-6 mt-[-1rem] text-center">
                            <Link
                                href={`/verify-email?email=${formData.username}`}
                                className="inline-block bg-orange-100 text-orange-700 font-bold px-4 py-2 rounded-lg text-sm hover:bg-orange-200 transition"
                            >
                                👉 Bấm vào đây để Nhập mã kích hoạt
                            </Link>
                        </div>
                    )}
                    {message.text && (
                        <div className={`mb-6 p-4 rounded-xl text-sm font-bold ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'
                            }`}>
                            {message.text}
                        </div>
                    )}
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Số điện thoại hoặc Email</label>
                            <input
                                name="username"
                                type="text"
                                required
                                value={formData.username}
                                onChange={handleChange}
                                placeholder="VD: 0909xxxxxx hoặc email@gmail.com"
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-green-500 focus:border-green-500 outline-none"
                            />
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="block text-sm font-bold text-gray-700">Mật khẩu</label>
                                {/* Đã cập nhật link trỏ về trang forgot-password */}
                                <Link href="/forgot-password" className="text-sm font-bold text-green-600 hover:text-green-500">
                                    Quên mật khẩu?
                                </Link>
                            </div>
                            <input
                                name="password"
                                type="password"
                                required
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-green-500 focus:border-green-500 outline-none"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3.5 px-4 rounded-xl text-sm font-black text-white bg-green-600 hover:bg-green-700 transition-all"
                        >
                            {isLoading ? 'Đang xử lý...' : 'ĐĂNG NHẬP'}
                        </button>
                    </form>

                    <div className="mt-8 text-center text-sm font-medium">
                        Chưa có tài khoản? <Link href="/register" className="font-bold text-green-600 hover:text-green-500">Đăng ký ngay</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}