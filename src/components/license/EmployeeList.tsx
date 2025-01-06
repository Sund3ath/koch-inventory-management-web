import React from 'react';
import { X } from 'lucide-react';
import type { Employee } from '../../types';
import { formatDate } from '../../utils/formatters';

interface EmployeeListProps {
  assignedEmployees: Array<{
    id: string;
    status: string;
    first_name: string;
    last_name: string;
    department: {
      name: string;
    };
  }>;
  onUnassign: (employeeId: string) => void;
}

export const EmployeeList: React.FC<EmployeeListProps> = ({
  assignedEmployees,
  onUnassign
}) => {
  const activeAssignments = assignedEmployees.filter(emp => emp.status === 'active');


  if (activeAssignments.length === 0) {
    return (
      <p className="text-sm text-gray-500 text-center py-4">
        No employees assigned
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {activeAssignments.map(employee => (
        <div
          key={employee.id}
          className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm"
        >
          <div>
            <div className="text-sm font-medium text-gray-900">
              {employee.first_name} {employee.last_name}
            </div>
            <div className="text-sm text-gray-500">
              {employee.department.name}
            </div>
          </div>
          <button
            onClick={() => onUnassign(employee.id)}
            className="p-1 text-gray-400 hover:text-red-500 rounded-full hover:bg-gray-100"
            title="Remove assignment"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};