import { Navigate } from "react-router-dom";
import { type ReactNode } from "react";
import { useAuth } from "../context/AuthContext";

export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  return <>{children}</>;
};

export const RoleProtectedRoute = ({
  children,
  requiredRole,
}: {
  children: ReactNode;
  requiredRole: string;
}) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Checking Access...</div>;

  if (!user || user.role !== requiredRole) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};
