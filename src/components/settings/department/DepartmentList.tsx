import React, { useState } from 'react';
import { Search, Edit2, Trash2, Users } from 'lucide-react';
import { useDepartmentStore } from '../../../stores/departmentStore';
import { EditDepartmentModal } from './EditDepartmentModal';

export const DepartmentList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingDepartment, setEditingDepartment] = useState<any>(null);
  const { departments, deleteDepartment } = useDepartmentStore();

  const filteredDepartments = departments.filter(dept =>
    dept.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this department?')) {
      try {
        await deleteDepartment(id);
      } catch (error) {
        console.error('Error deleting department:', error);
      }
    }
  };

  return (
    <div className="bg-white shadow-sm rounded-lg p-6">
      <div className="mb-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search departments..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Department
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Manager
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredDepartments.map((dept) => (
              <tr key={dept.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {dept.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      <Users className="h-4 w-4 inline mr-1" />
                      {dept.employees.count} employees
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {dept.manager?.employee ? 
                    `${dept.manager.employee.first_name} ${dept.manager.employee.last_name}` :
                    'No manager assigned'
                  }
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    dept.status === 'active' 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {dept.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button 
                    onClick={() => setEditingDepartment(dept)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(dept.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {editingDepartment && (
        <EditDepartmentModal
          department={editingDepartment}
          isOpen={true}
          onClose={() => setEditingDepartment(null)}
        />
      )}
    </div>
  );
};