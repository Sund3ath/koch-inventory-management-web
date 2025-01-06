import React from 'react';
import { DeviceSidebar } from '../device/DeviceSidebar';
import { EmployeeCard } from './EmployeeCard';
import { EmployeeDropZone } from './EmployeeDropZone';
import { Device, Employee } from '../../types';

interface EmployeeLayoutProps {
  devices: Device[];
  employees: Employee[];
  deviceSearchTerm: string;
  statusFilter: string;
  onDeviceSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
}

export const EmployeeLayout: React.FC<EmployeeLayoutProps> = ({
  devices,
  employees,
  deviceSearchTerm,
  statusFilter,
  onDeviceSearchChange,
  onStatusChange,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      <div className="lg:col-span-1">
        <div className="sticky top-4">
          <DeviceSidebar
            devices={devices}
            searchTerm={deviceSearchTerm}
            statusFilter={statusFilter}
            onSearchChange={onDeviceSearchChange}
            onStatusChange={onStatusChange}
          />
        </div>
      </div>
      <div className="lg:col-span-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {employees.map(employee => (
            <div key={employee.id} className="relative">
              <EmployeeCard employee={employee} />
              {employee.status === 'active' && <EmployeeDropZone employee={employee} />}
            </div>
          ))}
          
          {employees.length === 0 && (
            <div className="col-span-2 text-center py-12">
              <p className="text-gray-500 text-lg">No employees found matching your criteria</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};