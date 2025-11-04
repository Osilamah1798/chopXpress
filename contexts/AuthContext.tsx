import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { User, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  users: User[];
  login: (email: string, password: string) => Promise<{ success: boolean, message: string }>;
  register: (email: string, password: string, username: string) => Promise<{ success: boolean, message: string, user?: User }>;
  logout: () => void;
  isLoading: boolean;
  updateUser: (userId: string, data: Partial<Pick<User, 'username' | 'role' | 'avatarUrl'>>) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
  createStaff: (email: string, password: string, username: string, role: 'admin' | 'super-admin') => Promise<{ success: boolean, message: string }>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real app, you'd fetch the user session here.
    // For now, we'll just simulate the loading process.
    setIsLoading(false);
  }, []);
  
  const login = async (email: string, password: string) => {
    console.log('Login attempt:', { email, password });
    return { success: false, message: 'Login functionality is currently disabled.' };
  };
  
  const register = async (email: string, password: string, username: string) => {
    console.log('Register attempt:', { email, username, password });
    return { success: false, message: 'Registration is currently disabled.' };
  };
  
  const createStaff = async (email: string, password: string, username: string, role: 'admin' | 'super-admin') => {
    console.log('Create staff attempt:', { email, username, role });
    return { success: false, message: 'Staff creation is currently disabled.' };
  };


  const logout = async () => {
    setUser(null);
  };
  
  const updateUser = async (userId: string, data: Partial<Pick<User, 'username' | 'role' | 'avatarUrl'>>) => {
      console.log('Update user:', userId, data);
      alert('User update functionality is disabled.');
  };

  const deleteUser = async (userId: string) => {
    // NOTE: This only deletes the user's Firestore record. In a production app,
    // a Cloud Function should be triggered to delete the corresponding Firebase Auth user.
    console.log('Delete user:', userId);
    alert('User deletion functionality is disabled.');
  };


  return (
    <AuthContext.Provider value={{ user, users, login, register, logout, isLoading, updateUser, deleteUser, createStaff }}>
      {!isLoading && children}
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