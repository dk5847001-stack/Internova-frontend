import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getStoredToken, getStoredUser } from "../utils/authStorage";

function AdminRoute({ children }) {
  const token = getStoredToken();
  const location = useLocation();
  const user = getStoredUser();

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (user?.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default AdminRoute;
