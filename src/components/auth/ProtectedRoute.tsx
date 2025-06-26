'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

// SimpleLoadingSpinner có thể được đặt ở components/ui/LoadingSpinner.tsx
const SimpleLoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-100">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
);

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[]; // Thay thế requireAdmin bằng allowedRoles, là một mảng string
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, user, isLoading: isAuthContextLoading } = useAuth(); // Lấy user từ AuthContext
  const router = useRouter();

  const [initialCheckComplete, setInitialCheckComplete] = useState(false);
  const [hasPermission, setHasPermission] = useState(false); // Thêm state để kiểm soát quyền

  useEffect(() => {
    if (!isAuthContextLoading) {
      setInitialCheckComplete(true);

      if (!isAuthenticated) {
        // Nếu không được xác thực, chuyển hướng đến trang đăng nhập
        router.push('/login');
        return;
      }

      // Kiểm tra quyền
      if (allowedRoles && user) {
        // Nếu có allowedRoles được chỉ định và vai trò của người dùng không nằm trong danh sách
        if (!allowedRoles.includes(user.role)) {
          setHasPermission(false); // Đánh dấu là không có quyền
          // Không chuyển hướng ngay lập tức, mà hiển thị thông báo "Không có quyền"
          return;
        }
      }
      setHasPermission(true); // Nếu không có allowedRoles hoặc người dùng có quyền
    }
  }, [isAuthenticated, user, isAuthContextLoading, allowedRoles, router]);

  // --- Logic hiển thị ---

  // 1. Hiển thị loading spinner nếu AuthContext đang tải hoặc kiểm tra ban đầu chưa hoàn tất
  if (isAuthContextLoading || !initialCheckComplete) {
    return <SimpleLoadingSpinner />;
  }

  // 2. Nếu đã hoàn tất kiểm tra và người dùng không được xác thực (trường hợp redirect chưa kịp xảy ra)
  if (!isAuthenticated) {
    return <SimpleLoadingSpinner />; // Hoặc null, vì router.push đã xử lý
  }

  // 3. Nếu đã xác thực nhưng không có quyền truy cập
  if (!hasPermission) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold text-red-600 mb-4">Không có quyền truy cập</h1>
          <p className="text-gray-700 text-lg mb-6">Bạn không có quyền truy cập vào trang này. Vui lòng liên hệ quản trị viên nếu bạn nghĩ đây là lỗi.</p>
          <button
            onClick={() => router.push('/')}
            className="bg-blue-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-blue-700 transition-colors"
          >
            Về trang chủ
          </button>
        </div>
      </div>
    );
  }

  // 4. Nếu đã xác thực và có quyền, hiển thị nội dung con
  return <>{children}</>;
}