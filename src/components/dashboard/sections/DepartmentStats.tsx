import React from 'react';
import { Building2, Users, Monitor } from 'lucide-react';
import { useDashboardStore } from '../../../stores/dashboardStore';

export const DepartmentStats: React.FC = () => {
  const { metrics } = useDashboardStore();
  const departmentMetrics = metrics.departments;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Department Overview</h3>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center mb-2">
            <Building2 className="h-5 w-5 text-indigo-600 mr-2" />
            <span className="text-sm font-medium text-gray-700">Total Departments</span>
          </div>
          <p className="text-2xl font-semibold text-indigo-600">
            {departmentMetrics.total_departments || 0}
          </p>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center mb-2">
            <Users className="h-5 w-5 text-indigo-600 mr-2" />
            <span className="text-sm font-medium text-gray-700">Avg Team Size</span>
          </div>
          <p className="text-2xl font-semibold text-indigo-600">
            {departmentMetrics.avg_team_size || 0}
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">Device Distribution</h4>
          <div className="space-y-2">
            {Object.entries(departmentMetrics.device_distribution || {}).map(([dept, count]) => (
              <div key={dept} className="flex items-center">
                <Monitor className="h-4 w-4 text-gray-400 mr-2" />
                <span className="text-sm text-gray-600 flex-1">{dept}</span>
                <span className="text-sm font-medium text-gray-900">{count} devices</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};