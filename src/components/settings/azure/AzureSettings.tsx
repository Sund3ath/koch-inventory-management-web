import React from 'react';
import { AzureConnectionForm } from './AzureConnectionForm';
import { SyncScheduler } from './SyncScheduler';
import { AttributeMapper } from './AttributeMapper';
import { SyncLogs } from './SyncLogs';

export const AzureSettings: React.FC = () => {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Azure AD Configuration</h3>
        <AzureConnectionForm />
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Synchronization Settings</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <SyncScheduler />
          </div>
          <div>
            <AttributeMapper />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Synchronization Logs</h3>
        <SyncLogs />
      </div>
    </div>
  );
};