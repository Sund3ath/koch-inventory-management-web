import React from 'react';
import { BulkDeviceUpload } from './BulkDeviceUpload';

export const DeviceSettings: React.FC = () => {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Device Management</h3>
        <BulkDeviceUpload />
      </div>
    </div>
  );
};