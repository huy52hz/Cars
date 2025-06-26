// src/data/orders.ts

import { Order } from '@/types/order';

// Khởi tạo dữ liệu đơn hàng ban đầu (chỉ dùng nếu localStorage trống)
// ĐÃ THÊM THÊM CÁC ĐƠN HÀNG MỚI DỰA TRÊN DỮ LIỆU USER CỦA BẠN
const initialOrdersData: Order[] = [
  // Đơn hàng cũ (giữ nguyên)
  {
    id: '1',
    userId: '2', // Nguyễn Văn A
    carId: '1', // BMW M4
    customerName: 'Nguyễn Văn A',
    customerEmail: 'user@gmail.com',
    customerPhone: '0907654321',
    status: 'pending',
    totalAmount: 1250000000,
    notes: 'Khách hàng muốn xem xe trực tiếp trước khi quyết định mua',
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z'
  },
  {
    id: '2',
    userId: '3', // John Doe
    carId: '2', // Mercedes-Benz C-Class
    customerName: 'John Doe',
    customerEmail: 'john.doe@email.com',
    customerPhone: '0909876543',
    status: 'confirmed',
    totalAmount: 950000000,
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-16T00:00:00Z'
  },
  {
    id: '3',
    userId: '1', // Admin user
    carId: '3', // Audi A6
    customerName: 'Nguyễn Văn Admin',
    customerEmail: 'admin@carshop.com',
    customerPhone: '0901234567',
    status: 'completed',
    totalAmount: 1100000000,
    createdAt: '2024-01-20T00:00:00Z',
    updatedAt: '2024-01-20T00:00:00Z'
  },

  // THÊM ĐƠN HÀNG CHO USER '2' - Nguyễn Văn A
  {
    id: '4',
    userId: '2', // Nguyễn Văn A
    carId: '4', // Ford Mustang
    customerName: 'Nguyễn Văn A',
    customerEmail: 'user@gmail.com',
    customerPhone: '0907654321',
    status: 'completed', // Đã hoàn thành
    totalAmount: 2000000000,
    notes: 'Đã hoàn tất thanh toán và nhận xe.',
    createdAt: '2024-02-01T10:30:00Z',
    updatedAt: '2024-02-05T15:00:00Z'
  },
  {
    id: '5',
    userId: '2', // Nguyễn Văn A
    carId: '5', // Honda Civic
    customerName: 'Nguyễn Văn A',
    customerEmail: 'user@gmail.com',
    customerPhone: '0907654321',
    status: 'cancelled', // Đã hủy
    totalAmount: 750000000,
    notes: 'Khách hàng đổi ý, không mua nữa.',
    createdAt: '2024-03-05T09:00:00Z',
    updatedAt: '2024-03-05T10:00:00Z'
  },

  // THÊM ĐƠN HÀNG CHO USER '3' - John Doe
  {
    id: '6',
    userId: '3', // John Doe
    carId: '6', // Volkswagen Golf
    customerName: 'John Doe',
    customerEmail: 'john.doe@email.com',
    customerPhone: '0909876543',
    status: 'pending', // Đang chờ
    totalAmount: 800000000,
    notes: 'Yêu cầu kiểm tra kỹ xe trước khi giao.',
    createdAt: '2024-03-10T11:00:00Z',
    updatedAt: '2024-03-10T11:00:00Z'
  },
  {
    id: '7',
    userId: '3', // John Doe
    carId: '7', // Toyota Camry
    customerName: 'John Doe',
    customerEmail: 'john.doe@email.com',
    customerPhone: '0909876543',
    status: 'completed', // Hoàn thành
    totalAmount: 1300000000,
    notes: 'Giao xe thành công.',
    createdAt: '2024-03-20T14:00:00Z',
    updatedAt: '2024-03-22T10:00:00Z'
  },

  // THÊM ĐƠN HÀNG CHO USER '4' - Lê Thành
  {
    id: '8',
    userId: '4', // Lê Thành
    carId: '8', // Porsche 911
    customerName: 'Lê Thành',
    customerEmail: 'lethanh@email.com',
    customerPhone: '0912345678',
    status: 'confirmed', // Đã xác nhận
    totalAmount: 5500000000,
    notes: 'Khách hàng yêu cầu lắp thêm phụ kiện.',
    createdAt: '2024-04-01T16:00:00Z',
    updatedAt: '2024-04-02T09:00:00Z'
  },
  {
    id: '9',
    userId: '4', // Lê Thành
    carId: '9', // Ferrari 488
    customerName: 'Lê Thành',
    customerEmail: 'lethanh@email.com',
    customerPhone: '0912345678',
    status: 'pending', // Đang chờ
    totalAmount: 8000000000,
    notes: 'Đang chờ xác nhận cuối cùng về màu sắc.',
    createdAt: '2024-04-05T10:00:00Z',
    updatedAt: '2024-04-05T10:00:00Z'
  },

  // THÊM ĐƠN HÀNG CHO USER '5' - Phạm Thị Hương
  {
    id: '10',
    userId: '5', // Phạm Thị Hương
    carId: '10', // Lamborghini Huracan
    customerName: 'Phạm Thị Hương',
    customerEmail: 'phamhuong@email.com',
    customerPhone: '0923456789',
    status: 'completed', // Hoàn thành
    totalAmount: 9000000000,
    notes: 'Đã nhận xe và hài lòng.',
    createdAt: '2024-04-10T13:00:00Z',
    updatedAt: '2024-04-15T11:00:00Z'
  },
  {
    id: '11',
    userId: '5', // Phạm Thị Hương
    carId: '11', // Tesla Model S
    customerName: 'Phạm Thị Hương',
    customerEmail: 'phamhuong@email.com',
    customerPhone: '0923456789',
    status: 'cancelled', // Đã hủy
    totalAmount: 3000000000,
    notes: 'Hủy vì muốn đợi phiên bản mới hơn.',
    createdAt: '2024-04-18T08:00:00Z',
    updatedAt: '2024-04-18T09:00:00Z'
  },

  // THÊM ĐƠN HÀNG CHO USER '6' - Nguyễn Minh Tùng
  {
    id: '12',
    userId: '6', // Nguyễn Minh Tùng
    carId: '12', // Mercedes-AMG GT
    customerName: 'Nguyễn Minh Tùng',
    customerEmail: 'nguyentung@email.com',
    customerPhone: '0934567890',
    status: 'confirmed', // Đã xác nhận
    totalAmount: 6000000000,
    notes: 'Sẽ đến lấy xe vào tuần tới.',
    createdAt: '2024-05-01T10:00:00Z',
    updatedAt: '2024-05-02T10:00:00Z'
  },
  {
    id: '13',
    userId: '6', // Nguyễn Minh Tùng
    carId: '13', // Audi R8
    customerName: 'Nguyễn Minh Tùng',
    customerEmail: 'nguyentung@email.com',
    customerPhone: '0934567890',
    status: 'pending', // Đang chờ
    totalAmount: 7000000000,
    notes: 'Đang chờ phản hồi về tùy chọn màu sơn.',
    createdAt: '2024-05-05T14:00:00Z',
    updatedAt: '2024-05-05T14:00:00Z'
  },

  // THÊM ĐƠN HÀNG CHO USER '7' - Trần Mai
  {
    id: '14',
    userId: '7', // Trần Mai
    carId: '14', // BMW X5
    customerName: 'Trần Mai',
    customerEmail: 'tranmai@email.com',
    customerPhone: '0945678901',
    status: 'completed', // Hoàn thành
    totalAmount: 3500000000,
    notes: 'Khách hàng rất ưng ý với xe.',
    createdAt: '2024-05-10T09:00:00Z',
    updatedAt: '2024-05-12T16:00:00Z'
  },
  {
    id: '15',
    userId: '7', // Trần Mai
    carId: '15', // Lexus RX
    customerName: 'Trần Mai',
    customerEmail: 'tranmai@email.com',
    customerPhone: '0945678901',
    status: 'pending', // Đang chờ
    totalAmount: 3000000000,
    notes: 'Yêu cầu lái thử thêm lần nữa.',
    createdAt: '2024-05-15T11:00:00Z',
    updatedAt: '2024-05-15T11:00:00Z'
  },

  // THÊM ĐƠN HÀNG CHO USER '8' - Đặng Quang
  {
    id: '16',
    userId: '8', // Đặng Quang
    carId: '1', // BMW M4 (dùng lại xe cũ)
    customerName: 'Đặng Quang',
    customerEmail: 'dangquang@email.com',
    customerPhone: '0956789012',
    status: 'confirmed', // Đã xác nhận
    totalAmount: 1250000000,
    notes: 'Khách hàng đã cọc.',
    createdAt: '2024-05-20T14:00:00Z',
    updatedAt: '2024-05-21T09:00:00Z'
  },
  {
    id: '17',
    userId: '8', // Đặng Quang
    carId: '2', // Mercedes-Benz C-Class (dùng lại xe cũ)
    customerName: 'Đặng Quang',
    customerEmail: 'dangquang@email.com',
    customerPhone: '0956789012',
    status: 'pending', // Đang chờ
    totalAmount: 950000000,
    notes: 'Đang xem xét thêm các lựa chọn khác.',
    createdAt: '2024-05-25T16:00:00Z',
    updatedAt: '2024-05-25T16:00:00Z'
  },
];

// Biến nội bộ để quản lý mảng đơn hàng trong module này
let orders: Order[] = [];

// Hàm helper để tải đơn hàng từ localStorage
const loadOrdersFromLocalStorage = (): Order[] => {
  if (typeof window !== 'undefined') {
    const storedOrders = localStorage.getItem('orders');
    if (storedOrders) {
      try {
        return JSON.parse(storedOrders) as Order[];
      } catch (e) {
        console.error("Lỗi khi phân tích cú pháp đơn hàng từ localStorage:", e);
        return [];
      }
    }
  }
  return []; // Trả về mảng rỗng nếu không có gì trong localStorage hoặc không phải môi trường trình duyệt
};

// Hàm helper để lưu đơn hàng vào localStorage
const saveOrdersToLocalStorage = (currentOrders: Order[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('orders', JSON.stringify(currentOrders));
  }
};


// Khi module được tải, thử tải từ localStorage.
// Nếu localStorage trống, sử dụng dữ liệu khởi tạo và lưu vào localStorage.
if (typeof window !== 'undefined') {
  const stored = loadOrdersFromLocalStorage();
  if (stored.length === 0) {
    orders = initialOrdersData;
    saveOrdersToLocalStorage(orders);
  } else {
    orders = stored;
  }
}

// Hàm lấy tất cả đơn hàng
export function getOrders(): Order[] {
  // Luôn đảm bảo lấy trạng thái mới nhất từ localStorage trước khi trả về
  orders = loadOrdersFromLocalStorage();
  return [...orders]; // Trả về bản sao để tránh sửa đổi trực tiếp từ bên ngoài
}

// Hàm thêm đơn hàng mới
export function addOrder(newOrderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'status'>): Order {
  orders = loadOrdersFromLocalStorage(); // Lấy trạng thái mới nhất
  const newId = (orders.length > 0 ? Math.max(...orders.map(o => parseInt(o.id))) + 1 : 1).toString();
  const now = new Date().toISOString();
  const addedOrder: Order = {
    ...newOrderData,
    id: newId,
    createdAt: now,
    updatedAt: now,
    status: 'pending' // Luôn đặt trạng thái mặc định là 'pending' khi tạo mới
  };
  orders.push(addedOrder);
  saveOrdersToLocalStorage(orders); // Lưu thay đổi vào localStorage
  return addedOrder;
}

// Hàm lấy đơn hàng theo ID
export function getOrderById(id: string): Order | null {
  orders = loadOrdersFromLocalStorage(); // Lấy trạng thái mới nhất
  return orders.find(order => order.id === id) || null;
}

// Hàm cập nhật thông tin đơn hàng
export function updateOrder(id: string, updatedFields: Partial<Order>): Order | null {
  orders = loadOrdersFromLocalStorage(); // Lấy trạng thái mới nhất
  const orderIndex = orders.findIndex(order => order.id === id);
  if (orderIndex > -1) {
    orders[orderIndex] = { ...orders[orderIndex], ...updatedFields, updatedAt: new Date().toISOString() };
    saveOrdersToLocalStorage(orders); // Lưu thay đổi vào localStorage
    return orders[orderIndex];
  }
  return null;
}

// Hàm xóa đơn hàng
export function deleteOrder(id: string): boolean {
  orders = loadOrdersFromLocalStorage(); // Lấy trạng thái mới nhất
  const initialLength = orders.length;
  orders = orders.filter(order => order.id !== id);
  saveOrdersToLocalStorage(orders); // Lưu thay đổi vào localStorage
  return orders.length < initialLength;
}

// HÀM HỦY ĐƠN HÀNG
export function cancelOrder(orderId: string): boolean {
  orders = loadOrdersFromLocalStorage(); // Lấy trạng thái mới nhất trước khi chỉnh sửa
  const orderIndex = orders.findIndex(order => order.id === orderId);
  if (orderIndex > -1) {
    const order = orders[orderIndex];
    // Chỉ cho phép hủy nếu trạng thái là 'pending' hoặc 'confirmed'
    if (order.status === 'pending' || order.status === 'confirmed') {
      orders[orderIndex] = {
        ...order,
        status: 'cancelled', // Thay đổi trạng thái thành 'cancelled'
        updatedAt: new Date().toISOString(),
      };
      saveOrdersToLocalStorage(orders); // RẤT QUAN TRỌNG: LƯU THAY ĐỔI VÀO localStorage
      return true;
    } else {
      console.warn(`Đơn hàng ${orderId} không thể hủy vì trạng thái là ${order.status}.`);
      return false;
    }
  }
  return false; // Không tìm thấy đơn hàng
}