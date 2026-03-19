'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function AdminDashboard() {
    const { data: session, status } = useSession()
    const router = useRouter()

    if (status === 'loading') {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-700"></div>
            </div>
        )
    }

    if (!session || session.user?.role !== 'ADMIN') {
        // Use router.push instead of redirect to avoid server-side conflicts
        if (typeof window !== 'undefined') {
            router.push('/')
        }
        return null
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                    <p className="mt-2 text-gray-600">Quản lý hệ thống NowTrip</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Link href="/admin/bookings" className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 bg-blue-100 rounded-lg p-3">
                                <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <h3 className="text-lg font-medium text-gray-900">Quản lý Booking</h3>
                                <p className="text-sm text-gray-500">Xem và quản lý các booking</p>
                            </div>
                        </div>
                    </Link>

                    <Link href="/admin/tours" className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 bg-green-100 rounded-lg p-3">
                                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <h3 className="text-lg font-medium text-gray-900">Quản lý Tour</h3>
                                <p className="text-sm text-gray-500">Tạo và quản lý các tour</p>
                            </div>
                        </div>
                    </Link>

                    <Link href="/admin/tours/create" className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 bg-purple-100 rounded-lg p-3">
                                <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <h3 className="text-lg font-medium text-gray-900">Tạo Tour mới</h3>
                                <p className="text-sm text-gray-500">Thêm tour trekking mới</p>
                            </div>
                        </div>
                    </Link>
                </div>

                <div className="mt-8 bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Thông tin Admin</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-500">Tên</p>
                            <p className="font-medium">{session.user?.name || 'N/A'}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Email</p>
                            <p className="font-medium">{session.user?.email || 'N/A'}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Vai trò</p>
                            <p className="font-medium text-green-600">{session.user?.role}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Số điện thoại</p>
                            <p className="font-medium">{(session.user as any)?.phone || 'N/A'}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
