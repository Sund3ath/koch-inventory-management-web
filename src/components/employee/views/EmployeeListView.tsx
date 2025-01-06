import React from 'react';
import { Mail, Briefcase, Monitor, Trash2 } from 'lucide-react';
import type { Employee } from '../../../types';
import { useDeviceStore } from '../../../stores/deviceStore';
import { formatDate } from '../../../utils/formatters';

interface EmployeeListViewProps {
  employees: Employee[];
}

export const EmployeeListView: React.FC<EmployeeListViewProps> = ({ employees }) => {
  const { devices } = useDeviceStore();

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Employee
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Department
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Position
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Devices
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {employees.map((employee) => {
            const isActive = employee.status === 'active';
            const assignedDevices = devices.filter(device => 
              device.assignments?.some(assignment => 
                assignment.employee.id === employee.id && 
                device.status === 'assigned'
              )
            );

            return (
              <tr 
                key={employee.id} 
                className={`hover:bg-gray-50 ${isActive ? 'relative group' : ''}`}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-indigo-700">
                        {`${employee.first_name[0]}${employee.last_name[0]}`}
                      </span>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {employee.first_name} {employee.last_name}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Mail className="h-4 w-4 mr-1" />
                        {employee.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-900">
                    <Briefcase className="h-4 w-4 mr-2" />
                    {employee.department.name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {employee.position}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    employee.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {employee.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {isActive ? (
                    <div 
                      className={`
                        p-2 rounded border-2 border-dashed transition-all duration-200
                        ${isActive ? 'border-gray-300 hover:border-indigo-300 group-hover:bg-gray-50' : ''}
                      `}
                      onDragOver={(e) => {
                        e.preventDefault();
                        e.currentTarget.classList.add('border-indigo-500', 'bg-indigo-50');
                      }}
                      onDragLeave={(e) => {
                        e.currentTarget.classList.remove('border-indigo-500', 'bg-indigo-50');
                      }}
                      onDrop={async (e) => {
                        e.preventDefault();
                        e.currentTarget.classList.remove('border-indigo-500', 'bg-indigo-50');
                        try {
                          let deviceData = e.dataTransfer.getData('text/plain');
                          if (!deviceData) {
                            deviceData = e.dataTransfer.getData('application/json');
                          }
                          if (deviceData) {
                            const device = JSON.parse(deviceData);
                            await useDeviceStore.getState().assignDevice(device.id, employee.id);
                          }
                        } catch (error) {
                          console.error('Error assigning device:', error);
                        }
                      }}
                    >
                      <div className="flex items-center text-sm text-gray-500">
                        <Monitor className="h-4 w-4 mr-2" />
                        {assignedDevices.length} devices
                      </div>
                      {assignedDevices.length > 0 && (
                        <div className="mt-1 text-xs text-gray-400">
                          {assignedDevices.map(device => (
                            <div key={device.id} className="flex items-center justify-between">
                              <span className="truncate">{device.brand} {device.model}</span>
                              <button
                                onClick={() => useDeviceStore.getState().unassignDevice(device.id)}
                                className="text-red-600 hover:text-red-700 p-1 rounded hover:bg-red-50"
                                title="Unassign device"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500">
                      <Monitor className="h-4 w-4 mr-2 inline" />
                      {assignedDevices.length} devices
                    </div>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};