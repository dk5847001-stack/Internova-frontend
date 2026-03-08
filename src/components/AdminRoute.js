import React from "react";
import { Navigate, useLocation } from "react-router-dom";

function AdminRoute({ children }) {
  const token = localStorage.getItem("token");
  const location = useLocation();

  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch (error) {
    user = null;
  }

  if (!token) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  if (user?.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default AdminRoute;