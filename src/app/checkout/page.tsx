// src/app/checkout/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Order } from '@/types/order';
import { v4 as uuidv4 } from 'uuid';
import Link from 'next/link';
import Image from 'next/image';
import { getCarById } from '@/data/cars';
import { ArrowLeft } from 'lucide-react';

const CheckoutPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();

  const carId = searchParams.get('carId');
  const car = carId ? getCarById(carId) : null;

  const [customerInfo, setCustomerInfo] = useState({
    name: user?.fullName || '',
    email: user?.email || '',
    phone: '',
    address: '',
    notes: '',
  });

  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderMessage, setOrderMessage] = useState('');
  // State mới để quản lý lỗi validation
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (!carId || !car) {
      setOrderMessage('Không tìm thấy thông tin xe để đặt hàng. Vui lòng chọn lại xe.');
      setOrderSuccess(false);
      setTimeout(() => {
        router.push('/cars');
      }, 2000);
    }
  }, [carId, car, router]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCustomerInfo((prevInfo) => ({ ...prevInfo, [name]: value }));
    // Xóa lỗi validation cho trường này khi người dùng bắt đầu nhập
    setValidationErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
  };

  // Hàm validate form
  const validateForm = () => {
    let errors: { [key: string]: string } = {};
    let isValid = true;

    if (!customerInfo.name.trim()) {
      errors.name = 'Họ và tên không được để trống.';
      isValid = false;
    }
    if (!customerInfo.email.trim()) {
      errors.email = 'Email không được để trống.';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(customerInfo.email)) {
      errors.email = 'Email không đúng định dạng.';
      isValid = false;
    }
    if (!customerInfo.phone.trim()) {
      errors.phone = 'Số điện thoại không được để trống.';
      isValid = false;
    } else if (!/^\d{10,11}$/.test(customerInfo.phone)) { // Simple phone number regex for 10 or 11 digits
      errors.phone = 'Số điện thoại phải có 10 hoặc 11 chữ số.';
      isValid = false;
    }
    if (!customerInfo.address.trim()) {
      errors.address = 'Địa chỉ nhận xe không được để trống.';
      isValid = false;
    }

    setValidationErrors(errors);
    return isValid;
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (!car || !carId) {
      setOrderMessage('Thông tin xe không hợp lệ. Vui lòng thử lại.');
      setOrderSuccess(false);
      return;
    }

    // Chạy validation trước khi xử lý đơn hàng
    if (!validateForm()) {
      setOrderMessage('Vui lòng điền đầy đủ và chính xác các thông tin bắt buộc.');
      setOrderSuccess(false);
      return;
    }

    const newOrder: Order = {
      id: uuidv4(),
      userId: user?.id || 'guest',
      carId: car.id,
      customerName: customerInfo.name,
      customerEmail: customerInfo.email,
      customerPhone: customerInfo.phone,
      totalAmount: car.price,
      status: 'pending',
      notes: customerInfo.notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (typeof window !== 'undefined') {
      const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]') as Order[];
      localStorage.setItem('orders', JSON.stringify([...existingOrders, newOrder]));
    }

    setOrderSuccess(true);
    setOrderMessage(`Đơn hàng xe "${car.name}" của bạn đã được đặt thành công!`);

    setTimeout(() => {
      router.push('/profile/orders');
    }, 3000);
  };

  if (!car) {
    return (
      <div className="text-center py-10">
        <h1 className="text-2xl font-bold mb-4">Đang tải thông tin xe...</h1>
        <p>Nếu trang không tự động chuyển hướng, vui lòng quay lại và chọn xe.</p>
        <Link href="/cars" className="text-blue-600 hover:underline mt-4 inline-block">
          Xem tất cả xe
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link href={`/cars/${car.id}`} className="inline-flex items-center text-blue-600 hover:underline">
          <ArrowLeft className="w-4 h-4 mr-1" /> Quay lại 
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">Xác nhận Đặt hàng</h1>

      {orderSuccess && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-6" role="alert">
          <strong className="font-bold">Thành công! </strong>
          <span className="block sm:inline">{orderMessage}</span>
          <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
            <svg
              className="fill-current h-6 w-6 text-green-500"
              role="button"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              onClick={() => setOrderSuccess(false)}
            >
              <title>Close</title>
              <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.196l-2.651 3.653a1.2 1.2 0 1 1-1.697-1.697l3.653-2.651-3.653-2.651a1.2 1.2 0 1 1 1.697-1.697L10 8.304l2.651-3.653a1.2 1.2 0 1 1 1.697 1.697L11.196 10l3.653 2.651a1.2 1.2 0 0 1 0 1.698z" />
            </svg>
          </span>
        </div>
      )}

      {orderMessage && !orderSuccess && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
          <strong className="font-bold">Lỗi! </strong>
          <span className="block sm:inline">{orderMessage}</span>
          <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
            <svg
              className="fill-current h-6 w-6 text-red-500"
              role="button"
              xmlns="http://www.w3c.org/2000/svg"
              viewBox="0 0 20 20"
              onClick={() => setOrderMessage('')}
            >
              <title>Close</title>
              <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.196l-2.651 3.653a1.2 1.2 0 1 1-1.697-1.697l3.653-2.651-3.653-2.651a1.2 1.2 0 1 1 1.697-1.697L10 8.304l2.651-3.653a1.2 1.2 0 1 1 1.697 1.697L11.196 10l3.653 2.651a1.2 1.2 0 0 1 0 1.698z" />
            </svg>
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">Thông tin xe đặt mua</h2>
          <div className="flex items-center border-b pb-4">
            {car.images && car.images.length > 0 && (
              <div className="relative w-24 h-24 mr-4 flex-shrink-0">
                <Image src={car.images[0]} alt={car.name} fill style={{ objectFit: 'cover' }} className="rounded-md" />
              </div>
            )}
            <div className="flex-grow">
              <h3 className="font-medium text-gray-800 text-lg">{car.name}</h3>
              <p className="text-sm text-gray-600">Thương hiệu: {car.brand}</p>
              <p className="text-sm text-gray-600">Năm: {car.year}</p>
            </div>
            <span className="font-semibold text-gray-800 text-xl">{formatPrice(car.price)}</span>
          </div>

          <div className="flex justify-between items-center mt-6 pt-4 border-t-2 border-dashed border-gray-200">
            <p className="text-xl font-bold text-gray-800">Tổng thanh toán:</p>
            <p className="text-2xl font-bold text-blue-600">{formatPrice(car.price)}</p>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">Thông tin khách hàng</h2>
          <form onSubmit={handleSubmitOrder} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Họ và tên <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                id="name"
                name="name"
                value={customerInfo.name}
                onChange={handleInputChange}
                className="w-full"
              />
              {validationErrors.name && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.name}</p>
              )}
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <Input
                type="email"
                id="email"
                name="email"
                value={customerInfo.email}
                onChange={handleInputChange}
                className="w-full"
              />
              {validationErrors.email && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.email}</p>
              )}
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Số điện thoại <span className="text-red-500">*</span>
              </label>
              <Input
                type="tel"
                id="phone"
                name="phone"
                value={customerInfo.phone}
                onChange={handleInputChange}
                className="w-full"
              />
              {validationErrors.phone && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.phone}</p>
              )}
            </div>
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                Địa chỉ nhận xe <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                id="address"
                name="address"
                value={customerInfo.address}
                onChange={handleInputChange}
                className="w-full"
              />
              {validationErrors.address && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.address}</p>
              )}
            </div>
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                Ghi chú (tùy chọn)
              </label>
              <textarea
                id="notes"
                name="notes"
                value={customerInfo.notes}
                onChange={handleInputChange}
                rows={3}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              ></textarea>
            </div>
            <Button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 mt-4 text-lg"
              disabled={orderSuccess}
            >
              {orderSuccess ? 'Đang chuyển hướng...' : 'Xác nhận Đặt hàng'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};
 
export default CheckoutPage;