import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

// Default admin credentials — baad me localStorage ("adminCreds") se change ho sakte hain
const DEFAULT_ADMIN_CREDS = { username: 'admin', password: 'admin123' };

const getStoredAdminCreds = () => {
  try {
    const saved = JSON.parse(localStorage.getItem('adminCreds'));
    if (saved && saved.username && saved.password) return saved;
  } catch {
    // corrupted storage → fall back to defaults
  }
  return DEFAULT_ADMIN_CREDS;
};

export const AuthProvider = ({ children }) => {
  // ---------- normal user ----------
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  // ---------- admin ----------
  const [isAdmin, setIsAdmin] = useState(() => {
    return localStorage.getItem('isAdmin') === 'true';
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  // Simple signup (localStorage based) — normal user, NO admin access
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

  // Simple login — normal user, NO admin access
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

  // ---------- admin login / logout ----------
  const loginAsAdmin = (username, password) => {
    const creds = getStoredAdminCreds();
    if (
      username.trim().toLowerCase() === creds.username.toLowerCase() &&
      password === creds.password
    ) {
      localStorage.setItem('isAdmin', 'true');
      setIsAdmin(true);
      return { success: true };
    }
    return { success: false, error: 'Invalid admin username or password.' };
  };

  const logoutAdmin = () => {
    localStorage.removeItem('isAdmin');
    setIsAdmin(false);
  };

  // (Optional) admin credentials update — future use
  const updateAdminCreds = (username, password) => {
    localStorage.setItem('adminCreds', JSON.stringify({ username, password }));
    return { success: true };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        isAdmin,
        loginAsAdmin,
        logoutAdmin,
        updateAdminCreds
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
