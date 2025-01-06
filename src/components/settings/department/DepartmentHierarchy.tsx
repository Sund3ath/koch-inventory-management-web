import React, { useEffect } from 'react';
import { ChevronRight, Users } from 'lucide-react';
import { useDepartmentStore } from '../../../stores/departmentStore';

export const DepartmentHierarchy: React.FC = () => {
  const { hierarchy, fetchHierarchy, isLoading, error } = useDepartmentStore();

  useEffect(() => {
    fetchHierarchy();
  }, [fetchHierarchy]);

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="text-red-600">
          <p>Error loading department hierarchy: {error}</p>
          <button 
            onClick={() => fetchHierarchy()}
            className="mt-2 text-sm text-indigo-600 hover:text-indigo-500"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  const renderDepartment = (dept: DepartmentNode, level: number = 0) => {
    return (
      <div key={dept.id} style={{ marginLeft: `${level * 20}px` }}>
        <div className={`
          flex items-center justify-between p-2 rounded-lg
          ${level === 0 ? 'bg-gray-50' : 'hover:bg-gray-50'}
        `}>
          <div className="flex items-center">
            {level > 0 && <ChevronRight className="h-4 w-4 text-gray-400 mr-2" />}
            <div>
              <div className="text-sm font-medium text-gray-900">{dept.name}</div>
              {dept.manager?.employee && (
                <div className="text-xs text-gray-500">
                  Manager: {dept.manager.employee.first_name} {dept.manager.employee.last_name}
                </div>
              )}
            </div>
          </div>
        </div>
        {dept.children?.map(child => renderDepartment(child, level + 1))}
      </div>
    );
  };

  return (
    <div className="bg-white shadow-sm rounded-lg p-6">
      <h4 className="text-sm font-medium text-gray-900 mb-4">Department Hierarchy</h4>
      <div className="space-y-2 mt-4">
        {hierarchy.length > 0 ? (
          hierarchy.map(dept => renderDepartment(dept))
        ) : (
          <p className="text-center text-gray-500 py-4">
            No departments found
          </p>
        )}
      </div>
    </div>
  );
};