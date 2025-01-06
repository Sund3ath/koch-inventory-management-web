import React, { useState } from 'react';
import { UserPlus } from 'lucide-react';
import type { License } from '../../types';

interface LicenseAssignmentDropZoneProps {
  license: License;
  onAssign: (employeeId: string) => void;
}

export const LicenseAssignmentDropZone: React.FC<LicenseAssignmentDropZoneProps> = ({
  license,
  onAssign
}) => {
  const [isOver, setIsOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsOver(true);
  };

  const handleDragLeave = () => {
    setIsOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsOver(false);

    try {
      const employeeData = e.dataTransfer.getData('employee');
      if (employeeData) {
        const employee = JSON.parse(employeeData);
        onAssign(employee.id);
      }
    } catch (error) {
      console.error('Error handling drop:', error);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`
        border-2 border-dashed rounded-lg p-4 text-center transition-colors
        ${isOver 
          ? 'border-indigo-500 bg-indigo-50' 
          : 'border-gray-300 hover:border-indigo-300'
        }
      `}
    >
      <UserPlus className="mx-auto h-6 w-6 text-gray-400" />
      <p className="mt-2 text-sm text-gray-500">
        {isOver ? 'Drop to assign license' : 'Drag employee here to assign license'}
      </p>
    </div>
  );
};