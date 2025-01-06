import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X } from 'lucide-react';
import { useDepartmentStore } from '../../../stores/departmentStore';
import { useEmployeeStore } from '../../../stores/employeeStore';

const departmentSchema = z.object({
  name: z.string().min(1, 'Department name is required'),
  managerId: z.string().uuid('Invalid manager ID'),
  parentDepartmentId: z.string().uuid('Invalid parent department ID').optional().nullable(),
  description: z.string().optional(),
  costCenter: z.string().optional(),
  location: z.string().optional()
});

type DepartmentFormData = z.infer<typeof departmentSchema>;

interface DepartmentFormProps {
  onClose: () => void;
}

export const DepartmentForm: React.FC<DepartmentFormProps> = ({ onClose }) => {
  const { createDepartment } = useDepartmentStore();
  const { employees, fetchEmployees } = useEmployeeStore();
  
  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<DepartmentFormData>({
    resolver: zodResolver(departmentSchema)
  });

  const onSubmit = async (data: DepartmentFormData) => {
    try {
      await createDepartment(data);
      onClose();
    } catch (error) {
      console.error('Error creating department:', error);
    }
  };

  const activeEmployees = employees.filter(emp => emp.status === 'active');

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-25" onClick={onClose} />
        
        <div className="relative w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Add New Department</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Department Name
                </label>
                <input
                  type="text"
                  {...register('name')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Manager
                </label>
                <select
                  {...register('managerId')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="">Select manager</option>
                  {activeEmployees.map(employee => (
                    <option key={employee.id} value={employee.id}>
                      {employee.first_name} {employee.last_name} - {employee.department.name}
                    </option>
                  ))}
                </select>
                {errors.managerId && (
                  <p className="mt-1 text-sm text-red-600">{errors.managerId.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Cost Center
                </label>
                <input
                  type="text"
                  {...register('costCenter')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Location
                </label>
                <input
                  type="text"
                  {...register('location')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  {...register('description')}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
              >
                {isSubmitting ? 'Adding...' : 'Add Department'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};