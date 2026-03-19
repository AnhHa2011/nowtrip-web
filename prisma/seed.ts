import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('⏳ Đang nạp dữ liệu TOÀN DIỆN cho hệ thống NowTrip...');

    // ==========================================
    // 1. TẠO USERS & PROFILES (ADMIN + KHÁCH HÀNG)
    // ==========================================
    console.log('1. Đang nạp dữ liệu Users...');
    // 1.1 Tạo tài khoản Admin (Mr Trường)
    const adminUser = await prisma.user.upsert({
        where: { email: 'nowtrip.vn@gmail.com' },
        update: {
            // Cập nhật lại mật khẩu băm nếu tài khoản đã tồn tại
            password: bcrypt.hashSync('admin123', 10),
        },
        create: {
            email: 'nowtrip.vn@gmail.com',
            phone: '0973644837',
            // 2. Mã hóa chữ "admin123" thành chuỗi băm an toàn
            password: bcrypt.hashSync('admin123', 10),
            role: 'ADMIN',
            isActive: true,
            isEmailVerified: true,
            staffProfile: {
                create: {
                    fullName: 'Mr Trường',
                    hireDate: new Date('2017-01-01T00:00:00Z'),
                    baseSalary: 20000000,
                }
            }
        }
    });

    // 1.2 Tạo tài khoản Khách hàng mẫu
    const customerUser = await prisma.user.upsert({
        where: { email: 'khachhang@example.com' },
        update: {
            password: bcrypt.hashSync('khachhang123', 10),
        },
        create: {
            email: 'khachhang@example.com',
            phone: '0909123456',
            // 3. Mã hóa chữ "khachhang123" 
            password: bcrypt.hashSync('khachhang123', 10),
            role: 'MEMBER',
            isActive: true,
            isEmailVerified: true,
            customerProfile: {
                create: {
                    fullName: 'Nguyễn Văn Trekker',
                    address: 'Quận 1, TP.HCM',
                    loyaltyPoints: 150,
                    membershipTier: 'SILVER'
                }
            }
        }
    });
    // ==========================================
    // 2. TẠO CÁC BÀI VIẾT (POSTS) - GIỚI THIỆU, TIN TỨC
    // ==========================================
    console.log('2. Đang nạp dữ liệu Bài viết & Thông tin...');
    await prisma.post.upsert({
        where: { slug: 'thong-tin-cong-ty' },
        update: {},
        create: {
            title: 'Thông tin công ty',
            slug: 'thong-tin-cong-ty',
            category: 'GIOI_THIEU',
            views: 940,
            content: '<p>NowTrip được hình thành từ nhóm tổ chức tour Trekking từ năm 2017 với tour Tà Năng - Phan Dũng, chinh phục núi Bà Đen... với tên gọi Khám Phá Thiên Nhiên.</p><p>Công ty TNHH du lịch trải nghiệm NowTrip. Địa chỉ: 361 Bùi Thị Điệt, xã Phạm Văn Cội, Củ Chi, TPHCM. MST: 0317960538.</p>',
        }
    });

    await prisma.post.upsert({
        where: { slug: 'thong-tin-lien-he' },
        update: {},
        create: {
            title: 'Thông tin liên hệ',
            slug: 'thong-tin-lien-he',
            category: 'LIEN_HE',
            views: 718,
            content: '<p>Mọi thắc mắc liên hệ về NowTrip.</p><p>SĐT: 0973.644.837 - Mr Trường</p><p>Email: nowtrip.vn@gmail.com</p><p>Page: https://www.facebook.com/NowTrip.vn/</p>',
        }
    });

    await prisma.post.upsert({
        where: { slug: 'chuong-trinh-khuyen-mai' },
        update: {},
        create: {
            title: 'Chương trình khuyến mãi',
            slug: 'chuong-trinh-khuyen-mai',
            category: 'TIN_TUC',
            views: 431,
            content: '<p>Chương trình ưu đãi khi đăng ký tour trekking của NowTrip áp dụng từ ngày 01/12/2024 đến khi có thông báo mới</p>',
        }
    });

    // ==========================================
    // 3. TẠO DỮ LIỆU TOURS
    // ==========================================
    console.log('3. Đang nạp dữ liệu Tours...');
    const tourTaNang = await prisma.tour.upsert({
        where: { slug: 'tour-trekking-ta-nang-phan-dung' },
        update: {},
        create: {
            title: 'Tour Trekking Tà Năng - Phan Dũng',
            slug: 'tour-trekking-ta-nang-phan-dung',
            image: 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e',
            price: '2.800.000đ/khách',
            duration: '2 ngày 1 đêm',
            distance: '30km (Trekking 25km, Grab rừng 5km)',
            difficulty: '3/10',
            description: 'Cung đường trekking đẹp nhất Việt Nam, với những đồi cỏ xanh nối tiếp nhau chạy tận xa tít chân trời.',
            badge: "Tour bán chạy",
            isActive: true,
            itinerary: [
                { day: 'Ngày 0', content: '22h HDV đón quý khách tại TPHCM lên xe xuất phát đi Đức Trọng' },
                { day: 'Ngày 1 (hành trình 14km)', content: '<ul><li><b>5h00:</b> Xe tới xã Đà Loan, ăn sáng.</li><li><b>13h00:</b> Checkin chop Tà Năng - Phan Dũng ở độ cao 1.168m.</li><li><b>16h30:</b> Tới điểm cắm trại đồi 2 cây thông.</li></ul>' },
                { day: 'Ngày 2 (16km)', content: '<ul><li><b>7h00:</b> Checkin đồi Lính.</li><li><b>13h30:</b> Trải nghiệm Grab rừng Phan Dũng.</li></ul>' }
            ],
            included: ['Xe giường nằm', 'Grab rừng', 'Lều trại tối đa 3 người/lều', 'Porter', 'Bảo hiểm du lịch'],
            excluded: ['VAT 8%', 'Phụ thu lều riêng 200k/lều'],
            checklist: ['Dép tổ ong', 'Quần áo', 'Đèn pin', 'Giày thể thao đế bám tốt']
        }
    });

    await prisma.tour.upsert({
        where: { slug: 'chinh-phuc-dinh-ky-quan-san-3046m' },
        update: {},
        create: {
            title: 'Chinh phục đỉnh Ky Quan San 3046m',
            slug: 'chinh-phuc-dinh-ky-quan-san-3046m',
            price: '3.500.000đ/khách',
            duration: '3 ngày 2 đêm',
            distance: '35km',
            difficulty: '4/10',
            isActive: false,
            itinerary: [], included: [], excluded: [], checklist: []
        }
    });

    // Xóa các Schedule và Booking cũ để tránh lỗi Duplicate khi chạy lệnh Seed nhiều lần
    await prisma.booking.deleteMany();
    await prisma.tourSchedule.deleteMany();

    // ==========================================
    // 4. TẠO LỊCH KHỞI HÀNH (TOUR SCHEDULES) CHO TÀ NĂNG
    // ==========================================
    console.log('4. Đang nạp dữ liệu Lịch khởi hành...');

    // Lịch 1: Khởi hành giữa tháng (Đã có 2 người đặt)
    const schedule1 = await prisma.tourSchedule.create({
        data: {
            tourId: tourTaNang.id,
            startDate: new Date('2026-05-15T00:00:00Z'),
            endDate: new Date('2026-05-16T23:59:59Z'),
            totalSlots: 20,
            bookedSlots: 2,
            isActive: true
        }
    });

    // Lịch 2: Khởi hành cuối tháng (Còn trống hoàn toàn 20 chỗ)
    await prisma.tourSchedule.create({
        data: {
            tourId: tourTaNang.id,
            startDate: new Date('2026-05-22T00:00:00Z'),
            endDate: new Date('2026-05-23T23:59:59Z'),
            totalSlots: 20,
            bookedSlots: 0,
            isActive: true
        }
    });

    // ==========================================
    // 5. TẠO ĐƠN HÀNG (BOOKING)
    // ==========================================
    console.log('5. Đang nạp dữ liệu Đơn đặt Tour...');
    const mockBooking = await prisma.booking.create({
        data: {
            tourId: tourTaNang.id,
            tourScheduleId: schedule1.id, // Liên kết đơn hàng với lịch khởi hành 15/05
            userId: customerUser.id,
            customerName: 'Nguyễn Văn Trekker',
            customerPhone: '0909123456',
            customerEmail: 'khachhang@example.com',
            pax: 2,
            status: 'DA_COC',
            handledById: adminUser.id,
            isActive: true
        }
    });

    // ==========================================
    // 6. TẠO ĐÁNH GIÁ (REVIEW), THÔNG BÁO & LỊCH SỬ THAO TÁC
    // ==========================================
    console.log('6. Đang nạp dữ liệu Đánh giá & Lịch sử thao tác...');

    // Xóa đánh giá, thông báo và lịch sử cũ trước
    await prisma.review.deleteMany();
    await prisma.notification.deleteMany();
    await prisma.actionHistory.deleteMany();

    await prisma.review.create({
        data: {
            tourId: tourTaNang.id,
            userId: customerUser.id,
            rating: 5,
            comment: 'Tour tuyệt vời, HDV nhiệt tình. Đồ ăn BBQ buổi tối trên đồi 2 cây thông rất ngon!',
            isActive: true
        }
    });

    await prisma.notification.create({
        data: {
            userId: customerUser.id,
            message: 'Đơn đặt tour Tà Năng - Phan Dũng của bạn đã được xác nhận thành công!',
            isRead: false,
            isActive: true
        }
    });

    await prisma.actionHistory.create({
        data: {
            userId: adminUser.id,
            action: 'UPDATE_STATUS',
            entityType: 'BOOKING',
            entityId: mockBooking.id,
            oldValues: { status: 'TU_VAN' },
            newValues: { status: 'DA_COC' },
            description: 'Admin Mr Trường đã cập nhật trạng thái đơn hàng sang Đã Cọc.'
        }
    });

    // ==========================================
    // 7. TẠO DỮ LIỆU CẤU HÌNH HỆ THỐNG & CHÍNH SÁCH
    // ==========================================
    console.log('7. Đang nạp dữ liệu Cấu hình hệ thống (Settings)...');
    const settings = [
        { key: 'HOTLINE', value: '0973.644.837', description: 'Số điện thoại Hotline chính (Mr Trường)' },
        { key: 'EMAIL', value: 'nowtrip.vn@gmail.com', description: 'Email liên hệ của công ty' },
        { key: 'ADDRESS', value: '361 Bùi Thị Điệt, xã Phạm Văn Cội, Củ Chi, TPHCM', description: 'Địa chỉ trụ sở công ty' },
        { key: 'TAX_CODE', value: '0317960538', description: 'Mã số thuế doanh nghiệp' },
        { key: 'FANPAGE', value: 'https://www.facebook.com/NowTrip.vn/', description: 'Đường dẫn Fanpage Facebook' },
        { key: 'SLOGAN', value: 'Go now. Be free', description: 'Slogan thương hiệu hiển thị trên web' },
        { key: 'ESTABLISH_YEAR', value: '2017', description: 'Năm bắt đầu tổ chức tour (Dùng để tự động tính số năm kinh nghiệm)' },
        { key: 'FOUNDED_DATE', value: '23/04/2020', description: 'Thương Hiệu NowTrip chính thức ra đời' },

        // Chính sách & Quy định
        { key: 'POLICY_PROMO', value: '<p><strong>Chương trình ưu đãi khi đăng ký tour trekking của NowTrip áp dụng từ ngày 01/12/2024 đến khi có thông báo mới.</strong> Quý khách hàng vui lòng liên hệ trực tiếp qua Hotline hoặc Fanpage để được tư vấn chi tiết về các mức giảm giá dành cho khách đoàn và khách đăng ký sớm.</p>', description: 'Nội dung chương trình khuyến mãi' },
        { key: 'POLICY_REFUND', value: '<p>Để đảm bảo công tác chuẩn bị hậu cần (đặt xe, chuẩn bị thực phẩm, lều trại, thuê porter) được chu đáo nhất, NowTrip áp dụng chính sách hoàn/hủy vé tour như sau:</p><ul><li><strong>Hủy trước 15 ngày khởi hành:</strong> Hoàn 100% tiền cọc hoặc hỗ trợ dời ngày đi miễn phí.</li><li><strong>Hủy từ 7 - 14 ngày trước ngày khởi hành:</strong> Hoàn 50% tiền cọc hoặc hỗ trợ dời ngày đi (có thu phí chuyển đổi).</li><li><strong>Hủy trong vòng 7 ngày trước ngày khởi hành:</strong> Không hoàn lại tiền cọc (do chi phí hậu cần đã được thanh toán cho đối tác).</li></ul><h3>Trường hợp bất khả kháng</h3><p>Trong trường hợp thời tiết xấu (bão, lũ lụt, sạt lở) hoặc các sự cố bất khả kháng do thiên tai, dịch bệnh, Ban tổ chức NowTrip sẽ chủ động thông báo hủy hoặc dời lịch trình. Quý khách sẽ được bảo lưu 100% số tiền hoặc hoàn lại 100% chi phí.</p>', description: 'Chính sách hoàn trả vé tour' },
        { key: 'POLICY_SAFETY', value: '<ul><li>Tuyệt đối tuân thủ sự hướng dẫn của Hướng dẫn viên (Leader) trong suốt hành trình.</li><li>Không tự ý tách đoàn, rẽ nhánh hoặc đi trước người dẫn đường.</li><li>Bảo vệ môi trường sinh thái: Không xả rác bừa bãi, không chặt phá cây rừng. Rác cá nhân phải được thu gom và mang ra khỏi rừng.</li></ul>', description: 'Quy định an toàn Trekking' }
    ];

    for (const setting of settings) {
        await prisma.systemSetting.upsert({
            where: { key: setting.key },
            update: { value: setting.value, description: setting.description },
            create: setting,
        });
    }

    // ==========================================
    // 8. TẠO DỮ LIỆU KINH NGHIỆM TREKKING (BLOG)
    // ==========================================
    console.log('8. Đang nạp dữ liệu Kinh nghiệm Trekking...');
    const posts = [
        {
            slug: 'chu-yang-lak-san-may-giua-dai-ngan-tay-nguyen',
            title: 'Chư Yang Lak, săn mây giữa đại ngàn Tây nguyên',
            category: 'KINH_NGHIEM',
            thumbnail: 'https://images.unsplash.com/photo-1542224566-6e85f2e6772f?q=80&w=1200',
            views: 942,
            isActive: true,
            createdAt: new Date('2022-04-22T05:00:00Z'),
            content: `<p>Chư Yang Lak là đỉnh núi cao nhất xã Yang Tao, huyện Lak, tỉnh Đak Lak, ở độ cao 1675, so với mực nướng biển, được xem là thiên đường săn mây ở Tây Nguyên</p>`
        },
        {
            slug: 'bidoup-chinh-phuc-noc-nha-tinh-lam-dong',
            title: 'Bidoup, chinh phục nóc nhà tỉnh Lâm Đồng',
            category: 'KINH_NGHIEM',
            thumbnail: 'https://images.unsplash.com/photo-1517823382902-86104bc12232?q=80&w=1200',
            views: 1320,
            isActive: true,
            createdAt: new Date('2022-03-02T22:37:00Z'),
            content: `<p>Bidoup thuộc vườn quốc gia Bidoup núi Bà, đỉnh núi cao 2.287m là đỉnh núi cao nhất tỉnh Lâm Đồng. Đứng thứ 3 ở Tây Nguyên sau Ngọc Linh và Chư Yang Sin.</p>`
        }
    ];

    for (const post of posts) {
        await prisma.post.upsert({
            where: { slug: post.slug },
            update: {},
            create: post,
        });
    }

    // ==========================================
    // 9. TẠO DỮ LIỆU CỘT MỐC LỊCH SỬ (MILESTONES)
    // ==========================================
    console.log('9. Đang nạp dữ liệu Cột mốc lịch sử...');
    await prisma.milestone.deleteMany();

    const milestones = [
        {
            period: '2017',
            title: 'Khởi nguồn đam mê',
            description: 'NowTrip được hình thành từ nhóm tổ chức tour Trekking từ năm 2017 với tour Tà Năng - Phan Dũng, chinh phục núi Bà Đen, Núi Chứa Chan, Cực Đông.... với tên gọi Khám Phá Thiên Nhiên.',
            order: 1,
            isActive: true,
        },
        {
            period: '23/04/2020',
            title: 'Thương hiệu NowTrip ra đời',
            description: '23/4/2020 Thương Hiệu NowTrip chính thức ra đời, thừa hưởng kinh nghiệm tổ chức tour trekking trước đó NowTrip ngày càng mở rộng có thêm nhiều tour khác.',
            order: 2,
            isActive: true,
        },
        {
            period: 'Nay',
            title: 'Không ngừng vươn xa',
            description: 'Hiện tại với kinh nghiêm hơn 5 năm tổ chức Trekking, NowTrip mang đến cho bạn những trải nghiệm an toàn, có nhiều kỷ niệm trên từng cung đường.',
            order: 3,
            isActive: true,
        }
    ];

    for (const milestone of milestones) {
        await prisma.milestone.create({ data: milestone });
    }

    console.log('✅ Nạp dữ liệu (Seeding) thành công TOÀN BỘ hệ thống!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });