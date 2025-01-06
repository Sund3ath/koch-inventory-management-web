import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../../lib/auth/AuthContext';

export const PersistLogin: React.FC = () => {
  const [isVerifying, setIsVerifying] = useState(true);
  const { isLoading } = useAuth();

  useEffect(() => {
    // Wait for initial auth check
    if (!isLoading) {
      setIsVerifying(false);
    }
  }, [isLoading]);

  if (isVerifying) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return <Outlet />;
};