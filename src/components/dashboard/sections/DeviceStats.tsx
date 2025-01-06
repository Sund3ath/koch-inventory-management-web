import React from 'react';
import { Monitor, Smartphone, Tablet, Computer, Laptop, Package } from 'lucide-react';
import { useDashboardStore } from '../../../stores/dashboardStore';

export const DeviceStats: React.FC = () => {
  const { metrics } = useDashboardStore();
  const deviceMetrics = metrics.devices;

  const getDeviceIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'laptop': return Laptop;
      case 'phone': return Smartphone;
      case 'tablet': return Tablet;
      case 'monitor': return Monitor;
      case 'workstation': return Computer;
      default: return Package;
    }
  };

  const deviceTypes = Object.entries(deviceMetrics.by_type || {}).map(([type, count]) => ({
    name: type.charAt(0).toUpperCase() + type.slice(1),
    icon: getDeviceIcon(type),
    count: count || 0
  }));

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Device Overview</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {deviceTypes.map(({ name, icon: Icon, count }) => (
          <div key={name} className="flex items-center p-3 bg-gray-50 rounded-lg">
            <Icon className="h-5 w-5 text-indigo-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-900">{name}</p>
              <p className="text-lg font-semibold text-indigo-600">{count}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Status Distribution</h4>
        <div className="space-y-2">
          {Object.entries(deviceMetrics.by_status || {}).map(([status, count]) => (
            <div key={status} className="flex items-center">
              <span className="text-sm text-gray-600 w-24">{status}</span>
              <div className="flex-1 ml-2">
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 rounded-full"
                    style={{
                      width: `${(count as number / deviceMetrics.total_devices) * 100}%`
                    }}
                  />
                </div>
              </div>
              <span className="ml-2 text-sm text-gray-600">{count}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-500">Recent Assignments</span>
          <span className="font-medium text-indigo-600">
            {deviceMetrics.recent_assignments || 0}
          </span>
        </div>
      </div>
    </div>
  );
};