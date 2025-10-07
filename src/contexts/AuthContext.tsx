import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase, UserProfile } from '../lib/supabase';
import { User } from '@supabase/supabase-js';

// Define the shape of the error object returned by auth functions
type AuthResult = {
  success: boolean;
  message?: string;
};

type AuthContextType = {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  appError: string | null; // <-- NEW STATE FOR APPLICATION-WIDE ERRORS
  clearAppError: () => void; // <-- NEW METHOD TO CLEAR ERROR STATE
  signUp: (email: string, password: string) => Promise<AuthResult>; // <-- UPDATED RETURN TYPE
  signIn: (email: string, password: string) => Promise<AuthResult>; // <-- UPDATED RETURN TYPE
  signOut: () => Promise<AuthResult>; // <-- UPDATED RETURN TYPE
  updateProfile: (updates: Partial<UserProfile>) => Promise<AuthResult>; // <-- UPDATED RETURN TYPE
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    // Better practice: log error only in dev, throw in component
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [appError, setAppError] = useState<string | null>(null); // <-- NEW STATE

  const clearAppError = () => setAppError(null); // <-- NEW METHOD

  // Utility to handle error display logic
  const handleError = (error: any, defaultMsg: string): string => {
    console.error('Authentication Error:', error);
    // Check for common supabase error structure
    if (error?.message) {
      return error.message;
    }
    return defaultMsg;
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      (async () => {
        setUser(session?.user ?? null);
        if (session?.user) {
          await loadProfile(session.user.id);
        } else {
          setProfile(null);
          setLoading(false);
        }
      })();
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) throw error;
      setProfile(data as UserProfile); // Added casting for safety
    } catch (error) {
      console.error('Error loading profile:', error);
      // Set an application error for the UI
      setAppError('Failed to load user profile data.'); 
    } finally {
      setLoading(false);
    }
  };

  // UPDATED SIGN UP LOGIC
  const signUp = async (email: string, password: string): Promise<AuthResult> => {
    try {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setAppError(handleError(error, 'Sign up failed due to an unknown error.'));
        return { success: false, message: error.message };
      }

      if (data.user) {
        const { error: profileError } = await supabase.from('user_profiles').insert({
          id: data.user.id,
          email: data.user.email!,
          coach_persona: 'chill_friend',
          stress_spender: false,
          onboarding_completed: false,
          financial_health_score: 50,
        });

        if (profileError) {
          setAppError(handleError(profileError, 'Account created, but failed to create profile data.'));
          return { success: false, message: profileError.message };
        }
      }
      return { success: true };
    } catch (error) {
        setAppError(handleError(error, 'An unexpected error occurred during sign up.'));
        return { success: false };
    }
  };

  // UPDATED SIGN IN LOGIC
  const signIn = async (email: string, password: string): Promise<AuthResult> => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setAppError(handleError(error, 'Invalid login credentials.'));
        return { success: false, message: error.message };
      }
      return { success: true };
    } catch (error) {
        setAppError(handleError(error, 'An unexpected error occurred during sign in.'));
        return { success: false };
    }
  };

  // UPDATED SIGN OUT LOGIC
  const signOut = async (): Promise<AuthResult> => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        setAppError(handleError(error, 'Failed to sign out.'));
        return { success: false, message: error.message };
      }
      setProfile(null);
      return { success: true };
    } catch (error) {
        setAppError(handleError(error, 'An unexpected error occurred during sign out.'));
        return { success: false };
    }
  };

  // UPDATED UPDATE PROFILE LOGIC
  const updateProfile = async (updates: Partial<UserProfile>): Promise<AuthResult> => {
    if (!user) {
        return { success: false, message: "User not logged in." };
    }
    
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', user.id);

      if (error) {
        setAppError(handleError(error, 'Failed to update profile.'));
        return { success: false, message: error.message };
      }
      await loadProfile(user.id);
      return { success: true };
    } catch (error) {
        setAppError(handleError(error, 'An unexpected error occurred during profile update.'));
        return { success: false };
    }
  };

  return (
    <AuthContext.Provider value={{ 
        user, 
        profile, 
        loading, 
        appError, // <-- PROVIDED TO CONTEXT
        clearAppError, // <-- PROVIDED TO CONTEXT
        signUp, 
        signIn, 
        signOut, 
        updateProfile 
    }}>
      {children}
    </AuthContext.Provider>
  );
};