'use client';

import React, { useState } from 'react';
import { getOrders, updateOrder, deleteOrder } from '@/data/orders'; // Import deleteOrder
import { getCars } from '@/data/cars';
import { getUsers } from '@/data/users';
import { ShoppingBag, Eye, Edit, Trash, Filter } from 'lucide-react';
import Link from 'next/link';
import AdminHeader from '@/components/admin/AdminHeader';
import Button from '@/components/ui/Button';
import Table from '@/components/ui/Table';
import { Order } from '@/types/order';
import { formatPrice, formatDate } from '@/lib/utils';
import Modal from '@/components/ui/Modal';
import toast from 'react-hot-toast';
import ConfirmDialog from '@/components/ui/ConfirmDialog'; // Đảm bảo bạn đã import ConfirmDialog

export default function AdminOrdersPage() {
  // Lấy dữ liệu ban đầu
  const initialAllOrders = getOrders();
  const allCars = getCars();
  const allUsers = getUsers();

  const [orders, setOrders] = useState(initialAllOrders);
  const [filterStatus, setFilterStatus] = useState('all');
  const [isEditStatusModalOpen, setIsEditStatusModalOpen] = useState(false);
  const [orderToEdit, setOrderToEdit] = useState<Order | null>(null);
  const [newStatus, setNewStatus] = useState<Order['status']>('pending');

  // State mới cho chức năng xóa
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);

  // Hàm cập nhật lại danh sách đơn hàng sau khi có thay đổi (thêm, sửa, xóa)
  const refreshOrders = () => {
    const updatedOrders = getOrders();
    if (filterStatus === 'all') {
      setOrders(updatedOrders);
    } else {
      setOrders(updatedOrders.filter(order => order.status === filterStatus));
    }
  };

  const getOrderStatusDisplay = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'Đang chờ';
      case 'confirmed': return 'Đã xác nhận';
      case 'completed': return 'Hoàn thành';
      case 'cancelled': return 'Đã hủy';
      default: return 'Không rõ';
    }
  };

  const getOrderStatusClass = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterStatus(e.target.value);
    const updatedOrders = getOrders(); // Lấy lại danh sách mới nhất để lọc
    if (e.target.value === 'all') {
      setOrders(updatedOrders);
    } else {
      setOrders(updatedOrders.filter(order => order.status === e.target.value));
    }
  };

  const handleEditStatusClick = (order: Order) => {
    setOrderToEdit(order);
    setNewStatus(order.status); // Set initial status to current order status
    setIsEditStatusModalOpen(true);
  };

  const confirmUpdateStatus = () => {
    if (orderToEdit) {
      updateOrder(orderToEdit.id, { status: newStatus });
      refreshOrders(); // Tải lại và lọc
      setIsEditStatusModalOpen(false);
      setOrderToEdit(null);
      toast.success('Đã cập nhật trạng thái đơn hàng thành công!');
    }
  };

  // Hàm xử lý khi click nút Xóa
  const handleDeleteClick = (order: Order) => {
    setOrderToDelete(order);
    setShowConfirmDelete(true);
  };

  // Hàm xác nhận xóa đơn hàng
  const confirmDelete = () => {
    if (orderToDelete) {
      const isDeleted = deleteOrder(orderToDelete.id);
      if (isDeleted) {
        toast.success(`Đã xóa đơn hàng #${orderToDelete.id.substring(0, 8)}... thành công.`);
        refreshOrders(); // Tải lại danh sách đơn hàng sau khi xóa
      } else {
        toast.error(`Không thể xóa đơn hàng #${orderToDelete.id.substring(0, 8)}...`);
      }
      setShowConfirmDelete(false);
      setOrderToDelete(null);
    }
  };


  const orderColumns = [
    { key: 'id', header: 'Mã Đơn hàng', render: (order: Order) => order.id.substring(0, 8) + '...' },
    {
      key: 'customer',
      header: 'Khách hàng',
      render: (order: Order) => {
        const customer = allUsers.find(u => u.id === order.userId);
        return customer?.fullName || order.customerName || 'N/A';
      }
    },
    {
      key: 'carName',
      header: 'Tên xe',
      render: (order: Order) => {
        const orderedCar = allCars.find(car => car.id === order.carId);
        return orderedCar?.name || 'N/A';
      }
    },
    {
      key: 'totalAmount',
      header: 'Tổng tiền',
      render: (order: Order) => formatPrice(order.totalAmount),
      className: 'text-blue-600 font-semibold'
    },
    {
      key: 'status',
      header: 'Trạng thái',
      render: (order: Order) => (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getOrderStatusClass(order.status)}`}>
          {getOrderStatusDisplay(order.status)}
        </span>
      )
    },
    {
      key: 'createdAt',
      header: 'Ngày đặt',
      render: (order: Order) => formatDate(order.createdAt),
      className: 'text-gray-500 text-sm'
    },
    {
      key: 'actions',
      header: 'Hành động',
      render: (order: Order) => (
        <div className="flex items-center space-x-2">
          <Link href={`/admin/orders/${order.id}`} title="Xem chi tiết">
            <Button variant="ghost" size="sm">
              <Eye className="w-4 h-4" />
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEditStatusClick(order)}
            title="Sửa trạng thái"
          >
            <Edit className="w-4 h-4 text-blue-600" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => handleDeleteClick(order)} title="Xóa">
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
        title="Quản lý đơn hàng"
        description="Xem và quản lý tất cả các đơn đặt hàng từ khách hàng."
      />

      <div className="mb-4 flex items-center justify-end gap-3">
        <label htmlFor="orderStatusFilter" className="text-sm font-medium text-gray-700">
          Lọc theo trạng thái:
        </label>
        <select
          id="orderStatusFilter"
          className="mt-1 block w-48 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          value={filterStatus}
          onChange={handleFilterChange}
        >
          <option value="all">Tất cả</option>
          <option value="pending">Đang chờ</option>
          <option value="confirmed">Đã xác nhận</option>
          <option value="completed">Hoàn thành</option>
          <option value="cancelled">Đã hủy</option>
        </select>
      </div>

      <Table<Order>
        data={orders}
        columns={orderColumns}
        emptyMessage="Không có đơn hàng nào được tìm thấy."
      />

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
        {orderToEdit && (
          <div>
            <p className="mb-4">
              Cập nhật trạng thái cho đơn hàng ID:{' '}
              <span className="font-semibold">{orderToEdit.id.substring(0, 8)}...</span> của{' '}
              <span className="font-semibold">{orderToEdit.customerName}</span>.
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
        )}
      </Modal>

      {/* Confirm Dialog cho chức năng Xóa đơn hàng */}
      {orderToDelete && (
        <ConfirmDialog
          isOpen={showConfirmDelete}
          title='Xác nhận xóa đơn hàng'
          message={`Bạn có chắc chắn muốn xóa đơn hàng #${orderToDelete.id.substring(0, 8)}... của "${orderToDelete.customerName}"? Hành động này không thể hoàn tác.`}
          onClose={() => setShowConfirmDelete(false)}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
}