import React from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="container py-5">
      <div className="card shadow p-4">
        <h2>Welcome, {user?.name || "User"} 🎉</h2>
        <p>Email: {user?.email}</p>
        <p>Role: {user?.role}</p>

        <button onClick={handleLogout} className="btn btn-danger mt-3">
          Logout
        </button>
      </div>
    </div>
  );
}

export default Dashboard;