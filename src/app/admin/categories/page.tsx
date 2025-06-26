'use client';

import React, { useState } from 'react';
import { getCategories, addCategory, updateCategory, deleteCategory } from '@/data/categories';
import { Category } from '@/types/category';
import AdminHeader from '@/components/admin/AdminHeader';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import Table from '@/components/ui/Table';
import { Plus, Edit, Trash, Tags, CheckCircle, XCircle, X } from 'lucide-react';
import { createSlug, formatDate } from '@/lib/utils';

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

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState(getCategories());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [categoryName, setCategoryName] = useState('');
  const [categoryDescription, setCategoryDescription] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast, showToast, hideToast } = useToast();

  const resetForm = () => {
    setCategoryName('');
    setCategoryDescription('');
    setErrors({});
    setEditingCategory(null);
  };

  const handleOpenModal = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setCategoryName(category.name);
      setCategoryDescription(category.description || '');
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!categoryName.trim()) {
      newErrors.name = 'Tên danh mục không được để trống.';
    } else if (categories.some(cat => cat.name === categoryName.trim() && cat.id !== editingCategory?.id)) {
      newErrors.name = 'Tên danh mục đã tồn tại.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const slug = createSlug(categoryName);
    const commonFields = { name: categoryName.trim(), description: categoryDescription.trim(), slug };

    if (editingCategory) {
      // Update
      const updated = updateCategory(editingCategory.id, commonFields);
      if (updated) {
        setCategories(getCategories());
        showToast('Cập nhật danh mục thành công!', 'success');
      } else {
        showToast('Cập nhật danh mục thất bại.', 'error');
      }
    } else {
      // Add
      const newCat = addCategory(commonFields);
      if (newCat) {
        setCategories(getCategories());
        showToast('Thêm danh mục mới thành công!', 'success');
      } else {
        showToast('Thêm danh mục mới thất bại.', 'error');
      }
    }
    handleCloseModal();
  };

  const handleDeleteClick = (category: Category) => {
    setCategoryToDelete(category);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (categoryToDelete) {
      const isDeleted = deleteCategory(categoryToDelete.id);
      if (isDeleted) {
        setCategories(getCategories());
        showToast('Đã xóa danh mục thành công!', 'success');
      } else {
        showToast('Xóa danh mục thất bại.', 'error');
      }
      setIsDeleteModalOpen(false);
      setCategoryToDelete(null);
    }
  };

  const categoryColumns = [
    { key: 'name', header: 'Tên danh mục' },
    { key: 'slug', header: 'Slug' },
    { key: 'description', header: 'Mô tả' },
    { key: 'createdAt', header: 'Ngày tạo', render: (item: Category) => formatDate(item.createdAt) },
    {
      key: 'actions',
      header: 'Hành động',
      render: (item: Category) => (
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={() => handleOpenModal(item)} title="Chỉnh sửa">
            <Edit className="w-4 h-4 text-blue-600" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => handleDeleteClick(item)} title="Xóa">
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
        title="Quản lý danh mục"
        description="Thêm, sửa và xóa các danh mục xe."
        actions={
          <Button onClick={() => handleOpenModal()}>
            <Plus className="w-5 h-5 mr-2" /> Thêm danh mục mới
          </Button>
        }
      />

      <Table<Category>
        data={categories}
        columns={categoryColumns}
        emptyMessage="Không có danh mục nào được tìm thấy."
      />

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingCategory ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}
        footer={
          <>
            <Button variant="secondary" onClick={handleCloseModal}>
              Hủy
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
              {editingCategory ? 'Cập nhật' : 'Thêm mới'}
            </Button>
          </>
        }
      >
        <Input
          label="Tên danh mục"
          name="categoryName"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          error={errors.name}
          placeholder="Ví dụ: Sedan"
        />
        <div className="mb-4">
          <label htmlFor="categoryDescription" className="block text-sm font-medium text-gray-700 mb-1">
            Mô tả
          </label>
          <textarea
            id="categoryDescription"
            name="categoryDescription"
            value={categoryDescription}
            onChange={(e) => setCategoryDescription(e.target.value)}
            rows={3}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Mô tả về danh mục..."
          ></textarea>
        </div>
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Xác nhận xóa danh mục"
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
          Bạn có chắc chắn muốn xóa danh mục "{categoryToDelete?.name}" không? Hành động này không thể hoàn tác.
        </p>
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