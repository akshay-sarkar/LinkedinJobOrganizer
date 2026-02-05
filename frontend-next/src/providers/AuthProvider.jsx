'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { subscribeToAuthState, signInWithGoogle, signOut } from '@/lib/firebase';

const AuthContext = createContext({
  user: null,
  loading: true,
  signIn: async () => {},
  logOut: async () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Subscribe to auth state changes
    const unsubscribe = subscribeToAuthState((firebaseUser) => {
      if (firebaseUser) {
        // User is signed in
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
        });
      } else {
        // User is signed out
        setUser(null);
      }
      setLoading(false);
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  const signIn = async () => {
    setLoading(true);
    const result = await signInWithGoogle();
    setLoading(false);
    return result;
  };

  const logOut = async () => {
    setLoading(true);
    const result = await signOut();
    setLoading(false);
    return result;
  };

  const value = {
    user,
    loading,
    signIn,
    logOut,
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
