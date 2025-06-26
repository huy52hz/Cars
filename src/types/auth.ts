// src/types/auth.ts
export type UserRole = "user" | "admin";

export interface User {
  id: string;
  email: string;
  password?: string;
  fullName: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  address?: string;
  createdAt: string;
  updatedAt?: string;
}

export type UserWithoutPassword = Omit<User, "password">;

export interface AuthContextType {
  user: UserWithoutPassword | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (
    updatedFields: Partial<Omit<UserWithoutPassword, "email" | "id" | "role">>
  ) => Promise<boolean>;
  refreshUser: () => void;
}
