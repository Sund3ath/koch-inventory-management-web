import React, { useState, useEffect } from 'react';
import { Plus, Upload, Users } from 'lucide-react';
import { Header } from '../components/Header';
import { DeviceSidebar } from '../components/device/DeviceSidebar';
import { EmployeeCard } from '../components/employee/EmployeeCard';
import { ViewToggle } from '../components/employee/views/ViewToggle';
import { EmployeeListView } from '../components/employee/views/EmployeeListView';
import { EmployeeFilters } from '../components/employee/EmployeeFilters';
import { EmployeeModal } from '../components/employee/modal/EmployeeModal';
import { EmployeeDropZone } from '../components/employee/EmployeeDropZone';
import { useEmployeeStore } from '../stores/employeeStore';
import { useDeviceStore } from '../stores/deviceStore';
import { useDepartmentStore } from '../stores/departmentStore';

export const EmployeePage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBulkUploadOpen, setBulkUploadOpen] = useState(false);
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<string>('name');
  const [employeeStatusFilter, setEmployeeStatusFilter] = useState<string>('all');
  const [deviceStatusFilter, setDeviceStatusFilter] = useState<string>('all');
  const { 
    employees,
    searchTerm,
    departmentFilter,
    setSearchTerm,
    setDepartmentFilter,
    fetchEmployees,
    getFilteredEmployees,
    isLoading: isLoadingEmployees,
    error: employeeError
  } = useEmployeeStore();

  const {
    devices,
    searchTerm: deviceSearchTerm,
    setSearchTerm: setDeviceSearchTerm, 
    fetchDevices,
    getFilteredDevices,
    isLoading: isLoadingDevices,
    error: deviceError
  } = useDeviceStore();

  const { fetchDepartments } = useDepartmentStore();

  useEffect(() => {
    fetchEmployees();
    fetchDevices();
    fetchDepartments();
  }, [fetchEmployees, fetchDevices, fetchDepartments]);

  const filteredEmployees = getFilteredEmployees();
  const filteredDevices = getFilteredDevices();

  if (isLoadingEmployees || isLoadingDevices) {
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

  if (employeeError || deviceError) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-red-600">
            <p>Error loading data: {employeeError || deviceError}</p>
            <button 
              onClick={() => {
                fetchEmployees();
                fetchDevices();
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
      
      <main className="container-fluid px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Employee Directory</h2>
            <p className="mt-1 text-sm text-gray-500">Manage employees and their assigned devices</p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Employee
            </button>
            <button
              onClick={() => setBulkUploadOpen(true)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <Upload className="h-5 w-5 mr-2" />
              Bulk Upload
            </button>
          </div>
        </div>

        <EmployeeFilters
          searchTerm={searchTerm}
          departmentFilter={departmentFilter}
          statusFilter={employeeStatusFilter}
          sortBy={sortBy}
          onSearchChange={setSearchTerm}
          onDepartmentChange={setDepartmentFilter}
          onStatusChange={setEmployeeStatusFilter}
          onSortChange={setSortBy}
        />
        
        <div className="flex justify-end">
          <ViewToggle view={view} onViewChange={setView} />
        </div>

        <div className="mt-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <div className="sticky top-4">
                <DeviceSidebar
                  devices={filteredDevices}
                  searchTerm={deviceSearchTerm}
                  statusFilter={deviceStatusFilter}
                  onSearchChange={setDeviceSearchTerm}
                  onStatusChange={(status) => setDeviceStatusFilter(status)}
                />
              </div>
            </div>
            <div className="lg:col-span-3">
              {view === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredEmployees.map(employee => (
                    <div key={employee.id} className="relative">
                      <EmployeeCard employee={employee} />
                      {employee.status === 'active' && <EmployeeDropZone employee={employee} />}
                    </div>
                  ))}
                  {filteredEmployees.length === 0 && (
                    <div className="col-span-full text-center py-12">
                      <Users className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No employees found</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Try adjusting your search or filter criteria
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <EmployeeListView employees={filteredEmployees} />
              )}
            </div>
          </div>
        </div>

        <EmployeeModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </main>
    </div>
  );
};