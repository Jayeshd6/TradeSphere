import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  // Still checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  // User not logged in
  //The replace prop prevents the protected page from staying in the browser history.
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // User logged in
  return children;
}

export default ProtectedRoute;