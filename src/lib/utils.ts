// src/lib/utils.ts

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0, // Không hiển thị số thập phân
  }).format(price);
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Hàm tạo slug từ string
export const createSlug = (text: string): string => {
  return text
    .normalize('NFD') // Chuẩn hóa Unicode
    .replace(/[\u0300-\u036f]/g, '') // Xóa các ký tự dấu
    .toLowerCase() // Chuyển thành chữ thường
    .trim() // Xóa khoảng trắng ở đầu/cuối
    .replace(/\s+/g, '-') // Thay thế khoảng trắng bằng dấu gạch ngang
    .replace(/[^\w-]+/g, '') // Xóa tất cả các ký tự không phải chữ, số, hoặc dấu gạch ngang
    .replace(/--+/g, '-'); // Thay thế nhiều dấu gạch ngang bằng một dấu
};