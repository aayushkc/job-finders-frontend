"use client"
import { createContext, useContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState({'logInStatus':false, 'username':''});

  // Check cookie on mount
  useEffect(() => {
    const loggedInCookie = Cookies.get('accessToken');
    
    if (loggedInCookie) {
      setIsLoggedIn((prevState) => {return {...prevState, 'logInStatus':true}});
    }else{
      setIsLoggedIn((prevState) => {return {...prevState, 'logInStatus':false}})
    }
  }, []);

  // Update cookie when isLoggedIn changes
  useEffect(() => {
    Cookies.set('isLoggedIn', isLoggedIn.logInStatus); // Expires in 7 days
  }, [isLoggedIn.logInStatus]);

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);