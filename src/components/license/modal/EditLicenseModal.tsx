import React from 'react';
import { X } from 'lucide-react';
import { EditLicenseForm } from '../forms/EditLicenseForm';
import type { License } from '../../../types';

interface EditLicenseModalProps {
  license: License;
  isOpen: boolean;
  onClose: () => void;
}

export const EditLicenseModal: React.FC<EditLicenseModalProps> = ({ license, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-25" onClick={onClose} />
        
        <div className="relative w-full max-w-3xl rounded-lg bg-white p-6 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Edit License</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <EditLicenseForm license={license} onClose={onClose} />
        </div>
      </div>
    </div>
  );
};