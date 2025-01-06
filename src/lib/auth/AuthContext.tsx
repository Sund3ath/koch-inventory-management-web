import React, { createContext, useContext, useEffect } from 'react';
import { useAuthStore } from './authStore';
import { useNavigate, useLocation } from 'react-router-dom';
import type { AuthUser } from './types';

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: { firstName: string; lastName: string; email: string }) => Promise<void>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { 
    user, 
    isLoading, 
    error, 
    initialize, 
    login, 
    register, 
    logout,
    updateProfile,
    updatePassword
  } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    // Redirect to login if user becomes unauthenticated
    if (!isLoading && !user) {
      const isAuthRoute = ['/login', '/register'].includes(location.pathname);
      if (!isAuthRoute) {
        navigate('/login', { 
          state: { from: location },
          replace: true 
        });
      }
    }
  }, [user, isLoading, navigate, location]);
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isLoading, 
        error, 
        isAuthenticated: !!user,
        login, 
        register, 
        logout,
        updateProfile,
        updatePassword
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};