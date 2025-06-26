import { users } from "@/data/users";
import { User, UserWithoutPassword } from "@/types/auth";

const CURRENT_USER_STORAGE_KEY = 'user';

// Helper to get the current user from localStorage
export const getCurrentUser = (): UserWithoutPassword | null => {
  if (typeof window === 'undefined') return null;
  const userData = localStorage.getItem(CURRENT_USER_STORAGE_KEY);
  return userData ? JSON.parse(userData) as UserWithoutPassword : null;
};

// Helper to set the current user in localStorage
export const setCurrentUser = (user: UserWithoutPassword | null): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CURRENT_USER_STORAGE_KEY, user ? JSON.stringify(user) : '');
};

// Simulate authentication
export const authenticateUser = async (
  email: string,
  password: string
): Promise<UserWithoutPassword | null> => {
  await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API delay

  const user = users.find((u) => u.email === email && u.password === password);
  if (user) {
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
  return null;
};

// Đảm bảo hàm này được export như thế này:
export const getUserById = (id: string): UserWithoutPassword | null => {
    const user = users.find(u => u.id === id);
    if (user) {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
    return null;
};

// Update user function
export const updateUser = (
  id: string,
  updatedFields: Partial<Omit<UserWithoutPassword, 'id' | 'email' | 'role'>>
): UserWithoutPassword | null => {
  const userIndex = users.findIndex((user) => user.id === id);
  if (userIndex === -1) {
    return null; // User not found
  }

  const currentUser = { ...users[userIndex] };

  if (updatedFields.fullName !== undefined) {
    currentUser.fullName = updatedFields.fullName;
  }
  if (updatedFields.phone !== undefined) {
    currentUser.phone = updatedFields.phone;
  }
  if (updatedFields.address !== undefined) {
    currentUser.address = updatedFields.address;
  }
  if (updatedFields.avatar !== undefined) {
    currentUser.avatar = updatedFields.avatar;
  }

  users[userIndex] = currentUser;

  const { password, ...updatedUserWithoutPassword } = users[userIndex];
  return updatedUserWithoutPassword;
};