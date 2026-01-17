import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
        }
      } catch (error) {
        console.error("Failed to parse user data", error);
        localStorage.removeItem("user");
      } finally {
        setAuthLoading(false);
        setIsInitialized(true);
      }
    };

    initializeAuth();
  }, []);

  // In your AuthProvider component
  const login = async (userData) => {
    // Store both token and user data
    const authData = {
      token: userData.token,
      ...userData.user,
    };
    localStorage.setItem("user", JSON.stringify(authData));
    setUser(authData);
    return Promise.resolve();
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  if (authLoading) {
    return <div>Loading authentication...</div>;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        authLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
