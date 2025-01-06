import { create } from 'zustand';
import { supabase } from '../supabase/client';
import type { AuthState } from './types';

interface AuthStore extends AuthState {
  initialize: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: { firstName: string; lastName: string; email: string }) => Promise<void>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  session: null,
  isLoading: true,
  error: null,

  initialize: async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;
      
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('first_name, last_name')
          .eq('id', session.user.id)
          .single();

        set({
          session,
          user: {
            id: session.user.id,
            email: session.user.email!,
            firstName: profile?.first_name,
            lastName: profile?.last_name
          },
          isLoading: false
        });
      } else {
        set({ session: null, user: null, isLoading: false });
      }
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Authentication error',
        isLoading: false 
      });
    }
  },

  login: async (email: string, password: string) => {
    try {
      set({ error: null }); // Clear any previous errors

      // Sign in with Supabase Auth
      const { data: { session }, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (signInError) throw signInError;
      if (!session?.user) throw new Error('No user returned from login');
      
      // Get user profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('first_name, last_name')
        .eq('id', session.user.id)
        .single();
      
      if (profile) {
        set({
          session,
          user: {
            id: session.user.id,
            email: session.user.email!,
            firstName: profile.first_name,
            lastName: profile.last_name
          },
          error: null
        });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Invalid email or password';
      set({ error: message, user: null });
      throw error;
    }
  },

  register: async (email: string, password: string, firstName: string, lastName: string) => {
    try {
      set({ error: null }); // Clear any previous errors
      
      // Sign up with Supabase Auth
      const { data: { user, session }, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName
          }
        }
      });

      if (error) throw error;
      if (!user) throw new Error('Registration failed');

      set({
        session,
        user: {
          id: user.id,
          email: user.email!,
          firstName,
          lastName
        },
        error: null
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Registration failed';
      set({ 
        error: message, 
        user: null,
        session: null
      });
      throw error;
    }
  },

  updateProfile: async (data: { firstName: string; lastName: string; email: string }) => {
    const { user } = get();
    if (!user) throw new Error('No user logged in');

    try {
      // Update profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          first_name: data.firstName,
          last_name: data.lastName,
          email: data.email
        })
        .eq('id', user.id);

      if (profileError) throw profileError;

      set({
        user: {
          ...user,
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName
        }
      });
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to update profile');
    }
  },

  updatePassword: async (currentPassword: string, newPassword: string) => {
    const { user } = get();
    if (!user) throw new Error('No user logged in');

    try {
      // Verify current password
      const { data: isValid, error: verifyError } = await supabase.rpc(
        'verify_password',
        {
          password: currentPassword,
          hashed_password: user.password
        }
      );

      if (verifyError || !isValid) {
        throw new Error('Current password is incorrect');
      }

      // Hash and update new password
      const { data: hashedPassword } = await supabase.rpc('hash_password', {
        password: newPassword
      });

      if (!hashedPassword) {
        throw new Error('Failed to hash new password');
      }

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ password: hashedPassword })
        .eq('id', user.id);

      if (updateError) throw updateError;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to update password');
    }
  },

  logout: async () => {
    try {
      set({ session: null, user: null, error: null });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Logout failed' });
      throw error;
    }
  }
}));