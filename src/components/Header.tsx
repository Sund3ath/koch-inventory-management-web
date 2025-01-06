import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutGrid, Users, Key, Settings, BarChart2 } from 'lucide-react';
import { NotificationBell } from './notifications/NotificationBell';
import { UserMenu } from './user/UserMenu';

export const Header: React.FC = () => {
  const location = useLocation();
  
  const Logo = () => (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-8 w-8">
      <rect width="32" height="32" rx="8" fill="currentColor" className="text-indigo-600"/>
      <path d="M8 10H24M8 16H24M8 22H24" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M12 7L12 25M20 7L20 25" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  );

  return (
    <header className="bg-white shadow-sm">
      <div className="container-fluid px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center">
            <Logo />
            <div className="ml-3">
              <h1 className="text-xl font-bold text-gray-900">KOCH</h1>
              <p className="text-xs text-gray-500">Inventory & License Management</p>
            </div>
          </Link>
          
          <nav className="flex items-center space-x-4">
            <Link
              to="/"
              className={`inline-flex items-center px-3 py-2 text-sm font-medium ${
                location.pathname === '/' 
                  ? 'text-indigo-600' 
                  : 'text-gray-700 hover:text-indigo-600'
              }`}
            >
              <BarChart2 className="h-5 w-5 mr-1" />
              Dashboard
            </Link>
            <Link
              to="/devices"
              className={`inline-flex items-center px-3 py-2 text-sm font-medium ${
                location.pathname === '/devices' 
                  ? 'text-indigo-600' 
                  : 'text-gray-700 hover:text-indigo-600'
              }`}
            >
              <LayoutGrid className="h-5 w-5 mr-1" />
              Devices
            </Link>
            <Link
              to="/employees"
              className={`inline-flex items-center px-3 py-2 text-sm font-medium ${
                location.pathname === '/employees' 
                  ? 'text-indigo-600' 
                  : 'text-gray-700 hover:text-indigo-600'
              }`}
            >
              <Users className="h-5 w-5 mr-1" />
              Employees
            </Link>
            <Link
              to="/licenses"
              className={`inline-flex items-center px-3 py-2 text-sm font-medium ${
                location.pathname === '/licenses' 
                  ? 'text-indigo-600' 
                  : 'text-gray-700 hover:text-indigo-600'
              }`}
            >
              <Key className="h-5 w-5 mr-1" />
              Licenses
            </Link>
            <Link
              to="/settings"
              className={`inline-flex items-center px-3 py-2 text-sm font-medium ${
                location.pathname === '/settings' 
                  ? 'text-indigo-600' 
                  : 'text-gray-700 hover:text-indigo-600'
              }`}
            >
              <Settings className="h-5 w-5 mr-1" />
              Settings
            </Link>

            <div className="ml-4 border-l pl-4 flex items-center space-x-4">
              <NotificationBell />
              <UserMenu />
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};