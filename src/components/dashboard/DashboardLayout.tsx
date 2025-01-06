import React, { useState } from 'react';
import { DateRangePicker } from './DateRangePicker';
import { MetricCards } from './MetricCards';
import { DeviceStats } from './sections/DeviceStats';
import { LicenseStats } from './sections/LicenseStats';
import { EmployeeStats } from './sections/EmployeeStats';
import { DepartmentStats } from './sections/DepartmentStats';
import { useDashboardStore } from '../../stores/dashboardStore';

export const DashboardLayout: React.FC = () => {
  const [dateRange, setDateRange] = useState<[Date, Date]>([
    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    new Date()
  ]);

  const { metrics, updateDateRange } = useDashboardStore();

  const handleDateRangeChange = (range: [Date, Date]) => {
    setDateRange(range);
    updateDateRange(range);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <DateRangePicker value={dateRange} onChange={handleDateRangeChange} />
      </div>

      <MetricCards metrics={metrics} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DeviceStats />
        <LicenseStats />
        <EmployeeStats />
        <DepartmentStats />
      </div>
    </div>
  );
};