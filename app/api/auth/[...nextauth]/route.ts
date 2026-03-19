import NextAuth, { AuthOptions, SessionStrategy } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();


export const authOptions: AuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                // Đổi email thành username để nhận cả SĐT lẫn Email
                username: { label: "Email hoặc Số điện thoại", type: "text" },
                password: { label: "Mật khẩu", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.username || !credentials?.password) {
                    throw new Error("Vui lòng nhập tài khoản và mật khẩu");
                }

                // TÌM TÀI KHOẢN BẰNG EMAIL HOẶC SỐ ĐIỆN THOẠI
                const user = await prisma.user.findFirst({
                    where: {
                        OR: [
                            { email: credentials.username },
                            { phone: credentials.username }
                        ]
                    },
                    include: { customerProfile: true }
                });

                const errorMessage = "Tài khoản hoặc mật khẩu không chính xác!";

                if (!user || !user.isActive) {
                    throw new Error(errorMessage);
                }

                const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

                if (!isPasswordValid) {
                    throw new Error(errorMessage);
                }

                if (!user.isEmailVerified) {
                    throw new Error("Tài khoản chưa được xác thực! Vui lòng kiểm tra Email để kích hoạt.");
                }

                // Trả về dữ liệu cho Token
                return {
                    id: user.id,
                    email: user.email,
                    role: user.role,
                    name: user.customerProfile?.fullName || '',
                    phone: user.phone || '',
                };
            }
        })
    ],
    pages: {
        signIn: '/login',
    },
    session: {
        strategy: "jwt" as SessionStrategy,
        maxAge: 30 * 24 * 60 * 60, // Ghi nhớ đăng nhập 30 ngày (Thay thế cái popup 60 giây cũ)
    },
    callbacks: {
        // 3. Nạp data vào Token
        async jwt({ token, user }) {
            if (user) {
                token.role = (user as any).role;
                token.id = user.id;
                token.phone = (user as any).phone;
                token.name = user.name;
            }
            return token;
        },
        // 4. Đẩy data từ Token ra Session cho Frontend dùng
        async session({ session, token }) {
            if (session.user) {
                (session.user as any).role = token.role;
                (session.user as any).id = token.id;
                (session.user as any).phone = token.phone;
                session.user.name = token.name as string;
            }
            return session;
        }
    },
    secret: process.env.NEXTAUTH_SECRET,
}
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };