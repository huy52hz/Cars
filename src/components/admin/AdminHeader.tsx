import React from 'react';

interface AdminHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode; // For buttons like "Add New Car"
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ title, description, actions }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border mb-8 flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
        {description && <p className="mt-2 text-gray-600">{description}</p>}
      </div>
      {actions && (
        <div className="flex-shrink-0">
          {actions}
        </div>
      )}
    </div>
  );
};

export default AdminHeader;