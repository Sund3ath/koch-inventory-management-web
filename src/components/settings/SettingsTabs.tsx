import React, { useState } from 'react';
import { Building2, Store, Cloud, Languages, Monitor } from 'lucide-react';
import { DepartmentSettings } from './department/DepartmentSettings';
import { VendorSettings } from './vendor/VendorSettings';
import { AzureSettings } from './azure/AzureSettings';
import { LanguageSettings } from './language/LanguageSettings';
import { DeviceSettings } from './device/DeviceSettings';

const tabs = [
  { id: 'departments', name: 'Departments', icon: Building2, component: DepartmentSettings },
  { id: 'devices', name: 'Devices', icon: Monitor, component: DeviceSettings },
  { id: 'vendors', name: 'Vendors', icon: Store, component: VendorSettings },
  { id: 'azure', name: 'Azure AD', icon: Cloud, component: AzureSettings },
  { id: 'language', name: 'Language', icon: Languages, component: LanguageSettings }
];

export const SettingsTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState(tabs[0].id);
  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component;

  return (
    <div>
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center py-4 px-1 border-b-2 font-medium text-sm
                ${activeTab === tab.id
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              <tab.icon className="h-5 w-5 mr-2" />
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-6">
        {ActiveComponent && <ActiveComponent />}
      </div>
    </div>
  );
};