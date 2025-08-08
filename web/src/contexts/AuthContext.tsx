import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/utils/supabaseClient';
import { apiClient } from '@/utils/apiClient';

interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  user_num: string;
  role: string;
  provider_type?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  signUp: (data: RegisterData) => Promise<{ success: boolean; message: string }>;
  signInWithGoogle: () => Promise<{ success: boolean; message: string }>;
  signOut: () => Promise<void>;
  forgotPassword: (email: string) => Promise<{ success: boolean; message: string }>;
  checkUser: () => Promise<void>;
}

interface RegisterData {
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
  street_address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      // Check Supabase session
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error || !user) {
        setUser(null);
        setLoading(false);
        return;
      }

      let profileData = null;
      try {
        const response = await apiClient.get(`/profiles/?supabase_id=${user.id}`);
        profileData = response.data;
      } catch (error) {
        console.warn('Could not fetch profile data', error);
      }

      // Set user data
      const userData = {
        id: user.id,
        email: user.email!,
        first_name: profileData?.first_name || user.user_metadata?.first_name || '',
        last_name: profileData?.last_name || user.user_metadata?.last_name || '',
        user_num: profileData?.user_num || '',
        role: profileData?.role || 'client',
      };

      setUser(userData);
    } catch (error) {
      console.error('Error checking user:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      // 1. Sign in with Supabase directly
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (authError) {
        return { success: false, message: authError.message };
      }

      if (!authData.user) {
        return { success: false, message: 'Login failed' };
      }

      let profileData = null;
      try {
        const response = await apiClient.get(`/profiles/?supabase_id=${authData.user.id}`);
        profileData = response.data;
      } catch (error) {
        console.warn('Could not fetch profile data', error);
      }

      const userData = {
        id: authData.user.id,
        email: authData.user.email!,
        first_name: profileData?.first_name || authData.user.user_metadata?.first_name || '',
        last_name: profileData?.last_name || authData.user.user_metadata?.last_name || '',
        user_num: profileData?.user_num || '',
        role: profileData?.role || 'client',
      };

      setUser(userData);
      return { success: true, message: 'Login successful' };

    } catch (error: any) {
      return { success: false, message: error.message || 'Login failed' };
    }
  };

  const signUp = async (data: RegisterData) => {
    try {
      // 1. Sign up with Supabase directly
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            first_name: data.first_name,
            last_name: data.last_name,
          }
        }
      });

      if (authError) {
        return { success: false, message: authError.message };
      }

      if (!authData.user) {
        return { success: false, message: 'Failed to create user' };
      }

      try {
        await apiClient.post('/profiles/', {
          supabase_id: authData.user.id,
          email: authData.user.email,
          first_name: data.first_name,
          last_name: data.last_name,
          street_address: data.street_address,
          city: data.city,
          state: data.state,
          zip_code: data.zip_code,
        });
      } catch (profileError) {
        console.warn('Profile creation failed, but user was created in Supabase', profileError);
      }

      const userData = {
        id: authData.user.id,
        email: authData.user.email!,
        first_name: data.first_name || '',
        last_name: data.last_name || '',
        user_num: '', // Will be set by backend
        role: 'client',
      };

      setUser(userData);
      return { success: true, message: 'Registration successful' };

    } catch (error: any) {
      return { success: false, message: error.message || 'Registration failed' };
    }
  };

  const signInWithGoogle = async () => {
    try {
      // Use Supabase Google OAuth
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        }
      });
      
      if (error) throw error;
      
      return { success: true, message: 'Redirecting to Google...' };
    } catch (error: any) {
      return { success: false, message: error.message || 'Google login failed' };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });

      if (error) {
        return { success: false, message: error.message };
      }

      return { success: true, message: 'Password reset email sent! Check your inbox.' };
    } catch (error: any) {
      return { success: false, message: error.message || 'Password reset failed' };
    }
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    forgotPassword,
    checkUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};