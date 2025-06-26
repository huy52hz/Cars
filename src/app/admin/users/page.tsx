'use client';

import React, { useState } from 'react';
import { getUsers, deleteUser } from '@/data/users';
import { User as UserIcon, Plus, Edit, Trash, Eye, CheckCircle, XCircle, X } from 'lucide-react';
import Link from 'next/link';
import AdminHeader from '@/components/admin/AdminHeader';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Table from '@/components/ui/Table';
import { User } from '@/types/auth';
import { formatDate } from '@/lib/utils';
import { useRouter } from 'next/navigation';

// Toast Component
interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'warning';
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  const bgColor = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    warning: 'bg-yellow-50 border-yellow-200'
  }[type];

  const textColor = {
    success: 'text-green-800',
    error: 'text-red-800',
    warning: 'text-yellow-800'
  }[type];

  const Icon = {
    success: CheckCircle,
    error: XCircle,
    warning: XCircle
  }[type];

  const iconColor = {
    success: 'text-green-400',
    error: 'text-red-400',
    warning: 'text-yellow-400'
  }[type];

  return (
    <div
      className={`fixed top-8 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full mx-4 ${bgColor} border rounded-lg shadow-xl p-6 transition-all duration-300 ease-in-out`}
    >
      <div className="flex items-center">
        <Icon className={`w-6 h-6 ${iconColor} mr-4 flex-shrink-0`} />
        <p className={`text-base font-medium ${textColor} flex-grow`}>
          {message}
        </p>
        <button
          onClick={onClose}
          className={`ml-4 flex-shrink-0 ${textColor} hover:opacity-70 transition-opacity`}
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

// Hook để quản lý Toast
const useToast = () => {
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error' | 'warning';
  } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'warning') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000); // Tự động ẩn sau 4 giây
  };

  const hideToast = () => {
    setToast(null);
  };

  return {
    toast,
    showToast,
    hideToast
  };
};

export default function AdminUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState(getUsers());
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const { toast, showToast, hideToast } = useToast();

  const handleDeleteClick = (user: User) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (userToDelete) {
      // Prevent deleting the admin user if there's only one
      if (userToDelete.role === 'admin' && users.filter(u => u.role === 'admin').length <= 1) {
        showToast('Không thể xóa người dùng admin duy nhất.', 'error');
        setIsDeleteModalOpen(false);
        setUserToDelete(null);
        return;
      }

      deleteUser(userToDelete.id);
      setUsers(getUsers()); // Refresh the list
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
      showToast('Đã xóa người dùng thành công!', 'success');
    }
  };

  const userColumns = [
    {
      key: 'fullName',
      header: 'Tên người dùng',
      render: (user: User) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center overflow-hidden">
            {user.avatar ? (
              <img src={user.avatar} alt={user.fullName} className="w-full h-full object-cover" />
            ) : (
              <span className="text-blue-600 font-semibold text-sm">
                {user.fullName?.charAt(0).toUpperCase() || 'U'}
              </span>
            )}
          </div>
          <span>{user.fullName}</span>
        </div>
      ),
      className: 'font-medium'
    },
    { key: 'email', header: 'Email' },
    { key: 'phone', header: 'Số điện thoại' },
    {
      key: 'role',
      header: 'Vai trò',
      render: (user: User) => (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
          user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {user.role === 'admin' ? 'Quản trị viên' : 'Người dùng'}
        </span>
      )
    },
    {
      key: 'createdAt',
      header: 'Ngày tạo',
      render: (user: User) => formatDate(user.createdAt),
      className: 'text-gray-500 text-sm'
    },
    {
      key: 'actions',
      header: 'Hành động',
      render: (user: User) => (
        <div className="flex items-center space-x-2">
          <Link href={`/admin/users/${user.id}`} title="Xem chi tiết">
            <Button variant="ghost" size="sm">
              <Eye className="w-4 h-4" />
            </Button>
          </Link>
          {user.role !== 'admin' || users.filter(u => u.role === 'admin').length > 1 ? (
             <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDeleteClick(user)}
                title="Xóa người dùng"
              >
                <Trash className="w-4 h-4 text-red-600" />
              </Button>
          ) : (
            <span className="text-gray-400 text-xs italic">Không thể xóa</span>
          )}
        </div>
      ),
      className: 'text-right'
    },
  ];

  return (
    <div className="p-8 bg-gray-50 min-h-full">
      <AdminHeader
        title="Quản lý người dùng"
        description="Xem và quản lý thông tin các tài khoản người dùng và quản trị viên."
      />

      <Table<User>
        data={users}
        columns={userColumns}
        emptyMessage="Không có người dùng nào được tìm thấy."
      />

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Xác nhận xóa người dùng"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsDeleteModalOpen(false)}>
              Hủy
            </Button>
            <Button variant="danger" onClick={confirmDelete}>
              Xóa
            </Button>
          </>
        }
      >
        <p className="text-gray-700">
          Bạn có chắc chắn muốn xóa người dùng "{userToDelete?.fullName}" ({userToDelete?.email}) không? Hành động này không thể hoàn tác.
        </p>
        {userToDelete?.role === 'admin' && users.filter(u => u.role === 'admin').length <= 1 && (
          <p className="mt-2 text-sm text-red-500">
            Lưu ý: Đây là người dùng admin duy nhất. Việc xóa có thể gây ra lỗi truy cập hệ thống.
          </p>
        )}
      </Modal>

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
        />
      )}
    </div>
  );
}