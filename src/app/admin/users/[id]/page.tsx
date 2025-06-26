'use client';

import React from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getUserById } from '@/data/users';
import { getOrders } from '@/data/orders'; // Để hiển thị đơn hàng của user
import AdminHeader from '@/components/admin/AdminHeader';
import Button from '@/components/ui/Button';
import { ArrowLeft, User as UserIcon, Mail, Phone, MapPin, Calendar, ShoppingBag, Eye } from 'lucide-react';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import Table from '@/components/ui/Table';
import { Order } from '@/types/order';
import { getCarById } from '@/data/cars';
import { formatPrice } from '@/lib/utils';


export default function AdminUserDetailPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;
  const user = getUserById(userId);
  const userOrders = getOrders().filter(order => order.userId === userId);

  if (!user) {
    return (
      <div className="p-8 bg-gray-50 min-h-full">
        <AdminHeader title="Người dùng không tìm thấy" />
        <p className="text-gray-700">Không tìm thấy người dùng với ID: {userId}</p>
        <Button onClick={() => router.push('/admin/users')} className="mt-4">
          <ArrowLeft className="w-4 h-4 mr-2" /> Quay lại danh sách người dùng
        </Button>
      </div>
    );
  }

  const orderColumns = [
    { key: 'id', header: 'Mã Đơn hàng', render: (order: Order) => order.id.substring(0, 8) + '...' },
    {
      key: 'carName',
      header: 'Tên xe',
      render: (order: Order) => {
        const orderedCar = getCarById(order.carId);
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
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
          order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
          order.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
          order.status === 'completed' ? 'bg-green-100 text-green-800' :
          'bg-red-100 text-red-800'
        }`}>
          {order.status === 'pending' ? 'Đang chờ' :
           order.status === 'confirmed' ? 'Đã xác nhận' :
           order.status === 'completed' ? 'Hoàn thành' : 'Đã hủy'}
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
        <Link href={`/admin/orders/${order.id}`} title="Xem chi tiết">
          <Button variant="ghost" size="sm">
            <Eye className="w-4 h-4" />
          </Button>
        </Link>
      ),
      className: 'text-right'
    },
  ];


  return (
    <div className="p-8 bg-gray-50 min-h-full">
      <AdminHeader
        title={`Chi tiết người dùng: ${user.fullName}`}
        description="Thông tin chi tiết về tài khoản người dùng."
        actions={
          <Button variant="secondary" onClick={() => router.back()}>
            <ArrowLeft className="w-5 h-5 mr-2" /> Quay lại
          </Button>
        }
      />

      <div className="bg-white p-6 rounded-xl shadow-sm border space-y-6">
        <div className="flex items-center gap-6 pb-4 border-b">
          <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
            {user.avatar ? (
              <img src={user.avatar} alt={user.fullName} className="w-full h-full object-cover" />
            ) : (
              <UserIcon className="w-16 h-16 text-blue-600" />
            )}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{user.fullName}</h2>
            <p className="text-gray-600">{user.email}</p>
            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full mt-2 ${
              user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
            }`}>
              {user.role === 'admin' ? 'Quản trị viên' : 'Người dùng'}
            </span>
          </div>
        </div>

        {/* User Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <p className="text-gray-700 flex items-center gap-2">
            <UserIcon className="w-5 h-5 text-gray-600" />
            <strong className="text-gray-900">ID:</strong> {user.id}
          </p>
          <p className="text-gray-700 flex items-center gap-2">
            <Mail className="w-5 h-5 text-gray-600" />
            <strong className="text-gray-900">Email:</strong> {user.email}
          </p>
          <p className="text-gray-700 flex items-center gap-2">
            <Phone className="w-5 h-5 text-gray-600" />
            <strong className="text-gray-900">Điện thoại:</strong> {user.phone || 'N/A'}
          </p>
          <p className="text-gray-700 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-gray-600" />
            <strong className="text-gray-900">Địa chỉ:</strong> {user.address || 'N/A'}
          </p>
          <p className="text-gray-700 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-gray-600" />
            <strong className="text-gray-900">Ngày tạo:</strong> {formatDate(user.createdAt)}
          </p>
          {user.updatedAt && (
            <p className="text-gray-700 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gray-600" />
              <strong className="text-gray-900">Cập nhật cuối:</strong> {formatDate(user.updatedAt!)} {/* SỬA CHỖ NÀY */}
            </p>
          )}
        </div>

        {/* User Orders */}
        <div className="border-t pt-6 mt-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-blue-600" /> Đơn hàng của người dùng
          </h3>
          <Table<Order>
            data={userOrders}
            columns={orderColumns}
            emptyMessage="Người dùng này chưa có đơn hàng nào."
          />
        </div>
      </div>
    </div>
  );
}