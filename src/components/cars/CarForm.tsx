'use client';

import React, { useState, useEffect } from 'react';
import { Car } from '@/types/car';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { getCategories } from '@/data/categories'; // Import categories
import { getBrands } from '@/data/brands'; // Import brands

interface CarFormProps {
  initialData?: Car;
  onSubmit: (data: Omit<Car, 'id' | 'createdAt' | 'updatedAt'>) => void;
  isLoading?: boolean;
  submitButtonText?: string;
}

const CarForm: React.FC<CarFormProps> = ({
  initialData,
  onSubmit,
  isLoading = false,
  submitButtonText = 'Lưu xe'
}) => {
  const [formData, setFormData] = useState<Omit<Car, 'id' | 'createdAt' | 'updatedAt'>>({
    name: '',
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    price: 0,
    category: '',
    fuel: 'gasoline',
    transmission: 'automatic',
    mileage: 0,
    color: '',
    description: '',
    features: [],
    images: [],
    status: 'available',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [featureInput, setFeatureInput] = useState<string>('');
  const [imageInput, setImageInput] = useState<string>('');

  const categories = getCategories(); // Fetch categories
  const brands = getBrands(); // Fetch brands

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        brand: initialData.brand,
        model: initialData.model,
        year: initialData.year,
        price: initialData.price,
        category: initialData.category,
        fuel: initialData.fuel,
        transmission: initialData.transmission,
        mileage: initialData.mileage,
        color: initialData.color,
        description: initialData.description,
        features: initialData.features || [],
        images: initialData.images || [],
        status: initialData.status,
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
    setErrors(prev => ({ ...prev, [name]: '' })); // Clear error on change
  };

  const handleAddFeature = () => {
    if (featureInput.trim() && !formData.features.includes(featureInput.trim())) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, featureInput.trim()]
      }));
      setFeatureInput('');
    }
  };

  const handleRemoveFeature = (featureToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter(f => f !== featureToRemove)
    }));
  };

  const handleAddImage = () => {
    if (imageInput.trim() && !formData.images.includes(imageInput.trim())) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, imageInput.trim()]
      }));
      setImageInput('');
    }
  };

  const handleRemoveImage = (imageToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter(img => img !== imageToRemove)
    }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Tên xe không được để trống';
    if (!formData.brand.trim()) newErrors.brand = 'Thương hiệu không được để trống';
    if (!formData.model.trim()) newErrors.model = 'Model không được để trống';
    if (formData.year < 1900 || formData.year > new Date().getFullYear() + 1) newErrors.year = 'Năm sản xuất không hợp lệ';
    if (formData.price <= 0) newErrors.price = 'Giá phải lớn hơn 0';
    if (!formData.category.trim()) newErrors.category = 'Danh mục không được để trống';
    if (!formData.fuel.trim()) newErrors.fuel = 'Loại nhiên liệu không được để trống';
    if (!formData.transmission.trim()) newErrors.transmission = 'Hộp số không được để trống';
    if (formData.mileage < 0) newErrors.mileage = 'Số km đã đi không hợp lệ';
    if (!formData.color.trim()) newErrors.color = 'Màu sắc không được để trống';
    if (!formData.description.trim()) newErrors.description = 'Mô tả không được để trống';
    if (formData.images.length === 0) newErrors.images = 'Cần ít nhất một ảnh xe';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6 bg-white rounded-xl shadow-sm border">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">{initialData ? 'Chỉnh sửa xe' : 'Thêm xe mới'}</h2>

      <Input
        label="Tên xe"
        name="name"
        value={formData.name}
        onChange={handleChange}
        error={errors.name}
        placeholder="Ví dụ: Toyota Camry 2024"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-1">
            Thương hiệu
          </label>
          <select
            id="brand"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${errors.brand ? 'border-red-500' : ''}`}
          >
            <option value="">Chọn thương hiệu</option>
            {brands.map(brand => (
              <option key={brand.id} value={brand.name}>{brand.name}</option>
            ))}
          </select>
          {errors.brand && <p className="mt-1 text-sm text-red-600">{errors.brand}</p>}
        </div>

        <Input
          label="Model"
          name="model"
          value={formData.model}
          onChange={handleChange}
          error={errors.model}
          placeholder="Ví dụ: Camry"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Năm sản xuất"
          name="year"
          type="number"
          value={formData.year}
          onChange={handleChange}
          error={errors.year}
          placeholder="Ví dụ: 2024"
        />
        <Input
          label="Giá (VND)"
          name="price"
          type="number"
          value={formData.price}
          onChange={handleChange}
          error={errors.price}
          placeholder="Ví dụ: 1250000000"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Danh mục
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${errors.category ? 'border-red-500' : ''}`}
          >
            <option value="">Chọn danh mục</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.name}>{cat.name}</option>
            ))}
          </select>
          {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
        </div>

        <div>
          <label htmlFor="fuel" className="block text-sm font-medium text-gray-700 mb-1">
            Nhiên liệu
          </label>
          <select
            id="fuel"
            name="fuel"
            value={formData.fuel}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="gasoline">Xăng</option>
            <option value="diesel">Dầu</option>
            <option value="electric">Điện</option>
            <option value="hybrid">Hybrid</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="transmission" className="block text-sm font-medium text-gray-700 mb-1">
            Hộp số
          </label>
          <select
            id="transmission"
            name="transmission"
            value={formData.transmission}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="automatic">Tự động</option>
            <option value="manual">Sàn</option>
          </select>
        </div>
        <Input
          label="Số km đã đi"
          name="mileage"
          type="number"
          value={formData.mileage}
          onChange={handleChange}
          error={errors.mileage}
          placeholder="Ví dụ: 0 (Xe mới)"
        />
      </div>

      <Input
        label="Màu sắc"
        name="color"
        value={formData.color}
        onChange={handleChange}
        error={errors.color}
        placeholder="Ví dụ: Trắng ngọc trai"
      />

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Mô tả
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${errors.description ? 'border-red-500' : ''}`}
          placeholder="Mô tả chi tiết về xe..."
        ></textarea>
        {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
      </div>

      <div>
        <label htmlFor="features" className="block text-sm font-medium text-gray-700 mb-1">
          Tính năng
        </label>
        <div className="flex gap-2 mb-2">
          <Input
            id="featureInput"
            value={featureInput}
            onChange={(e) => setFeatureInput(e.target.value)}
            placeholder="Thêm tính năng (ví dụ: Camera 360 độ)"
            className="flex-grow"
          />
          <Button type="button" onClick={handleAddFeature} variant="secondary">Thêm</Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.features.map((feature, index) => (
            <span key={index} className="flex items-center bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
              {feature}
              <button
                type="button"
                onClick={() => handleRemoveFeature(feature)}
                className="ml-2 text-blue-600 hover:text-blue-900"
              >
                &times;
              </button>
            </span>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="images" className="block text-sm font-medium text-gray-700 mb-1">
          Ảnh xe (URLs)
        </label>
        <div className="flex gap-2 mb-2">
          <Input
            id="imageInput"
            value={imageInput}
            onChange={(e) => setImageInput(e.target.value)}
            placeholder="URL ảnh (ví dụ: /images/cars/camry-1.jpg)"
            className="flex-grow"
            error={errors.images}
          />
          <Button type="button" onClick={handleAddImage} variant="secondary">Thêm</Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.images.map((image, index) => (
            <div key={index} className="relative w-24 h-24 border rounded-md overflow-hidden">
              <img src={image} alt={`Ảnh xe ${index + 1}`} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => handleRemoveImage(image)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
        {errors.images && <p className="mt-1 text-sm text-red-600">{errors.images}</p>}
      </div>
      
      <div>
        <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
          Trạng thái
        </label>
        <select
          id="status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        >
          <option value="available">Có sẵn</option>
          <option value="sold">Đã bán</option>
          <option value="pending">Đang chờ</option>
        </select>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Đang xử lý...' : submitButtonText}
      </Button>
    </form>
  );
};

export default CarForm;