import Link from 'next/link';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function Footer() {
    const settings = await prisma.systemSetting.findMany();

    const getSetting = (key: string, fallback: string) => {
        const found = settings.find(s => s.key === key);
        return found ? found.value : fallback;
    };

    const slogan = getSetting('SLOGAN', 'Go now. Be free');
    const address = getSetting('ADDRESS', '361 Bùi Thị Điệt, xã Phạm Văn Cội, Củ Chi, TPHCM');
    const hotline = getSetting('HOTLINE', '0973.644.837');
    const email = getSetting('EMAIL', 'nowtrip.vn@gmail.com');
    const taxCode = getSetting('TAX_CODE', '0317960538');
    const fanpage = getSetting('FANPAGE', 'https://www.facebook.com/NowTrip.vn/');

    // Đổi toàn bộ chữ sang hệ màu xanh nhạt (green-50, green-100, green-200) để nổi bật trên nền green-900
    return (
        <footer className="bg-green-900 text-green-50 pt-16 pb-8 border-t-4 border-green-500 mt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
                    {/* Cột 1: Thương hiệu */}
                    <div>
                        <h3 className="text-3xl font-black text-white mb-2">NowTrip</h3>
                        <p className="text-green-300 font-bold mb-6 italic text-lg">{slogan}</p>
                        <p className="text-sm leading-relaxed text-green-100">
                            Công ty TNHH du lịch trải nghiệm NowTrip. Đưa bạn từ những đỉnh núi mây mù đến nơi đón ánh bình minh, an toàn và đầy kỷ niệm.
                        </p>
                    </div>

                    {/* Cột 2: Liên hệ */}
                    <div>
                        <h4 className="text-lg font-bold text-white mb-6 uppercase">Liên Hệ</h4>
                        <ul className="space-y-4 text-sm font-medium text-green-100">
                            <li className="flex gap-3"><span>📍</span> <span>{address}</span></li>
                            <li className="flex gap-3"><span>📞</span> <span>{hotline} (Mr Trường)</span></li>
                            <li className="flex gap-3"><span>✉️</span> <span>{email}</span></li>
                            <li className="flex gap-3"><span>📄</span> <span>MST: {taxCode}</span></li>
                        </ul>
                    </div>

                    {/* Cột 3: Khám phá */}
                    <div>
                        <h4 className="text-lg font-bold text-white mb-6 uppercase">Khám Phá</h4>
                        <ul className="space-y-3 text-sm font-medium">
                            <li><Link href="/tours" className="text-green-200 hover:text-white transition-colors">Danh sách Tour Trekking</Link></li>
                            <li><Link href="/kinh-nghiem" className="text-green-200 hover:text-white transition-colors">Kinh nghiệm Trekking</Link></li>
                            <li><Link href="/chinh-sach" className="text-green-200 hover:text-white transition-colors">Chính sách hoàn trả vé</Link></li>
                            <li><a href={fanpage} target="_blank" rel="noreferrer" className="text-green-200 hover:text-white transition-colors">Fanpage Facebook</a></li>
                        </ul>
                    </div>
                </div>

                {/* Bản quyền */}
                <div className="border-t border-green-700 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-green-300">
                    <p>© {new Date().getFullYear()} NowTrip.vn. Tất cả quyền được bảo lưu.</p>
                    <div className="flex gap-4 mt-4 md:mt-0 font-medium">
                        <Link href="/chinh-sach" className="hover:text-white transition-colors">Điều khoản</Link>
                        <span>|</span>
                        <Link href="/chinh-sach" className="hover:text-white transition-colors">Bảo mật</Link>
                    </div>
                </div>

            </div>
        </footer>
    );
}