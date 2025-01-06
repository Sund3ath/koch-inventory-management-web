import React from 'react';
import { LanguageSelector } from './LanguageSelector';
import { TranslationManager } from './TranslationManager';
import { LanguagePackages } from './LanguagePackages';

export const LanguageSettings: React.FC = () => {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Language Configuration</h3>
        <LanguageSelector />
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Translation Management</h3>
        <TranslationManager />
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Language Packages</h3>
        <LanguagePackages />
      </div>
    </div>
  );
};