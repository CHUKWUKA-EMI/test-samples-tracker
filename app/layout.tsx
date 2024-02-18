import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Test Samples Tracker',
  description: 'Track your test samples with ease'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <nav className="w-full fixed top-0 left-0 right-0 z-30 bg-inherit py-3 px-20 border-b border-gray-400 flex items-center justify-between">
          <Link className="font-bold text-2xl text-green-600 italic" href="/">
            T-S Tracker
          </Link>
          <div className="w-[60%] flex justify-end">
            <Link
              className="font-medium hover:text-green-500 hover:border-green-500 border border-gray-400 rounded-md py-1 px-2"
              href="/test-samples"
            >
              Samples
            </Link>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
