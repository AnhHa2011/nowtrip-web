import Link from 'next/link';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function ChinhSachPage() {
    // 1. KÉO DỮ LIỆU TỪ DATABASE
    const settingsData = await prisma.systemSetting.findMany();
    const config = settingsData.reduce((acc, setting) => {
        acc[setting.key] = setting.value;
        return acc;
    }, {} as Record<string, string>);

    // 2. GÁN GIÁ TRỊ VỚI FALLBACK
    const policies = {
        promo: config.POLICY_PROMO || `<p><strong>Chương trình ưu đãi khi đăng ký tour trekking của NowTrip áp dụng từ ngày 01/12/2024 đến khi có thông báo mới.</strong> Quý khách hàng vui lòng liên hệ trực tiếp qua Hotline hoặc Fanpage để được tư vấn chi tiết về các mức giảm giá dành cho khách đoàn và khách đăng ký sớm.</p>`,
        refund: config.POLICY_REFUND || `<p>Để đảm bảo công tác chuẩn bị hậu cần (đặt xe, chuẩn bị thực phẩm, lều trại, thuê porter) được chu đáo nhất, NowTrip áp dụng chính sách hoàn/hủy vé tour như sau:</p>
      <ul>
        <li><strong>Hủy trước 15 ngày khởi hành:</strong> Hoàn 100% tiền cọc hoặc hỗ trợ dời ngày đi miễn phí.</li>
        <li><strong>Hủy từ 7 - 14 ngày trước ngày khởi hành:</strong> Hoàn 50% tiền cọc hoặc hỗ trợ dời ngày đi (có thu phí chuyển đổi).</li>
        <li><strong>Hủy trong vòng 7 ngày trước ngày khởi hành:</strong> Không hoàn lại tiền cọc.</li>
      </ul>
      <h3>Trường hợp bất khả kháng</h3>
      <p>Trong trường hợp thời tiết xấu (bão, lũ lụt, sạt lở) hoặc sự cố do thiên tai, dịch bệnh, NowTrip sẽ chủ động thông báo hủy hoặc dời lịch trình. Quý khách sẽ được bảo lưu 100% số tiền hoặc hoàn lại 100% chi phí.</p>`,
        safety: config.POLICY_SAFETY || `<ul>
      <li>Tuyệt đối tuân thủ sự hướng dẫn của Hướng dẫn viên (Leader) trong suốt hành trình.</li>
      <li>Không tự ý tách đoàn, rẽ nhánh hoặc đi trước người dẫn đường.</li>
      <li>Bảo vệ môi trường sinh thái: Không xả rác bừa bãi, không chặt phá cây rừng. Rác cá nhân phải được thu gom và mang ra khỏi rừng.</li>
    </ul>`
    };

    return (
        <div className="bg-gray-50 min-h-screen pb-24">

            {/* KHỐI HERO: BANNER TIÊU ĐỀ */}
            <section className="bg-green-900 text-white pt-24 pb-32 px-4 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1600')] bg-cover bg-center"></div>
                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <span className="bg-green-600 text-white px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider mb-6 inline-block shadow-md">
                        Thông tin cần biết
                    </span>
                    <h1 className="text-4xl md:text-6xl font-black mb-6 drop-shadow-lg">Chính Sách & Quy Định</h1>
                    <p className="text-lg md:text-xl text-green-100 font-medium max-w-2xl mx-auto leading-relaxed">
                        Các quy định, điều khoản và chính sách hoàn trả vé tour của NowTrip nhằm đảm bảo quyền lợi và an toàn tuyệt đối cho khách hàng.
                    </p>
                </div>
            </section>

            {/* KHỐI NỘI DUNG DẠNG THẺ (CARDS) */}
            <section className="max-w-4xl mx-auto px-4 -mt-16 relative z-20 space-y-8">

                {/* THẺ 1: CHƯƠNG TRÌNH KHUYẾN MÃI (Bôi màu Gradient nổi bật) */}
                <div className="bg-gradient-to-br from-green-500 to-green-700 p-8 md:p-12 rounded-3xl shadow-2xl text-white transform hover:-translate-y-1 transition-transform duration-300">
                    <div className="flex items-center gap-5 mb-6 border-b border-green-400/30 pb-6">
                        <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-3xl shadow-inner backdrop-blur-sm">
                            🎁
                        </div>
                        <h2 className="text-2xl md:text-3xl font-black drop-shadow-sm">Chương trình khuyến mãi</h2>
                    </div>
                    {/* Chỉnh màu prose cho nền tối: prose-invert */}
                    <div
                        className="prose prose-lg prose-invert max-w-none font-medium leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: policies.promo }}
                    />
                </div>

                {/* THẺ 2: HOÀN TRẢ VÉ TOUR */}
                <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
                    <div className="flex items-center gap-5 mb-6 border-b border-gray-100 pb-6">
                        <div className="w-16 h-16 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center text-3xl shadow-inner border border-orange-100">
                            💳
                        </div>
                        <h2 className="text-2xl md:text-3xl font-black text-gray-900">Chính sách hoàn trả vé</h2>
                    </div>
                    <div
                        className="prose prose-lg prose-green max-w-none text-gray-600 leading-relaxed marker:text-green-500 prose-li:my-2"
                        dangerouslySetInnerHTML={{ __html: policies.refund }}
                    />
                </div>

                {/* THẺ 3: QUY ĐỊNH AN TOÀN */}
                <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
                    <div className="flex items-center gap-5 mb-6 border-b border-gray-100 pb-6">
                        <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center text-3xl shadow-inner border border-blue-100">
                            🛡️
                        </div>
                        <h2 className="text-2xl md:text-3xl font-black text-gray-900">Quy định an toàn Trekking</h2>
                    </div>
                    <div
                        className="prose prose-lg prose-green max-w-none text-gray-600 leading-relaxed marker:text-green-500 prose-li:my-2"
                        dangerouslySetInnerHTML={{ __html: policies.safety }}
                    />
                </div>

            </section>

            {/* NÚT ĐIỀU HƯỚNG CTA LỚN */}
            <div className="max-w-4xl mx-auto px-4 mt-16 text-center">
                <Link href="/tours" className="inline-flex items-center justify-center gap-3 bg-gray-900 hover:bg-black text-white px-10 py-4 rounded-2xl font-black transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1 text-lg group">
                    Tôi đã hiểu & Xem danh sách Tour ngay
                    <span className="group-hover:translate-x-1 transition-transform">➔</span>
                </Link>
            </div>

        </div>
    );
}