import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Search, X } from 'lucide-react';
import { License, LicenseAssignment } from '../../types/license';
import { useLicenseStore } from '../../stores/licenseStore';

interface LicenseAssignmentModalProps {
  license: License;
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  userId: string;
  expiresAt?: string;
}

export const LicenseAssignmentModal: React.FC<LicenseAssignmentModalProps> = ({
  license,
  isOpen,
  onClose
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { assignLicense } = useLicenseStore();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    try {
      const assignment: LicenseAssignment = {
        id: crypto.randomUUID(),
        licenseId: license.id,
        userId: data.userId,
        assignedBy: 'current-user-id', // Replace with actual user ID
        assignedAt: new Date().toISOString(),
        expiresAt: data.expiresAt,
        status: 'active'
      };

      await assignLicense(assignment);
      onClose();
    } catch (error) {
      console.error('Error assigning license:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-25" onClick={onClose} />
        
        <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Assign License</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Search Users
              </label>
              <div className="relative mt-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Search by name or email..."
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                User ID
              </label>
              <input
                type="text"
                {...register('userId', { required: 'User ID is required' })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
              {errors.userId && (
                <p className="mt-1 text-sm text-red-600">{errors.userId.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Expiration Date
              </label>
              <input
                type="date"
                {...register('expiresAt')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
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
                {isSubmitting ? 'Assigning...' : 'Assign License'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};