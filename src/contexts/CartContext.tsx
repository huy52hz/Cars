// src/contexts/CartContext.tsx
"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { CartItem, CartContextType } from "@/types/cart";
import {
  getCartFromLocalStorage,
  saveCartToLocalStorage,
  clearCartInLocalStorage,
} from "@/lib/cart";
import { Car } from "@/types/car"; // Import Car để dùng trong addToCart

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Tải giỏ hàng từ Local Storage khi component mount
  useEffect(() => {
    setCartItems(getCartFromLocalStorage());
  }, []);

  // Lưu giỏ hàng vào Local Storage mỗi khi cartItems thay đổi
  useEffect(() => {
    saveCartToLocalStorage(cartItems);
  }, [cartItems]);

  // Hàm thêm sản phẩm vào giỏ hàng
  const addToCart = useCallback((car: Car) => {
    if (!car || !car.id) {
      console.error("addToCart: car is undefined hoặc thiếu id", car);
      return;
    }
    setCartItems((prevItems) => {
      // Lọc bỏ các item lỗi (item.car bị undefined/null)
      const validItems = prevItems.filter((item) => item.car && item.car.id);
      const existingItemIndex = validItems.findIndex(
        (item) => item.car.id === car.id
      );
      if (existingItemIndex > -1) {
        console.warn(`Xe ${car.name} (ID: ${car.id}) đã có trong giỏ hàng.`);
        return validItems;
      } else {
        return [...validItems, { car, quantity: 1 }];
      }
    });
  }, []);

  // Hàm xóa sản phẩm khỏi giỏ hàng
  const removeFromCart = useCallback((carId: string) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.car.id !== carId)
    );
  }, []);

  // Hàm cập nhật số lượng sản phẩm
  // (Có thể không cần thiết lắm cho việc bán xe, nhưng hữu ích nếu có tính năng thuê xe hoặc bán phụ kiện)
  const updateQuantity = useCallback((carId: string, quantity: number) => {
    setCartItems((prevItems) => {
      const updatedItems = prevItems.map((item) =>
        item.car.id === carId
          ? { ...item, quantity: Math.max(1, quantity) }
          : item
      );
      // Lọc bỏ những item có số lượng = 0 nếu bạn muốn
      return updatedItems.filter((item) => item.quantity > 0);
    });
  }, []);

  // Hàm xóa toàn bộ giỏ hàng
  const clearCart = useCallback(() => {
    setCartItems([]);
    clearCartInLocalStorage();
  }, []);

  // Hàm tính tổng số lượng mặt hàng trong giỏ hàng
  const getTotalItems = useCallback(() => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  }, [cartItems]);

  // Hàm tính tổng số tiền của giỏ hàng
  const getTotalAmount = useCallback(() => {
    return cartItems.reduce(
      (total, item) => total + item.car.price * item.quantity,
      0
    );
  }, [cartItems]);

  const value: CartContextType = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalAmount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// Hook tùy chỉnh để sử dụng CartContext
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
