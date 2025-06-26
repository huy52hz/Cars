'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { addCar } from '@/data/cars';
import { Car } from '@/types/car';
import AdminHeader from '@/components/admin/AdminHeader';
import CarForm from '@/components/cars/CarForm';
import Loading from '@/components/ui/Loading';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, XCircle, X } from 'lucide-react'; 


interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'warning';
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  const bgColor = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    warning: 'bg-yellow-50 border-yellow-200'
  }[type];

  const textColor = {
    success: 'text-green-800',
    error: 'text-red-800',
    warning: 'text-yellow-800'
  }[type];

  const Icon = {
    success: CheckCircle,
    error: XCircle,
    warning: XCircle
  }[type];

  const iconColor = {
    success: 'text-green-400',
    error: 'text-red-400',
    warning: 'text-yellow-400'
  }[type];

  return (
    <div
      className={`fixed top-8 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full mx-4 ${bgColor} border rounded-lg shadow-xl p-6 transition-all duration-300 ease-in-out`}
    >
      <div className="flex items-center">
        <Icon className={`w-6 h-6 ${iconColor} mr-4 flex-shrink-0`} />
        <p className={`text-base font-medium ${textColor} flex-grow`}>
          {message}
        </p>
        <button
          onClick={onClose}
          className={`ml-4 flex-shrink-0 ${textColor} hover:opacity-70 transition-opacity`}
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

const useToast = () => {
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error' | 'warning';
  } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'warning') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000); // Tự động ẩn sau 4 giây
  };

  const hideToast = () => {
    setToast(null);
  };

  return {
    toast,
    showToast,
    hideToast
  };
};

export default function AdminAddCarPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { toast, showToast, hideToast } = useToast(); 

  const handleAddCar = (newCarData: Omit<Car, 'id' | 'createdAt' | 'updatedAt'>) => {
    setIsLoading(true);
    try {
      addCar(newCarData);
      showToast('Đã thêm xe mới thành công!', 'success'); 
      router.push('/admin/cars'); 
    } catch (error) {
      console.error("Failed to add car:", error);
      showToast('Có lỗi xảy ra khi thêm xe.', 'error'); 
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-full">
      {/* Back button */}
      <div className="mb-6">
        <Link href="/admin/cars" className="inline-flex items-center text-blue-600 hover:underline">
          <ArrowLeft className="w-4 h-4 mr-1" /> Quay lại danh sách xe
        </Link>
      </div>

      <AdminHeader title="Thêm xe mới" description="Nhập thông tin chi tiết cho xe mới." />
      {isLoading && <Loading fullScreen />}
      <CarForm onSubmit={handleAddCar} isLoading={isLoading} submitButtonText="Thêm xe" />

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
        />
      )}
    </div>
  );
}