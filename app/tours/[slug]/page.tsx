// import Image from 'next/image';
// import { PrismaClient } from '@prisma/client';
// import { notFound } from 'next/navigation';

// // Khởi tạo Prisma Client
// const prisma = new PrismaClient();

// // Hàm chính render trang chi tiết Tour (Async Server Component)
// export default async function TourDetailPage({ params }: { params: Promise<{ slug: string }> }) {

//   const resolvedParams = await params;

//   const tour = await prisma.tour.findUnique({
//     where: {
//       slug: resolvedParams.slug,
//     },
//   });
//   // Nếu nhập sai link hoặc tour không tồn tại -> chuyển tới trang 404
//   if (!tour) {
//     notFound();
//   }

//   return (
//     <div className="bg-gray-50 min-h-screen pb-20">

//       {/* KHỐI HERO BANNER & THÔNG SỐ TỔNG QUAN (Sử dụng dữ liệu động từ DB) */}
//       <section className="bg-green-900 text-white pt-20 pb-32 px-4 relative">
//         <div
//           className="absolute inset-0 opacity-20 bg-cover bg-center"
//           style={{ backgroundImage: `url('${tour.image || '/images/tours/default-tour.jpg'}')` }}
//         ></div>
//         <div className="max-w-7xl mx-auto relative z-10">
//           {tour.badge && (
//             <span className="bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 inline-block shadow-md">
//               {tour.badge}
//             </span>
//           )}
//           <h1 className="text-4xl md:text-5xl font-black mb-8 leading-tight">{tour.title}</h1>

//           {/* Lưới thông số kéo từ Database */}
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20">
//             <div>
//               <p className="text-green-300 text-sm font-bold mb-1">ĐỘ KHÓ</p>
//               <p className="font-extrabold text-xl">{tour.difficulty}</p>
//             </div>
//             <div>
//               <p className="text-green-300 text-sm font-bold mb-1">THỜI GIAN</p>
//               <p className="font-extrabold text-xl">{tour.duration}</p>
//             </div>
//             <div>
//               <p className="text-green-300 text-sm font-bold mb-1">QUÃNG ĐƯỜNG</p>
//               <p className="font-extrabold text-lg leading-tight">{tour.distance}</p>
//             </div>
//             <div>
//               <p className="text-green-300 text-sm font-bold mb-1">SỐ LƯỢNG</p>
//               <p className="font-extrabold text-xl">5 - 20 người</p>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* KHUNG CHIA 2 CỘT (Trái: Nội dung | Phải: Đặt tour) */}
//       <section className="max-w-7xl mx-auto px-4 -mt-16 relative z-20">
//         <div className="flex flex-col lg:flex-row gap-8">

//           {/* CỘT TRÁI: CHI TIẾT TOUR */}
//           <div className="lg:w-2/3 space-y-8">

//             {/* LỊCH TRÌNH TIMELINE DỌC (Khuôn mẫu chuẩn Tà Năng - Phan Dũng) */}
//             <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
//               <h2 className="text-2xl font-black text-gray-900 mb-8 flex items-center gap-3">
//                 <span className="text-green-600">📍</span> Lịch trình chi tiết
//               </h2>

//               <div className="space-y-8 border-l-2 border-green-200 ml-4 pl-8 relative">
//                 {/* Ngày 0 */}
//                 <div className="relative">
//                   <div className="absolute -left-[41px] bg-green-500 w-5 h-5 rounded-full border-4 border-white shadow-sm"></div>
//                   <h3 className="text-lg font-bold text-green-700 mb-2">Ngày 0: Di chuyển</h3>
//                   <p className="text-gray-600 leading-relaxed"><strong>22h00:</strong> HDV đón quý khách tại TPHCM lên xe xuất phát đi Đức Trọng [5].</p>
//                 </div>

//                 {/* Ngày 1 */}
//                 <div className="relative">
//                   <div className="absolute -left-[41px] bg-green-500 w-5 h-5 rounded-full border-4 border-white shadow-sm"></div>
//                   <h3 className="text-lg font-bold text-green-700 mb-2">Ngày 1: Rừng Tà Năng (14km)</h3>
//                   <ul className="space-y-3 text-gray-600 leading-relaxed">
//                     <li><strong>07h30:</strong> Tới điểm xuất phát, trekking qua rẫy ChuRu và rừng thông [3].</li>
//                     <li><strong>13h00:</strong> Check-in chóp Tà Năng - Phan Dũng ở độ cao 1.168m. Đây là điểm cao nhất hành trình [3].</li>
//                     <li><strong>16h30:</strong> Tới điểm cắm trại đồi 2 cây thông, nhận lều đón hoàng hôn [3, 5].</li>
//                     <li><strong>18h00:</strong> Dùng bữa tối BBQ giữa rừng nhiệt đới [5].</li>
//                   </ul>
//                 </div>

//                 {/* Ngày 2 */}
//                 <div className="relative">
//                   <div className="absolute -left-[41px] bg-green-500 w-5 h-5 rounded-full border-4 border-white shadow-sm"></div>
//                   <h3 className="text-lg font-bold text-green-700 mb-2">Ngày 2: Về Phan Dũng (16km)</h3>
//                   <ul className="space-y-3 text-gray-600 leading-relaxed">
//                     <li><strong>07h00:</strong> Tiếp tục hành trình, check-in đồi Lính và đồi cỏ cuối cùng [3, 5].</li>
//                     <li><strong>11h00:</strong> Tới suối nghỉ ngơi, ngâm chân [3].</li>
//                     <li><strong>13h30:</strong> Trải nghiệm Grab rừng cực mạnh (5km) chỉ có ở Phan Dũng [3].</li>
//                     <li><strong>22h30:</strong> Lên xe về lại và có mặt tại Sài Gòn [5].</li>
//                   </ul>
//                 </div>
//               </div>
//             </div>

//             {/* DỊCH VỤ BAO GỒM / CHƯA BAO GỒM & ACCORDION */}
//             <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-8">
//               <div>
//                 <h3 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">✔️ Đã bao gồm</h3>
//                 <ul className="space-y-3 text-gray-600 font-medium">
//                   <li>• Xe giường nằm khứ hồi TPHCM</li>
//                   <li>• Dịch vụ Grab rừng Phan Dũng</li>
//                   <li>• Lều trại, túi ngủ (Tối đa 3 người/lều)</li>
//                   <li>• HDV, Porter vận chuyển đồ</li>
//                   <li>• Bảo hiểm du lịch, Y tế & Vé rừng </li>

//                   {/* ACCORDION THỰC ĐƠN THẢ XUỐNG KHÔNG CẦN JS */}
//                   <li className="pt-2">
//                     <details className="group bg-green-50 rounded-xl overflow-hidden cursor-pointer">
//                       <summary className="p-3 font-bold text-green-800 list-none flex justify-between items-center">
//                         🍔 Xem thực đơn ăn uống
//                         <span className="transition group-open:rotate-180">▼</span>
//                       </summary>
//                       <div className="p-4 pt-0 text-sm text-green-900/80 space-y-2 border-t border-green-100 mt-2">
//                         <p><strong>Sáng 1:</strong> Bún/Phở bò [4]</p>
//                         <p><strong>Trưa 1:</strong> Bánh mì bò kho, trái cây [4]</p>
//                         <p><strong>Tối 1:</strong> BBQ (Heo nướng, cháo nấm...) [4]</p>
//                         <p><strong>Sáng 2:</strong> Mì/Nui xương hầm [4]</p>
//                         <p><strong>Trưa 2:</strong> Bánh chưng / Cơm phần [4]</p>
//                       </div>
//                     </details>
//                   </li>
//                 </ul>
//               </div>

//               <div>
//                 <h3 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">➖ Chưa bao gồm</h3>
//                 <ul className="space-y-3 text-gray-600 font-medium">
//                   <li>• VAT 8% (nếu xuất hóa đơn đỏ) </li>
//                   <li>• Ăn uống, mua sắm cá nhân </li>
//                   <li>• Phụ thu lều riêng: 200.000đ/lều </li>
//                 </ul>
//               </div>
//             </div>

//             {/* CHECKLIST CHUẨN BỊ */}
//             <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
//               <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">🎒 Đồ dùng cần chuẩn bị</h2>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600 font-medium">
//                 <label className="flex items-center gap-3"><input type="checkbox" className="w-5 h-5 text-green-600 rounded focus:ring-green-500" /> Dép tổ ong (chống trơn trượt) </label>
//                 <label className="flex items-center gap-3"><input type="checkbox" className="w-5 h-5 text-green-600 rounded focus:ring-green-500" /> Giày thể thao đế bám tốt </label>
//                 <label className="flex items-center gap-3"><input type="checkbox" className="w-5 h-5 text-green-600 rounded focus:ring-green-500" /> Quần áo, áo mưa </label>
//                 <label className="flex items-center gap-3"><input type="checkbox" className="w-5 h-5 text-green-600 rounded focus:ring-green-500" /> Đèn pin, điện thoại, sạc dự phòng </label>
//                 <label className="flex items-center gap-3"><input type="checkbox" className="w-5 h-5 text-green-600 rounded focus:ring-green-500" /> Đồ ăn vặt (bánh kẹo năng lượng) </label>
//                 <label className="flex items-center gap-3"><input type="checkbox" className="w-5 h-5 text-green-600 rounded focus:ring-green-500" /> Kem chống nắng, mũ nón </label>
//               </div>
//             </div>

//           </div>

//           {/* CỘT PHẢI: STICKY SIDEBAR ĐẶT TOUR (Dữ liệu giá kéo từ DB) */}
//           <div className="lg:w-1/3">
//             <div className="bg-white p-6 rounded-3xl shadow-xl border border-gray-100 sticky top-28">
//               <div className="text-center pb-6 border-b border-gray-100 mb-6">
//                 <p className="text-gray-500 font-bold mb-2">GIÁ TOUR TRỌN GÓI</p>
//                 <p className="text-4xl font-black text-green-600">{tour.price}</p>
//                 <p className="text-sm text-gray-400 mt-1">/ 1 khách (Tối thiểu 5 người) [5]</p>
//               </div>

//               <button className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white font-black text-lg py-4 rounded-2xl shadow-lg shadow-green-500/30 transform transition hover:-translate-y-1 mb-4">
//                 ĐẶT TOUR NGAY
//               </button>

//               <p className="text-center text-sm text-gray-500 flex items-center justify-center gap-2">
//                 <span>📞</span> Hỗ trợ 24/7: <strong>0973.644.837</strong>
//               </p>
//             </div>
//           </div>

//         </div>
//       </section>
//     </div>
//   );
// }
import { PrismaClient } from '@prisma/client';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import BookingForm from '@/app/components/BookingForm';

const prisma = new PrismaClient();

// 1. CẬP NHẬT KIỂU DỮ LIỆU CỦA PARAMS THÀNH PROMISE
export default async function TourDetailPage({
  params
}: {
  params: Promise<{ slug: string }>
}) {
  // 2. AWAIT PARAMS ĐỂ GIẢI MÃ LẤY CHÍNH XÁC SLUG
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  // 3. TRUYỀN SLUG ĐÃ GIẢI MÃ VÀO PRISMA
  const tour = await prisma.tour.findUnique({
    where: { slug: slug },
    include: {
      schedules: {
        where: {
          isActive: true,
          startDate: { gte: new Date() } // Chỉ lấy các lịch chưa khởi hành
        },
        orderBy: { startDate: 'asc' }
      }
    }
  });

  // Nếu không tìm thấy tour, trả về trang 404
  if (!tour || !tour.isActive) {
    return notFound();
  }

  // ÉP KIỂU DỮ LIỆU JSON
  const itinerary = (tour.itinerary as Array<{ day: string; content: string }>) || [];
  const included = (tour.included as string[]) || [];
  const excluded = (tour.excluded as string[]) || [];
  const checklist = (tour.checklist as string[]) || [];

  // Trích xuất số tiền từ chuỗi "2.800.000đ/khách" để tính toán
  const basePrice = parseInt(tour.price.replace(/[^0-9]/g, '')) || 0;

  return (
    <div className="bg-gray-50 min-h-screen pb-24">

      {/* 1. KHỐI HERO: ẢNH BÌA & THÔNG SỐ TỔNG QUAN */}
      <section className="relative h-[60vh] min-h-[500px] flex items-end pb-16">
        <div className="absolute inset-0">
          <Image
            src={tour.image || 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e'}
            alt={tour.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 w-full text-white">
          {tour.badge && (
            <span className="bg-orange-500 text-white px-4 py-1.5 rounded-full text-sm font-black uppercase tracking-wider mb-6 inline-block shadow-md">
              🔥 {tour.badge}
            </span>
          )}
          <h1 className="text-4xl md:text-6xl font-black mb-6 drop-shadow-lg leading-tight">
            {tour.title}
          </h1>

          <div className="flex flex-wrap gap-4 md:gap-8 font-medium text-lg">
            <div className="flex items-center gap-2 bg-black/30 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10">
              <span>⏱️</span> {tour.duration}
            </div>
            <div className="flex items-center gap-2 bg-black/30 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10">
              <span>🥾</span> Độ khó: {tour.difficulty}
            </div>
            <div className="flex items-center gap-2 bg-black/30 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10">
              <span>📏</span> {tour.distance}
            </div>
          </div>
        </div>
      </section>

      {/* 2. KHỐI NỘI DUNG CHÍNH (GRID 2 CỘT LỚN NHỎ) */}
      <section className="max-w-7xl mx-auto px-4 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-10">

        {/* CỘT TRÁI: CHI TIẾT TOUR (Chiếm 2/3 màn hình) */}
        <div className="lg:col-span-2 space-y-12">

          {/* Mô tả Tour */}
          <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
              <span className="text-3xl">✨</span> Điểm nhấn hành trình
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed font-medium">
              {tour.description}
            </p>
          </div>

          {/* Lịch trình (Itinerary Timeline Component) */}
          <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-black text-gray-900 mb-8 flex items-center gap-3">
              <span className="text-3xl">🗺️</span> Lịch trình chi tiết
            </h2>
            <div className="space-y-8">
              {itinerary.map((item, index) => (
                <div key={index} className="relative pl-8 md:pl-0">
                  {/* Trục dọc Timeline (Ẩn trên mobile để tối ưu không gian) */}
                  <div className="hidden md:block absolute left-[150px] top-2 bottom-[-32px] w-0.5 bg-green-100"></div>
                  <div className="hidden md:block absolute left-[143px] top-2 w-4 h-4 rounded-full border-4 border-white bg-green-500 shadow-sm z-10"></div>

                  <div className="md:flex gap-12">
                    <div className="md:w-[120px] shrink-0 font-black text-green-700 text-lg mb-3 md:mb-0">
                      {item.day}
                    </div>
                    <div
                      className="prose prose-green max-w-none text-gray-600 font-medium leading-relaxed prose-li:my-1 prose-ul:pl-5 marker:text-green-500"
                      dangerouslySetInnerHTML={{ __html: item.content }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bao gồm & Chưa bao gồm (2 Cột UI Component) */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-green-50 p-8 rounded-3xl border border-green-100">
              <h3 className="text-xl font-black text-green-900 mb-6 flex items-center gap-3">
                <span className="bg-green-200 text-green-700 w-8 h-8 rounded-full flex items-center justify-center text-sm">✔️</span>
                Đã bao gồm
              </h3>
              <ul className="space-y-4">
                {included.map((item, idx) => (
                  <li key={idx} className="flex gap-3 text-green-800 font-medium">
                    <span className="text-green-500 mt-1">●</span> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-red-50 p-8 rounded-3xl border border-red-100">
              <h3 className="text-xl font-black text-red-900 mb-6 flex items-center gap-3">
                <span className="bg-red-200 text-red-700 w-8 h-8 rounded-full flex items-center justify-center text-sm">➖</span>
                Chưa bao gồm
              </h3>
              <ul className="space-y-4">
                {excluded.map((item, idx) => (
                  <li key={idx} className="flex gap-3 text-red-800 font-medium">
                    <span className="text-red-400 mt-1">●</span> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Checklist Chuẩn Bị */}
          <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
              <span className="text-3xl">🎒</span> Bạn cần chuẩn bị gì?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {checklist.map((item, idx) => (
                <div key={idx} className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <div className="w-6 h-6 rounded border-2 border-green-500 flex items-center justify-center shrink-0">
                    <div className="w-3 h-3 bg-green-500 rounded-sm"></div>
                  </div>
                  <span className="font-bold text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* CỘT PHẢI: FORM ĐẶT TOUR (Sticky Sidebar) */}
        <div className="lg:col-span-1 relative">
          <div className="sticky top-28">
            <BookingForm
              tourId={tour.id}
              basePrice={basePrice}
              schedules={tour.schedules}
            />
          </div>
        </div>

      </section>
    </div>
  );
}
