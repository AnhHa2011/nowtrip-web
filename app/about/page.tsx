import Link from 'next/link';

export const metadata = {
    title: 'Giới Thiệu - NowTrip',
    description: 'Tìm hiểu về lịch sử hình thành và sứ mệnh của NowTrip - Go now. Be free',
};

export default function AboutPage() {
    const activeTours = [
        'Trekking Tà Giang', 'Trekking thác K50', 'Bidoup - Phước Bình - Tà Giang',
        'Chinh phục đỉnh núi Chúa - Ninh Thuận', 'Bidoup chinh phục nóc nhà tỉnh Lâm Đồng',
        'Trekking Cực Đông, nơi đón bình minh', 'Tà Năng - Phan Dũng',
        'Chư Yang Lak, săn mây đại ngàn', 'Chinh phục đỉnh Chư Yang Sin',
        'Khám phá thác Phi Liêng', 'Trekking chinh phục đỉnh LangBiang',
        'Lảo Thẩn, săn mây nóc nhà Y Tý', 'Bạch Mộc Lương Tử - Đỉnh núi cao thứ 4 VN'
    ];

    return (
        <main className="min-h-screen bg-gray-50 py-16 px-4">
            <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">

                {/* KHỐI HEADER GIỚI THIỆU */}
                <div className="bg-green-900 text-white p-10 md:p-16 text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://nowtrip.vn/n/uploads/news/2021_12/logo.jpg')] opacity-10 bg-cover bg-center"></div>
                    <div className="relative z-10">
                        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
                            Về Chúng Tôi
                        </h1>
                        <p className="text-xl text-green-200 font-light italic mb-8">
                            "Go now. Be free"
                        </p>
                        <div className="inline-block bg-green-800 border border-green-700 rounded-full px-6 py-2 text-sm font-medium">
                            Thành lập từ năm 2017 • Hơn 5 năm kinh nghiệm
                        </div>
                    </div>
                </div>

                {/* KHỐI NỘI DUNG LỊCH SỬ HÌNH THÀNH */}
                <div className="p-10 md:p-16">
                    <section className="mb-16">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-sm">1</span>
                            Câu Chuyện Thương Hiệu
                        </h2>
                        <div className="space-y-6 text-gray-700 leading-relaxed border-l-2 border-green-100 pl-6 ml-4">
                            <p>
                                NowTrip được hình thành từ nhóm tổ chức tour Trekking từ <strong>năm 2017</strong> với các tour nền tảng như Tà Năng - Phan Dũng, chinh phục núi Bà Đen, Núi Chứa Chan, Cực Đông.... dưới tên gọi ban đầu là <strong>Khám Phá Thiên Nhiên</strong>.
                            </p>
                            <p>
                                Đến ngày <strong>23/04/2020</strong>, thương hiệu <strong>NowTrip</strong> chính thức ra đời. Thừa hưởng những kinh nghiệm quý báu trong việc tổ chức tour trekking trước đó, NowTrip ngày càng mở rộng và phát triển thêm nhiều cung đường mới mẻ, hấp dẫn trên khắp mọi miền đất nước.
                            </p>
                            <p className="font-medium text-gray-900 bg-green-50 p-4 rounded-lg">
                                Hiện tại với kinh nghiệm hơn 5 năm tổ chức Trekking, NowTrip tự hào mang đến cho bạn những trải nghiệm an toàn, chuyên nghiệp và lưu giữ nhiều kỷ niệm đẹp nhất trên từng cung đường.
                            </p>
                        </div>
                    </section>

                    {/* KHỐI DANH SÁCH TOUR HOẠT ĐỘNG */}
                    <section className="mb-16">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-sm">2</span>
                            Các Cung Đường Trekking Đang Tổ Chức
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-4">
                            {activeTours.map((tour, index) => (
                                <div key={index} className="flex items-start gap-2 text-gray-700">
                                    <span className="text-green-500 mt-0.5">✔️</span>
                                    <span>{tour}</span>
                                </div>
                            ))}
                        </div>
                        <div className="mt-8 text-center">
                            <Link href="/tours" className="inline-block bg-green-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-green-700 transition-colors">
                                Xem chi tiết lịch trình các Tour
                            </Link>
                        </div>
                    </section>

                    {/* KHỐI THÔNG TIN CÔNG TY (PHÁP LÝ) */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-sm">3</span>
                            Thông Tin Pháp Lý & Liên Hệ
                        </h2>
                        <div className="bg-gray-50 rounded-2xl p-6 md:p-8 border border-gray-100">
                            <h3 className="text-xl font-bold text-green-800 mb-4">
                                Công ty TNHH du lịch trải nghiệm NowTrip
                            </h3>
                            <ul className="space-y-4 text-gray-700">
                                <li className="flex items-start gap-3">
                                    <span className="text-xl">📍</span>
                                    <span><strong>Địa chỉ:</strong> 361 Bùi Thị Điệt, xã Phạm Văn Cội, Củ Chi, TPHCM</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <span className="text-xl">🏢</span>
                                    <span><strong>Mã số thuế:</strong> 0317960538</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <span className="text-xl">📞</span>
                                    <span><strong>Điện thoại:</strong> <a href="tel:0973644837" className="text-green-600 font-bold hover:underline">0973.644.837 (Mr Trường)</a></span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <span className="text-xl">✉️</span>
                                    <span><strong>Email:</strong> <a href="mailto:nowtrip.vn@gmail.com" className="hover:text-green-600">nowtrip.vn@gmail.com</a></span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <span className="text-xl">🌐</span>
                                    <span><strong>Fanpage:</strong> <a href="https://facebook.com/nowtrip.vn" target="_blank" rel="noopener noreferrer" className="hover:text-green-600">facebook.com/nowtrip.vn</a></span>
                                </li>
                            </ul>
                        </div>
                    </section>

                </div>
            </div>
        </main>
    );
}