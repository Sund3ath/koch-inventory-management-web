import React from 'react';
import { Users } from 'lucide-react';
import type { License } from '../../types';
import { LicenseAssignmentDropZone } from './LicenseAssignmentDropZone';
import { EmployeeList } from './EmployeeList';
import { useLicenseStore } from '../../stores/licenseStore';

interface LicenseAssignmentAreaProps {
  license: License;
}

export const LicenseAssignmentArea: React.FC<LicenseAssignmentAreaProps> = ({ license }) => {
  const { assignToEmployee, unassignLicense } = useLicenseStore();
  const assignedCount = license.assignments?.filter(a => a.status === 'active').length ?? 0;
  const availableCount = (license.total_quantity ?? 0) - assignedCount;

  return (
    <div className="mt-4 pt-4 border-t border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Users className="w-5 h-5 text-gray-400" />
          <span className="text-sm font-medium text-gray-900">
            License Assignments
          </span>
        </div>
        <span className="text-sm text-gray-500">
          {assignedCount} / {license.total_quantity} used
        </span>
      </div>

      <div className="space-y-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between text-sm text-gray-500 mb-2">
            <span>Available Licenses: {availableCount}</span>
            <span>Total Seats: {license.total_quantity}</span>
          </div>
          
          <LicenseAssignmentDropZone
            license={license}
            onAssign={async (employeeId) => {
              try {
                await assignToEmployee(license.id, employeeId);
              } catch (error) {
                console.error('Failed to assign license:', error);
              }
            }}
          />
        </div>

        <EmployeeList
          assignedEmployees={license.assignments?.map(a => a.employee) ?? []}
          onUnassign={async (employeeId) => {
            const assignment = license.assignments?.find(a => a.employee.id === employeeId);
            if (assignment) {
              try {
                await unassignLicense(assignment.id);
              } catch (error) {
                console.error('Failed to unassign license:', error);
              }
            }
          }}
        />
      </div>
    </div>
  );
};