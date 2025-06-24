import {
  createContext,
  useContext,
  useState,
  // useEffect,
  type ReactNode,
} from "react";

type AuthContextType = {
  user: any;
  setUser: React.Dispatch<React.SetStateAction<any>>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(() => {
    const token = localStorage.getItem("token");
    return token ? { token } : null;
  });

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const value = { user, setUser, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("useAuth must be provided within an AuthContext");
  return context;
};
