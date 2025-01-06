import React from 'react';
import { Plus, Settings } from 'lucide-react';

export const VendorWorkflows: React.FC = () => {
  const workflows = [
    {
      id: 1,
      name: 'New Vendor Approval',
      steps: ['Documentation Review', 'Financial Check', 'Contract Review', 'Final Approval'],
      status: 'active'
    },
    {
      id: 2,
      name: 'Annual Compliance Check',
      steps: ['Document Update', 'Compliance Review', 'Risk Assessment'],
      status: 'active'
    }
  ];

  return (
    <div className="bg-white shadow-sm rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h4 className="text-sm font-medium text-gray-900">Approval Workflows</h4>
        <button className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-900">
          <Plus className="h-4 w-4 mr-1" />
          Add Workflow
        </button>
      </div>

      <div className="space-y-4">
        {workflows.map((workflow) => (
          <div
            key={workflow.id}
            className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50"
          >
            <div className="flex items-center justify-between mb-2">
              <h5 className="text-sm font-medium text-gray-900">{workflow.name}</h5>
              <button className="text-gray-400 hover:text-gray-500">
                <Settings className="h-4 w-4" />
              </button>
            </div>
            
            <div className="flex items-center space-x-2">
              {workflow.steps.map((step, index) => (
                <React.Fragment key={index}>
                  <span className="text-xs text-gray-500">{step}</span>
                  {index < workflow.steps.length - 1 && (
                    <span className="text-gray-300">→</span>
                  )}
                </React.Fragment>
              ))}
            </div>

            <div className="mt-2">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                workflow.status === 'active' 
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {workflow.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};