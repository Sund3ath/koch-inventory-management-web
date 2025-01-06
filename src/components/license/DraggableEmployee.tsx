import React, { useState } from 'react';
import type { Employee } from '../../types';

interface DraggableEmployeeProps {
  employee: Employee;
}

export const DraggableEmployee: React.FC<DraggableEmployeeProps> = ({ employee }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('employee', employee.id);
    e.currentTarget.classList.add('scale-105', 'shadow-lg');
    setIsDragging(true);
  };

  const handleDragEnd = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('scale-105', 'shadow-lg');
    setIsDragging(false);
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className={`
        flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-200
        cursor-grab active:cursor-grabbing transition-all duration-200
        ${isDragging ? 'opacity-50' : 'hover:shadow-md'}
      `}
    >
      <div className="flex-shrink-0 w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
        <span className="text-sm font-medium text-indigo-700">
          {getInitials(employee.first_name, employee.last_name)}
        </span>
      </div>
      <div>
        <p className="text-sm font-medium text-gray-900">
          {employee.first_name} {employee.last_name}
        </p>
        <p className="text-xs text-gray-500">{employee.department.name}</p>
      </div>
    </div>
  );
};