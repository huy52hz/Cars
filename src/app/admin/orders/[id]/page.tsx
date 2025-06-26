'use client';

import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getOrderById, updateOrder } from '@/data/orders';
import { getCarById } from '@/data/cars';
import { getUserById } from '@/data/users';
import AdminHeader from '@/components/admin/AdminHeader';
import Button from '@/components/ui/Button';
import { ArrowLeft, User, Car, DollarSign, Calendar, Info, Mail, Phone } from 'lucide-react';
import Link from 'next/link';
import { formatPrice, formatDate } from '@/lib/utils';
import Modal from '@/components/ui/Modal';
import { Order } from '@/types/order';

export default function AdminOrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params.id as string;
  const order = getOrderById(orderId);

  const [isEditStatusModalOpen, setIsEditStatusModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<Order['status']>(order?.status || 'pending');

  if (!order) {
    return (
      <div className="p-8 bg-gray-50 min-h-full">
        <AdminHeader title="Đơn hàng không tìm thấy" />
        <p className="text-gray-700">Không tìm thấy đơn hàng với ID: {orderId}</p>
        <Button onClick={() => router.push('/admin/orders')} className="mt-4">
          <ArrowLeft className="w-4 h-4 mr-2" /> Quay lại danh sách đơn hàng
        </Button>
      </div>
    );
  }

  const orderedCar = getCarById(order.carId);
  const customerUser = getUserById(order.userId);

  const getStatusDisplay = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'Đang chờ';
      case 'confirmed': return 'Đã xác nhận';
      case 'completed': return 'Hoàn thành';
      case 'cancelled': return 'Đã hủy';
      default: return 'Không rõ';
    }
  };

  const getStatusClass = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleEditStatusClick = () => {
    setNewStatus(order.status); // Reset status to current before opening modal
    setIsEditStatusModalOpen(true);
  };

  const confirmUpdateStatus = () => {
    updateOrder(order.id, { status: newStatus });
    alert('Đã cập nhật trạng thái đơn hàng thành công!');
    setIsEditStatusModalOpen(false);
    router.refresh(); // Force a re-render to show updated status
  };

  return (
    <div className="p-8 bg-gray-50 min-h-full">
      <AdminHeader
        title={`Chi tiết đơn hàng: ${order.id.substring(0, 8)}...`}
        description="Thông tin chi tiết về đơn đặt hàng."
        actions={
          <Button variant="secondary" onClick={() => router.back()}>
            <ArrowLeft className="w-5 h-5 mr-2" /> Quay lại
          </Button>
        }
      />

      <div className="bg-white p-6 rounded-xl shadow-sm border space-y-6">
        {/* Order Summary */}
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Info className="w-6 h-6 text-blue-600" /> Thông tin đơn hàng
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <p className="text-gray-700">
              <strong className="block text-gray-900">Mã đơn hàng:</strong> {order.id}
            </p>
            <p className="text-gray-700">
              <strong className="block text-gray-900">Tổng tiền:</strong>{' '}
              <span className="text-blue-600 text-lg font-bold">{formatPrice(order.totalAmount)}</span>
            </p>
            <p className="text-gray-700">
              <strong className="block text-gray-900">Trạng thái:</strong>{' '}
              <span className={`px-2 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${getStatusClass(order.status)}`}>
                {getStatusDisplay(order.status)}
              </span>
              <Button variant="ghost" size="sm" onClick={handleEditStatusClick} className="ml-2">
                Chỉnh sửa
              </Button>
            </p>
            <p className="text-gray-700">
              <strong className="block text-gray-900">Ngày đặt:</strong> {formatDate(order.createdAt)}
            </p>
            {order.updatedAt && (
              <p className="text-gray-700">
                <strong className="block text-gray-900">Cập nhật cuối:</strong> {formatDate(order.updatedAt)}
              </p>
            )}
            {order.notes && (
              <p className="text-gray-700 col-span-2">
                <strong className="block text-gray-900">Ghi chú:</strong> {order.notes}
              </p>
            )}
          </div>
        </div>

        {/* Customer Information */}
        <div className="border-t pt-6 mt-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <User className="w-6 h-6 text-blue-600" /> Thông tin khách hàng
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <p className="text-gray-700">
              <strong className="block text-gray-900">Tên khách hàng:</strong> {order.customerName}
            </p>
            <p className="text-gray-700 flex items-center gap-2">
              <Mail className="w-5 h-5 text-gray-600" />
              <strong className="text-gray-900">Email:</strong> {order.customerEmail}
            </p>
            <p className="text-gray-700 flex items-center gap-2">
              <Phone className="w-5 h-5 text-gray-600" />
              <strong className="text-gray-900">Điện thoại:</strong> {order.customerPhone}
            </p>
            {customerUser && (
              <p className="text-gray-700">
                <strong className="block text-gray-900">Tài khoản liên kết:</strong>{' '}
                <Link href={`/admin/users/${customerUser.id}`} className="text-blue-600 hover:underline">
                  {customerUser.fullName} ({customerUser.email})
                </Link>
              </p>
            )}
          </div>
        </div>

        {/* Car Information */}
        <div className="border-t pt-6 mt-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Car className="w-6 h-6 text-blue-600" /> Thông tin xe đặt
          </h3>
          {orderedCar ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <p className="text-gray-700">
                <strong className="block text-gray-900">Tên xe:</strong>{' '}
                <Link href={`/admin/cars/${orderedCar.id}`} className="text-blue-600 hover:underline">
                  {orderedCar.name}
                </Link>
              </p>
              <p className="text-gray-700">
                <strong className="block text-gray-900">Thương hiệu:</strong> {orderedCar.brand}
              </p>
              <p className="text-gray-700">
                <strong className="block text-gray-900">Model:</strong> {orderedCar.model}
              </p>
              <p className="text-gray-700">
                <strong className="block text-gray-900">Năm sản xuất:</strong> {orderedCar.year}
              </p>
              <p className="text-gray-700">
                <strong className="block text-gray-900">Giá niêm yết:</strong> {formatPrice(orderedCar.price)}
              </p>
              <p className="text-gray-700">
                <strong className="block text-gray-900">Màu sắc:</strong> {orderedCar.color}
              </p>
              {orderedCar.images && orderedCar.images.length > 0 && (
                <div className="col-span-2">
                  <strong className="block text-gray-900 mb-2">Ảnh xe:</strong>
                  <img src={orderedCar.images[0]} alt={orderedCar.name} className="w-48 h-32 object-cover rounded-lg shadow-md" />
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-500">Thông tin xe không có sẵn hoặc đã bị xóa.</p>
          )}
        </div>
      </div>

      <Modal
        isOpen={isEditStatusModalOpen}
        onClose={() => setIsEditStatusModalOpen(false)}
        title="Cập nhật trạng thái đơn hàng"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsEditStatusModalOpen(false)}>
              Hủy
            </Button>
            <Button variant="primary" onClick={confirmUpdateStatus}>
              Lưu thay đổi
            </Button>
          </>
        }
      >
        <div>
          <p className="mb-4">
            Cập nhật trạng thái cho đơn hàng ID:{' '}
            <span className="font-semibold">{order.id.substring(0, 8)}...</span> của{' '}
            <span className="font-semibold">{order.customerName}</span>.
          </p>
          <label htmlFor="newOrderStatus" className="block text-sm font-medium text-gray-700 mb-1">
            Trạng thái mới
          </label>
          <select
            id="newOrderStatus"
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value as Order['status'])}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="pending">Đang chờ</option>
            <option value="confirmed">Đã xác nhận</option>
            <option value="completed">Hoàn thành</option>
            <option value="cancelled">Đã hủy</option>
          </select>
        </div>
      </Modal>
    </div>
  );
}