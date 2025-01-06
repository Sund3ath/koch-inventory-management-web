import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Header } from '../components/Header';
import { LicenseFilters } from '../components/license/LicenseFilters';
import { LicenseLayout } from '../components/license/LicenseLayout';
import { LicenseModal } from '../components/license/modal/LicenseModal';
import { useLicenseStore } from '../stores/licenseStore';
import { useEmployeeStore } from '../stores/employeeStore';

export const LicensePage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { 
    searchTerm,
    statusFilter,
    typeFilter,
    setSearchTerm,
    setStatusFilter,
    setTypeFilter,
    fetchLicenses,
    getFilteredLicenses,
    isLoading: isLoadingLicenses,
    error: licenseError
  } = useLicenseStore();

  const {
    employees,
    departments,
    searchTerm: employeeSearchTerm,
    departmentFilter,
    setSearchTerm: setEmployeeSearchTerm,
    setDepartmentFilter,
    fetchEmployees,
    fetchDepartments,
    getFilteredEmployees,
    isLoading: isLoadingEmployees,
    error: employeeError
  } = useEmployeeStore();

  useEffect(() => {
    fetchLicenses();
    fetchEmployees();
    fetchDepartments();
  }, [fetchLicenses, fetchEmployees, fetchDepartments]);

  const filteredLicenses = getFilteredLicenses();
  const filteredEmployees = getFilteredEmployees();

  if (isLoadingLicenses || isLoadingEmployees) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="space-y-3">
              <div className="h-48 bg-gray-200 rounded"></div>
              <div className="h-48 bg-gray-200 rounded"></div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (licenseError || employeeError) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-red-600">
            <p>Error loading data: {licenseError || employeeError}</p>
            <button 
              onClick={() => {
                fetchLicenses();
                fetchEmployees();
              }}
              className="mt-2 text-sm text-indigo-600 hover:text-indigo-500"
            >
              Try again
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container-fluid px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">License Management</h2>
            <p className="mt-1 text-sm text-gray-500">Track and manage software and hardware licenses</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add License
          </button>
        </div>

        <LicenseFilters
          searchTerm={searchTerm}
          statusFilter={statusFilter}
          typeFilter={typeFilter}
          onSearchChange={setSearchTerm}
          onStatusChange={setStatusFilter}
          onTypeChange={setTypeFilter}
        />

        <div className="mt-8">
          <LicenseLayout
            employees={filteredEmployees}
            licenses={filteredLicenses}
            employeeSearchTerm={employeeSearchTerm}
            departmentFilter={departmentFilter}
            departments={departments}
            onEmployeeSearchChange={setEmployeeSearchTerm}
            onDepartmentChange={setDepartmentFilter}
          />
        </div>

        <LicenseModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </main>
    </div>
  );
};