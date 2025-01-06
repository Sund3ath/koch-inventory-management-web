import React from 'react';
import { useEmployeeStore } from '../../stores/employeeStore';
import { DraggableEmployee } from './DraggableEmployee';
import { Search } from 'lucide-react';

export const EmployeePool: React.FC = () => {
  const { employees, searchTerm, setSearchTerm, getFilteredEmployees } = useEmployeeStore();
  const filteredEmployees = getFilteredEmployees();

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Available Employees</h2>
      
      <div className="mb-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search employees..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
      </div>

      <div className="space-y-2 max-h-[calc(100vh-20rem)] overflow-y-auto">
        {filteredEmployees.map(employee => (
          <DraggableEmployee key={employee.id} employee={employee} />
        ))}
        
        {filteredEmployees.length === 0 && (
          <p className="text-center text-gray-500 py-4">
            No employees found matching your criteria
          </p>
        )}
      </div>
    </div>
  );
};