// src/app/cart/page.tsx
'use client'; // Đảm bảo đây là Client Component

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/contexts/CartContext'; // Import hook useCart
import Button from '@/components/ui/Button'; // Import Button component của bạn
import { toast } from 'react-hot-toast'; // Có thể dùng react-hot-toast cho thông báo
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { useAuth } from '@/contexts/AuthContext';
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from 'next/navigation';

const CartPage = () => {
  // Lấy dữ liệu và các hàm từ CartContext
  const { cartItems, removeFromCart, updateQuantity, clearCart, getTotalItems, getTotalAmount } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  // State cho xác nhận xóa từng sản phẩm
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState<{id: string, name: string} | null>(null);

  // Hàm định dạng giá tiền theo VND
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  // Hàm xử lý khi tăng số lượng
  const handleIncreaseQuantity = (carId: string, currentQuantity: number) => {
    // Với xe, thường chỉ có 1 chiếc duy nhất.
    // Nếu bạn muốn cho phép mua nhiều hơn 1 chiếc cùng loại (ví dụ: cho thuê),
    // hãy bỏ comment dòng dưới và điều chỉnh logic.
    // updateQuantity(carId, currentQuantity + 1);
    toast.error('Hiện tại, bạn chỉ có thể đặt mua 1 chiếc xe mỗi loại.');
  };

  // Hàm xử lý khi giảm số lượng
  const handleDecreaseQuantity = (carId: string, currentQuantity: number) => {
    if (currentQuantity > 1) {
      updateQuantity(carId, currentQuantity - 1);
    } else {
      // Nếu số lượng là 1 và người dùng muốn giảm, hỏi xác nhận xóa
      if (window.confirm('Bạn có muốn xóa sản phẩm này khỏi giỏ hàng không?')) {
        removeFromCart(carId);
        toast.success('Đã xóa sản phẩm khỏi giỏ hàng.');
      }
    }
  };

  // Hàm xử lý khi bấm nút Xóa
  const handleRemoveClick = (carId: string, carName: string) => {
    setSelectedItem({ id: carId, name: carName });
    setConfirmOpen(true);
  };

  // Hàm xác nhận xóa
  const handleConfirmRemove = () => {
    if (selectedItem) {
      removeFromCart(selectedItem.id);
      toast.success(`Đã xóa ${selectedItem.name} khỏi giỏ hàng.`);
    }
    setConfirmOpen(false);
    setSelectedItem(null);
  };

  // Hàm xử lý khi xóa toàn bộ giỏ hàng
  const handleClearCart = () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa toàn bộ giỏ hàng không?')) {
      clearCart();
      toast.success('Giỏ hàng đã được xóa sạch.');
    }
  };

  // Hàm đặt hàng tất cả sản phẩm trong giỏ
  const handlePlaceOrder = () => {
    if (!user) {
      toast.error('Bạn cần đăng nhập để đặt hàng.');
      router.push('/login');
      return;
    }
    if (cartItems.length === 0) return;
    const newOrders = cartItems.map(item => ({
      id: uuidv4(),
      userId: user.id,
      carId: item.car.id,
      customerName: user.fullName,
      customerEmail: user.email,
      customerPhone: user.phone || '',
      totalAmount: item.car.price,
      status: 'pending',
      notes: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));
    if (typeof window !== 'undefined') {
      const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      localStorage.setItem('orders', JSON.stringify([...existingOrders, ...newOrders]));
    }
    clearCart();
    toast.success('Đặt hàng thành công!');
    setTimeout(() => {
      router.push('/profile/orders');
    }, 1500);
  };

  // Nếu giỏ hàng trống
  if (getTotalItems() === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-grow py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-bold mb-6 text-gray-900">Giỏ hàng của bạn</h1>
            <div className="text-center text-gray-500 py-12">
              Giỏ hàng của bạn đang trống.
              <div className="mt-4">
                <Link href="/cars">
                  <Button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors">Xem xe</Button>
                </Link>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-grow py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold mb-6 text-gray-900">Giỏ hàng của bạn</h1>
          <ul className="divide-y divide-gray-200 mb-6">
            {cartItems.map((item) => (
              <li key={item.car.id} className="flex items-center gap-4 py-4">
                <div className="w-24 h-16 relative flex-shrink-0">
                  <Image src={item.car.images?.[0] || '/images/placeholder.png'} alt={item.car.name} fill className="object-cover rounded-md" />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-gray-800">{item.car.name}</h2>
                  <p className="text-sm text-gray-600">{item.car.brand} - {item.car.model}</p>
                  <p className="text-blue-600 font-bold">{item.car.price.toLocaleString()}₫</p>
                </div>
                <Button onClick={() => handleRemoveClick(item.car.id, item.car.name)} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm">Xóa</Button>
              </li>
            ))}
          </ul>
          <div className="flex justify-between items-center mb-6">
            <span className="text-lg font-bold">Tổng cộng:</span>
            <span className="text-2xl font-bold text-blue-700">{getTotalAmount().toLocaleString()}₫</span>
          </div>
          <div className="flex gap-2 justify-end">
            <Button onClick={clearCart} className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-md">Xóa tất cả</Button>
            <Button onClick={handlePlaceOrder} className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors">Đặt hàng</Button>
          </div>
        </div>
      </main>
      <Footer />
      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmRemove}
        title="Xác nhận xóa sản phẩm"
        message={`Bạn có chắc chắn muốn xóa "${selectedItem?.name}" khỏi giỏ hàng không?`}
        confirmText="Xóa"
        cancelText="Hủy"
      />
    </div>
  );
};

export default CartPage;
