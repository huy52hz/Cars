// src/types/car.ts
export interface Car {
  id: string;
  name: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  category: string;
  fuel: 'gasoline' | 'diesel' | 'hybrid' | 'electric';
  transmission: 'manual' | 'automatic';
  mileage: number;
  color: string;
  description: string;
  features: string[];
  images: string[];
  status: 'available' | 'sold' | 'reserved';
  createdAt: string;
  updatedAt?: string;
}