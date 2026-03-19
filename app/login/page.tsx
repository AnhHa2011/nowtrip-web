'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl') || '/';

    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
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

        try {
            const res = await signIn('credentials', {
                redirect: false,
                username: formData.username,
                password: formData.password,
            });

            if (res?.error) {
                if (res.error.includes('chưa được xác thực')) {
                    toast.error('Tài khoản chưa được xác thực');
                    setTimeout(() => {
                        router.push(`/verify-email?email=${formData.username}`);
                    }, 1000);
                } else {
                    toast.error(res.error);
                }
            } else {
                toast.success('Đăng nhập thành công!');
                router.push(callbackUrl);
            }
        } catch (error) {
            toast.error('Lỗi kết nối đến máy chủ');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-8">
                <Link href="/" className="inline-block">
                    <div className="text-4xl font-black text-green-700 tracking-tighter">
                        NowTrip<span className="text-orange-500">.</span>
                    </div>
                </Link>
                <p className="mt-2 text-sm text-gray-600 font-bold uppercase tracking-widest">
                    Hành Trình Lớn Từ Bước Chân Nhỏ
                </p>
            </div>

            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-6 shadow-xl sm:rounded-3xl sm:px-10 border border-gray-100">
                    <h2 className="text-center text-3xl font-black text-gray-900 mb-2">
                        Đăng nhập
                    </h2>
                    <p className="text-center text-sm text-gray-600 mb-8">
                        Vui lòng nhập thông tin tài khoản của bạn
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Username/Email/Phone */}
                        <div>
                            <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-2">
                                Email hoặc Số điện thoại
                            </label>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                value={formData.username}
                                onChange={handleChange}
                                placeholder="Nhập email hoặc số điện thoại"
                                required
                                disabled={isLoading}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-50 transition"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                                Mật khẩu
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Nhập mật khẩu"
                                    required
                                    disabled={isLoading}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-50 transition"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                >
                                    {showPassword ? '🙈' : '👁️'}
                                </button>
                            </div>
                        </div>

                        {/* Remember Me & Forgot Password */}
                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" className="w-4 h-4 text-green-600 rounded" />
                                <span className="text-gray-700">Ghi nhớ tôi</span>
                            </label>
                            <Link href="/forgot-password" className="text-green-600 hover:text-green-700 font-medium">
                                Quên mật khẩu?
                            </Link>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading || !formData.username || !formData.password}
                            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <span className="animate-spin">⏳</span>
                                    Đang đăng nhập...
                                </span>
                            ) : (
                                '🚀 Đăng nhập'
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="mt-8 relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">hoặc</span>
                        </div>
                    </div>

                    {/* Register Link */}
                    <div className="mt-8 text-center">
                        <p className="text-gray-600 text-sm">
                            Chưa có tài khoản?{' '}
                            <Link href="/register" className="text-green-600 hover:text-green-700 font-bold">
                                Đăng ký ngay
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Info Box */}
                <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-900">
                    <p className="font-medium mb-2">💡 Tài khoản demo:</p>
                    <p>Email: <code className="bg-white px-2 py-1 rounded">demo@nowtrip.vn</code></p>
                    <p>Mật khẩu: <code className="bg-white px-2 py-1 rounded">Demo@123</code></p>
                </div>
            </div>
        </div>
    );
}