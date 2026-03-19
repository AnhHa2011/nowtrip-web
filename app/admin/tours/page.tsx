import { PrismaClient } from '@prisma/client';
import Link from 'next/link';
import TourActions from '../TourAction';

const prisma = new PrismaClient();

// Hàm lấy danh sách tất cả các tour (kể cả tour đang bị ẩn)
async function getTours() {
    return await prisma.tour.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
            _count: {
                select: { bookings: true } // Đếm số lượng đơn đặt của từng tour
            }
        }
    });
}

export default async function AdminToursPage() {
    const tours = await getTours();

    return (
        <div className="p-6 sm:p-10 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Quản lý Sản phẩm Tour</h1>
                <Link href="/admin/tours/create">
                    <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg shadow transition">
                        + Thêm Tour Mới
                    </button>
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4">Hình ảnh</th>
                                <th className="px-6 py-4">Tên Tour & Đường dẫn</th>
                                <th className="px-6 py-4">Thông số</th>
                                <th className="px-6 py-4">Giá bán</th>
                                <th className="px-6 py-4">Trạng thái</th>
                                <th className="px-6 py-4">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {tours.map((tour) => (
                                <tr key={tour.id} className="hover:bg-gray-50 transition-colors">

                                    {/* CỘT HÌNH ẢNH */}
                                    <td className="px-6 py-4">
                                        <img
                                            src={tour.image || '/default-tour.jpg'}
                                            alt={tour.title}
                                            className="w-16 h-16 object-cover rounded-lg border border-gray-200 shadow-sm"
                                        />
                                    </td>

                                    {/* CỘT THÔNG TIN CƠ BẢN */}
                                    <td className="px-6 py-4">
                                        <p className="font-bold text-gray-900 text-base line-clamp-1">{tour.title}</p>
                                        <p className="text-gray-400 text-xs mt-1">/{tour.slug}</p>
                                        <p className="text-blue-600 text-xs mt-1 font-semibold">
                                            Đã có {tour._count.bookings} đơn đặt
                                        </p>
                                    </td>

                                    {/* CỘT THÔNG SỐ */}
                                    <td className="px-6 py-4">
                                        <p className="text-gray-600">⏳ {tour.duration}</p>
                                        <p className="text-gray-600 mt-1">⛰️ Độ khó: {tour.difficulty}</p>
                                    </td>

                                    {/* CỘT GIÁ BÁN */}
                                    <td className="px-6 py-4">
                                        <p className="font-bold text-orange-600 text-base">{tour.price}</p>
                                    </td>

                                    {/* CỘT TRẠNG THÁI (Active/Inactive) */}
                                    <td className="px-6 py-4">
                                        {tour.isActive ? (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                Đang mở bán
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                Tạm ngưng
                                            </span>
                                        )}
                                    </td>

                                    {/* CỘT THAO TÁC */}
                                    <td className="px-6 py-4 align-middle">
                                        <div className="flex h-full items-center">
                                            <TourActions tourId={tour.id} isActive={tour.isActive} />
                                        </div>
                                    </td>

                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {tours.length === 0 && (
                        <div className="p-8 text-center text-gray-500">Chưa có tour nào trong hệ thống.</div>
                    )}
                </div>
            </div>
        </div>
    );
}
