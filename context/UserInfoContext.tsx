"use client";
import { fetchUser } from '@/lib/actions/user.actions';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';


interface UserProps {
  _id: string;
  id: string;
  image: string;
  name: string;
  lastName: string;
  username: string;
}

interface UserContextType {
  userInfo: any | null;
  loading: boolean;
  error: string | null;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode; userId: string }> = ({ children, userId }) => {
  const [userInfo, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      setLoading(true);
      setError(null);

      try {
        const userInfo = await fetchUser(userId); // Chiamata per recuperare i dati dell'utente
        setUser(userInfo);
      } catch (err) {
        console.error('Error fetching user:', err);
        setError('Error fetching user information');
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [userId]);

  return (
    <UserContext.Provider value={{ userInfo, loading, error }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
