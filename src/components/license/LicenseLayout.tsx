import React from 'react';
import { EmployeeSidebar } from '../employee/EmployeeSidebar';
import { LicenseList } from './LicenseList';
import { License, Employee } from '../../types';

interface LicenseLayoutProps {
  employees: Employee[];
  licenses: License[];
  employeeSearchTerm: string;
  departmentFilter: string;
  departments: Array<{ id: string; name: string; }>;
  onEmployeeSearchChange: (value: string) => void;
  onDepartmentChange: (value: string) => void;
}

export const LicenseLayout: React.FC<LicenseLayoutProps> = ({
  employees,
  licenses,
  employeeSearchTerm,
  departmentFilter,
  departments,
  onEmployeeSearchChange,
  onDepartmentChange,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      <div className="lg:col-span-1">
        <EmployeeSidebar
          employees={employees}
          searchTerm={employeeSearchTerm}
          departmentFilter={departmentFilter}
          departments={departments}
          onSearchChange={onEmployeeSearchChange}
          onDepartmentChange={onDepartmentChange}
        />
      </div>
      <div className="lg:col-span-3">
        <LicenseList licenses={licenses} />
      </div>
    </div>
  );
};