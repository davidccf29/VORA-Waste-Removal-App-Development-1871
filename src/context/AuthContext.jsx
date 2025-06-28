import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock users for demo
  const [users, setUsers] = useState([
    { 
      id: 1, 
      email: 'customer@vora.com', 
      password: 'password', 
      role: 'customer', 
      name: 'John Customer',
      phone: '+1-555-0101',
      address: '123 Main St, City, State 12345'
    },
    { 
      id: 2, 
      email: 'contractor@vora.com', 
      password: 'password', 
      role: 'contractor', 
      name: 'Mike Contractor',
      phone: '+1-555-0123',
      address: '456 Oak Ave, City, State 12345'
    },
    { 
      id: 3, 
      email: 'admin@vora.com', 
      password: 'password', 
      role: 'administrator', 
      name: 'Sarah Admin',
      phone: '+1-555-0456',
      address: '789 Admin Blvd, City, State 12345'
    }
  ]);

  useEffect(() => {
    const savedUser = localStorage.getItem('voraUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const foundUser = users.find(u => u.email === email && u.password === password);
    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem('voraUser', JSON.stringify(userWithoutPassword));
      return { success: true };
    }
    return { success: false, error: 'Invalid credentials' };
  };

  const register = async (userData) => {
    // Check if email already exists
    const existingUser = users.find(u => u.email === userData.email);
    if (existingUser) {
      return { success: false, error: 'Email already registered' };
    }

    // Create new user
    const newUser = {
      id: Date.now(),
      ...userData,
      createdAt: new Date().toISOString()
    };

    // Add to users array
    setUsers(prev => [...prev, newUser]);
    
    // Also save to localStorage for persistence
    const savedUsers = localStorage.getItem('voraUsers');
    const currentUsers = savedUsers ? JSON.parse(savedUsers) : [];
    currentUsers.push(newUser);
    localStorage.setItem('voraUsers', JSON.stringify(currentUsers));

    return { success: true, user: newUser };
  };

  const resetPassword = async (email) => {
    // Check if user exists
    const foundUser = users.find(u => u.email === email);
    if (!foundUser) {
      return { success: false, error: 'No account found with this email address' };
    }

    // In a real app, you would send an email here
    // For demo purposes, we'll just simulate success
    console.log(`Password reset email sent to ${email}`);
    
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('voraUser');
  };

  const value = {
    user,
    login,
    register,
    resetPassword,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};