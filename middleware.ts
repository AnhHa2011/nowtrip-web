import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        // Lấy đường dẫn người dùng đang muốn vào
        const url = req.nextUrl.pathname;
        // Lấy chức vụ (role) từ token mà ta đã lưu ở bước trước
        const role = req.nextauth.token?.role;

        // 1. LUẬT CHO VÙNG ADMIN
        if (url.startsWith("/admin") && role !== "ADMIN") {
            // Không phải ADMIN -> Đá văng về trang chủ
            return NextResponse.redirect(new URL("/", req.url));
        }

        // 2. LUẬT CHO VÙNG SALE (Dành cho Admin và Nhân viên Sale)
        if (url.startsWith("/sale") && role !== "ADMIN" && role !== "SALE") {
            return NextResponse.redirect(new URL("/", req.url));
        }

        // Cho phép truy cập nếu pass qua các điều kiện trên
        return NextResponse.next();
    },
    {
        callbacks: {
            // Bắt buộc phải có token (đã đăng nhập) thì mới cho phép chạy kiểm tra ở trên
            authorized: ({ token }) => !!token,
        },
        // 👇 BỔ SUNG KHỐI NÀY ĐỂ ÉP NEXTAUTH TRỎ VỀ TRANG LOGIN CỦA CHÚNG TA
        pages: {
            signIn: "/login",
        }
    }
);


// Chỉ định Middleware này chỉ canh gác các đường dẫn bắt đầu bằng /admin và /sale
export const config = {
    matcher: ["/admin/:path*", "/sale/:path*"],
};
