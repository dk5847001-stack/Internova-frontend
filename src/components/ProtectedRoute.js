import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getStoredToken } from "../utils/authStorage";

function ProtectedRoute({ children }) {
  const token = getStoredToken();
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}

export default ProtectedRoute;
