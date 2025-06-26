'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getCarById, updateCar } from '@/data/cars';
import { Car } from '@/types/car';
import AdminHeader from '@/components/admin/AdminHeader';
import CarForm from '@/components/cars/CarForm';
import Loading from '@/components/ui/Loading';
import Button from '@/components/ui/Button';
import { ArrowLeft } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast'; // Import Toaster và toast từ react-hot-toast

export default function AdminEditCarPage() {
  const router = useRouter();
  const params = useParams();
  const carId = params.id as string;
  const [car, setCar] = useState<Car | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Xóa state notification và showNotification function
  // const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    const fetchCar = () => {
      const foundCar = getCarById(carId);
      if (foundCar) {
        setCar(foundCar);
      } else {
        // Thông báo lỗi nếu không tìm thấy xe, sau đó điều hướng
        toast.error('Không tìm thấy xe để chỉnh sửa.');
        router.push('/admin/cars');
      }
      setIsLoading(false);
    };
    fetchCar();
  }, [carId, router]); // Thêm router vào dependency array

  // Xóa function showNotification vì sẽ dùng toast từ react-hot-toast

  const handleUpdateCar = (updatedCarData: Omit<Car, 'id' | 'createdAt' | 'updatedAt'>) => {
    setIsSubmitting(true);
    try {
      if (car) {
        const updated = updateCar(car.id, updatedCarData);
        if (updated) {
          toast.success('Đã cập nhật thông tin xe thành công!'); // Sử dụng toast.success
          router.push(`/admin/cars/${car.id}`); // Điều hướng về trang chi tiết xe
        } else {
          toast.error('Cập nhật xe thất bại. Vui lòng thử lại.'); // Toast lỗi nếu update không thành công
        }
      }
    } catch (error) {
      console.error('Failed to update car:', error);
      toast.error('Có lỗi xảy ra khi cập nhật xe.'); // Sử dụng toast.error
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <Loading fullScreen text="Đang tải thông tin xe..." />;
  }

  if (!car) {
    return (
      <div className="p-8 bg-gray-50 min-h-full">
        <AdminHeader title="Xe không tìm thấy" />
        <p className="text-gray-700">Không tìm thấy xe với ID: {carId}</p>
        <Button onClick={() => router.push('/admin/cars')} className="mt-4">
          <ArrowLeft className="w-4 h-4 mr-2" /> Quay lại danh sách xe
        </Button>
        <Toaster position="top-center" reverseOrder={false} /> {/* Đặt Toaster ở đây */}
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-full">
      <AdminHeader
        title={`Chỉnh sửa xe: ${car.name}`}
        description="Cập nhật các thông tin chi tiết của xe."
        actions={
          <Button variant="secondary" onClick={() => router.back()}>
            <ArrowLeft className="w-5 h-5 mr-2" /> Quay lại
          </Button>
        }
      />

      <CarForm initialData={car} onSubmit={handleUpdateCar} isLoading={isSubmitting} submitButtonText="Cập nhật xe" />

      <Toaster position="top-center" reverseOrder={false} /> {/* Đặt Toaster ở đây */}
    </div>
  );
}