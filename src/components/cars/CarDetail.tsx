// src/components/cars/CarDetail.tsx
'use client'; // Đảm bảo đây là Client Component

import React from 'react';
import Image from 'next/image';
import { Car } from '@/types/car';
import { useCart } from '@/contexts/CartContext'; // Import useCart hook
import Button from '../ui/Button';

interface CarDetailProps {
  car: Car;
}

export const CarDetail = ({ car }: CarDetailProps) => {
  const { addToCart } = useCart(); // Sử dụng hook useCart

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const handleAddToCart = () => {
    addToCart(car);
    alert(`${car.name} đã được thêm vào giỏ hàng!`); // Thông báo đơn giản
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      {car.images && car.images.length > 0 && (
        <div className="relative w-full h-96 mb-4">
          <Image
            src={car.images[0]}
            alt={car.name}
            fill
            style={{ objectFit: 'cover' }}
            className="rounded-lg"
          />
        </div>
      )}
      <h1 className="text-3xl font-bold mb-4">{car.name}</h1>
      <p className="text-xl text-blue-600 font-semibold mb-2">Giá: {formatPrice(car.price)}</p>
      <p className="text-gray-700 mb-4">{car.description}</p>
      
      <div className="grid grid-cols-2 gap-4 text-gray-600 mb-6">
        <p><strong>Năm sản xuất:</strong> {car.year}</p>
        <p><strong>Hãng:</strong> {car.brand}</p>
        <p><strong>Màu sắc:</strong> {car.color}</p>
        <p><strong>Loại nhiên liệu:</strong> {car.fuel}</p>
        <p><strong>Hộp số:</strong> {car.transmission}</p>
        <p><strong>Tình trạng:</strong> {car.status === 'available' ? 'Có sẵn' : 'Đã bán'}</p>
      </div>

      <Button onClick={handleAddToCart} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3">
        Thêm vào giỏ hàng
      </Button>
    </div>
  );
};