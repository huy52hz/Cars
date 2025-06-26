// src/components/ui/Input.tsx
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string | null;
  icon?: React.ReactNode; 
}

const Input: React.FC<InputProps> = ({ label, error, className, id, icon, ...props }) => {
  const inputId = id || props.name || Math.random().toString(36).substring(2, 9);
  return (
    <div className="mb-4">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div className="relative"> {/* THÊM DIV BỌC CHO ICON */}
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
        <input
          id={inputId}
          className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm
            ${error ? 'border-red-500' : ''} 
            ${icon ? 'pl-10' : ''} {/* THÊM PADDING TRÁI NẾU CÓ ICON */}
            ${className || ''}`}
          {...props}
        />
      </div> {/* KẾT THÚC DIV BỌC */}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default Input;