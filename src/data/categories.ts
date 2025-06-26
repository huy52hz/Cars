import { Category } from '@/types/category';

export const categories: Category[] = [
  {
    id: '1',
    name: 'Sedan',
    slug: 'sedan',
    description: 'Dòng xe du lịch có 4 cửa, 4 chỗ hoặc 5 chỗ.',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'SUV',
    slug: 'suv',
    description: 'Dòng xe thể thao đa dụng, gầm cao, tiện dụng cho nhiều địa hình.',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '3',
    name: 'Hatchback',
    slug: 'hatchback',
    description: 'Dòng xe nhỏ gọn với cửa hậu mở lên, phù hợp di chuyển trong đô thị.',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '4',
    name: 'Crossover',
    slug: 'crossover',
    description: 'Sự kết hợp giữa sedan và SUV, mang lại sự thoải mái của sedan và không gian của SUV.',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '5',
    name: 'MPV',
    slug: 'mpv',
    description: 'Xe đa dụng, thường có 7 chỗ, phù hợp cho gia đình.',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
];

// Hàm lấy tất cả danh mục
export function getCategories(): Category[] {
  return [...categories];
}

// Hàm thêm danh mục mới
export function addCategory(newCategory: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>): Category {
  const newId = (categories.length > 0 ? Math.max(...categories.map(c => parseInt(c.id))) + 1 : 1).toString();
  const now = new Date().toISOString();
  const addedCategory: Category = { ...newCategory, id: newId, createdAt: now, updatedAt: now };
  categories.push(addedCategory);
  return addedCategory;
}

// Hàm lấy danh mục theo ID
export function getCategoryById(id: string): Category | null {
  return categories.find(cat => cat.id === id) || null;
}

// Hàm cập nhật thông tin danh mục
export function updateCategory(id: string, updatedFields: Partial<Category>): Category | null {
  const categoryIndex = categories.findIndex(cat => cat.id === id);
  if (categoryIndex > -1) {
    categories[categoryIndex] = { ...categories[categoryIndex], ...updatedFields, updatedAt: new Date().toISOString() };
    return categories[categoryIndex];
  }
  return null;
}

// Hàm xóa danh mục
export function deleteCategory(id: string): boolean {
  const index = categories.findIndex(cat => cat.id === id);
  if (index > -1) {
    categories.splice(index, 1);
    return true;
  }
  return false;
}