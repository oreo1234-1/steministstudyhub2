import { createContext, useContext, useEffect, useState } from 'react';
import type { Profile } from '@shared/schema';

interface AuthContextType {
  user: Profile | null;
  loading: boolean;
  signIn: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session in localStorage
    const storedUser = localStorage.getItem('steminist_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        localStorage.removeItem('steminist_user');
      }
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string) => {
    try {
      // Check if profile exists
      const response = await fetch(`/api/profiles/email/${email}`);
      let profile: Profile;
      
      if (response.ok) {
        profile = await response.json();
      } else {
        // Create new profile
        const createResponse = await fetch('/api/profiles', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: crypto.randomUUID(),
            email,
            fullName: email.split('@')[0],
            role: 'student' as const,
          }),
        });
        
        if (!createResponse.ok) {
          throw new Error('Failed to create profile');
        }
        
        profile = await createResponse.json();
      }
      
      setUser(profile);
      localStorage.setItem('steminist_user', JSON.stringify(profile));
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    setUser(null);
    localStorage.removeItem('steminist_user');
  };

  const value = {
    user,
    loading,
    signIn,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};