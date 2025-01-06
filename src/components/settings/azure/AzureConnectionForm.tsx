import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const azureConfigSchema = z.object({
  tenantId: z.string().min(1, 'Tenant ID is required'),
  clientId: z.string().min(1, 'Client ID is required'),
  clientSecret: z.string().min(1, 'Client Secret is required'),
  redirectUri: z.string().url('Must be a valid URL'),
  scope: z.string().min(1, 'Scope is required')
});

type AzureConfigData = z.infer<typeof azureConfigSchema>;

export const AzureConnectionForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<AzureConfigData>({
    resolver: zodResolver(azureConfigSchema)
  });

  const onSubmit = async (data: AzureConfigData) => {
    try {
      // TODO: Implement Azure AD connection update
      console.log('Updating Azure AD connection:', data);
    } catch (error) {
      console.error('Error updating Azure AD connection:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow-sm rounded-lg p-6">
      <div className="grid grid-cols-1 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Azure AD Tenant ID
          </label>
          <input
            type="text"
            {...register('tenantId')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.tenantId && (
            <p className="mt-1 text-sm text-red-600">{errors.tenantId.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Client ID
          </label>
          <input
            type="text"
            {...register('clientId')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.clientId && (
            <p className="mt-1 text-sm text-red-600">{errors.clientId.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Client Secret
          </label>
          <input
            type="password"
            {...register('clientSecret')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.clientSecret && (
            <p className="mt-1 text-sm text-red-600">{errors.clientSecret.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Redirect URI
          </label>
          <input
            type="url"
            {...register('redirectUri')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.redirectUri && (
            <p className="mt-1 text-sm text-red-600">{errors.redirectUri.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            API Scope
          </label>
          <input
            type="text"
            {...register('scope')}
            placeholder="e.g., User.Read Directory.Read.All"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.scope && (
            <p className="mt-1 text-sm text-red-600">{errors.scope.message}</p>
          )}
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            {isSubmitting ? 'Saving...' : 'Save Configuration'}
          </button>
        </div>
      </div>
    </form>
  );
};