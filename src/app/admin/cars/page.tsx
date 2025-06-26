'use client';

import React, { useState } from 'react';
import { getCars, deleteCar } from '@/data/cars';
import { Car as CarIcon, Plus, Edit, Trash, Eye } from 'lucide-react';
import Link from 'next/link';
import AdminHeader from '@/components/admin/AdminHeader';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Table from '@/components/ui/Table';
import { Car } from '@/types/car'; // Import Car type
import { formatPrice, formatDate } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { Toaster, toast } from 'react-hot-toast'; 

export default function AdminCarsPage() {
  const router = useRouter();
  const [cars, setCars] = useState(getCars()); // Use state to manage cars for live updates
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [carToDelete, setCarToDelete] = useState<Car | null>(null);

  const handleDeleteClick = (car: Car) => {
    setCarToDelete(car);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (carToDelete) {
      const deleted = deleteCar(carToDelete.id); // Lấy kết quả từ hàm deleteCar
      if (deleted) {
        setCars(getCars()); // Refresh the list
        setIsDeleteModalOpen(false);
        setCarToDelete(null);
        toast.success(`Đã xóa xe "${carToDelete.name}" thành công!`); // Sử dụng toast.success
      } else {
        toast.error(`Không thể xóa xe "${carToDelete.name}". Vui lòng thử lại.`); // Thông báo lỗi nếu xóa không thành công
      }
    }
  };

  interface CustomModalProps extends React.ComponentProps<typeof Modal> {
    description?: string;
    footer?: React.ReactNode;
}

  const carColumns = [
    {
      key: 'name',
      header: 'Tên xe',
      render: (car: Car) => (
        <div className="flex items-center gap-3">
          {car.images && car.images.length > 0 ? (
            <img src={car.images[0]} alt={car.name} className="w-16 h-10 object-cover rounded" />
          ) : (
            <CarIcon className="w-10 h-10 text-gray-400" />
          )}
          <span>{car.name}</span>
        </div>
      ),
      className: 'font-medium'
    },
    { key: 'brand', header: 'Thương hiệu' },
    { key: 'category', header: 'Danh mục' },
    {
      key: 'price',
      header: 'Giá',
      render: (car: Car) => formatPrice(car.price),
      className: 'text-blue-600 font-semibold'
    },
    {
      key: 'status',
      header: 'Trạng thái',
      render: (car: Car) => (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
          car.status === 'available' ? 'bg-green-100 text-green-800' :
          car.status === 'sold' ? 'bg-red-100 text-red-800' :
          'bg-yellow-100 text-yellow-800'
        }`}>
          {car.status === 'available' ? 'Có sẵn' :
           car.status === 'sold' ? 'Đã bán' : 'Đang chờ'}
        </span>
      )
    },
    {
      key: 'createdAt',
      header: 'Ngày tạo',
      render: (car: Car) => formatDate(car.createdAt),
      className: 'text-gray-500 text-sm'
    },
    {
      key: 'actions',
      header: 'Hành động',
      render: (car: Car) => (
        <div className="flex items-center space-x-2">
          <Link href={`/admin/cars/${car.id}`} title="Xem chi tiết">
            <Button variant="ghost" size="sm">
              <Eye className="w-4 h-4" />
            </Button>
          </Link>
          <Link href={`/admin/cars/${car.id}/edit`} title="Chỉnh sửa">
            <Button variant="ghost" size="sm">
              <Edit className="w-4 h-4 text-blue-600" />
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDeleteClick(car)}
            title="Xóa"
          >
            <Trash className="w-4 h-4 text-red-600" />
          </Button>
        </div>
      ),
      className: 'text-right'
    },
  ];

  return (
    <div className="p-8 bg-gray-50 min-h-full">
      <AdminHeader
        title="Quản lý xe"
        description="Quản lý danh sách các xe có sẵn, đã bán và đang chờ."
        actions={
          <Link href="/admin/cars/add">
            <Button>
              <Plus className="w-5 h-5 mr-2" /> Thêm xe mới
            </Button>
          </Link>
        }
      />

      <Table<Car>
        data={cars}
        columns={carColumns}
        emptyMessage="Không có xe nào được tìm thấy."
      />

    <Modal
    // Ép kiểu các props bạn muốn truyền vào
    {...{
      isOpen: isDeleteModalOpen,
      onClose: () => setIsDeleteModalOpen(false),
      title: "Xác nhận xóa xe",
      description: `Hành động này sẽ xóa vĩnh viễn xe "${carToDelete?.name}" khỏi hệ thống. Bạn có chắc chắn muốn tiếp tục?`,
      footer: (
        <>
          <Button variant="secondary" onClick={() => setIsDeleteModalOpen(false)}>
            Hủy
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Xóa
          </Button>
        </>
      )
    } as CustomModalProps} // Ép kiểu ở đây
  >
    <p className="text-gray-700">
      Bạn đang xóa xe: <span className="font-semibold text-blue-700">{carToDelete?.name}</span>.
    </p>
  </Modal>

      <Toaster position="top-center" reverseOrder={false} /> {/* Đặt Toaster ở đây */}
    </div>
  );
}