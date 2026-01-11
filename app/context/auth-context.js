"use client";
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [modalTitle, setModalTitle] = useState("Sign in to continue");

  useEffect(() => {
    try {
      // Try AuthContext format first, then fallback to standard format
      let token = localStorage.getItem("spreadnext_token");
      let userData = localStorage.getItem("spreadnext_user");
      
      if (!token) token = localStorage.getItem("token");
      if (!userData) userData = localStorage.getItem("user");
      
      if (token && userData) setUser(JSON.parse(userData));
    } catch {
      localStorage.clear();
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * ✅ LOGIN = SINGLE EXECUTION POINT
   */
  const login = useCallback((token, userData) => {
    // Store in AuthContext format
    localStorage.setItem("spreadnext_token", token);
    localStorage.setItem("spreadnext_user", JSON.stringify(userData));
    
    // Also store in standard format for compatibility with rest of app
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    
    setUser(userData);
    setShowAuthModal(false);

    if (pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
  }, [pendingAction]);

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  /**
   * ⭐ GLOBAL AUTH GUARD
   */
  const requireAuth = useCallback((action, title) => {
    return (...args) => {
      if (user) return action(...args);

      return new Promise((resolve, reject) => {
        setModalTitle(title || "Sign in to continue");

        setPendingAction(() => async () => {
          try {
            const result = await action(...args);
            resolve(result);
          } catch (e) {
            reject(e);
          }
        });

        setShowAuthModal(true);
      });
    };
  }, [user]);

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      loading,
      login,
      logout,
      requireAuth,
      showAuthModal,
      modalTitle,
      closeAuth: () => {
        setShowAuthModal(false);
        setPendingAction(null);
      }
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
