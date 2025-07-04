// src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import { CartProvider } from '@/contexts/CartContext';
import { Toaster } from 'react-hot-toast'; // Import Toaster

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Car Sales App',
  description: 'Generated by create next app',
  icons: {
    icon: '/images/icons/car-dealership.png',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </AuthProvider>
        <Toaster /> {/* Thêm Toaster component vào đây */}
      </body>
    </html>
  );
}