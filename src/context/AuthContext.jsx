import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  // Simple signup (localStorage based)
  const signup = ({ name, email, password }) => {
    const users = JSON.parse(localStorage.getItem('allUsers') || '[]');
    const exists = users.find(u => u.email === email);
    if (exists) {
      return { success: false, error: 'This email is already registered. Please login.' };
    }
    const newUser = { id: Date.now(), name, email, password };
    users.push(newUser);
    localStorage.setItem('allUsers', JSON.stringify(users));
    setUser({ id: newUser.id, name, email });
    return { success: true };
  };

  // Simple login
  const login = ({ email, password }) => {
    const users = JSON.parse(localStorage.getItem('allUsers') || '[]');
    const found = users.find(u => u.email === email && u.password === password);
    if (!found) {
      return { success: false, error: 'Invalid email or password.' };
    }
    setUser({ id: found.id, name: found.name, email: found.email });
    return { success: true };
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);