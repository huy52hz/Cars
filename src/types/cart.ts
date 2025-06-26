// src/types/cart.ts

import { Car } from './car'; // Import kiểu Car từ file car.ts

export interface CartItem {
  car: Car; // Thông tin chi tiết của xe
  quantity: number; // Số lượng xe (mặc dù với xe thường là 1)
  // Bạn có thể thêm các thuộc tính khác nếu cần, ví dụ: startDate, endDate cho thuê xe
}

export interface CartContextType {
  cartItems: CartItem[];
  addToCart: (car: Car) => void;
  removeFromCart: (carId: string) => void;
  updateQuantity: (carId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalAmount: () => number;
}