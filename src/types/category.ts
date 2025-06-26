export interface Category {
  id: string;
  name: string;
  slug: string; // Friendly URL part
  description?: string;
  createdAt: string;
  updatedAt: string;
}