import { PrismaClient } from '@prisma/client';
import { notFound } from 'next/navigation';
import Link from 'next/link';

const prisma = new PrismaClient();

// 1. Khai báo params dạng Promise để tương thích chuẩn Next.js 15+
export default async function PostDetailPage({ params }: { params: Promise<{ slug: string }> }) {

    // 2. Lấy slug an toàn
    const resolvedParams = await params;
    const slug = resolvedParams.slug;

    // 3. SSR: Gọi dữ liệu bài viết từ MySQL Database
    const post = await prisma.post.findUnique({
        where: { slug: slug },
    });

    // Nếu nhập sai đường dẫn, trả về trang 404
    if (!post) {
        notFound();
    }

    // Chuyển đổi mã Category thành Text hiển thị
    const categoryName =
        post.category === 'KINH_NGHIEM' ? 'Kinh Nghiệm Trekking' :
            post.category === 'TIN_TUC' ? 'Tin Tức NowTrip' :
                post.category === 'CHINH_SACH' ? 'Chính Sách & Quy Định' : 'Giới Thiệu';

    return (
        <main className="min-h-screen bg-white py-12 px-4">
            <div className="max-w-3xl mx-auto">

                {/* THANH ĐIỀU HƯỚNG BREADCRUMB */}
                <nav className="flex text-sm text-gray-500 mb-8 gap-2">
                    <Link href="/" className="hover:text-green-600">Trang chủ</Link>
                    <span>/</span>
                    <Link href="/news" className="hover:text-green-600">Tin tức & Kinh nghiệm</Link>
                    <span>/</span>
                    <span className="text-gray-900 font-medium truncate">{post.title}</span>
                </nav>

                {/* HEADER BÀI VIẾT */}
                <header className="mb-10">
                    <div className="flex items-center gap-4 mb-4 text-sm">
                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-bold">
                            {categoryName}
                        </span>
                        <span className="text-gray-500 flex items-center gap-1">
                            👁️ {post.views} lượt xem
                        </span>
                        <span className="text-gray-500 flex items-center gap-1">
                            📅 {new Date(post.createdAt).toLocaleDateString('vi-VN')}
                        </span>
                    </div>

                    <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight mb-6">
                        {post.title}
                    </h1>

                    {/* Tác giả & Chia sẻ */}
                    <div className="flex items-center justify-between border-y border-gray-100 py-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">
                                N
                            </div>
                            <div>
                                <div className="font-bold text-gray-900">Admin NowTrip</div>
                                <div className="text-xs text-gray-500">"Go now. Be free"</div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* NỘI DUNG CHÍNH (CONTENT) */}
                {/* LƯU Ý: Nếu sau này nội dung nhập vào là HTML (từ các Editor WYSIWYG), bạn sẽ dùng dangerouslySetInnerHTML */}
                <article className="prose prose-lg max-w-none text-gray-700 leading-relaxed mb-12 whitespace-pre-line">
                    {post.content}
                </article>

                {/* PHẦN ĐIỀU HƯỚNG ĐẶT TOUR BÊN DƯỚI BÀI VIẾT */}
                <div className="bg-green-50 rounded-2xl p-8 text-center mt-12 border border-green-100">
                    <h3 className="text-2xl font-bold text-green-800 mb-3">
                        Bạn đã sẵn sàng cho chuyến đi tiếp theo?
                    </h3>
                    <p className="text-green-700 mb-6">
                        Khám phá các cung đường trekking an toàn và tuyệt đẹp cùng đội ngũ NowTrip giàu kinh nghiệm.
                    </p>
                    <Link
                        href="/tours"
                        className="inline-block bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-full transition-colors shadow-md"
                    >
                        Xem danh sách Tour
                    </Link>
                </div>

            </div>
        </main>
    );
}
