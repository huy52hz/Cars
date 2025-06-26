'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Order } from '@/types/order';
import { Car } from '@/types/car';
import { getCarById } from '@/data/cars';
import { cancelOrder } from '@/data/orders';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Link from 'next/link';
import Image from 'next/image';
import { toast, Toaster } from 'react-hot-toast';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import Button from '@/components/ui/Button';
import {
  HomeIcon, // Icon trang chủ
  ArrowPathIcon, // Icon loading (still useful for general loading states)
  ClockIcon, // Icon ngày đặt
  CurrencyDollarIcon, // Icon tổng tiền
  ShoppingBagIcon, // Icon for empty orders state
  UserIcon, // Icon tên khách hàng
  EnvelopeIcon, // Icon email khách hàng
  PhoneIcon, // Icon điện thoại khách hàng
  ChatBubbleBottomCenterTextIcon, // Icon ghi chú
  XCircleIcon, // Icon hủy đơn (màu đỏ)
  ArrowLeftIcon // Explicitly import ArrowLeftIcon for "back to home"
} from '@heroicons/react/24/outline'; // Hoặc /24/solid cho các icon đổ màu

// Định nghĩa một interface mới cho Order kết hợp với chi tiết xe
interface OrderWithCarDetails extends Order {
  carDetails: Car | null; // Null nếu không tìm thấy thông tin xe
}

const UserOrdersPage = () => {
  const { user, isLoading: isAuthLoading } = useAuth();

  const [userOrders, setUserOrders] = useState<OrderWithCarDetails[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);
  const [showConfirmCancel, setShowConfirmCancel] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState<OrderWithCarDetails | null>(null);

  const fetchOrders = async () => {
    if (!isAuthLoading) {
      if (!user) {
        setIsLoadingOrders(false);
        return;
      }

      setIsLoadingOrders(true);
      if (typeof window !== 'undefined') {
        const storedOrders = JSON.parse(localStorage.getItem('orders') || '[]') as Order[];
        const filteredOrders = storedOrders.filter(order => order.userId === user.id);

        const ordersWithCarDetails: OrderWithCarDetails[] = filteredOrders.map(order => {
          const carDetails = getCarById(order.carId);
          return { ...order, carDetails };
        });

        // Sắp xếp đơn hàng theo ngày tạo mới nhất lên trước
        ordersWithCarDetails.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        setUserOrders(ordersWithCarDetails);
      }
      setIsLoadingOrders(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [user, isAuthLoading]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (error) {
      console.error("Lỗi định dạng ngày:", dateString, error);
      return 'Ngày không hợp lệ';
    }
  };

  const getStatusText = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'Đang chờ xác nhận';
      case 'confirmed':
        return 'Đã xác nhận';
      case 'completed':
        return 'Hoàn thành';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return 'Không rõ';
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleCancelOrderClick = (order: OrderWithCarDetails) => {
    setOrderToCancel(order);
    setShowConfirmCancel(true);
  };

  const confirmCancel = () => {
    if (orderToCancel) {
      const isCancelled = cancelOrder(orderToCancel.id);
      if (isCancelled) {
        toast.success(`Đơn hàng #${orderToCancel.id} đã được hủy thành công.`);
        fetchOrders();
      } else {
        toast.error(`Không thể hủy đơn hàng #${orderToCancel.id}. Vui lòng thử lại.`);
      }
      setShowConfirmCancel(false);
      setOrderToCancel(null);
    }
  };

  if (isAuthLoading || isLoadingOrders) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <ArrowPathIcon className="h-8 w-8 animate-spin text-blue-500 mr-3" />
        <p className="text-lg text-gray-700 font-semibold">Đang tải đơn hàng...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-100 p-4">
        <p className="text-xl text-red-600 font-semibold mb-5 text-center">
          Bạn cần đăng nhập để xem lịch sử đơn hàng.
        </p>
        <Link
          href="/login"
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-300 ease-in-out"
        >
          <EnvelopeIcon className="h-5 w-5 mr-2 -ml-1" />
          Đăng nhập ngay
        </Link>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header của trang Lịch sử Đơn hàng */}
          <div className="flex justify-between items-center mb-8">
            {/* START: Changed Link to homepage and used HomeIcon */}
            <Link
              href="/" // Link changed from /profile to /
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
            >
              <HomeIcon className="h-4 w-4 mr-2" /> {/* Changed icon to HomeIcon */}
              Quay lại Trang chủ
            </Link>
            {/* END: Changed Link to homepage and used HomeIcon */}

            <h1 className="text-3xl font-bold text-gray-800 text-center flex-grow">Lịch sử Đơn hàng của bạn</h1>
            <div className="w-[120px]"></div> {/* Giữ khoảng trống để căn giữa h1 */}
          </div>


          {userOrders.length === 0 ? (
            <div className="bg-white shadow-lg rounded-xl p-8 text-center border border-gray-200">
              <ShoppingBagIcon className="h-16 w-16 text-gray-400 mx-auto mb-6" />
              <p className="text-2xl font-semibold text-gray-700 mb-4">Bạn chưa có đơn hàng nào.</p>
              <p className="text-lg text-gray-600 mb-6">Hãy khám phá những chiếc xe tuyệt vời của chúng tôi!</p>
              <Link
                href="/cars"
                className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-lg shadow-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-300 ease-in-out"
              >
                Bắt đầu mua sắm ngay!
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {userOrders.map((order) => (
                <div key={order.id} className="bg-white shadow-lg rounded-xl p-6 border border-gray-200 transform transition-transform duration-200 hover:scale-[1.01] hover:shadow-xl">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 pb-4 border-b border-gray-200">
                    <div className="mb-3 md:mb-0">
                      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center">
                        Đơn hàng #{order.id}
                      </h2>
                      <p className="text-sm text-gray-600 flex items-center mt-1">
                        <ClockIcon className="h-4 w-4 mr-1 text-gray-500" />
                        Ngày đặt: {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      <span
                        className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}
                      >
                        {getStatusText(order.status)}
                      </span>
                      {(order.status === 'pending' || order.status === 'confirmed') && (
                        <Button
                          onClick={() => handleCancelOrderClick(order)}
                          className="flex items-center bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-200 ease-in-out"
                        >
                          <XCircleIcon className="h-4 w-4 mr-1" />
                          Hủy đơn hàng
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Phần thông tin xe đặt mua */}
                  <div className="flex flex-col sm:flex-row items-center gap-6 mb-4">
                    <div className="relative w-32 h-32 sm:w-40 sm:h-40 flex-shrink-0 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                      <Image
                        src={order.carDetails?.images?.[0] || '/placeholder-car.jpg'}
                        alt={order.carDetails?.name || 'Xe không rõ'}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        style={{ objectFit: 'cover' }}
                        className="rounded-lg"
                      />
                    </div>
                    <div className="flex-grow text-center sm:text-left">
                      <h3 className="font-bold text-gray-900 text-xl sm:text-2xl leading-tight mb-2">
                        {order.carDetails?.name || `ID: ${order.carId} (Không tìm thấy thông tin xe)`}
                      </h3>
                      {order.carDetails && (
                        <p className="text-base text-gray-700 mb-1">Năm sản xuất: <span className="font-semibold">{order.carDetails.year}</span></p>
                      )}
                      <p className="text-lg font-bold text-blue-600 flex items-center justify-center sm:justify-start">
                        <CurrencyDollarIcon className="h-5 w-5 mr-2 text-blue-500" />
                        Tổng tiền: {formatPrice(order.totalAmount)}
                      </p>
                    </div>
                  </div>

                  {/* Thông tin khách hàng */}
                  <div className="mt-6 border-t border-gray-200 pt-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center">
                      <UserIcon className="h-5 w-5 mr-2 text-gray-600" />
                      Thông tin liên hệ
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <p className="text-gray-700 flex items-center">
                        <UserIcon className="h-4 w-4 mr-2 text-gray-500" />
                        <span className="font-medium">Tên:</span> {order.customerName}
                      </p>
                      <p className="text-gray-700 flex items-center">
                        <EnvelopeIcon className="h-4 w-4 mr-2 text-gray-500" />
                        <span className="font-medium">Email:</span> {order.customerEmail}
                      </p>
                      <p className="text-gray-700 flex items-center">
                        <PhoneIcon className="h-4 w-4 mr-2 text-gray-500" />
                        <span className="font-medium">Điện thoại:</span> {order.customerPhone}
                      </p>
                      <p className="text-gray-700 flex items-center col-span-1 sm:col-span-2">
                        <ChatBubbleBottomCenterTextIcon className="h-4 w-4 mr-2 text-gray-500" />
                        <span className="font-medium">Ghi chú:</span> {order.notes || 'Không có'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Toaster position="top-center" reverseOrder={false} />

      {/* Confirm Dialog cho chức năng Hủy đơn hàng */}
      {orderToCancel && (
        <ConfirmDialog
          isOpen={showConfirmCancel}
          title='Xác nhận hủy đơn hàng'
          message={`Bạn có chắc chắn muốn hủy đơn hàng #${orderToCancel.id} cho xe "${orderToCancel.carDetails?.name || 'không rõ'}"?`}
          onClose={() => setShowConfirmCancel(false)}
          onConfirm={confirmCancel}
        />
      )}
    </ProtectedRoute>
  );
};

export default UserOrdersPage;