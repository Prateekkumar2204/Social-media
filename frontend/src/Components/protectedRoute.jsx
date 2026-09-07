import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../store/auth.jsx";

const ProtectedRoute = () => {
  const { user, isLoading } = useAuth();
  if (isLoading) {
    return <div>Checking authentication...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;