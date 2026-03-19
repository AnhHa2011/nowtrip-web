'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname();

    // Danh sách các menu điều hướng trong Admin
    const navItems = [
        { name: '📊 Tổng quan (Dashboard)', path: '/admin' },
        { name: '📦 Quản lý Đơn hàng', path: '/admin/bookings' },
        { name: '⛰️ Quản lý Tour', path: '/admin/tours' },
        { name: '📝 Bài viết & Blog', path: '/admin/posts' },
        { name: '⚙️ Cài đặt Hệ thống', path: '/admin/settings' },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex">

            {/* 1. LỚP PHỦ MÀN HÌNH ĐEN (Chỉ hiện trên Mobile khi mở Menu) */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm transition-opacity"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* 2. THANH SIDEBAR (Trượt trên Mobile, Cố định trên PC) */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 text-white transform transition-transform duration-300 ease-in-out flex flex-col
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 md:static md:block shadow-2xl md:shadow-none`}
            >
                <div className="p-6 flex items-center justify-between border-b border-gray-800">
                    <Link href="/admin" className="font-black text-2xl text-green-500 tracking-wider">
                        NowTrip
                    </Link>
                    {/* Nút đóng Menu trên Mobile */}
                    <button onClick={() => setIsMobileMenuOpen(false)} className="md:hidden text-gray-400 hover:text-white text-2xl">
                        ×
                    </button>
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    {navItems.map(item => {
                        const isActive = pathname === item.path || pathname?.startsWith(item.path + '/');
                        return (
                            <Link
                                key={item.path}
                                href={item.path}
                                onClick={() => setIsMobileMenuOpen(false)} // Click xong tự đóng menu trên mobile
                                className={`block px-4 py-3 rounded-xl font-medium transition-all duration-200 ${isActive
                                    ? 'bg-green-600 text-white shadow-md shadow-green-900/50'
                                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                                    }`}
                            >
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                {/* Nút Đăng xuất ở cuối Sidebar */}
                <div className="p-4 border-t border-gray-800">
                    <button className="w-full bg-gray-800 hover:bg-red-600 text-gray-300 hover:text-white px-4 py-3 rounded-xl font-medium transition-all">
                        🚪 Đăng xuất
                    </button>
                </div>
            </aside>

            {/* 3. KHU VỰC NỘI DUNG CHÍNH (MAIN CONTENT) */}
            <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">

                {/* HEADER TRÊN MOBILE (Chứa nút Hamburger) */}
                <header className="bg-white shadow-sm border-b md:hidden flex items-center justify-between p-4 sticky top-0 z-30">
                    <div className="font-black text-xl text-green-600">NowTrip</div>
                    <button
                        onClick={() => setIsMobileMenuOpen(true)}
                        className="p-2 bg-gray-100 rounded-lg text-gray-700 hover:bg-gray-200 transition"
                    >
                        {/* Icon Hamburger */}
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </header>

                {/* KHUNG HIỂN THỊ CÁC TRANG ADMIN (Như Quản lý Đơn, Quản lý Tour) */}
                <main className="flex-1 overflow-y-auto">
                    {children}
                </main>

            </div>
        </div>
    );
}
