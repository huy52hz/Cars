// src/components/ui/Modal.tsx
import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react'; // Import icon X cho nút đóng

interface ModalProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string; // Đã là optional ở đây
  footer?: React.ReactNode; // Thêm prop footer để truyền các nút hành động
}

export default function Modal({ children, isOpen, onClose, title, description, footer }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Hiệu ứng đóng/mở modal
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'; // Ngăn cuộn trang chính khi modal mở
      // Thêm class để kích hoạt animation mở
      if (modalRef.current) {
        modalRef.current.classList.add('animate-scale-in');
        modalRef.current.classList.remove('animate-scale-out');
      }
    } else {
      document.body.style.overflow = ''; // Cho phép cuộn lại trang chính
      // Thêm class để kích hoạt animation đóng
      if (modalRef.current) {
        modalRef.current.classList.add('animate-scale-out');
        modalRef.current.classList.remove('animate-scale-in');
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = ''; // Đảm bảo scroll được khôi phục khi unmount
    };
  }, [isOpen, onClose]);

  if (!isOpen && (!modalRef.current || !modalRef.current.classList.contains('animate-scale-out'))) {
    return null; // Chỉ ẩn hoàn toàn khi không mở và không trong quá trình đóng
  }

  // Styles cho animations (Bạn có thể thêm vào global CSS hoặc file CSS module)
  // Ví dụ: trong global.css hoặc một file CSS module riêng
  /*
  @keyframes scaleIn {
    from {
      opacity: 0;
      transform: scale(0.9);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes scaleOut {
    from {
      opacity: 1;
      transform: scale(1);
    }
    to {
      opacity: 0;
      transform: scale(0.9);
    }
  }

  .animate-scale-in {
    animation: scaleIn 0.2s ease-out forwards;
  }

  .animate-scale-out {
    animation: scaleOut 0.2s ease-in forwards;
  }
  */


  return (
    // Overlay: Màu đen mờ, cố định, bao phủ toàn màn hình
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 transition-opacity duration-200">
      {/* Modal content */}
      <div
        ref={modalRef}
        className="bg-white p-6 rounded-lg shadow-2xl w-full max-w-md mx-4 transform transition-transform duration-200 ease-out"
        // onClick={(e) => e.stopPropagation()} // Ngăn chặn click từ children propagation lên overlay
      >
        <div className="flex justify-between items-center mb-4 border-b pb-3">
          <h2 className="text-2xl font-semibold text-gray-800">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Description nếu có */}
        {description && <p className="text-gray-700 text-base mb-4">{description}</p>}

        {/* Nội dung chính của modal (children) */}
        <div className="text-gray-800 text-base mb-6">
          {children}
        </div>

        {/* Footer với các nút hành động */}
        {footer && (
          <div className="flex justify-end space-x-3 pt-4 border-t">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}