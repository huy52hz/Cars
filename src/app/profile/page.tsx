'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Link from 'next/link';
import Image from 'next/image';

// Import icons từ Heroicons
import {
  UserCircleIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  ShieldCheckIcon,
  PencilSquareIcon,
  ShoppingBagIcon,
  HomeIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

const ProfilePage = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <ArrowPathIcon className="h-8 w-8 animate-spin text-blue-500 mr-3" /> {/* Nhỏ hơn */}
        <p className="text-lg text-gray-700 font-semibold">Đang tải hồ sơ...</p> {/* Nhỏ hơn */}
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-100 p-4"> {/* Nhỏ hơn */}
        <p className="text-xl text-red-600 font-semibold mb-5 text-center"> {/* Nhỏ hơn */}
          Bạn cần đăng nhập để xem hồ sơ cá nhân của mình.
        </p>
        <Link
          href="/login"
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-300 ease-in-out" // Nhỏ hơn
        >
          <EnvelopeIcon className="h-5 w-5 mr-2 -ml-1" /> {/* Nhỏ hơn */}
          Đăng nhập ngay
        </Link>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 flex items-center justify-center"> {/* py và px nhỏ hơn */}
        <div className="max-w-2xl w-full bg-white shadow-xl rounded-xl overflow-hidden transform transition-all duration-300 hover:scale-[1.005]"> {/* max-w và rounded nhỏ hơn */}
          {/* Header với Cover Photo và Avatar */}
          <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 h-40 flex items-end justify-start p-6"> {/* h và p nhỏ hơn */}
            <div className="absolute -bottom-14 left-6"> {/* bottom và left nhỏ hơn */}
              <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-md bg-gray-300 flex items-center justify-center"> {/* w, h, border, shadow nhỏ hơn */}
                {user.avatar ? (
                  <Image
                    src={user.avatar}
                    alt={user.fullName || 'Ảnh đại diện'}
                    fill
                    style={{ objectFit: 'cover' }}
                    className="rounded-full"
                  />
                ) : (
                  <UserCircleIcon className="h-full w-full text-gray-400" />
                )}
              </div>
            </div>
          </div>

          <div className="p-6 pt-20 sm:p-8 sm:pt-24"> {/* p và pt nhỏ hơn */}
            {/* Thông tin cơ bản */}
            <h1 className="text-3xl font-extrabold text-gray-900 leading-tight mb-1"> {/* Nhỏ hơn */}
              {user.fullName}
            </h1>
            <p className="text-lg text-gray-700 flex items-center mb-3"> {/* Nhỏ hơn */}
              <ShieldCheckIcon className="h-5 w-5 text-indigo-500 mr-2" /> {/* Nhỏ hơn */}
              <span className="font-semibold">{user.role === 'admin' ? 'Quản trị viên' : 'Người dùng'}</span>
            </p>

            {/* Các chi tiết liên hệ */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6"> {/* gap và mt nhỏ hơn */}
              <div className="bg-gray-50 p-5 rounded-lg shadow-sm border border-gray-100 flex items-center"> {/* p và rounded nhỏ hơn */}
                <EnvelopeIcon className="h-6 w-6 text-blue-500 mr-3 flex-shrink-0" /> {/* Nhỏ hơn */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-600">Email</h3> {/* Nhỏ hơn */}
                  <p className="text-base text-gray-800 break-words">{user.email}</p> {/* Nhỏ hơn */}
                </div>
              </div>
              {user.phone && (
                <div className="bg-gray-50 p-5 rounded-lg shadow-sm border border-gray-100 flex items-center"> {/* p và rounded nhỏ hơn */}
                  <PhoneIcon className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" /> {/* Nhỏ hơn */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-600">Số điện thoại</h3> {/* Nhỏ hơn */}
                    <p className="text-base text-gray-800">{user.phone}</p> {/* Nhỏ hơn */}
                  </div>
                </div>
              )}
              {user.address && (
                <div className="bg-gray-50 p-5 rounded-lg shadow-sm border border-gray-100 flex items-center col-span-1 md:col-span-2"> {/* p và rounded nhỏ hơn */}
                  <MapPinIcon className="h-6 w-6 text-red-500 mr-3 flex-shrink-0" /> {/* Nhỏ hơn */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-600">Địa chỉ</h3> {/* Nhỏ hơn */}
                    <p className="text-base text-gray-800">{user.address}</p> {/* Nhỏ hơn */}
                  </div>
                </div>
              )}
            </div>

            {/* Tùy chọn tài khoản */}
            <div className="mt-10 border-t border-gray-200 pt-6"> {/* mt và pt nhỏ hơn */}
              <h2 className="text-xl font-bold text-gray-800 mb-5">Tùy chọn tài khoản</h2> {/* Nhỏ hơn */}
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3"> {/* gap nhỏ hơn */}
                <li>
                  <Link
                    href="/profile/edit"
                    className="flex items-center px-5 py-3 bg-blue-50 hover:bg-blue-100 rounded-lg shadow-sm hover:shadow-md text-blue-700 font-medium text-base transition duration-200 ease-in-out transform hover:-translate-y-1" // Nhỏ hơn
                  >
                    <PencilSquareIcon className="h-5 w-5 mr-2 flex-shrink-0" /> {/* Nhỏ hơn */}
                    Chỉnh sửa thông tin cá nhân
                  </Link>
                </li>
                <li>
                  <Link
                    href="/profile/orders"
                    className="flex items-center px-5 py-3 bg-purple-50 hover:bg-purple-100 rounded-lg shadow-sm hover:shadow-md text-purple-700 font-medium text-base transition duration-200 ease-in-out transform hover:-translate-y-1" // Nhỏ hơn
                  >
                    <ShoppingBagIcon className="h-5 w-5 mr-2 flex-shrink-0" /> {/* Nhỏ hơn */}
                    Xem lịch sử đơn hàng
                  </Link>
                </li>
              </ul>
            </div>

            {/* Quay lại trang chủ */}
            <div className="mt-10 text-center"> {/* mt nhỏ hơn */}
              <Link
                href="/"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition duration-300 ease-in-out" // Nhỏ hơn
              >
                <HomeIcon className="h-5 w-5 mr-2 -ml-1" /> {/* Nhỏ hơn */}
                Quay lại trang chủ
              </Link>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default ProfilePage;