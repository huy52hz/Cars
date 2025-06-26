// data/users.ts 
import { User } from '@/types/auth'; 

export const users: User[] = [
  {
    id: '1',
    email: 'admin@carshop.com',
    password: 'admin123',
    fullName: 'Nguyễn Văn Admin',
    role: 'admin',
    avatar: '/images/avatars/admin.jpg',
    phone: '0901234567',
    address: '123 Đường ABC, Quận 1, TP.HCM',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    email: 'user@gmail.com',
    password: 'user123',
    fullName: 'Nguyễn Văn A',
    role: 'user',
    avatar: '/images/avatars/user.jpg',
    phone: '0907654321',
    address: 'San Jose, California',
    createdAt: '2024-01-15T00:00:00Z'
  },
  {
    id: '3',
    email: 'john.doe@email.com',
    password: 'password123',
    fullName: 'John Doe',
    role: 'user',
    avatar: '/images/avatars/user0.jpg',
    phone: '0909876543',
    address: '789 Street ABC, District 3, HCMC',
    createdAt: '2024-02-01T00:00:00Z'
  },
    {
    id: '4',
    email: 'lethanh@email.com',
    password: 'user1234',
    fullName: 'Lê Thành',
    role: 'user',
    avatar: '/images/avatars/user1.jpg',
    phone: '0912345678',
    address: '12 Nguyễn Huệ, Quận 1, TP.HCM',
    createdAt: '2024-02-10T00:00:00Z'
  },
  {
    id: '5',
    email: 'phamhuong@email.com',
    password: 'user5678',
    fullName: 'Phạm Thị Hương',
    role: 'user',
    avatar: '/images/avatars/user2.jpg',
    phone: '0923456789',
    address: '34 Lê Duẩn, Quận 1, TP.HCM',
    createdAt: '2024-02-12T00:00:00Z'
  },
  {
    id: '6',
    email: 'nguyentung@email.com',
    password: 'userabcd',
    fullName: 'Nguyễn Minh Tùng',
    role: 'user',
    avatar: '/images/avatars/user3.jpg',
    phone: '0934567890',
    address: '56 Hai Bà Trưng, Quận 3, TP.HCM',
    createdAt: '2024-02-15T00:00:00Z'
  },
  {
    id: '7',
    email: 'tranmai@email.com',
    password: 'maitrans@2024',
    fullName: 'Trần Mai',
    role: 'user',
    avatar: '/images/avatars/user4.jpg',
    phone: '0945678901',
    address: '78 Điện Biên Phủ, Quận Bình Thạnh, TP.HCM',
    createdAt: '2024-02-18T00:00:00Z'
  },
  {
    id: '8',
    email: 'dangquang@email.com',
    password: 'dangquang123',
    fullName: 'Đặng Quang',
    role: 'user',
    avatar: '/images/avatars/user5.jpg',
    phone: '0956789012',
    address: '90 Phan Xích Long, Quận Phú Nhuận, TP.HCM',
    createdAt: '2024-02-20T00:00:00Z'
  }
];

// Thêm hàm này vào
export const getUsers = (): User[] => {
  return users;
};

export const getUserById = (id: string): User | undefined => {
  return users.find(user => user.id === id);
};

// Hàm thêm người dùng mới
export const addUser = (newUser: Omit<User, 'id' | 'createdAt'>): User => {
  const newId = (users.length + 1).toString();
  const createdAt = new Date().toISOString();
  const addedUser: User = { ...newUser, id: newId, createdAt };
  users.push(addedUser);
  return addedUser;
};

// Hàm cập nhật thông tin người dùng
export const updateUser = (id: string, updatedFields: Partial<Omit<User, 'password' | 'email'>>): User | null => {
  const userIndex = users.findIndex(user => user.id === id);
  if (userIndex > -1) {
    users[userIndex] = { ...users[userIndex], ...updatedFields };
    return users[userIndex];
  }
  return null;
};

// Hàm xóa người dùng
export const deleteUser = (id: string): boolean => {
  const initialLength = users.length;
  const filteredUsers = users.filter(user => user.id !== id);
  if (filteredUsers.length < initialLength) {
    // Gán lại mảng users bằng mảng đã lọc
    // Sử dụng splice để thay đổi trực tiếp mảng gốc, giữ cho các tham chiếu không bị mất
    users.splice(0, users.length, ...filteredUsers); 
    return true;
  }
  return false;
};