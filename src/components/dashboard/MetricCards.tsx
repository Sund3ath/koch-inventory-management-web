import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Monitor, Key, Users, Building2, 
  TrendingUp, TrendingDown 
} from 'lucide-react';

interface DashboardMetrics {
  devices: {
    total_devices: number;
    active_devices: number;
  };
  licenses: {
    total_licenses: number;
    expiring_soon: number;
  };
  employees: {
    total_employees: number;
    active_employees: number;
  };
  departments: {
    total_departments: number;
    avg_team_size: number;
  };
}

interface MetricCardsProps {
  metrics: DashboardMetrics;
}

export const MetricCards: React.FC<MetricCardsProps> = ({ metrics }) => {
  const navigate = useNavigate();

  const cards = [
    {
      title: 'Devices',
      icon: Monitor,
      primary: metrics.devices.total_devices,
      secondary: metrics.devices.active_devices,
      label: 'Active Devices',
      trend: metrics.devices.active_devices / metrics.devices.total_devices,
      trend: metrics.devices.active_devices / metrics.devices.total_devices,
      path: '/devices'
    },
    {
      title: 'Licenses',
      icon: Key,
      primary: metrics.licenses.total_licenses,
      secondary: metrics.licenses.expiring_soon,
      label: 'Expiring Soon',
      trend: 1 - (metrics.licenses.expiring_soon / metrics.licenses.total_licenses),
      trend: 1 - (metrics.licenses.expiring_soon / metrics.licenses.total_licenses),
      path: '/licenses'
    },
    {
      title: 'Employees',
      icon: Users,
      primary: metrics.employees.total_employees,
      secondary: metrics.employees.active_employees,
      label: 'Active Employees',
      trend: metrics.employees.active_employees / metrics.employees.total_employees,
      trend: metrics.employees.active_employees / metrics.employees.total_employees,
      path: '/employees'
    },
    {
      title: 'Departments',
      icon: Building2,
      primary: metrics.departments.total_departments,
      secondary: Math.round(metrics.departments.avg_team_size),
      label: 'Avg Team Size',
      trend: metrics.departments.avg_team_size / 10, // Normalize for visualization
      trend: metrics.departments.avg_team_size / 10, // Normalize for visualization
      path: '/settings'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card) => (
        <div 
          key={card.title} 
          onClick={() => navigate(card.path)}
          onClick={() => navigate(card.path)}
          className="bg-white rounded-lg shadow-sm p-6 cursor-pointer hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <card.icon className="h-5 w-5 text-indigo-600" />
              <h3 className="ml-2 text-sm font-medium text-gray-900">{card.title}</h3>
            </div>
            {card.trend >= 0.5 ? (
              <TrendingUp className="h-5 w-5 text-green-500" />
            ) : (
              <TrendingDown className="h-5 w-5 text-red-500" />
            )}
          </div>
          <div className="mt-4">
            <p className="text-2xl font-semibold text-gray-900">{card.primary}</p>
            <p className="mt-1 text-sm text-gray-500">
              {card.secondary} {card.label}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};