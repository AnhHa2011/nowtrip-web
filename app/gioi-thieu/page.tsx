import Link from 'next/link';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function GioiThieuPage() {
    // 1. KÉO CẤU HÌNH HỆ THỐNG
    const settingsData = await prisma.systemSetting.findMany();
    const config = settingsData.reduce((acc, setting) => {
        acc[setting.key] = setting.value;
        return acc;
    }, {} as Record<string, string>);

    // 2. KÉO DANH SÁCH CỘT MỐC LỊCH SỬ TỪ DB VÀ SẮP XẾP THEO THỨ TỰ (ORDER)
    // Đã sử dụng trường "period" thay cho "year"
    const milestones = await prisma.milestone.findMany({
        where: { isActive: true },
        orderBy: { order: 'asc' }
    });

    // GÁN GIÁ TRỊ VỚI FALLBACK TỪ DỮ LIỆU CHUẨN NOWTRIP
    const company = {
        name: config.COMPANY_NAME || "Công ty TNHH du lịch trải nghiệm NowTrip",
        slogan: config.SLOGAN || "Go now. Be free",
        address: config.ADDRESS || "361 Bùi Thị Điệt, xã Phạm Văn Cội, Củ Chi, TPHCM",
        taxCode: config.TAX_CODE || "0317960538",
        phone: config.HOTLINE || "0973.644.837",
        email: config.EMAIL || "nowtrip.vn@gmail.com",
        fanpage: config.FANPAGE || "https://www.facebook.com/NowTrip.vn/",
    };

    // 3. TÍNH TOÁN SỐ NĂM KINH NGHIỆM TỰ ĐỘNG (DỰA VÀO ESTABLISH_YEAR LÀ 2017)
    const establishYear = parseInt(config.ESTABLISH_YEAR || '2017', 10);
    const currentYear = new Date().getFullYear();
    const experienceYears = currentYear - establishYear;

    return (
        <div className="bg-gray-50 min-h-screen pb-24">

            {/* KHỐI HERO: BANNER GIỚI THIỆU */}
            <section className="bg-green-900 text-white pt-24 pb-32 px-4 relative overflow-hidden">
                <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1542224566-6e85f2e6772f?q=80&w=1600')] bg-cover bg-center"></div>
                <div className="max-w-4xl mx-auto relative z-10 text-center">
                    <span className="bg-green-600 text-white px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider mb-6 inline-block shadow-md">
                        Về Chúng Tôi
                    </span>
                    <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight drop-shadow-lg">
                        {company.slogan}
                    </h1>
                    <p className="text-lg md:text-xl text-green-100 font-medium max-w-2xl mx-auto leading-relaxed">
                        Hơn <strong>{experienceYears} năm</strong> đồng hành cùng những người yêu thiên nhiên, mang đến những trải nghiệm an toàn và đầy kỷ niệm trên từng cung đường trải dài khắp Việt Nam.
                    </p>
                </div>
            </section>

            {/* KHỐI NỘI DUNG: LỊCH SỬ HÌNH THÀNH RENDER TỰ ĐỘNG TỪ DATABASE */}
            <section className="max-w-5xl mx-auto px-4 -mt-16 relative z-20">
                <div className="bg-white p-8 md:p-16 rounded-3xl shadow-xl border border-gray-100">

                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-black text-gray-900 mb-4">Câu Chuyện Thương Hiệu</h2>
                        <div className="w-20 h-1 bg-green-500 mx-auto rounded-full"></div>
                    </div>

                    <div className="space-y-12 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-1 before:bg-gradient-to-b before:from-transparent before:via-green-200 before:to-transparent">

                        {/* LẶP QUA MẢNG MILESTONES TỪ DB */}
                        {milestones.map((milestone, index) => {
                            // Xử lý thông minh: Tự động thay thế số "5 năm" cũ (lưu trong DB) thành số năm động
                            let displayDescription = milestone.description;
                            if (displayDescription.includes('5 năm')) {
                                displayDescription = displayDescription.replace('5 năm', `${experienceYears} năm`);
                            }

                            // Màu sắc background thay đổi theo thứ tự
                            const bgColors = ['bg-green-500', 'bg-green-600', 'bg-green-700', 'bg-green-800'];
                            const circleColor = bgColors[index % bgColors.length];

                            return (
                                <div key={milestone.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">

                                    {/* Vòng tròn/Hạt đậu thời gian (UI tự động co giãn) */}
                                    <div className={`flex items-center justify-center h-10 min-w-[2.5rem] px-3 rounded-full border-4 border-white ${circleColor} text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 whitespace-nowrap`}>
                                        <span className="text-xs font-bold">{milestone.period}</span>
                                    </div>

                                    {/* Nội dung Cột mốc */}
                                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white hover:bg-green-50 transition-colors p-6 rounded-2xl border border-gray-100 shadow-sm">
                                        <h3 className="text-xl font-black text-gray-900 mb-2">{milestone.title}</h3>
                                        <p className="text-gray-600 leading-reslaxed">
                                            {displayDescription}
                                        </p>
                                    </div>

                                </div>
                            );
                        })}

                    </div>
                </div>
            </section>

            {/* KHỐI THÔNG TIN PHÁP LÝ & LIÊN HỆ */}
            <section className="max-w-5xl mx-auto px-4 mt-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                    {/* Box 1: Pháp lý */}
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                        <h3 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
                            <span className="text-green-600">🏢</span> Thông tin Công ty
                        </h3>
                        <div className="space-y-4 text-gray-600">
                            <p className="font-bold text-lg text-green-800">{company.name}</p>
                            <div className="flex gap-3 items-start">
                                <span className="mt-1">📍</span>
                                <span><strong>Địa chỉ:</strong> {company.address}</span>
                            </div>
                            <div className="flex gap-3 items-center">
                                <span>📄</span>
                                <span><strong>Mã số thuế:</strong> {company.taxCode}</span>
                            </div>
                        </div>
                    </div>

                    {/* Box 2: Liên hệ */}
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                        <h3 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
                            <span className="text-green-600">📞</span> Hỗ trợ 24/7
                        </h3>
                        <div className="space-y-4 text-gray-600">
                            <div className="flex gap-3 items-center">
                                <span>📱</span>
                                <span><strong>Điện thoại:</strong> {company.phone}</span>
                            </div>
                            <div className="flex gap-3 items-center">
                                <span>✉️</span>
                                <span><strong>Email:</strong> {company.email}</span>
                            </div>
                            <div className="flex gap-3 items-center">
                                <span>🌐</span>
                                <span><strong>Fanpage:</strong> <a href={company.fanpage} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">NowTrip.vn</a></span>
                            </div>
                            <div className="flex gap-3 items-center mt-6">
                                <Link href="/tours" className="w-full text-center bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl transition-colors">
                                    Xem danh sách Tour
                                </Link>
                            </div>
                        </div>
                    </div>

                </div>
            </section>

        </div>
    );
}