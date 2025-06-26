// src/components/layout/Header.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image'; // Import Image component
import { useAuth } from '@/contexts/AuthContext';
// Import các icon mới: History hoặc ReceiptText thay cho ShoppingCart
import { Car, User, LogOut, Settings, History, ReceiptText, ShoppingCart } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
// import { useCart } from '@/contexts/CartContext'; // Không cần thiết nếu không hiển thị số lượng giỏ hàng

export default function Header() {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const { getTotalItems } = useCart();
  // const { getTotalItems } = useCart(); // Không cần thiết nếu không hiển thị số lượng giỏ hàng

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
              <Car className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-800">Car Shop</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-gray-600 hover:text-blue-600 transition-colors">
              Trang chủ
            </Link>
            {/* Bạn có thể thêm các liên kết khác ở đây, ví dụ: /cars */}
            <Link href="/cars" className="text-gray-600 hover:text-blue-600 transition-colors">
              Xem xe
            </Link>
          </nav>

          {/* User Menu */}
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                {/* HIỂN THỊ ICON LỊCH SỬ MUA HÀNG CHO USER (KHÔNG PHẢI ADMIN) */}
                {!isAdmin && (
                  <Link
                    href="/profile/orders" // Đường dẫn đến trang lịch sử đơn hàng
                    className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                    title="Lịch sử đơn hàng" // Tooltip
                  >
                    {/* Chọn một trong các icon sau: */}
                    <History className="w-5 h-5" /> {/* Icon lịch sử */}
                    {/* Hoặc */}
                    {/* <ReceiptText className="w-5 h-5" /> Icon hóa đơn */}
                  </Link>
                )}

                {isAuthenticated && !isAdmin && (
                  <Link href="/cart" className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors" title="Giỏ hàng">
                    <ShoppingCart className="w-6 h-6" />
                    {getTotalItems() > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 font-bold">
                        {getTotalItems()}
                      </span>
                    )}
                  </Link>
                )}

                <div className="flex items-center gap-3">
                  {/* AVATAR VÀ TÊN NGƯỜI DÙNG CÓ THỂ NHẤP VÀO ĐỂ ĐI ĐẾN PROFILE */}
                  <Link href="/profile" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                    <div className="relative w-8 h-8 rounded-full overflow-hidden border-2 border-blue-500">
                      <Image
                        src={user?.avatar || '/images/avatars/default-avatar.jpg'} // Sử dụng avatar của user hoặc ảnh mặc định
                        alt={user?.fullName || 'User Avatar'}
                        fill // Fill parent container
                        sizes="32px" // Optimize image loading
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                    <span className="text-sm text-gray-700 font-medium hidden sm:block">{user?.fullName}</span>
                  </Link>
                  {/* KẾT THÚC AVATAR */}

                  {isAdmin && (
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full hidden sm:block">
                      Admin
                    </span>
                  )}

                  {isAdmin && (
                    <Link
                      href="/admin"
                      className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                      title="Admin Panel"
                    >
                      <Settings className="w-5 h-5" />
                    </Link>
                  )}

                  <button
                    onClick={logout}
                    className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                    title="Đăng xuất"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              </>
            ) : (
              <Link
                href="/login"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Đăng nhập
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}