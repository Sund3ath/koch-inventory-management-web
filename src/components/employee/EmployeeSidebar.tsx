import React from 'react';
import { Search, Filter, Mail, Briefcase } from 'lucide-react';
import type { Employee } from '../../types';

interface EmployeeSidebarProps {
  employees: Employee[];
  searchTerm: string;
  departmentFilter: string;
  onSearchChange: (value: string) => void;
  onDepartmentChange: (value: string) => void;
  departments: Array<{ id: string; name: string; }>;
}

export const EmployeeSidebar: React.FC<EmployeeSidebarProps> = ({
  employees,
  searchTerm,
  departmentFilter,
  onSearchChange,
  onDepartmentChange,
  departments
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Available Employees</h2>
      
      <div className="space-y-4 mb-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search employees..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Filter className="h-5 w-5 text-gray-400" />
          <select
            className="block w-full pl-3 pr-10 py-2 text-sm border-gray-300 rounded-md"
            value={departmentFilter}
            onChange={(e) => onDepartmentChange(e.target.value)}
          >
            <option value="all">All Departments</option>
            {departments.map(dept => (
              <option key={dept.id} value={dept.name}>{dept.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-2 max-h-[calc(100vh-280px)] overflow-y-auto">
        {employees.map((employee) => (
          <EmployeeListItem key={employee.id} employee={employee} />
        ))}
        
        {employees.length === 0 && (
          <p className="text-center text-sm text-gray-500 py-4">
            No employees found
          </p>
        )}
      </div>
    </div>
  );
};

const EmployeeListItem: React.FC<{ employee: Employee }> = ({ employee }) => {
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('employee', JSON.stringify(employee));
    e.dataTransfer.setData('text/plain', JSON.stringify(employee));
    e.dataTransfer.setData('application/json', JSON.stringify(employee));
    e.dataTransfer.setData('application/employee', JSON.stringify(employee));
    e.currentTarget.classList.add('opacity-50');
  };

  const handleDragEnd = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('opacity-50');
  };

  return (
    <div 
      draggable
      data-employee-id={employee.id}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className={`
        flex items-center p-3 bg-white rounded-lg border border-gray-200 
        cursor-grab active:cursor-grabbing transition-all duration-200 
        hover:shadow-md hover:border-indigo-300
      `}
    >
      <div className="flex-shrink-0 w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
        <span className="text-sm font-medium text-indigo-700">
          {getInitials(employee.first_name, employee.last_name)}
        </span>
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-gray-900">
          {employee.first_name} {employee.last_name}
        </p>
        <div className="mt-1 text-xs text-gray-500 space-y-1">
          <div className="flex items-center">
            <Mail className="w-3 h-3 mr-1" />
            <span className="truncate">{employee.email}</span>
          </div>
          <div className="flex items-center">
            <Briefcase className="w-3 h-3 mr-1" />
            <span className="truncate">{employee.department.name}</span>
          </div>
        </div>
      </div>
    </div>
  );
};