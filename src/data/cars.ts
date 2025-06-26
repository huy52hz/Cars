import { Car } from '@/types/car';

// Dữ liệu ban đầu
export const cars: Car[] = [
  {
    id: '1',
    name: 'Toyota Camry 2024',
    brand: 'Toyota',
    model: 'Camry',
    year: 2024,
    price: 1250000000,
    category: 'Sedan',
    fuel: 'gasoline',
    transmission: 'automatic',
    mileage: 0,
    color: 'Trắng ngọc trai',
    description: 'Toyota Camry 2024 mới 100%, thiết kế sang trọng, động cơ mạnh mẽ, tiết kiệm nhiên liệu.',
    features: [
      'Hệ thống an toàn Toyota Safety Sense 2.0',
      'Màn hình cảm ứng 9 inch',
      'Camera 360 độ',
      'Cửa sổ trời panorama',
      'Ghế da cao cấp',
      'Điều hòa tự động 2 vùng'
    ],
    images: [
      '/images/cars/toyota-camry-1.jpg',
      '/images/cars/toyota-camry-1.jpg',
      '/images/cars/toyota-camry-1.jpg',
    ],
    status: 'available',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'Honda Civic 2024',
    brand: 'Honda',
    model: 'Civic',
    year: 2024,
    price: 950000000,
    category: 'Sedan',
    fuel: 'gasoline',
    transmission: 'automatic',
    mileage: 0,
    color: 'Đen crystal',
    description: 'Honda Civic 2024 thế hệ mới, thiết kế trẻ trung, công nghệ hiện đại.',
    features: [
      'Honda SENSING',
      'Màn hình 8 inch',
      'Sạc không dây',
      'Đèn LED full',
      'Cruise control thích ứng',
      'Hệ thống âm thanh Bose'
    ],
    images: [
      '/images/cars/honda-civic-1.jpg',
      '/images/cars/honda-civic-2.jpg',
      '/images/cars/honda-civic-3.jpg'
    ],
    status: 'available',
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z'
  },
  {
    id: '3',
    name: 'Hyundai Tucson 2024',
    brand: 'Hyundai',
    model: 'Tucson',
    year: 2024,
    price: 1100000000,
    category: 'SUV',
    fuel: 'gasoline',
    transmission: 'automatic',
    mileage: 0,
    color: 'Xanh dương metallic',
    description: 'Hyundai Tucson 2024 SUV 5 chỗ, thiết kế mạnh mẽ, không gian rộng rãi.',
    features: [
      'SmartSense',
      'Màn hình 12.3 inch',
      'Hệ thống âm thanh Infinity',
      'Sạc không dây',
      'Cửa cốp điện',
      'Phanh tay điện tử'
    ],
    images: [
      '/images/cars/hyundai-tucson-1.jpg',
      '/images/cars/hyundai-tucson-2.jpg',
      '/images/cars/hyundai-tucson-3.jpg'
    ],
    status: 'available',
    createdAt: '2024-01-03T00:00:00Z',
    updatedAt: '2024-01-03T00:00:00Z'
  },
  {
      id: '4',
    name: 'Mazda CX-5 2024',
    brand: 'Mazda',
    model: 'CX-5',
    year: 2024,
    price: 999000000,
    category: 'SUV',
    fuel: 'gasoline',
    transmission: 'automatic',
    mileage: 0,
    color: 'Đỏ Soul',
    description: 'Mazda CX-5 thiết kế Kodo đẹp mắt, trang bị công nghệ i-Activsense hiện đại.',
    features: ['i-Activsense', 'Màn hình HUD', 'Ghế da Nappa', 'Camera 360', 'Cửa sổ trời', 'Gương chống chói'],
    images: ['/images/cars/mazda-cx5-1.jpg', '/images/cars/mazda-cx5-2.jpg'],
    status: 'available',
    createdAt: '2024-01-04T00:00:00Z',
    updatedAt: '2024-01-04T00:00:00Z'
  },
  {
    id: '5',
    name: 'Kia Seltos 2024',
    brand: 'Kia',
    model: 'Seltos',
    year: 2024,
    price: 750000000,
    category: 'SUV',
    fuel: 'gasoline',
    transmission: 'automatic',
    mileage: 0,
    color: 'Cam ánh kim',
    description: 'Kia Seltos mới với kiểu dáng thể thao, nhiều công nghệ an toàn.',
    features: ['Cruise control', 'Camera lùi', 'Màn hình 10.25 inch', 'Apple CarPlay', 'ABS', 'ESP'],
    images: ['/images/cars/kia-seltos-1.jpg', '/images/cars/kia-seltos-2.jpg'],
    status: 'available',
    createdAt: '2024-01-05T00:00:00Z',
    updatedAt: '2024-01-05T00:00:00Z'
  },
  {
    id: '6',
    name: 'Mercedes-Benz C200 2024',
    brand: 'Mercedes-Benz',
    model: 'C200',
    year: 2024,
    price: 1750000000,
    category: 'Sedan',
    fuel: 'gasoline',
    transmission: 'automatic',
    mileage: 0,
    color: 'Trắng Polar',
    description: 'C200 sang trọng, động cơ mạnh mẽ, trải nghiệm đẳng cấp từ Mercedes.',
    features: ['LED Multibeam', 'MBUX 11.9"', 'Camera 360', 'Ghế massage', 'Cruise Control', 'Hệ thống Pre-Safe'],
    images: ['/images/cars/mercedes-c200-1.jpg'],
    status: 'available',
    createdAt: '2024-01-06T00:00:00Z',
    updatedAt: '2024-01-06T00:00:00Z'
  },
  {
    id: '7',
    name: 'BMW X3 2024',
    brand: 'BMW',
    model: 'X3',
    year: 2024,
    price: 2390000000,
    category: 'SUV',
    fuel: 'gasoline',
    transmission: 'automatic',
    mileage: 0,
    color: 'Xanh dương đậm',
    description: 'BMW X3 sang trọng, động cơ mạnh mẽ, phong cách thể thao đậm chất Đức.',
    features: ['iDrive 8.0', 'Mâm 19 inch', 'HUD', 'Ghế thể thao', 'Cửa sổ trời', 'Hệ thống hỗ trợ lái'],
    images: ['/images/cars/bmw-x3-1.jpg'],
    status: 'available',
    createdAt: '2024-01-07T00:00:00Z',
    updatedAt: '2024-01-07T00:00:00Z'
  },
  {
    id: '8',
    name: 'Ford Everest Titanium 2024',
    brand: 'Ford',
    model: 'Everest',
    year: 2024,
    price: 1390000000,
    category: 'SUV',
    fuel: 'diesel',
    transmission: 'automatic',
    mileage: 0,
    color: 'Xám Meteor',
    description: 'Ford Everest mới mạnh mẽ, tiện nghi với nhiều tính năng hiện đại.',
    features: ['Cruise Control', 'Camera 360', 'Màn hình 12 inch', 'Phanh tay điện tử', 'Cửa hậu điện'],
    images: ['/images/cars/ford-everest-1.jpg'],
    status: 'available',
    createdAt: '2024-01-08T00:00:00Z',
    updatedAt: '2024-01-08T00:00:00Z'
  },
  {
    id: '9',
    name: 'VinFast VF 8 Plus 2024',
    brand: 'VinFast',
    model: 'VF 8',
    year: 2024,
    price: 1250000000,
    category: 'SUV',
    fuel: 'electric',
    transmission: 'automatic',
    mileage: 0,
    color: 'Xanh thiên thanh',
    description: 'Xe điện VF 8 Plus, công nghệ cao, trải nghiệm lái hiện đại.',
    features: ['ADAS', 'Màn hình cảm ứng 15.6 inch', 'Không gian rộng', 'Tự lái cấp 2+', 'Cốp điện'],
    images: ['/images/cars/vinfast-vf8-1.jpg'],
    status: 'available',
    createdAt: '2024-01-09T00:00:00Z',
    updatedAt: '2024-01-09T00:00:00Z'
  },
  {
    id: '10',
    name: 'Lexus RX500h 2024',
    brand: 'Lexus',
    model: 'RX500h',
    year: 2024,
    price: 4590000000,
    category: 'SUV',
    fuel: 'hybrid',
    transmission: 'automatic',
    mileage: 0,
    color: 'Đen bóng',
    description: 'Lexus RX thế hệ mới với công nghệ hybrid tiết kiệm và vận hành êm ái.',
    features: ['Hệ thống hybrid', 'Màn hình 14 inch', 'Cửa sổ trời toàn cảnh', 'Mark Levinson Audio', 'Camera 360'],
    images: ['/images/cars/lexus-rx-1.jpg'],
    status: 'available',
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z'
  }
];

// Hàm thêm xe mới
export const addCar = (newCar: Omit<Car, 'id' | 'createdAt' | 'updatedAt'>): Car => {
  const newId = (cars.length > 0 ? Math.max(...cars.map(c => parseInt(c.id))) + 1 : 1).toString(); // Đảm bảo ID tăng dần
  const now = new Date().toISOString();
  const addedCar: Car = { ...newCar, id: newId, createdAt: now, updatedAt: now };
  cars.push(addedCar);
  return addedCar;
};

// Hàm lấy tất cả xe
export const getCars = (): Car[] => {
  return [...cars]; // Trả về bản sao để tránh thay đổi trực tiếp bên ngoài
};

// Hàm lấy xe theo ID
export const getCarById = (id: string): Car | null => {
  return cars.find(car => car.id === id) || null;
};

// Hàm cập nhật thông tin xe
export const updateCar = (id: string, updatedFields: Partial<Car>): Car | null => {
  const carIndex = cars.findIndex(car => car.id === id);
  if (carIndex > -1) {
    cars[carIndex] = { ...cars[carIndex], ...updatedFields, updatedAt: new Date().toISOString() };
    return cars[carIndex];
  }
  return null;
};

// Hàm xóa xe
export const deleteCar = (id: string): boolean => {
  const initialLength = cars.length;
  const index = cars.findIndex(car => car.id === id);
  if (index > -1) {
    cars.splice(index, 1);
    return true;
  }
  return false;
};