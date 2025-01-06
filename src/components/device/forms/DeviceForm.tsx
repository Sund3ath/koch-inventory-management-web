import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDeviceStore } from '../../../stores/deviceStore';
import { deviceTypes } from '../../../utils/constants';

const deviceSchema = z.object({
  type: z.enum(['laptop', 'phone', 'tablet', 'monitor', 'other'], {
    required_error: 'Device type is required'
  }),
  brand: z.string().min(1, 'Brand is required'),
  model: z.string().min(1, 'Model is required'),
  serialNumber: z.string().min(1, 'Serial number is required'),
  purchaseDate: z.string().min(1, 'Purchase date is required'),
  status: z.enum(['available', 'assigned', 'maintenance', 'retired'], {
    required_error: 'Status is required'
  }),
  notes: z.string().optional()
});

type DeviceFormData = z.infer<typeof deviceSchema>;

interface DeviceFormProps {
  onClose: () => void;
}

export const DeviceForm: React.FC<DeviceFormProps> = ({ onClose }) => {
  const { createDevice } = useDeviceStore();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<DeviceFormData>({
    resolver: zodResolver(deviceSchema),
    defaultValues: {
      status: 'available'
    }
  });

  const onSubmit = async (data: DeviceFormData) => {
    try {
      await createDevice({
        type: data.type,
        brand: data.brand,
        model: data.model,
        serial_number: data.serialNumber,
        purchase_date: data.purchaseDate,
        status: data.status,
        notes: data.notes
      });
      onClose();
    } catch (error) {
      console.error('Error creating device:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Device Type
          </label>
          <select
            {...register('type')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="">Select type</option>
            {deviceTypes.map(type => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
          {errors.type && (
            <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Brand
          </label>
          <input
            type="text"
            {...register('brand')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.brand && (
            <p className="mt-1 text-sm text-red-600">{errors.brand.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Model
          </label>
          <input
            type="text"
            {...register('model')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.model && (
            <p className="mt-1 text-sm text-red-600">{errors.model.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Serial Number
          </label>
          <input
            type="text"
            {...register('serialNumber')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.serialNumber && (
            <p className="mt-1 text-sm text-red-600">{errors.serialNumber.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Purchase Date
          </label>
          <input
            type="date"
            {...register('purchaseDate')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.purchaseDate && (
            <p className="mt-1 text-sm text-red-600">{errors.purchaseDate.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            {...register('status')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="available">Available</option>
            <option value="maintenance">Maintenance</option>
            <option value="retired">Retired</option>
          </select>
          {errors.status && (
            <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
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
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          {isSubmitting ? 'Creating...' : 'Create Device'}
        </button>
      </div>
    </form>
  );
};