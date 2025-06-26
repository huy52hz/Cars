// src/lib/cart.ts

import { CartItem } from '@/types/cart';

const CART_STORAGE_KEY = 'cart';

export const getCartFromLocalStorage = (): CartItem[] => {
  if (typeof window === 'undefined') {
    return [];
  }
  try {
    const storedCart = localStorage.getItem(CART_STORAGE_KEY);
    return storedCart ? JSON.parse(storedCart) : [];
  } catch (error) {
    console.error('Failed to parse cart from localStorage', error);
    // Clear corrupted data
    localStorage.removeItem(CART_STORAGE_KEY);
    return [];
  }
};

export const saveCartToLocalStorage = (cart: CartItem[]): void => {
  if (typeof window === 'undefined') {
    return;
  }
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch (error) {
    console.error('Failed to save cart to localStorage', error);
  }
};

export const clearCartInLocalStorage = (): void => {
  if (typeof window === 'undefined') {
    return;
  }
  localStorage.removeItem(CART_STORAGE_KEY);
};