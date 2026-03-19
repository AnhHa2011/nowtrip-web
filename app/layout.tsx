import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from './components/Header';
import Footer from './components/Footer';
import { PrismaClient } from '@prisma/client';
import AuthProvider from './components/AuthProvider';

const prisma = new PrismaClient();
const inter = Inter({ subsets: ['latin', 'vietnamese'] });

export const metadata: Metadata = {
  title: 'NowTrip - Trekking, khám phá thiên nhiên',
  description: 'Go now. Be free Chuyên tổ chức tour trekking chuyên nghiệp, an toàn.',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const hotlineSetting = await prisma.systemSetting.findUnique({ where: { key: 'HOTLINE' } });
  const hotline = hotlineSetting?.value || '0973.644.837';
  return (
    <html lang="vi">
      <body className={`${inter.className} bg-gray-50 text-gray-900 antialiased flex flex-col min-h-screen`}>
        <AuthProvider>

          <Header hotline={hotline} />

          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
