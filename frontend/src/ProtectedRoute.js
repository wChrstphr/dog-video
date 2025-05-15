import { Navigate } from "react-router-dom";

function ProtectedRoute({ element, allowedRoles }) {
  const authData = JSON.parse(localStorage.getItem("authData"));

  if (!authData) {
    return <Navigate to="/" replace />;
  }

  if (!allowedRoles.includes(authData.userType)) {
    return <Navigate to="/" replace />;
  }

  return element;
}

export default ProtectedRoute;