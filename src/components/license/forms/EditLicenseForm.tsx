import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useLicenseStore } from '../../../stores/licenseStore';
import type { License } from '../../../types';

const licenseSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  vendor: z.string().min(1, 'Vendor is required'),
  type: z.string().min(1, 'License type is required'),
  key: z.string().min(1, 'License key is required'),
  total_quantity: z.number().min(1, 'Quantity must be at least 1'),
  purchase_date: z.string().min(1, 'Purchase date is required'),
  expiration_date: z.string().optional(),
  cost: z.number().min(0, 'Cost must be non-negative'),
  notes: z.string().optional()
});

type LicenseFormData = z.infer<typeof licenseSchema>;

interface EditLicenseFormProps {
  license: License;
  onClose: () => void;
}

export const EditLicenseForm: React.FC<EditLicenseFormProps> = ({ license, onClose }) => {
  const { updateLicense } = useLicenseStore();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LicenseFormData>({
    resolver: zodResolver(licenseSchema),
    defaultValues: {
      name: license.name,
      vendor: license.vendor,
      type: license.type,
      key: license.key,
      total_quantity: license.total_quantity,
      purchase_date: license.purchase_date,
      expiration_date: license.expiration_date || undefined,
      cost: license.cost,
      notes: license.notes || undefined
    }
  });

  const onSubmit = async (data: LicenseFormData) => {
    try {
      await updateLicense(license.id, data);
      onClose();
    } catch (error) {
      console.error('Error updating license:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            License Name
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
            Vendor
          </label>
          <input
            type="text"
            {...register('vendor')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.vendor && (
            <p className="mt-1 text-sm text-red-600">{errors.vendor.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            License Type
          </label>
          <input
            type="text"
            {...register('type')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.type && (
            <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            License Key
          </label>
          <input
            type="text"
            {...register('key')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.key && (
            <p className="mt-1 text-sm text-red-600">{errors.key.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Total Quantity
          </label>
          <input
            type="number"
            min="1"
            {...register('total_quantity', { valueAsNumber: true })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.total_quantity && (
            <p className="mt-1 text-sm text-red-600">{errors.total_quantity.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Cost
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            {...register('cost', { valueAsNumber: true })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.cost && (
            <p className="mt-1 text-sm text-red-600">{errors.cost.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Purchase Date
          </label>
          <input
            type="date"
            {...register('purchase_date')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.purchase_date && (
            <p className="mt-1 text-sm text-red-600">{errors.purchase_date.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Expiration Date
          </label>
          <input
            type="date"
            {...register('expiration_date')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.expiration_date && (
            <p className="mt-1 text-sm text-red-600">{errors.expiration_date.message}</p>
          )}
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            Notes
          </label>
          <textarea
            {...register('notes')}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.notes && (
            <p className="mt-1 text-sm text-red-600">{errors.notes.message}</p>
          )}
        </div>
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
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
};