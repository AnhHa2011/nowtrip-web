import Link from 'next/link';
import { PrismaClient } from '@prisma/client';

// Khởi tạo kết nối Database
const prisma = new PrismaClient();

export default async function KinhNghiemPage() {
    // Lọc chính xác các bài viết có category là 'KINH_NGHIEM' và đang được bật (isActive: true)
    const posts = await prisma.post.findMany({
        where: {
            isActive: true,
            category: 'KINH_NGHIEM' // Filter chuẩn xác theo ý bạn
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    return (
        <div className="bg-gray-50 min-h-screen pb-24">

            {/* KHỐI TIÊU ĐỀ TRANG */}
            <section className="bg-green-900 text-white py-20 px-4">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-black mb-6">Kinh nghiệm Trekking</h1>
                    <p className="text-lg text-green-100 max-w-2xl mx-auto">
                        Tổng hợp các kiến thức, kỹ năng sinh tồn và những câu chuyện chinh phục các đỉnh núi hùng vĩ nhất Việt Nam từ đội ngũ NowTrip.
                    </p>
                </div>
            </section>

            {/* KHỐI LƯỚI DANH SÁCH BÀI VIẾT TỪ DATABASE */}
            <section className="max-w-7xl mx-auto px-4 -mt-10 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

                    {posts.map((post) => (
                        <Link href={`/kinh-nghiem/${post.slug}`} key={post.id} className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300 transform hover:-translate-y-2 flex flex-col">

                            {/* Ảnh bìa Bài viết (Sử dụng thumbnail) */}
                            <div className="relative h-56 overflow-hidden bg-gray-200">
                                <img
                                    src={post.thumbnail || '/images/posts/default-blog.jpg'}
                                    alt={post.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                {/* Hiển thị Category */}
                                <div className="absolute top-4 left-4 bg-green-600 text-white px-3 py-1 rounded-lg text-xs font-bold shadow-md">
                                    Kinh Nghiệm
                                </div>
                            </div>

                            {/* Thông tin Bài viết */}
                            <div className="p-6 flex-1 flex flex-col">
                                <div className="flex items-center gap-4 text-xs text-gray-500 font-medium mb-3">
                                    <span>📅 {new Date(post.createdAt).toLocaleDateString('vi-VN')}</span>
                                    <span>👁️ {post.views} lượt xem</span>
                                </div>

                                <h3 className="text-xl font-black text-gray-900 mb-6 group-hover:text-green-600 transition-colors line-clamp-2">
                                    {post.title}
                                </h3>

                                <div className="mt-auto pt-4 border-t border-gray-100 font-bold text-green-600 flex items-center gap-2 group-hover:gap-3 transition-all">
                                    Đọc tiếp <span>→</span>
                                </div>
                            </div>
                        </Link>
                    ))}

                    {/* Xử lý khi DB trống hoặc không có bài thuộc category KINH_NGHIEM */}
                    {posts.length === 0 && (
                        <div className="col-span-full py-16 text-center text-gray-500">
                            Hiện tại chưa có bài viết Kinh nghiệm nào. Hãy thêm các bài viết như "Chư Yang Lak, săn mây giữa đại ngàn Tây nguyên" hay "Bidoup, chinh phục nóc nhà tỉnh Lâm Đồng" với danh mục KINH_NGHIEM vào Database nhé!
                        </div>
                    )}

                </div>
            </section>

        </div>
    );
}