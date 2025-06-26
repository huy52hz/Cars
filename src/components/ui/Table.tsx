import React from 'react';

interface Column<T> {
  key: keyof T | 'actions' | string; // 'actions' for action column, string for dynamic keys
  header: string;
  render?: (item: T) => React.ReactNode; // Custom render function for cells
  className?: string; // Tailwind classes for the th and td
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  emptyMessage?: string;
  className?: string;
}

const Table = <T extends Record<string, any>>({ data, columns, emptyMessage = 'Không có dữ liệu', className }: TableProps<T>) => {
  return (
    <div className={`overflow-x-auto rounded-lg border border-gray-200 shadow-sm ${className || ''}`}>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key.toString()}
                scope="col"
                className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${column.className || ''}`}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-6 py-4 whitespace-nowrap text-center text-gray-500">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((item, rowIndex) => (
              <tr key={item.id || rowIndex}> {/* Assume item has an 'id' or use row index */}
                {columns.map((column) => (
                  <td key={column.key.toString()} className={`px-6 py-4 whitespace-nowrap text-sm ${column.className || ''}`}>
                    {column.render ? column.render(item) : item[column.key as keyof T]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;