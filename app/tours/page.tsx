import Link from 'next/link';
import { PrismaClient } from '@prisma/client';

// Khởi tạo kết nối Database
const prisma = new PrismaClient();

// Chuyển component thành Async để gọi Database phía Server
export default async function ToursPage() {

    // Lấy toàn bộ danh sách tour đang hoạt động từ Database
    // Sắp xếp theo ID hoặc tiêu chí bạn muốn (ở đây giả sử sắp xếp mới nhất)
    const toursList = await prisma.tour.findMany({
        orderBy: {
            id: 'asc'
        }
    });

    return (
        <div className="bg-gray-50 min-h-screen pb-24">

            {/* KHỐI TIÊU ĐỀ TRANG */}
            <section className="bg-green-900 text-white py-20 px-4">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-black mb-6">Danh sách Tour Trekking</h1>
                    <p className="text-lg text-green-100 max-w-2xl mx-auto">
                        Khám phá những cung đường tuyệt đẹp trải dài khắp Việt Nam. Từ những đỉnh núi mây mù Tây Bắc đến nơi đón bình minh đầu tiên trên đại dương bao la.
                    </p>
                </div>
            </section>

            {/* KHỐI LƯỚI DANH SÁCH TOUR TỪ DATABASE */}
            <section className="max-w-7xl mx-auto px-4 -mt-10 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

                    {/* Lặp qua dữ liệu thật từ DB */}
                    {toursList.map((tour) => (
                        <Link href={`/tours/${tour.slug}`} key={tour.id} className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300 transform hover:-translate-y-2 flex flex-col">

                            {/* Ảnh bìa Tour */}
                            <div className="relative h-60 overflow-hidden bg-gray-200">
                                <img
                                    src={tour.image || '/images/tours/default-tour.jpg'}
                                    alt={tour.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />

                                {/* Badge (Ví dụ: Hot nhất, Thử thách...) */}
                                {tour.badge && (
                                    <div className="absolute top-4 left-4 bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-black shadow-md">
                                        {tour.badge}
                                    </div>
                                )}

                                {/* Badge Độ khó */}
                                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur px-3 py-1 rounded-full text-xs font-black text-green-700 shadow-sm">
                                    Độ khó: {tour.difficulty}
                                </div>
                            </div>

                            {/* Thông tin Tour */}
                            <div className="p-6 flex-1 flex flex-col">
                                <h3 className="text-xl font-black text-gray-900 mb-4 group-hover:text-green-600 transition-colors line-clamp-2">
                                    {tour.title}
                                </h3>

                                <div className="grid grid-cols-2 gap-3 mb-6 mt-auto">
                                    <div className="text-sm text-gray-600 font-medium flex items-center gap-2 bg-gray-50 p-2 rounded-lg">
                                        ⏱️ {tour.duration}
                                    </div>
                                    <div className="text-sm text-gray-600 font-medium flex items-center gap-2 bg-gray-50 p-2 rounded-lg">
                                        🥾 {tour.distance}
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-gray-100 flex items-center justify-between mt-auto">
                                    <div>
                                        <span className="text-xs text-gray-400 block font-bold mb-1">TRỌN GÓI</span>
                                        <span className="text-xl font-black text-green-600">{tour.price}</span>
                                    </div>
                                    <span className="bg-green-50 text-green-700 px-4 py-2 rounded-xl font-bold group-hover:bg-green-600 group-hover:text-white transition-colors">
                                        Xem tour →
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}

                    {/* Xử lý trường hợp DB chưa có tour nào */}
                    {toursList.length === 0 && (
                        <div className="col-span-full text-center py-10 text-gray-500">
                            Hiện tại chưa có tour nào trong hệ thống. Vui lòng thêm dữ liệu vào Database.
                        </div>
                    )}

                </div>
            </section>

        </div>
    );
}