import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../store/auth.jsx";

const ProtectedRoute = () => {
  // Logic: Check if a token exists in localStorage
  // In a real app, you might use a 'user' object from a Context or Redux
  const {user,isLoading} = useAuth();

  // If no token, redirect to login. Use 'replace' to clean up navigation history.
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If token exists, render the child routes
  return <Outlet />;
};

export default ProtectedRoute;