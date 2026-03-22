import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  // Logic: Check if a token exists in localStorage
  // In a real app, you might use a 'user' object from a Context or Redux
  const token = localStorage.getItem("token");

  // If no token, redirect to login. Use 'replace' to clean up navigation history.
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If token exists, render the child routes
  return <Outlet />;
};

export default ProtectedRoute;