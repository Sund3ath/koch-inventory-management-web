import React, { useState } from 'react';
import { Mail, Briefcase, Monitor, Edit2, Trash2 } from 'lucide-react';
import { Employee } from '../../types';
import { useDeviceStore } from '../../stores/deviceStore';
import { EditEmployeeModal } from './modal/EditEmployeeModal';

interface EmployeeCardProps {
  employee: Employee;
}

export const EmployeeCard: React.FC<EmployeeCardProps> = ({ employee }) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const { devices } = useDeviceStore();
  const assignedDevices = devices.filter(device => 
    device.assignments?.some(assignment => 
      assignment.employee.id === employee.id && 
      device.status === 'assigned'
    )
  );

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow relative">
        <div className="flex items-center justify-between mb-4">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <div className="bg-indigo-100 rounded-full p-3 w-12 h-12 flex items-center justify-center">
              <span className="text-xl font-medium text-indigo-700">
                {getInitials(employee.first_name, employee.last_name)}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-900">
                {employee.first_name} {employee.last_name}
              </h3>
              <p className="text-sm text-gray-500 truncate">{employee.position}</p>
            </div>
          </div>
          <div className="absolute top-2 right-2">
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
              employee.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
            }`}>
              {employee.status}
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div className="flex items-center text-gray-600">
            <Mail className="w-4 h-4 mr-2" />
            <span className="text-sm truncate">{employee.email}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Briefcase className="w-4 h-4 mr-2" />
            <span className="text-sm">{employee.department.name}</span>
          </div>
        </div>

        <div className="border-t pt-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">
            Assigned Devices ({assignedDevices.length})
          </h4>
          <div className="space-y-2">
            {assignedDevices.length === 0 ? (
              <p className="text-sm text-gray-500">No devices assigned</p>
            ) : (
              assignedDevices.map(device => (
                <div key={device.id} className="flex items-center justify-between text-sm bg-gray-50 p-2 rounded">
                  <span className="text-gray-600">
                    {device.brand} {device.model}
                  </span>
                  <button
                    onClick={() => useDeviceStore.getState().unassignDevice(device.id)}
                    className="text-red-600 hover:text-red-700 p-1 rounded-full hover:bg-red-50"
                    title="Unassign device"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <EditEmployeeModal
        employee={employee}
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
      />
    </>
  );
};