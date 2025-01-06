import React from 'react';
import { LicenseCard } from './LicenseCard';
import type { License } from '../../types';

interface LicenseListProps {
  licenses: License[];
}

export const LicenseList: React.FC<LicenseListProps> = ({ licenses }) => {
  if (licenses.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No licenses found matching your criteria</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {licenses.map(license => (
        <LicenseCard key={license.id} license={license} />
      ))}
    </div>
  );
};