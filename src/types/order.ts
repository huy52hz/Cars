// src/types/order.ts

// Định nghĩa kiểu chính cho đơn hàng
export interface Order {
  id: string;          // ID duy nhất của đơn hàng
  userId: string;      // ID của người dùng đặt hàng
  carId: string;       // ID của chiếc xe được đặt hàng (chỉ một xe mỗi đơn hàng)
  customerName: string; // Tên khách hàng
  customerEmail: string; // Email khách hàng
  customerPhone: string; // Số điện thoại khách hàng
  // Cập nhật: Thêm 'cancelled' vào các trạng thái
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  totalAmount: number;   // Tổng giá trị của đơn hàng
  notes?: string;      // Ghi chú của khách hàng (tùy chọn)
  createdAt: string;   // Thời gian tạo đơn hàng (ISO string)
  updatedAt: string;   // Thời gian cập nhật gần nhất (ISO string)
}