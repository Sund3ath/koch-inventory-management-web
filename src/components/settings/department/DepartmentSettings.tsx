import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { DepartmentList } from './DepartmentList';
import { DepartmentForm } from './DepartmentForm';
import { DepartmentHierarchy } from './DepartmentHierarchy';
import { useDepartmentStore } from '../../../stores/departmentStore';

export const DepartmentSettings: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { fetchDepartments } = useDepartmentStore();

  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Department Management</h3>
        <button
          onClick={() => setIsFormOpen(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Department
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <DepartmentList />
        </div>
        <div>
          <DepartmentHierarchy />
        </div>
      </div>

      {isFormOpen && (
        <DepartmentForm onClose={() => setIsFormOpen(false)} />
      )}
    </div>
  );
};