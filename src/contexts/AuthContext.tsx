// src/contexts/AuthContext.tsx
'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User, AuthContextType, UserWithoutPassword } from '@/types/auth';
import {
  authenticateUser,
  getCurrentUser,
  setCurrentUser,
  updateUser,
  getUserById
} from '@/lib/auth';
import { toast } from 'react-hot-toast';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUserState] = useState<UserWithoutPassword | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const setUser = useCallback((newUser: UserWithoutPassword | null) => {
    setUserState(newUser);
  }, []);

  const refreshUser = useCallback(() => {
    if (user?.id) {
      setIsLoading(true);
      const latestUser = getUserById(user.id);
      if (latestUser) {
        setUser(latestUser);
        setCurrentUser(latestUser);
      } else {
        setUser(null);
        setCurrentUser(null);
        toast.error('Tài khoản của bạn không còn tồn tại. Đã đăng xuất.');
      }
      setIsLoading(false);
    }
  }, [user?.id, setUser]);

  useEffect(() => {
    const loadUser = async () => {
      setIsLoading(true);
      try {
        const savedUser = getCurrentUser();
        if (savedUser) {
          const freshUser = getUserById(savedUser.id);
          if (freshUser) {
            setUser(freshUser);
          } else {
            setCurrentUser(null);
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Failed to load user from local storage:", error);
        setCurrentUser(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    loadUser();
  }, [setUser, refreshUser]);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const authenticatedUser = await authenticateUser(email, password);
      if (authenticatedUser) {
        setUser(authenticatedUser);
        setCurrentUser(authenticatedUser);
        toast.success('Đăng nhập thành công!');
        return true;
      }
      toast.error('Email hoặc mật khẩu không đúng!');
      return false;
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Đăng nhập thất bại.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = useCallback(() => {
    setUser(null);
    setCurrentUser(null);
    toast.success('Đã đăng xuất!');
  }, [setUser]);

  // <--- HÀM NÀY CŨNG CẦN KIỂM TRA
  const updateProfile = async (updatedFields: Partial<Omit<UserWithoutPassword, 'email' | 'id' | 'role'>>): Promise<boolean> => {
    if (!user) {
      toast.error('Bạn chưa đăng nhập.');
      return false;
    }
    setIsLoading(true);
    try {
      console.log('Attempting to update profile for user ID:', user.id, 'with fields:', updatedFields); // Thêm log
      const updatedUser = updateUser(user.id, updatedFields); // Gọi hàm updateUser từ lib/auth
      
      if (updatedUser) {
        setUser(updatedUser); // Cập nhật state user
        setCurrentUser(updatedUser); // Cập nhật localStorage
        toast.success('Cập nhật thông tin thành công!');
        return true;
      } else {
        toast.error('Cập nhật thông tin thất bại. Không tìm thấy người dùng hoặc lỗi.'); // Thông báo rõ ràng hơn
        return false;
      }
    } catch (error) {
      console.error('Update profile error:', error); // Log lỗi chi tiết
      toast.error('Đã xảy ra lỗi khi cập nhật.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isLoading,
    updateProfile,
    refreshUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};