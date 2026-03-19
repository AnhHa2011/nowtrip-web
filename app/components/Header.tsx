'use client'
import Link from 'next/link';
import { PrismaClient } from '@prisma/client';
import { useSession, signOut } from 'next-auth/react';

const prisma = new PrismaClient();

export default function Header({ hotline = '0973.644.837' }: { hotline?: string }) {

    // Lấy trạng thái đăng nhập ngầm từ NextAuth
    const { data: session, status } = useSession();
    const handleLogout = async () => {
        await signOut({ redirect: false });
        window.location.href = '/';
    };

    return (
        <header className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">

                <Link href="/" className="flex flex-col">
                    <span className="text-3xl font-black text-green-700 tracking-tighter">NowTrip</span>
                    <span className="text-[10px] font-extrabold text-gray-500 uppercase tracking-widest">Khám phá thiên nhiên</span>
                </Link>
                {/* LOGO & MENU TRÁI */}
                <nav className="hidden md:flex items-center gap-8 font-semibold text-sm text-gray-700">
                    <Link href="/" className="hover:text-green-600 transition-colors">Trang chủ</Link>
                    <Link href="/tours" className="hover:text-green-600 transition-colors">Tour Trekking</Link>
                    <Link href="/kinh-nghiem" className="hover:text-green-600 transition-colors">Kinh nghiệm</Link>
                    <Link href="/gioi-thieu" className="hover:text-green-600 transition-colors">Giới thiệu</Link>
                    <Link href="/chinh-sach" className="hover:text-green-600 transition-colors">Chính sách</Link>
                </nav>
                <div className="flex items-center gap-4 lg:gap-6">

                    {/* 1. Hotline (Chỉ hiện trên màn hình máy tính) */}
                    <a href={`tel:${hotline.replace(/\./g, '')}`} className="hidden lg:flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors group">
                        <div className="w-8 h-8 bg-gray-100 group-hover:bg-green-100 rounded-full flex items-center justify-center transition-colors">
                            📞
                        </div>
                        <span className="font-bold text-sm tracking-wide">{hotline}</span>
                    </a>

                    {/* Vạch kẻ phân cách */}
                    <div className="hidden lg:block w-px h-6 bg-gray-200"></div>

                    {/* 2. Khu vực Đăng nhập / User Profile */}
                    {status === 'loading' ? (
                        <div className="w-20 h-8 bg-gray-100 animate-pulse rounded-full"></div>
                    ) : session ? (
                        <div className="flex items-center gap-3">
                            {(session.user as any)?.role === 'ADMIN' && (
                                <Link href="/admin" className="text-xs font-black text-orange-600 bg-orange-50 px-2.5 py-1.5 rounded-lg border border-orange-100 hover:bg-orange-100 transition-colors hidden sm:block">
                                    ⚙️ ADMIN
                                </Link>
                            )}

                            {/* Avatar người dùng */}
                            <div className="flex items-center gap-2 group relative cursor-pointer">
                                <div className="w-9 h-9 bg-green-100 text-green-700 rounded-full flex items-center justify-center font-black border-2 border-white shadow-sm">
                                    {session.user?.email?.charAt(0).toUpperCase()}
                                </div>

                                {/* Dropdown menu */}
                                <div className="absolute top-full right-0 mt-3 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
                                    <div className="p-2">
                                        <div className="px-3 py-2 text-xs text-gray-500 font-medium border-b border-gray-50 mb-1 truncate">
                                            {session.user?.email}
                                        </div>   <Link
                                            href="/profile"
                                            className="flex items-center gap-1 sm:gap-2 px-3 py-2 bg-gray-50 text-gray-700 text-sm font-bold rounded-xl hover:bg-gray-200 hover:text-gray-900 transition-all shadow-sm"
                                            title="Thông tin tài khoản"
                                        >
                                            <span>👤</span> <span className="hidden sm:inline">Hồ sơ</span>
                                        </Link>
                                        <button onClick={handleLogout} className="w-full text-left px-3 py-2 text-sm font-bold text-red-600 hover:bg-red-50 rounded-xl transition-colors">
                                            Đăng xuất
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        // Nút Đăng nhập giờ được làm rất tinh tế, không còn là khối to bản
                        <Link href="/login" className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors font-bold text-sm">
                            <span className="text-lg">👤</span>
                            <span className="hidden sm:block">Đăng nhập</span>
                        </Link>
                    )}

                    {/* 3. Nút CTA Đặt Tour Ngay (Nổi bật nhất) */}
                    <Link
                        href="/tours"
                        className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl text-sm font-black transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 whitespace-nowrap"
                    >
                        Đặt Tour Ngay
                    </Link>

                </div>
            </div>
        </header >
    );
}