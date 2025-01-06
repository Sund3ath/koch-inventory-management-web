import React from 'react';
import { Key, AlertTriangle, DollarSign, TrendingUp, TrendingDown, Calendar, Users } from 'lucide-react';
import { useDashboardStore } from '../../../stores/dashboardStore';
import { formatCurrency } from '../../../utils/formatters';

export const LicenseStats: React.FC = () => {
  const { metrics } = useDashboardStore();
  const licenseMetrics = metrics.licenses;
  const monthlyTrend = ((licenseMetrics.total_cost || 0) - (licenseMetrics.previous_month_cost || 0)) / 
    (licenseMetrics.previous_month_cost || 1) * 100;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">License Management</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center mb-2">
            <Key className="h-5 w-5 text-indigo-600 mr-2" />
            <span className="text-sm font-medium text-gray-700">Active Licenses</span>
          </div>
          <p className="text-2xl font-semibold text-indigo-600">
            {licenseMetrics.active_licenses || 0}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Total: {licenseMetrics.total_licenses || 0}
          </p>
        </div>

        <div className="p-4 bg-red-50 rounded-lg">
          <div className="flex items-center mb-2">
            <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
            <span className="text-sm font-medium text-gray-700">Expiring Soon</span>
          </div>
          <p className="text-2xl font-semibold text-red-600">
            {licenseMetrics.expiring_soon || 0}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Within 30 days
          </p>
        </div>
        
        <div className="p-4 bg-green-50 rounded-lg">
          <div className="flex items-center mb-2">
            <Users className="h-5 w-5 text-green-600 mr-2" />
            <span className="text-sm font-medium text-gray-700">Assigned Users</span>
          </div>
          <p className="text-2xl font-semibold text-green-600">
            {licenseMetrics.assigned_users || 0}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Active assignments
          </p>
        </div>

        <div className="p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center mb-2">
            <Calendar className="h-5 w-5 text-blue-600 mr-2" />
            <span className="text-sm font-medium text-gray-700">Renewals Due</span>
          </div>
          <p className="text-2xl font-semibold text-blue-600">
            {licenseMetrics.renewals_due || 0}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Next 90 days
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">License Utilization</h4>
          <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between">
              <div>
                <span className="text-xs font-semibold inline-block text-indigo-600">
                  {licenseMetrics.utilization || 0}% Used
                </span>
              </div>
              <div className="text-xs text-gray-500">
                {licenseMetrics.available_seats || 0} seats available
              </div>
            </div>
            <div className="flex h-2 mb-4 overflow-hidden bg-gray-100 rounded">
              <div
                style={{ width: `${licenseMetrics.utilization || 0}%` }}
                className="flex flex-col justify-center overflow-hidden bg-indigo-500"
              />
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-4">Cost Overview</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <DollarSign className="h-5 w-5 text-green-600 mr-2" />
                  <span className="text-sm text-gray-700">Monthly Cost</span>
                </div>
                {monthlyTrend !== 0 && (
                  <div className={`flex items-center ${monthlyTrend > 0 ? 'text-red-500' : 'text-green-500'}`}>
                    {monthlyTrend > 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                    <span className="text-xs ml-1">{Math.abs(monthlyTrend).toFixed(1)}%</span>
                  </div>
                )}
              </div>
              <p className="text-lg font-semibold text-gray-900 mt-2">
                {formatCurrency(licenseMetrics.monthly_cost || 0)}
              </p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <DollarSign className="h-5 w-5 text-green-600 mr-2" />
                <span className="text-sm text-gray-700">Annual Cost</span>
              </div>
              <p className="text-lg font-semibold text-gray-900 mt-2">
                {formatCurrency(licenseMetrics.total_cost || 0)}
              </p>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-4">Top Vendors</h4>
          <div className="space-y-3">
            {(licenseMetrics.top_vendors || []).map((vendor: any) => (
              <div key={vendor.name} className="flex flex-col sm:flex-row sm:items-center justify-between space-y-1 sm:space-y-0">
                <span className="text-sm text-gray-600">{vendor.name}</span>
                <div className="flex items-center justify-between sm:justify-end space-x-4">
                  <span className="text-sm text-gray-500">{vendor.license_count} licenses</span>
                  <span className="text-sm font-medium text-gray-900">
                    {formatCurrency(vendor.total_cost)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};