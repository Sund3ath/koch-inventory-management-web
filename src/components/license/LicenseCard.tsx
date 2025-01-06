import React, { useState } from 'react';
import { Calendar, Key, Monitor, DollarSign, Edit2, Users, AlertTriangle, CheckCircle, Link } from 'lucide-react';
import type { License } from '../../types';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { EditLicenseModal } from './modal/EditLicenseModal';
import { LicenseAssignmentArea } from './LicenseAssignmentArea';

const getExpirationStatus = (expirationDate: string | null) => {
  if (!expirationDate) return null;
  const daysUntilExpiration = Math.ceil((new Date(expirationDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  return {
    days: daysUntilExpiration,
    isExpired: daysUntilExpiration < 0,
    isExpiringSoon: daysUntilExpiration > 0 && daysUntilExpiration <= 30
  };
};

interface LicenseCardProps {
  license: License;
}

export const LicenseCard: React.FC<LicenseCardProps> = ({ license }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const expirationStatus = getExpirationStatus(license.expiration_date);

  const getStatusColor = (status: License['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const activeAssignments = license.assignments?.filter(a => a.status === 'active') || [];
  const assignedCount = activeAssignments.length;
  const availableCount = (license.total_quantity ?? 0) - assignedCount;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 space-y-2 sm:space-y-0">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="text-lg font-semibold text-gray-900">{license.name}</h3>
            {license.website && (
              <a href={license.website} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-indigo-600">
                <Link className="h-4 w-4" />
              </a>
            )}
          </div>
          <div className="flex items-center space-x-2 mt-1">
            <span className="text-sm text-gray-500">{license.vendor}</span>
            <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
              {license.type}
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {expirationStatus?.isExpired ? (
            <span className="flex items-center px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">
              <AlertTriangle className="h-4 w-4 mr-1" />
              Expired
            </span>
          ) : expirationStatus?.isExpiringSoon ? (
            <span className="flex items-center px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
              <AlertTriangle className="h-4 w-4 mr-1" />
              Expires in {expirationStatus.days} days
            </span>
          ) : (
            <span className="flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
              <CheckCircle className="h-4 w-4 mr-1" />
              Active
            </span>
          )}
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="p-1 text-gray-400 hover:text-indigo-600 rounded-full hover:bg-gray-100"
            title="Edit license"
          >
            <Edit2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div className="flex items-center text-gray-600">
          <Key className="w-4 h-4 mr-2" />
          <span className="text-sm break-all">{license.key}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <Calendar className="w-4 h-4 mr-2" />
          <span className="text-sm">{formatDate(license.expiration_date)}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <Users className="w-4 h-4 mr-2" />
          <span className="text-sm">
            {assignedCount} / {license.total_quantity} seats used
          </span>
        </div>
        <div className="flex items-center text-gray-600">
          <DollarSign className="w-4 h-4 mr-2" />
          <span className="text-sm">{formatCurrency(license.cost)}</span>
        </div>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="flex flex-col">
          <span className="text-sm text-gray-500">Total Seats</span>
          <span className="text-lg font-medium text-gray-900">{license.total_quantity}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-sm text-gray-500">Available</span>
          <span className="text-lg font-medium text-gray-900">{availableCount}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-sm text-gray-500">Cost</span>
          <span className="text-lg font-medium text-gray-900">{formatCurrency(license.cost)}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-sm text-gray-500">Per User</span>
          <span className="text-lg font-medium text-gray-900">
            {formatCurrency(license.cost / license.total_quantity)}
          </span>
        </div>
      </div>

      {license.notes && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-sm text-gray-600">{license.notes}</p>
        </div>
      )}

      <LicenseAssignmentArea license={license} />

      <EditLicenseModal
        license={license}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />
    </div>
  );
};