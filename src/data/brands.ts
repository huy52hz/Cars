import { Brand } from '@/types/brand';

export const brands: Brand[] = [
  {
    id: '1',
    name: 'Toyota',
    logo: '/images/brands/toyota-logo.png',
    description: 'Thương hiệu ô tô hàng đầu Nhật Bản, nổi tiếng về độ bền và tiết kiệm nhiên liệu.',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'Honda',
    logo: '/images/brands/honda-logo.png',
    description: 'Thương hiệu ô tô và xe máy Nhật Bản, được biết đến với động cơ mạnh mẽ và thiết kế thể thao.',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '3',
    name: 'Hyundai',
    logo: '/images/brands/hyundai-logo.png',
    description: 'Thương hiệu ô tô Hàn Quốc, cung cấp các mẫu xe đa dạng với thiết kế hiện đại và công nghệ tiên tiến.',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '4',
    name: 'BMW',
    logo: '/images/brands/bmw-logo.png',
    description: 'Thương hiệu xe hơi hạng sang của Đức, nổi tiếng với hiệu suất lái và công nghệ cao cấp.',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '5',
    name: 'Mercedes-Benz',
    logo: '/images/brands/mercedes-logo.png',
    description: 'Thương hiệu xe hơi hạng sang của Đức, biểu tượng của sự sang trọng và đổi mới.',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
];

// Hàm thêm thương hiệu mới
export const addBrand = (newBrand: Omit<Brand, 'id' | 'createdAt' | 'updatedAt'>): Brand => {
  const newId = (brands.length > 0 ? Math.max(...brands.map(b => parseInt(b.id))) + 1 : 1).toString();
  const now = new Date().toISOString();
  const addedBrand: Brand = { ...newBrand, id: newId, createdAt: now, updatedAt: now };
  brands.push(addedBrand);
  return addedBrand;
};

// Hàm lấy tất cả thương hiệu
export const getBrands = (): Brand[] => {
  return [...brands];
};

// Hàm lấy thương hiệu theo ID
export const getBrandById = (id: string): Brand | null => {
  return brands.find(brand => brand.id === id) || null;
};

// Hàm cập nhật thông tin thương hiệu
export const updateBrand = (id: string, updatedFields: Partial<Brand>): Brand | null => {
  const brandIndex = brands.findIndex(brand => brand.id === id);
  if (brandIndex > -1) {
    brands[brandIndex] = { ...brands[brandIndex], ...updatedFields, updatedAt: new Date().toISOString() };
    return brands[brandIndex];
  }
  return null;
};

// Hàm xóa thương hiệu
export const deleteBrand = (id: string): boolean => {
  const index = brands.findIndex(brand => brand.id === id);
  if (index > -1) {
    brands.splice(index, 1);
    return true;
  }
  return false;
};