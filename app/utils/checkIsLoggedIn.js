"use client"
import { createContext, useContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check cookie on mount
  useEffect(() => {
    const loggedInCookie = Cookies.get('accessToken');
    console.log(loggedInCookie);
    
    if (loggedInCookie) {
      setIsLoggedIn(true);
    }else{
      setIsLoggedIn(false)
    }
  }, []);

  // Update cookie when isLoggedIn changes
  useEffect(() => {
    Cookies.set('isLoggedIn', isLoggedIn); // Expires in 7 days
  }, [isLoggedIn]);

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);