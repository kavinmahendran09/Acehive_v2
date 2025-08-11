"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, signInWithGoogle, signOutUser, onAuthStateChange, getCurrentUser, refreshUserAvatar } from '@/lib/firebaseAuth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  refreshAvatar: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChange((user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Force refresh user data
  const refreshUser = async () => {
    try {
      const user = await getCurrentUser();
      setUser(user);
    } catch (error) {
      console.error('Error refreshing user:', error);
    }
  };

  const signIn = async () => {
    try {
      const user = await signInWithGoogle();
      if (user) {
        setUser(user);
        setLoading(false);
      } else {
        // Fallback: try to get current user data after a small delay
        setTimeout(async () => {
          await refreshUser();
        }, 500);
      }
    } catch (error) {
      console.error('Sign in error:', error);
    }
  };

  const signOut = async () => {
    try {
      await signOutUser();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const refreshAvatar = async () => {
    try {
      await refreshUserAvatar();
      // Refresh user data after updating avatar
      await refreshUser();
    } catch (error) {
      console.error('Error refreshing avatar:', error);
    }
  };

  const value = {
    user,
    loading,
    signIn,
    signOut,
    refreshAvatar,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
