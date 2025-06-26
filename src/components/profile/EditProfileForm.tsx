'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

// Import icons từ Heroicons
import {
  UserCircleIcon, // Dùng cho avatar mặc định
  PhoneIcon,
  MapPinIcon,
  UserIcon,
  ArrowPathIcon, // Dùng cho đang tải/đang lưu
  XMarkIcon, // Icon hủy
  CheckIcon, // Icon lưu
  CameraIcon // Icon thay đổi ảnh
} from '@heroicons/react/24/outline'; // Hoặc /24/solid nếu muốn icon đổ đầy màu

const EditProfileForm = () => {
  const { user, updateProfile, isLoading } = useAuth();
  const router = useRouter();

  const [fullName, setFullName] = useState(user?.fullName || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');
  const [newAvatarFile, setNewAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user?.avatar || null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [fullNameError, setFullNameError] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [addressError, setAddressError] = useState<string | null>(null);

  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      setFullName(user.fullName || '');
      setPhone(user.phone || '');
      setAddress(user.address || '');
      setAvatarPreview(user.avatar || null);
      setNewAvatarFile(null);
      setFullNameError(null);
      setPhoneError(null);
      setAddressError(null);
    }
  }, [user]);

  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      if (avatarPreview && avatarPreview.startsWith('blob:')) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]);

  const validateFullName = (name: string): boolean => {
    if (name.trim() === '') {
      setFullNameError('Họ và Tên không được để trống.');
      return false;
    }
    setFullNameError(null);
    return true;
  };

  const validatePhone = (phoneNumber: string): boolean => {
    if (phoneNumber.trim() === '') {
      setPhoneError('Số điện thoại không được để trống.');
      return false;
    }
    const phoneRegex = /^(0|\+84)(3|5|7|8|9)\d{8}$/;
    if (!phoneRegex.test(phoneNumber.replace(/\s/g, ''))) {
      setPhoneError('Số điện thoại không hợp lệ (ví dụ: 0901234567 hoặc +84901234567).');
      return false;
    }
    setPhoneError(null);
    return true;
  };

  const validateAddress = (addr: string): boolean => {
    if (addr.trim() === '') {
      setAddressError('Địa chỉ không được để trống.');
      return false;
    }
    setAddressError(null);
    return true;
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Chỉ chấp nhận file ảnh.');
        return;
      }
      if (file.size > 2 * 1024 * 1024) { // 2MB
        toast.error('Kích thước ảnh không được vượt quá 2MB.');
        return;
      }

      setNewAvatarFile(file);
      if (avatarPreview && avatarPreview.startsWith('blob:')) {
        URL.revokeObjectURL(avatarPreview);
      }
      setAvatarPreview(URL.createObjectURL(file));
    } else {
      setNewAvatarFile(null);
      setAvatarPreview(user?.avatar || null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error('Người dùng không tồn tại.');
      return;
    }

    const isFullNameValid = validateFullName(fullName);
    const isPhoneValid = validatePhone(phone);
    const isAddressValid = validateAddress(address);

    if (!isFullNameValid || !isPhoneValid || !isAddressValid) {
      toast.error('Vui lòng kiểm tra lại thông tin nhập.');
      return;
    }

    setIsSubmitting(true);

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = null;
    }

    saveTimeoutRef.current = setTimeout(async () => {
      try {
        let updatedFields: Partial<Omit<typeof user, 'email' | 'id' | 'role'>> & { avatarFile?: File } = {
          fullName,
          phone,
          address,
        };

        if (newAvatarFile) {
            updatedFields.avatarFile = newAvatarFile;
        }

        const success = await updateProfile(updatedFields);

        setIsSubmitting(false);

        if (success && newAvatarFile && avatarPreview && avatarPreview.startsWith('blob:')) {
            URL.revokeObjectURL(avatarPreview);
        }
      } catch (error) {
        console.error("Error during profile update timeout:", error);
        toast.error('Đã xảy ra lỗi không mong muốn khi lưu.');
        setIsSubmitting(false);
      } finally {
        saveTimeoutRef.current = null;
      }
    }, 3000);
  };

  const handleCancel = () => {
    if (isSubmitting && saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = null;
      toast('Đã hủy thao tác lưu.');
    }
    setIsSubmitting(false);

    if (user) {
      setFullName(user.fullName || '');
      setPhone(user.phone || '');
      setAddress(user.address || '');
      if (avatarPreview && avatarPreview.startsWith('blob:')) {
        URL.revokeObjectURL(avatarPreview);
      }
      setAvatarPreview(user.avatar || null);
      setNewAvatarFile(null);
    }
    setFullNameError(null);
    setPhoneError(null);
    setAddressError(null);
  };

  const hasValidationErrors = !!(fullNameError || phoneError || addressError);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8 text-gray-600">
        <ArrowPathIcon className="h-6 w-6 animate-spin text-blue-500 mr-2" />
        <p>Đang tải thông tin hồ sơ...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center py-8 text-red-500">
        <p>Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Phần hiển thị Avatar và thông tin cơ bản của người dùng */}
      <div className="flex flex-col items-center gap-4 mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-md border border-blue-200">
        <div className="relative w-36 h-36 rounded-full overflow-hidden border-4 border-blue-400 shadow-xl group cursor-pointer transition-transform transform hover:scale-105"
             onClick={() => fileInputRef.current?.click()}>
          {avatarPreview ? (
            <Image
              src={avatarPreview}
              alt="Ảnh đại diện"
              fill
              style={{ objectFit: 'cover' }}
              className="rounded-full transition-opacity duration-300 group-hover:opacity-50"
            />
          ) : (
            <UserCircleIcon className="h-full w-full text-gray-400 rounded-full bg-white transition-opacity duration-300 group-hover:opacity-50" />
          )}

          {/* Lớp phủ và nút chọn ảnh */}
          <div
            className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"
          >
            <CameraIcon className="h-8 w-8 text-white mr-2" />
            <span className="text-white text-base font-semibold">Thay đổi ảnh</span>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleAvatarChange}
              className="hidden"
              accept="image/*"
            />
          </div>
        </div>
        <h2 className="text-3xl font-extrabold text-gray-800 tracking-tight">{user.fullName}</h2>
        <p className="text-gray-600 flex items-center text-lg">
          <UserIcon className="h-5 w-5 text-blue-500 mr-2" />
          Email: <span className="font-semibold text-blue-700 ml-2">{user.email}</span>
        </p>
        <p className="text-gray-600 text-sm flex items-center mt-1">
          <UserCircleIcon className="h-4 w-4 text-gray-500 mr-2" />
          Vai trò: <span className="font-medium text-gray-700 ml-1">{user.role === 'admin' ? 'Quản trị viên' : 'Người dùng'}</span>
        </p>
        <p className="text-sm text-red-500 mt-2 p-2 bg-red-50 rounded-md">
          *Email và Vai trò không thể thay đổi tại đây.
        </p>
      </div>

      {/* Các trường input cho phép chỉnh sửa */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Họ và Tên"
          id="fullName"
          type="text"
          value={fullName}
          onChange={(e) => {
            setFullName(e.target.value);
            validateFullName(e.target.value);
          }}
          required
          placeholder="Nhập họ và tên của bạn"
          className="md:col-span-2"
          error={fullNameError}
          icon={<UserIcon className="h-5 w-5 text-gray-400" />} // Thêm icon
        />
        <Input
          label="Số điện thoại"
          id="phone"
          type="tel"
          value={phone}
          onChange={(e) => {
            setPhone(e.target.value);
            validatePhone(e.target.value);
          }}
          placeholder="Nhập số điện thoại (VD: 0901234567)"
          error={phoneError}
          icon={<PhoneIcon className="h-5 w-5 text-gray-400" />} // Thêm icon
        />
        <Input
          label="Địa chỉ"
          id="address"
          type="text"
          value={address}
          onChange={(e) => {
            setAddress(e.target.value);
            validateAddress(e.target.value);
          }}
          placeholder="Nhập địa chỉ của bạn"
          error={addressError}
          icon={<MapPinIcon className="h-5 w-5 text-gray-400" />} 
        />
      </div>

      {/* Nút hành động */}
      <div className="flex justify-end gap-4 pt-6 border-t border-gray-200 mt-8">
        <Button
          type="button"
          variant="secondary"
          onClick={handleCancel}
          disabled={isLoading || isSubmitting}
        >
          <XMarkIcon className="h-5 w-5 mr-2" />
          Hủy bỏ
        </Button>
        <Button
          type="submit"
          variant="primary"
          disabled={isSubmitting || isLoading || hasValidationErrors}
        >
          {isSubmitting ? (
            <ArrowPathIcon className="h-5 w-5 animate-spin mr-2" />
          ) : (
            <CheckIcon className="h-5 w-5 mr-2" />
          )}
          {isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
        </Button>
      </div>
    </form>
  );
};

export default EditProfileForm;