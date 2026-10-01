'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '@/types';
import { DEMO_USERS } from '@/lib/mockData';

interface AuthContextType {
  user: UserProfile | null;
  role: UserRole | null;
  isLoading: boolean;
  loginAs: (role: UserRole, houseNo?: number) => void;
  logout: () => void;
  allDemoUsers: UserProfile[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(DEMO_USERS[0]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check local storage for persistent session
    const savedUser = localStorage.getItem('homehub_active_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Failed to parse saved user', e);
      }
    } else {
      // Default to Owner demo user
      setUser(DEMO_USERS[0]);
      localStorage.setItem('homehub_active_user', JSON.stringify(DEMO_USERS[0]));
    }
    setIsLoading(false);
  }, []);

  const loginAs = (role: UserRole, houseNo?: number) => {
    let targetUser: UserProfile | undefined;
    if (role === 'tenant' && houseNo) {
      targetUser = DEMO_USERS.find(u => u.role === 'tenant' && u.assignedHouseNo === houseNo);
    }
    if (!targetUser) {
      targetUser = DEMO_USERS.find(u => u.role === role);
    }

    if (targetUser) {
      setUser(targetUser);
      localStorage.setItem('homehub_active_user', JSON.stringify(targetUser));
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('homehub_active_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || null,
        isLoading,
        loginAs,
        logout,
        allDemoUsers: DEMO_USERS
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
