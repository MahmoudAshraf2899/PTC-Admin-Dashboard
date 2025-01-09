import { useState, createContext, ReactNode, useContext } from 'react';
type User = {
  // Define the properties of the user object
};

// Define the type for the AuthContext
type AuthContextType = {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
};
const AuthContext = createContext<AuthContextType | null>(null);
export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);

  // Define the login and logout functions
  const login = (user: User) => {
    setUser(user);
  };

  const logout = () => {
    setUser(null);
  };

  // Provide the context value to the children
  const contextValue: AuthContextType = {
    user,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
export const useAuth = () => {
  return useContext(AuthContext);
};
