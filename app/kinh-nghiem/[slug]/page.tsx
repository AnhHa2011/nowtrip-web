import { PrismaClient } from '@prisma/client';
import { notFound } from 'next/navigation';
import Link from 'next/link';

// Khởi tạo Prisma Client
const prisma = new PrismaClient();

// BƯỚC 1: Sửa type của params thành Promise<{ slug: string }>
export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {

    // BƯỚC 2: Bắt buộc phải await params trước khi sử dụng trong Next.js mới
    const resolvedParams = await params;

    // Lấy dữ liệu bài viết từ DB bằng resolvedParams.slug
    const post = await prisma.post.findUnique({
        where: {
            slug: resolvedParams.slug, // Truyền đúng slug đã được await
            isActive: true
        }
    });

    if (!post) {
        notFound();
    }

    return (
        <div className="bg-gray-50 min-h-screen pb-24">

            {/* KHỐI HERO: TIÊU ĐỀ BÀI VIẾT */}
            <section className="bg-green-900 text-white pt-24 pb-32 px-4 relative">
                <div
                    className="absolute inset-0 opacity-10 bg-cover bg-center"
                    style={{ backgroundImage: `url('${post.thumbnail || '/images/layout/header-bg.jpg'}')` }}
                ></div>

                <div className="max-w-4xl mx-auto relative z-10 text-center">
                    <span className="bg-green-600 text-white px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider mb-6 inline-block shadow-md">
                        {post.category}
                    </span>

                    <h1 className="text-3xl md:text-5xl font-black mb-6 leading-tight drop-shadow-lg">
                        {post.title}
                    </h1>

                    <div className="flex items-center justify-center gap-6 text-sm text-green-200 font-medium">
                        <span className="flex items-center gap-2">
                            📅 {new Date(post.createdAt).toLocaleDateString('vi-VN')}
                        </span>
                        <span className="flex items-center gap-2">
                            👁️ {post.views} lượt xem
                        </span>
                    </div>
                </div>
            </section>

            {/* KHỐI NỘI DUNG BÀI VIẾT (Sử dụng Plugin Typography) */}
            <section className="max-w-4xl mx-auto px-4 -mt-20 relative z-20">
                <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-gray-100">

                    {post.thumbnail && (
                        <div className="mb-10 rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                            <img
                                src={post.thumbnail}
                                alt={post.title}
                                className="w-full object-cover max-h-[500px]"
                            />
                        </div>
                    )}

                    {/* NỘI DUNG ĐƯỢC FORMAT TỰ ĐỘNG BẰNG PROSE */}
                    <div
                        className="prose prose-lg prose-green max-w-none text-gray-700 leading-relaxed 
                       prose-headings:font-black prose-headings:text-green-900 
                       prose-a:text-green-600 hover:prose-a:text-green-700 
                       prose-img:rounded-2xl prose-img:shadow-md prose-img:mx-auto"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />

                    {/* Chân bài viết */}
                    <div className="mt-16 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
                        <Link href="/kinh-nghiem" className="text-green-600 font-bold hover:text-green-700 transition-colors flex items-center gap-2 group">
                            <span className="transform group-hover:-translate-x-1 transition-transform">←</span>
                            Quay lại danh mục Kinh Nghiệm
                        </Link>

                        <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2.5 rounded-xl font-bold transition-colors text-sm flex items-center gap-2">
                            <span>🔗</span> Chia sẻ bài viết này
                        </button>
                    </div>
                </div>
            </section>

        </div>
    );
}