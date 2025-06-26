'use client';

import React from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getCarById } from '@/data/cars';
import AdminHeader from '@/components/admin/AdminHeader';
import Button from '@/components/ui/Button';
import { ArrowLeft, Edit, Trash, Fuel, Calendar, Palette, Gauge, Car as CarIcon, Info, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils';
import Modal from '@/components/ui/Modal';
import { useState } from 'react';
import { deleteCar } from '@/data/cars';
import { Toaster, toast } from 'react-hot-toast'; 

export default function AdminCarDetailPage() {
  const router = useRouter();
  const params = useParams();
  const carId = params.id as string;
  const car = getCarById(carId);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  if (!car) {
    return (
      <div className="p-8 bg-gray-50 min-h-full">
        <AdminHeader title="Xe không tìm thấy" />
        <p className="text-gray-700">Không tìm thấy xe với ID: {carId}</p>
        <Button onClick={() => router.push('/admin/cars')} className="mt-4">
          <ArrowLeft className="w-4 h-4 mr-2" /> Quay lại danh sách xe
        </Button>
        <Toaster position="top-center" reverseOrder={false} /> {/* Đặt Toaster cho trường hợp này */}
      </div>
    );
  }

  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    const deleted = deleteCar(car.id); // Lấy kết quả từ hàm deleteCar
    if (deleted) {
      toast.success(`Đã xóa xe "${car.name}" thành công!`); // Sử dụng toast.success
      router.push('/admin/cars'); // Redirect back to cars list
    } else {
      toast.error(`Không thể xóa xe "${car.name}". Vui lòng thử lại.`); // Thông báo lỗi nếu xóa không thành công
    }
    setIsDeleteModalOpen(false); // Đóng modal bất kể thành công hay thất bại
  };

  return (
    <div className="p-8 bg-gray-50 min-h-full">
      <AdminHeader
        title={`Chi tiết xe: ${car.name}`}
        description={`Thông tin chi tiết về ${car.name}`}
        actions={
          <div className="flex gap-2">
            <Link href={`/admin/cars/${car.id}/edit`}>
              <Button variant="primary">
                <Edit className="w-5 h-5 mr-2" /> Chỉnh sửa
              </Button>
            </Link>
            <Button variant="danger" onClick={handleDeleteClick}>
              <Trash className="w-5 h-5 mr-2" /> Xóa
            </Button>
            <Button variant="secondary" onClick={() => router.back()}>
              <ArrowLeft className="w-5 h-5 mr-2" /> Quay lại
            </Button>
          </div>
        }
      />

      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Car Images */}
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <ImageIcon className="w-6 h-6 text-blue-600" /> Ảnh xe
            </h3>
            {car.images && car.images.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {car.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${car.name} - ${index + 1}`}
                    className="w-full h-48 object-cover rounded-lg shadow-md"
                  />
                ))}
              </div>
            ) : (
              <div className="text-gray-500 text-center py-10 border border-dashed rounded-lg">
                Không có ảnh nào.
              </div>
            )}
          </div>

          {/* Car Details */}
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Info className="w-6 h-6 text-blue-600" /> Thông tin cơ bản
            </h3>
            <div className="space-y-4">
              <p className="text-gray-700">
                <strong className="block text-gray-900">Tên xe:</strong> {car.name}
              </p>
              <p className="text-gray-700">
                <strong className="block text-gray-900">Thương hiệu:</strong> {car.brand}
              </p>
              <p className="text-gray-700">
                <strong className="block text-gray-900">Model:</strong> {car.model}
              </p>
              <p className="text-gray-700">
                <strong className="block text-gray-900">Năm sản xuất:</strong> {car.year}
              </p>
              <p className="text-gray-700">
                <strong className="block text-gray-900">Giá:</strong>{' '}
                <span className="text-blue-600 text-lg font-bold">{formatPrice(car.price)}</span>
              </p>
              <p className="text-gray-700">
                <strong className="block text-gray-900">Danh mục:</strong> {car.category}
              </p>
              <p className="text-gray-700 flex items-center gap-2">
                <Fuel className="w-5 h-5 text-gray-600" />
                <strong className="text-gray-900">Nhiên liệu:</strong> {car.fuel}
              </p>
              <p className="text-gray-700 flex items-center gap-2">
                <CarIcon className="w-5 h-5 text-gray-600" />
                <strong className="text-gray-900">Hộp số:</strong> {car.transmission}
              </p>
              <p className="text-gray-700 flex items-center gap-2">
                <Gauge className="w-5 h-5 text-gray-600" />
                <strong className="text-gray-900">Số km đã đi:</strong> {car.mileage} km
              </p>
              <p className="text-gray-700 flex items-center gap-2">
                <Palette className="w-5 h-5 text-gray-600" />
                <strong className="text-gray-900">Màu sắc:</strong> {car.color}
              </p>
              <p className="text-gray-700">
                <strong className="block text-gray-900">Mô tả:</strong> {car.description}
              </p>
              <p className="text-gray-700">
                <strong className="block text-gray-900">Trạng thái:</strong>{' '}
                <span className={`font-semibold ${
                  car.status === 'available' ? 'text-green-600' :
                  car.status === 'sold' ? 'text-red-600' :
                  'text-yellow-600'
                }`}>
                  {car.status === 'available' ? 'Có sẵn' :
                    car.status === 'sold' ? 'Đã bán' : 'Đang chờ'}
                </span>
              </p>
              <p className="text-gray-700">
                <strong className="block text-gray-900">Ngày tạo:</strong>{' '}
                {new Date(car.createdAt).toLocaleDateString('vi-VN')}
              </p>
              <p className="text-gray-700">
                <strong className="block text-gray-900">Cập nhật cuối:</strong>{' '}
                {car.updatedAt ? new Date(car.updatedAt).toLocaleDateString('vi-VN') : 'Chưa cập nhật'}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Info className="w-6 h-6 text-blue-600" /> Tính năng nổi bật
          </h3>
          {car.features && car.features.length > 0 ? (
            <ul className="list-disc list-inside space-y-2 text-gray-700 pl-4">
              {car.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">Không có tính năng nổi bật nào được liệt kê.</p>
          )}
        </div>
      </div>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Xác nhận xóa xe"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsDeleteModalOpen(false)}>
              Hủy
            </Button>
            <Button variant="danger" onClick={confirmDelete}>
              Xóa
            </Button>
          </>
        }
      >
        <p className="text-gray-700">
          Bạn có chắc chắn muốn xóa xe "**{car.name}**" không? Hành động này không thể hoàn tác.
        </p>
      </Modal>

      {/* Đặt Toaster ở đây để hiển thị thông báo toast */}
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
}