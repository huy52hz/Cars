import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  className,
  ...props
}) => {
  let baseStyles = 'inline-flex items-center justify-center font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  // Size styles
  switch (size) {
    case 'sm':
      baseStyles += ' px-3 py-1.5 text-sm';
      break;
    case 'lg':
      baseStyles += ' px-6 py-3 text-lg';
      break;
    case 'md':
    default:
      baseStyles += ' px-4 py-2 text-base';
      break;
  }

  // Variant styles
  switch (variant) {
    case 'primary':
      baseStyles += ' bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500';
      break;
    case 'secondary':
      baseStyles += ' bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400';
      break;
    case 'danger':
      baseStyles += ' bg-red-600 text-white hover:bg-red-700 focus:ring-red-500';
      break;
    case 'outline':
      baseStyles += ' border border-gray-300 text-gray-700 hover:bg-gray-100 focus:ring-blue-500';
      break;
    case 'ghost':
      baseStyles += ' text-gray-700 hover:bg-gray-100 focus:ring-blue-500';
      break;
  }

  return (
    <button className={`${baseStyles} ${className || ''}`} {...props}>
      {children}
    </button>
  );
};

export default Button;