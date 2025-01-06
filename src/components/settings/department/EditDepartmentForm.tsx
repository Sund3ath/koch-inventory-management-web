import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDepartmentStore } from '../../../stores/departmentStore';
import { useEmployeeStore } from '../../../stores/employeeStore';

const departmentSchema = z.object({
  name: z.string().min(1, 'Department name is required'),
  manager_id: z.string().uuid('Invalid manager ID'),
  parent_id: z.string().uuid('Invalid parent department ID').optional().nullable(),
  description: z.string().optional(),
  cost_center: z.string().optional(),
  location: z.string().optional(),
  status: z.enum(['active', 'inactive'])
});

type DepartmentFormData = z.infer<typeof departmentSchema>;

interface EditDepartmentFormProps {
  department: {
    id: string;
    name: string;
    manager?: {
      employee?: {
        id: string;
      };
    };
    status: 'active' | 'inactive';
  };
  onClose: () => void;
}

export const EditDepartmentForm: React.FC<EditDepartmentFormProps> = ({ department, onClose }) => {
  const { departments, updateDepartment } = useDepartmentStore();
  const { employees, fetchEmployees } = useEmployeeStore();
  
  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<DepartmentFormData>({
    resolver: zodResolver(departmentSchema),
    defaultValues: {
      name: department.name,
      manager_id: department.manager?.employee?.id || '',
      status: department.status
    }
  });

  const activeEmployees = employees.filter(emp => emp.status === 'active');
  const otherDepartments = departments.filter(dept => dept.id !== department.id);

  const onSubmit = async (data: DepartmentFormData) => {
    try {
      await updateDepartment(department.id, data);
      onClose();
    } catch (error) {
      console.error('Error updating department:', error);
    }
  };

  return (
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
            {...register('manager_id')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="">Select manager</option>
            {activeEmployees.map(employee => (
              <option key={employee.id} value={employee.id}>
                {employee.first_name} {employee.last_name} - {employee.department.name}
              </option>
            ))}
          </select>
          {errors.manager_id && (
            <p className="mt-1 text-sm text-red-600">{errors.manager_id.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Parent Department
          </label>
          <select
            {...register('parent_id')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="">No parent department</option>
            {otherDepartments.map(dept => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>
          {errors.parent_id && (
            <p className="mt-1 text-sm text-red-600">{errors.parent_id.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Cost Center
          </label>
          <input
            type="text"
            {...register('cost_center')}
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

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            {...register('status')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
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
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
};