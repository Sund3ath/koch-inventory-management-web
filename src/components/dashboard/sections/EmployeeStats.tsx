import React from 'react';
import { Users, UserPlus, Building2 } from 'lucide-react';
import { useDashboardStore } from '../../../stores/dashboardStore';

export const EmployeeStats: React.FC = () => {
  const { metrics } = useDashboardStore();
  const employeeMetrics = metrics.employees;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Employee Statistics</h3>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center mb-2">
            <Users className="h-5 w-5 text-indigo-600 mr-2" />
            <span className="text-sm font-medium text-gray-700">Total Staff</span>
          </div>
          <p className="text-2xl font-semibold text-indigo-600">
            {employeeMetrics.total_employees || 0}
          </p>
        </div>

        <div className="p-4 bg-green-50 rounded-lg">
          <div className="flex items-center mb-2">
            <UserPlus className="h-5 w-5 text-green-600 mr-2" />
            <span className="text-sm font-medium text-gray-700">New Hires</span>
          </div>
          <p className="text-2xl font-semibold text-green-600">
            {employeeMetrics.new_hires || 0}
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">Department Distribution</h4>
          <div className="space-y-2">
            {Object.entries(employeeMetrics.by_department || {}).map(([dept, count]) => (
              <div key={dept} className="flex items-center">
                <Building2 className="h-4 w-4 text-gray-400 mr-2" />
                <span className="text-sm text-gray-600 flex-1">{dept}</span>
                <span className="text-sm font-medium text-gray-900">{count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <div className="flex justify-between items-baseline">
            <span className="text-sm text-gray-500">Device Allocation Ratio</span>
            <span className="text-lg font-medium text-indigo-600">
              {employeeMetrics.device_allocation || 0} per employee
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};