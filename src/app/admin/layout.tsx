'use client';

import React from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Car, BarChart3, Users, ShoppingBag, Settings, LogOut } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import AdminHeader from '@/components/admin/AdminHeader'; // Import AdminHeader

const adminMenuItems = [
  { href: '/admin', icon: BarChart3, label: 'Dashboard', exact: true },
  { href: '/admin/cars', icon: Car, label: 'Quản lý xe' },
  { href: '/admin/orders', icon: ShoppingBag, label: 'Đơn hàng' },
  { href: '/admin/users', icon: Users, label: 'Người dùng' },
  { href: '/admin/categories', icon: Settings, label: 'Danh mục' }
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const isActive = (href: string, exact = false) => {
    if (exact) {
      return pathname === href;
    }
    // Check if the current pathname starts with the item href
    // This handles nested routes like /admin/cars/add
    return pathname.startsWith(href);
  };

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <div className="min-h-screen bg-gray-50 flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg flex flex-col">
          <div className="p-6 border-b">
            <Link href="/" className="flex items-center gap-2">
              <Car className="w-8 h-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-800">Car Shop Admin</span>
            </Link>
          </div>

          {/* User Info */}
          <div className="p-4 border-b bg-blue-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center overflow-hidden">
                {user?.avatar ? (
                  <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-white font-semibold text-sm">
                    {user?.fullName?.charAt(0).toUpperCase() || 'A'}
                  </span>
                )}
              </div>
              <div>
                <div className="font-medium text-gray-800">{user?.fullName || 'Admin User'}</div>
                <div className="text-sm text-gray-600">{user?.role === 'admin' ? 'Administrator' : 'User'}</div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="p-4 flex-grow">
            <ul className="space-y-2">
              {adminMenuItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                      isActive(item.href, item.exact)
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Logout */}
          <div className="p-4 border-t">
            <button
              onClick={logout}
              className="w-full flex items-center gap-3 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Đăng xuất</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </ProtectedRoute>
  );
}