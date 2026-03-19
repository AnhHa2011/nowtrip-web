'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

interface DashboardStats {
    totalUsers: number;
    totalBookings: number;
    totalTours: number;
    totalPosts: number;
    totalRevenue: number;
    pendingBookings: number;
}

const ADMIN_MENU = [
    {
        title: '⛰️ Quản lý tour',
        description: 'Tạo, chỉnh sửa và xóa tour du lịch',
        href: '/admin/tours',
        icon: '🗻'
    },
    {
        title: '🎫 Quản lý đơn đặt',
        description: 'Xem và quản lý các đơn đặt tour',
        href: '/admin/bookings',
        icon: '📋'
    },
    {
        title: '📝 Quản lý bài viết',
        description: 'Tạo và quản lý bài viết, tin tức',
        href: '/admin/posts',
        icon: '📰'
    },
    {
        title: '⚙️ Cài đặt hệ thống',
        description: 'Quản lý thông tin công ty và cài đặt',
        href: '/admin/settings',
        icon: '🔧'
    },
    {
        title: '👥 Quản lý nhân viên',
        description: 'Quản lý thông tin nhân viên',
        href: '/admin/staff',
        icon: '👨‍💼'
    },
    {
        title: '📅 Mốc thời gian',
        description: 'Quản lý lịch sử phát triển công ty',
        href: '/admin/milestones',
        icon: '🏆'
    },
    {
        title: '📋 Lịch sử hành động',
        description: 'Xem nhật ký tất cả các thay đổi',
        href: '/admin/action-history',
        icon: '📜'
    },
];

export default function AdminDashboard() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            setLoading(true);
            // In a real app, you would fetch these stats from an API
            // For now, we'll use placeholder data
            setStats({
                totalUsers: 1250,
                totalBookings: 456,
                totalTours: 42,
                totalPosts: 128,
                totalRevenue: 125000000,
                pendingBookings: 23
            });
        } catch (error) {
            toast.error('Lỗi tải thống kê');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-12">
                <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-2">🎯 Bảng điều khiển Admin</h1>
                <p className="text-gray-600 text-lg">Chào mừng bạn quay lại, Admin! Đây là trung tâm quản lý toàn bộ hệ thống NowTrip.</p>
            </div>

            {/* Stats Cards */}
            {loading ? (
                <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Đang tải thống kê...</p>
                </div>
            ) : stats ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    {[
                        { label: 'Tổng người dùng', value: stats.totalUsers, icon: '👥', color: 'from-blue-400 to-blue-600' },
                        { label: 'Tổng tour', value: stats.totalTours, icon: '⛰️', color: 'from-green-400 to-green-600' },
                        { label: 'Đơn đặt chưa xử lý', value: stats.pendingBookings, icon: '⏳', color: 'from-yellow-400 to-yellow-600' },
                        { label: 'Tổng đơn đặt', value: stats.totalBookings, icon: '🎫', color: 'from-purple-400 to-purple-600' },
                        { label: 'Bài viết', value: stats.totalPosts, icon: '📝', color: 'from-pink-400 to-pink-600' },
                        { label: 'Doanh thu', value: `${(stats.totalRevenue / 1000000).toFixed(1)}M`, icon: '💰', color: 'from-red-400 to-red-600' },
                    ].map((stat, index) => (
                        <div key={index} className={`bg-gradient-to-br ${stat.color} rounded-lg p-6 text-white shadow-lg hover:shadow-xl transition transform hover:scale-105`}>
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-4xl">{stat.icon}</span>
                                <div className="text-right">
                                    <p className="text-sm opacity-90">{stat.label}</p>
                                    <p className="text-3xl font-black">{stat.value}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : null}

            {/* Quick Actions Menu */}
            <div className="mb-12">
                <h2 className="text-2xl font-black text-gray-900 mb-6">🚀 Các chức năng chính</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {ADMIN_MENU.map((item, index) => (
                        <Link
                            key={index}
                            href={item.href}
                            className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-lg hover:border-green-300 transition transform hover:scale-105"
                        >
                            <div className="text-4xl mb-4">{item.icon}</div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                            <p className="text-gray-600 text-sm mb-4">{item.description}</p>
                            <div className="text-green-600 font-semibold text-sm">Mở →</div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                <h2 className="text-2xl font-black text-gray-900 mb-6">📊 Hoạt động gần đây</h2>
                <div className="space-y-4">
                    {[
                        { action: 'Tạo tour mới', detail: 'Tour Fansipan 3 ngày 2 đêm', time: '2 giờ trước', icon: '✅' },
                        { action: 'Cập nhật bài viết', detail: 'Bài viết "Kinh nghiệm trekking"', time: '4 giờ trước', icon: '✏️' },
                        { action: 'Xác nhận đơn đặt', detail: 'Đơn đặt #12345', time: '6 giờ trước', icon: '✓' },
                        { action: 'Thêm nhân viên', detail: 'Nguyễn Văn A - Hướng dẫn viên', time: '1 ngày trước', icon: '➕' },
                    ].map((item, index) => (
                        <div key={index} className="flex items-center gap-4 pb-4 border-b border-gray-200 last:border-b-0">
                            <div className="text-2xl">{item.icon}</div>
                            <div className="flex-1">
                                <p className="font-semibold text-gray-900">{item.action}</p>
                                <p className="text-sm text-gray-600">{item.detail}</p>
                            </div>
                            <div className="text-xs text-gray-500 whitespace-nowrap">{item.time}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Tips Box */}
            <div className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3">💡 Mẹo hữu ích</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                    <li>✓ Kiểm tra lịch sử hành động thường xuyên để theo dõi các thay đổi</li>
                    <li>✓ Cập nhật thông tin công ty trong phần Cài đặt hệ thống</li>
                    <li>✓ Quản lý nhân viên để phân công công việc hiệu quả</li>
                    <li>✓ Tạo bài viết định kỳ để tăng tương tác với khách hàng</li>
                </ul>
            </div>
        </div>
    );
}