import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Search } from 'lucide-react';
import { departments } from '../../../utils/constants';
import { ManagerSearch } from './ManagerSearch';
import { ActiveDirectorySearch } from './ActiveDirectorySearch';
import type { Employee, Manager } from '../../../types';

interface EmployeeFormData extends Omit<Employee, 'id'> {
  firstName: string;
  lastName: string;
  startDate: string;
  status: 'active' | 'inactive';
  managerId?: string;
}

interface SingleEmployeeFormProps {
  onClose: () => void;
}

export const SingleEmployeeForm: React.FC<SingleEmployeeFormProps> = ({ onClose }) => {
  const [creationType, setCreationType] = useState<'ad' | 'manual'>('ad');
  const [selectedManager, setSelectedManager] = useState<Manager | null>(null);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<EmployeeFormData>();

  const onSubmit = async (data: EmployeeFormData) => {
    try {
      const employeeData = {
        ...data,
        name: `${data.firstName} ${data.lastName}`,
        managerId: selectedManager?.id,
      };
      // TODO: Implement employee creation logic
      console.log('Creating employee:', employeeData);
      onClose();
    } catch (error) {
      console.error('Error creating employee:', error);
    }
  };

  const handleADSelect = (employee: any) => {
    setValue('firstName', employee.firstName);
    setValue('lastName', employee.lastName);
    setValue('email', employee.email);
    setValue('department', employee.department);
    setValue('position', employee.position);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="mb-6">
        <div className="flex space-x-4">
          <button
            type="button"
            onClick={() => setCreationType('ad')}
            className={`px-4 py-2 text-sm font-medium rounded-md ${
              creationType === 'ad'
                ? 'bg-indigo-100 text-indigo-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Active Directory Sync
          </button>
          <button
            type="button"
            onClick={() => setCreationType('manual')}
            className={`px-4 py-2 text-sm font-medium rounded-md ${
              creationType === 'manual'
                ? 'bg-indigo-100 text-indigo-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Manual Creation
          </button>
        </div>
      </div>

      {creationType === 'ad' && (
        <div className="mb-6">
          <ActiveDirectorySearch onSelect={handleADSelect} />
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            First Name
          </label>
          <input
            type="text"
            {...register('firstName', { required: 'First name is required' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.firstName && (
            <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Last Name
          </label>
          <input
            type="text"
            {...register('lastName', { required: 'Last name is required' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.lastName && (
            <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            {...register('email', { 
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address'
              }
            })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Department
          </label>
          <select
            {...register('department', { required: 'Department is required' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="">Select department</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
          {errors.department && (
            <p className="mt-1 text-sm text-red-600">{errors.department.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Position
          </label>
          <input
            type="text"
            {...register('position', { required: 'Position is required' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.position && (
            <p className="mt-1 text-sm text-red-600">{errors.position.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Start Date
          </label>
          <input
            type="date"
            {...register('startDate', { required: 'Start date is required' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.startDate && (
            <p className="mt-1 text-sm text-red-600">{errors.startDate.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Manager
          </label>
          <ManagerSearch
            onSelect={setSelectedManager}
            selectedManager={selectedManager}
          />
        </div>

        {creationType === 'manual' && (
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              {...register('status', { required: 'Status is required' })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            {errors.status && (
              <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
            )}
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onClose}
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          {isSubmitting ? 'Creating...' : 'Create Employee'}
        </button>
      </div>
    </form>
  );
};