import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "context";

const ProtectedRoute = ({ 
  isAuthenticated, 
  redirectPath = "/auth/login", 
  children, 
  requireAdmin = false 
}) => {
  const authContext = useContext(AuthContext);

  if (!isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }

  // Check if route requires admin access
  if (requireAdmin && !authContext.isAdmin) {
    // Redirect non-admin users to sheet1 page
    return <Navigate to="/tables/sheet1" replace />;
  }

  return children;
};

export default ProtectedRoute;
