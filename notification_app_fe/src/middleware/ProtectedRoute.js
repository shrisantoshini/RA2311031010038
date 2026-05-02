import { Navigate } from "react-router-dom";

// simple protected route - checks if token is in localstorage
function ProtectedRoute({ children }) {
  const token = localStorage.getItem("auth_token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
