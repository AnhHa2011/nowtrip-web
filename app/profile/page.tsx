import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import CancelRequestButton from '../components/CancelRequestButton';

const prisma = new PrismaClient();
export const dynamic = 'force-dynamic'; // Luôn lấy dữ liệu mới nhất từ Database

export default async function ProfilePage() {
    // 1. Kiểm tra phiên đăng nhập
    const session = await getServerSession();

    if (!session || !session.user) {
        // Nếu chưa đăng nhập, đá về trang login
        redirect('/login');
    }

    const userEmail = session.user.email as string;

    // 2. Kéo dữ liệu User kèm CustomerProfile và Bookings từ Database
    const user = await prisma.user.findUnique({
        where: { email: userEmail },
        include: {
            customerProfile: true,
            bookings: {
                orderBy: { createdAt: 'desc' }, // Sắp xếp tour mới đặt lên đầu
                include: {
                    tour: {
                        select: { title: true, image: true, duration: true }
                    }
                }
            }
        }
    });

    if (!user) {
        redirect('/login');
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* HEADER: TIÊU ĐỀ TRANG */}
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Hồ sơ của tôi</h1>
                    <p className="text-gray-500 font-medium mt-2">Quản lý thông tin cá nhân và lịch sử chuyến đi của bạn.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* CỘT TRÁI: THÔNG TIN CÁ NHÂN (1/3) */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-2xl font-black">
                                    {user.customerProfile?.fullName?.charAt(0) || 'U'}
                                </div>
                                <div>
                                    <h2 className="text-xl font-black text-gray-900">{user.customerProfile?.fullName}</h2>
                                    <span className="inline-block mt-1 px-3 py-1 bg-gradient-to-r from-orange-400 to-orange-500 text-white text-xs font-black rounded-full shadow-sm">
                                        HẠNG {user.customerProfile?.membershipTier || 'BRONZE'}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-4 text-sm font-medium text-gray-600">
                                <div className="flex justify-between border-b border-gray-50 pb-3">
                                    <span>Số điện thoại:</span>
                                    <span className="text-gray-900 font-bold">{user.phone}</span>
                                </div>
                                <div className="flex justify-between border-b border-gray-50 pb-3">
                                    <span>Email:</span>
                                    <span className="text-gray-900 font-bold">{user.email}</span>
                                </div>
                                <div className="flex justify-between border-b border-gray-50 pb-3">
                                    <span>Điểm tích lũy:</span>
                                    <span className="text-green-600 font-black text-base">{user.customerProfile?.loyaltyPoints || 0} pt</span>
                                </div>
                            </div>

                            <button className="w-full mt-6 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-bold transition-colors">
                                Chỉnh sửa thông tin
                            </button>
                        </div>
                    </div>

                    {/* CỘT PHẢI: LỊCH SỬ ĐẶT TOUR (2/3) */}
                    <div className="lg:col-span-2">
                        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
                            <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
                                <span>🎒</span> Hành trình của bạn ({user.bookings.length})
                            </h2>

                            {user.bookings.length === 0 ? (
                                <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                                    <span className="text-4xl mb-4 block">🏕️</span>
                                    <h3 className="text-lg font-bold text-gray-900">Chưa có chuyến đi nào</h3>
                                    <p className="text-gray-500 font-medium mb-6 mt-2">Hành trình vạn dặm bắt đầu từ một bước chân. Hãy chọn một điểm đến!</p>
                                    <Link href="/" className="inline-block bg-green-600 text-white px-6 py-3 rounded-xl font-bold shadow-md hover:bg-green-700 transition-all">
                                        Khám phá tour ngay
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {user.bookings.map((booking) => (
                                        <div key={booking.id} className="flex flex-col md:flex-row gap-6 p-4 rounded-2xl border border-gray-100 hover:shadow-md transition-shadow bg-gray-50/50">

                                            {/* Ảnh Tour */}
                                            <div className="relative w-full md:w-48 h-32 rounded-xl overflow-hidden shrink-0">
                                                <Image
                                                    src={booking.tour.image || 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e'}
                                                    alt={booking.tour.title}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>

                                            {/* Thông tin đơn hàng */}
                                            <div className="flex-1 flex flex-col justify-between">
                                                <div>
                                                    <div className="flex justify-between items-start mb-1">
                                                        <h3 className="text-lg font-black text-gray-900 line-clamp-2">
                                                            {booking.tour.title}
                                                        </h3>
                                                        {/* Trạng thái đơn hàng */}
                                                        <span className={`px-3 py-1 text-xs font-black rounded-lg shrink-0 ${booking.status === 'TU_VAN' ? 'bg-orange-100 text-orange-700' :
                                                            booking.status === 'DA_COC' ? 'bg-blue-100 text-blue-700' :
                                                                booking.status === 'HOAN_THANH' ? 'bg-green-100 text-green-700' :
                                                                    'bg-gray-200 text-gray-700'
                                                            }`}>
                                                            {booking.status === 'TU_VAN' ? 'Cần tư vấn' :
                                                                booking.status === 'DA_COC' ? 'Đã cọc' :
                                                                    booking.status === 'HOAN_THANH' ? 'Hoàn thành' : booking.status}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm font-bold text-gray-500 mb-3">Mã đơn: #{booking.id.slice(0, 8).toUpperCase()}</p>

                                                    <div className="flex flex-wrap gap-4 text-sm font-medium text-gray-600">
                                                        <span className="flex items-center gap-1">🗓️ Đặt ngày: {new Date(booking.createdAt).toLocaleDateString('vi-VN')}</span>
                                                        <span className="flex items-center gap-1">👥 Số lượng: <b className="text-gray-900">{booking.pax} khách</b></span>
                                                        <span className="flex items-center gap-1">⏱️ {booking.tour.duration}</span>
                                                    </div>
                                                </div>

                                                {/* Các nút hành động */}
                                                <div className="mt-4 pt-4 border-t border-gray-200 flex justify-end gap-3">
                                                    <Link href={`/tours/${booking.tourId}`} className="px-4 py-2 text-sm font-bold text-green-700 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                                                        Xem lại Tour
                                                    </Link>
                                                    {(booking.status === 'TU_VAN' || booking.status === 'DA_COC') && (
                                                        <CancelRequestButton />
                                                    )}
                                                </div>
                                            </div>

                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}