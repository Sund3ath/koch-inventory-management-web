import React, { useState } from 'react';
import { useSettingsStore } from '../../../stores/settingsStore';

interface Language {
  code: string;
  name: string;
}

export const LanguageSelector: React.FC = () => {
  const [defaultLanguage, setDefaultLanguage] = useState('en');
  const [multiLanguageEnabled, setMultiLanguageEnabled] = useState(true);
  const [selectedLanguages, setSelectedLanguages] = useState<Set<string>>(new Set(['en']));

  const languages: Language[] = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'it', name: 'Italian' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'ja', name: 'Japanese' },
    { code: 'zh', name: 'Chinese' },
  ];

  const handleLanguageToggle = (code: string) => {
    const newSelected = new Set(selectedLanguages);
    if (newSelected.has(code)) {
      if (code !== 'en') { // Don't allow deselecting English
        newSelected.delete(code);
      }
    } else {
      newSelected.add(code);
    }
    setSelectedLanguages(newSelected);
  };

  const handleSave = () => {
    // TODO: Implement save functionality
    console.log('Saving language settings:', {
      defaultLanguage,
      multiLanguageEnabled,
      selectedLanguages: Array.from(selectedLanguages)
    });
  };

  return (
    <div className="bg-white shadow-sm rounded-lg p-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Default System Language
          </label>
          <select
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            value={defaultLanguage}
            onChange={(e) => setDefaultLanguage(e.target.value)}
          >
            {languages.map(lang => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="multiLanguage"
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            checked={multiLanguageEnabled}
            onChange={(e) => setMultiLanguageEnabled(e.target.checked)}
          />
          <label htmlFor="multiLanguage" className="text-sm text-gray-700">
            Enable multiple language support
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Supported Languages
          </label>
          <div className="mt-2 space-y-2">
            {languages.map(lang => (
              <div key={lang.code} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={`lang-${lang.code}`}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  checked={selectedLanguages.has(lang.code)}
                  onChange={() => handleLanguageToggle(lang.code)}
                  disabled={lang.code === 'en'} // English is always required
                />
                <label htmlFor={`lang-${lang.code}`} className="text-sm text-gray-700">
                  {lang.name}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4">
          <button
            onClick={handleSave}
            className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Save Language Settings
          </button>
        </div>
      </div>
    </div>
  );
};