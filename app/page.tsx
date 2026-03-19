import { PrismaClient } from '@prisma/client';
import Link from 'next/link';

const prisma = new PrismaClient();

export default async function HomePage() {
  // 1. LẤY SLOGAN TỪ BẢNG SYSTEM SETTING
  const sloganSetting = await prisma.systemSetting.findUnique({
    where: { key: 'SLOGAN' }
  });
  const slogan = sloganSetting?.value || 'Go now. Be free';

  // 2. LẤY BÀI VIẾT KHUYẾN MÃI MỚI NHẤT (Chỉ lấy bài đang Active)
  const promotion = await prisma.post.findFirst({
    where: {
      category: 'TIN_TUC',
      isActive: true
    },
    orderBy: { createdAt: 'desc' }
  });

  // 3. LẤY 6 TOUR NỔI BẬT ĐANG MỞ BÁN
  const featuredTours = await prisma.tour.findMany({
    where: { isActive: true }, // Rất quan trọng: Bỏ qua các tour đã bị ẩn/xóa mềm
    take: 6,
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="bg-gray-50 min-h-screen">

      {/* KHỐI HERO BANNER */}
      <section className="relative bg-green-900 text-white py-32 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1519904981063-b0cf448d479e?q=80&w=2000')] bg-cover bg-center"></div>
        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight">
            NowTrip
          </h1>
          <p className="text-2xl md:text-3xl text-green-300 font-bold italic mb-10">
            {slogan}
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/tours" className="px-8 py-4 bg-green-500 hover:bg-green-400 text-white font-black rounded-full text-lg transition-transform hover:scale-105 shadow-lg">
              Khám Phá Tour Ngay
            </Link>
          </div>
        </div>
      </section>

      {/* KHỐI THÔNG BÁO KHUYẾN MÃI (NẾU CÓ) */}
      {promotion && (
        <section className="max-w-7xl mx-auto px-4 -mt-8 relative z-20">
          <div className="bg-amber-100 border-l-4 border-amber-500 p-6 rounded-2xl shadow-md flex items-start gap-4">
            <span className="text-3xl">🎁</span>
            <div>
              <h3 className="font-bold text-amber-900 text-lg">{promotion.title}</h3>
              <div
                className="text-amber-800 mt-1 line-clamp-2 text-sm [&>p]:inline"
                dangerouslySetInnerHTML={{ __html: promotion.content }}
              />
            </div>
          </div>
        </section>
      )}

      {/* KHỐI DANH SÁCH TOUR NỔI BẬT */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">Tour Trekking Nổi Bật</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">Trải nghiệm những cung đường tuyệt đẹp cùng đội ngũ hướng dẫn viên chuyên nghiệp của NowTrip.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredTours.map((tour) => (
            <Link href={`/tours/${tour.slug}`} key={tour.id} className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300 transform hover:-translate-y-2">
              <div className="relative h-64 overflow-hidden bg-gray-200">
                <img
                  src={tour.image || 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1000'}
                  alt={tour.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-black text-green-700">
                  {tour.difficulty}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-extrabold text-gray-900 mb-2 group-hover:text-green-600 transition-colors line-clamp-2">
                  {tour.title}
                </h3>
                <div className="grid grid-cols-2 gap-3 mb-6 mt-4">
                  <div className="text-sm text-gray-600 font-medium flex items-center gap-2">
                    ⏱️ {tour.duration}
                  </div>
                  <div className="text-sm text-gray-600 font-medium flex items-center gap-2">
                    🥾 {tour.distance}
                  </div>
                </div>
                <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-xl font-black text-red-600">{tour.price}</span>
                  <span className="text-green-600 font-bold group-hover:translate-x-2 transition-transform">Xem chi tiết →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
