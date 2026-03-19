import { PrismaClient } from '@prisma/client';
import Link from 'next/link';

const prisma = new PrismaClient();

export const metadata = {
    title: 'Tin Tức & Kinh Nghiệm Trekking - NowTrip',
    description: 'Tổng hợp các kinh nghiệm đi trekking, kỹ năng sinh tồn và tin tức mới nhất từ hệ thống NowTrip.',
};

export default async function NewsPage() {
    // SSR: Lấy danh sách các bài viết thuộc chuyên mục TIN_TUC và KINH_NGHIEM từ MySQL
    const posts = await prisma.post.findMany({
        where: {
            category: {
                in: ['KINH_NGHIEM', 'TIN_TUC']
            }
        },
        orderBy: { createdAt: 'desc' },
    });

    return (
        <main className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4">

                {/* TIÊU ĐỀ TRANG */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold text-green-800 mb-4">
                        Kinh Nghiệm & Tin Tức Trekking
                    </h1>
                    <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                        Khám phá những bí kíp sinh tồn, kinh nghiệm leo núi và các chương trình ưu đãi mới nhất từ NowTrip.
                    </p>
                </div>

                {/* LƯỚI DANH SÁCH BÀI VIẾT */}
                {posts.length === 0 ? (
                    <div className="text-center text-gray-500 py-12">
                        Đang cập nhật bài viết mới...
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {posts.map((post) => (
                            <article
                                key={post.id}
                                className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col group"
                            >
                                {/* Khối Hình ảnh (Mô phỏng thumbnail) */}
                                <div className="h-48 bg-gray-200 relative overflow-hidden">
                                    <div className="absolute inset-0 bg-green-900/10 group-hover:bg-transparent transition-colors duration-300"></div>
                                    <div className="absolute top-4 left-4 bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                                        {post.category === 'KINH_NGHIEM' ? 'Kinh Nghiệm' : 'Tin Tức'}
                                    </div>
                                </div>

                                {/* Khối Nội dung */}
                                <div className="p-6 flex flex-col flex-grow">
                                    <Link href={`/news/${post.slug}`}>
                                        <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-green-600 transition-colors line-clamp-2">
                                            {post.title}
                                        </h2>
                                    </Link>

                                    <p className="text-gray-600 text-sm mb-6 line-clamp-3">
                                        {post.content}
                                    </p>

                                    {/* Khối Thống kê & Nút đọc tiếp */}
                                    <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-100">
                                        <div className="text-xs text-gray-500 flex items-center gap-1">
                                            <span>👁️</span> {post.views} lượt xem
                                        </div>
                                        <Link
                                            href={`/news/${post.slug}`}
                                            className="text-green-600 hover:text-green-800 text-sm font-bold flex items-center gap-1 transition-colors"
                                        >
                                            Đọc tiếp <span aria-hidden="true">&rarr;</span>
                                        </Link>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}