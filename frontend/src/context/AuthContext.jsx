import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

// Dummy credentials
const DUMMY_CREDENTIALS = {
  customer: {
    email: 'customer@demo.com',
    password: 'customer123',
    name: 'John Customer',
    isAdmin: false,
    role: 'customer',
  },
  seller: {
    email: 'seller@demo.com',
    password: 'seller123',
    name: 'Jane Seller',
    isAdmin: true,
    role: 'seller',
  },
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Check dummy credentials first
      if (email === DUMMY_CREDENTIALS.customer.email && password === DUMMY_CREDENTIALS.customer.password) {
        const user = { id: 1, ...DUMMY_CREDENTIALS.customer };
        const token = `token_${Date.now()}`;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        setUser(user);
        return { success: true, user };
      }

      if (email === DUMMY_CREDENTIALS.seller.email && password === DUMMY_CREDENTIALS.seller.password) {
        const user = { id: 2, ...DUMMY_CREDENTIALS.seller };
        const token = `token_${Date.now()}`;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        setUser(user);
        return { success: true, user };
      }

      // Check localStorage for other users
      const users = localStorage.getItem('users');
      if (users) {
        const allUsers = JSON.parse(users);
        const foundUser = allUsers.find(u => u.email === email && u.password === password);
        if (foundUser) {
          const { password: _, ...userWithoutPassword } = foundUser;
          const token = `token_${Date.now()}`;
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(userWithoutPassword));
          setUser(userWithoutPassword);
          return { success: true, user: userWithoutPassword };
        }
      }

      return { success: false, error: 'Invalid email or password' };
    } catch (error) {
      return { success: false, error: 'Login failed' };
    }
  };

  const signup = async (userData) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Check if email already exists
      const users = localStorage.getItem('users');
      if (users) {
        const allUsers = JSON.parse(users);
        if (allUsers.find(u => u.email === userData.email)) {
          return { success: false, error: 'Email already registered' };
        }
      }

      const isAdmin = userData.role === 'seller';
      const newUser = {
        id: Date.now(),
        name: userData.name,
        email: userData.email,
        password: userData.password, // Store for demo purposes
        mobile: userData.mobile || null,
        address: userData.address || null,
        isAdmin: isAdmin,
        role: userData.role,
      };

      // Save to users list
      const allUsers = users ? JSON.parse(users) : [];
      allUsers.push(newUser);
      localStorage.setItem('users', JSON.stringify(allUsers));

      // Create user object without password for session
      const { password: _, ...userWithoutPassword } = newUser;
      const token = `token_${Date.now()}`;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      setUser(userWithoutPassword);

      return { success: true, user: userWithoutPassword };
    } catch (error) {
      return { success: false, error: 'Signup failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

