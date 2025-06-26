'use client';

import React from 'react';
import Link from 'next/link';
import { Car } from 'lucide-react'; // Import Car icon

export default function Footer() {
  return (
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Car className="w-8 h-8" />
                <span className="text-xl font-bold">Car Shop</span>
              </div>
              <p className="text-gray-300">
                Nền tảng mua bán xe ô tô uy tín, chất lượng cao tại Việt Nam.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Liên kết</h3>
              <ul className="space-y-2 text-gray-300">
                <li><Link href="/" className="hover:text-white transition-colors">Trang chủ</Link></li>
                <li><Link href="/cars" className="hover:text-white transition-colors">Xe bán</Link></li>
                <li><Link href="/search" className="hover:text-white transition-colors">Tìm kiếm</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Liên hệ</h3>
              <div className="text-gray-300 space-y-2">
                <p>📞 Hotline: 1900 1234</p>
                <p>📧 Email: contact@carshop.com</p>
                <p>📍 Địa chỉ: 123 Đường ABC, TP.Hà Nội</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Car Shop. Tất cả quyền được bảo lưu.</p>
          </div>
        </div>
      </footer>
  );
}