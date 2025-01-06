import React, { useEffect } from 'react';
import { Header } from '../components/Header';
import { DepartmentTable } from '../components/department/DepartmentTable';
import { useDepartmentStore } from '../stores/departmentStore';

export const DepartmentPage: React.FC = () => {
  const { fetchDepartments } = useDepartmentStore();

  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Departments</h2>
          <p className="mt-1 text-sm text-gray-500">
            View all active departments and their details
          </p>
        </div>
        <DepartmentTable />
      </main>
    </div>
  );
};