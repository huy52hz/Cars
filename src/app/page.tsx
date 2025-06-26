'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { cars } from '@/data/cars';
import { Car, ArrowRight, Star, Fuel, Calendar, Palette, Info, Search } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const { isAuthenticated, user, isAdmin } = useAuth();
  const router = useRouter();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const featuredCars = cars.slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Tìm chiếc xe <span className="text-blue-200">hoàn hảo</span> cho bạn
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Hàng nghìn xe chất lượng cao, giá tốt nhất thị trường
            </p>
            {isAuthenticated ? (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {/* Link trực tiếp đến /cars khi đã đăng nhập */}
                <Link
                  href="/cars"
                  className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-all duration-200 inline-flex items-center gap-2"
                >
                  Xem tất cả xe <ArrowRight className="w-5 h-5" />
                </Link>

              </div>
            ) : (
              <Link
                href="/login"
                className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-all duration-200 inline-flex items-center gap-2"
              >
                Đăng nhập để xem xe <ArrowRight className="w-5 h-5" />
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Welcome Message */}
      {isAuthenticated && (
        <section className="py-8 bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Chào mừng, {user?.fullName}! 👋
              </h2>
              <p className="text-gray-600">
                {user?.role === 'admin'
                  ? 'Bạn đang đăng nhập với quyền Admin. Có thể quản lý toàn bộ hệ thống.'
                  : 'Hãy khám phá bộ sưu tập xe của chúng tôi và tìm chiếc xe phù hợp với bạn.'
                }
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Featured Cars */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Xe nổi bật</h2>
            <p className="text-gray-600 text-lg">Những chiếc xe được yêu thích nhất</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCars.map((car) => (
              <div key={car.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="relative w-full aspect-video">
                  {car.images && car.images.length > 0 ? (
                    <Image
                      src={car.images[0]}
                      alt={car.name}
                      fill
                      style={{ objectFit: 'cover' }}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="transition-transform duration-300 hover:scale-105"
                    />
                  ) : (
                    <div className="bg-gradient-to-r from-gray-200 to-gray-300 flex items-center justify-center h-full">
                      <Car className="w-16 h-16 text-gray-400" />
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded-full">
                      {car.category}
                    </span>
                    <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded-full">
                      {car.status === 'available' ? 'Có sẵn' : 'Đã bán'}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-gray-800 mb-2">{car.name}</h3>

                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{car.year}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Fuel className="w-4 h-4" />
                      <span>{car.fuel}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Palette className="w-4 h-4" />
                      <span>{car.color}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold text-blue-600">
                      {formatPrice(car.price)}
                    </div>
                    {isAuthenticated ? (
                      // Link trực tiếp đến trang chi tiết xe khi đã đăng nhập
                      <Link
                        href={`/cars/${car.id}`}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Xem chi tiết
                      </Link>
                    ) : (
                      // Link đến trang đăng nhập nếu chưa đăng nhập
                      <Link
                        href="/login"
                        className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                      >
                        Đăng nhập
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {isAuthenticated && (
            <div className="text-center mt-12">
              {/* Link trực tiếp đến /cars khi đã đăng nhập */}
              <Link
                href="/cars"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
              >
                Xem tất cả xe <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center text-white">
            <div>
              <div className="text-4xl font-bold mb-2">1000+</div>
              <div className="text-blue-200">Xe có sẵn</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-blue-200">Khách hàng hài lòng</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">10+</div>
              <div className="text-blue-200">Thương hiệu xe</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Component */}
      <Footer />
    </div>
  );
}