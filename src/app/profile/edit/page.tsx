// src/app/profile/edit/page.tsx
'use client';

import React from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import EditProfileForm from '@/components/profile/EditProfileForm';
import Link from 'next/link';

// Import icon từ Heroicons
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

const EditProfilePage = () => {
  return (
    <ProtectedRoute>
      <div className="bg-gray-50 py-8 min-h-screen flex items-center justify-center"> {/* Thêm flex, items-center, justify-center */}
        <div className="max-w-2xl w-full mx-auto bg-white shadow-xl rounded-xl p-10 sm:p-12 border border-gray-100"> {/* Tăng max-w, shadow, rounded, padding */}
          <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center tracking-tight">
            Chỉnh sửa Hồ sơ cá nhân
          </h1>

          <EditProfileForm />

          {/* Nút "Quay lại Hồ sơ" */}
          <div className="mt-10 text-center">
            <Link
              href="/profile"
              className="inline-flex items-center px-8 py-3 border border-transparent text-lg font-medium rounded-lg shadow-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
            >
              <ArrowLeftIcon className="h-6 w-6 mr-3 text-blue-600" /> {/* Tăng kích thước icon */}
              Quay lại Hồ sơ
            </Link>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default EditProfilePage;