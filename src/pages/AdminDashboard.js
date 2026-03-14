import React, { useEffect, useState } from "react";
import API from "../services/api";
import { Link } from "react-router-dom";

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalPrograms: 0,
    activePrograms: 0,
    inactivePrograms: 0,
    totalModules: 0,
    totalVideos: 0,
    totalQuizQuestions: 0,
  });

  const [recentInternships, setRecentInternships] = useState([]);
  const [loading, setLoading] = useState(true);

  const [toast, setToast] = useState({
    show: false,
    type: "success",
    message: "",
  });

  const showToast = (type, message) => {
    setToast({ show: true, type, message });

    setTimeout(() => {
      setToast({ show: false, type: "success", message: "" });
    }, 3000);
  };

  const fetchStats = async () => {
    try {
      const { data } = await API.get("/internships/admin/stats");
      setStats(data.stats || {});
      setRecentInternships(data.recentInternships || []);
    } catch (error) {
      console.error("Failed to fetch admin stats:", error);
      showToast("error", "Failed to fetch admin dashboard stats");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const getStatusBadge = (isActive) => {
    return isActive ? (
      <span className="badge bg-success-subtle text-success border rounded-pill px-3 py-2">
        Active
      </span>
    ) : (
      <span className="badge bg-secondary-subtle text-dark border rounded-pill px-3 py-2">
        Inactive
      </span>
    );
  };

  if (loading) {
    return (
      <div
        className="min-vh-100 d-flex align-items-center justify-content-center"
        style={{
          background:
            "linear-gradient(135deg, #f8fafc 0%, #eef2ff 45%, #f8fafc 100%)",
        }}
      >
        <div className="text-center">
          <div className="spinner-border text-dark mb-3" role="status"></div>
          <div className="fw-semibold text-dark">Loading admin dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        .admin-dashboard-page {
          min-height: 100vh;
          background:
            radial-gradient(circle at top left, rgba(59,130,246,0.18), transparent 28%),
            radial-gradient(circle at bottom right, rgba(99,102,241,0.16), transparent 32%),
            linear-gradient(135deg, #f8fafc 0%, #eef2ff 48%, #f8fafc 100%);
          position: relative;
          overflow: hidden;
        }

        .admin-dashboard-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(10px);
          opacity: 0.55;
          animation: adminDashboardFloat 9s ease-in-out infinite;
          -webkit-animation: adminDashboardFloat 9s ease-in-out infinite;
          pointer-events: none;
        }

        .admin-dashboard-orb-1 {
          width: 220px;
          height: 220px;
          top: 70px;
          left: -60px;
          background: linear-gradient(135deg, rgba(37,99,235,0.25), rgba(14,165,233,0.18));
        }

        .admin-dashboard-orb-2 {
          width: 280px;
          height: 280px;
          right: -80px;
          bottom: 70px;
          background: linear-gradient(135deg, rgba(99,102,241,0.18), rgba(59,130,246,0.22));
          animation-delay: 1.2s;
          -webkit-animation-delay: 1.2s;
        }

        .admin-dashboard-shell {
          position: relative;
          z-index: 2;
        }

        .admin-dashboard-hero {
          border: 1px solid rgba(255,255,255,0.42);
          background:
            linear-gradient(135deg, #081226 0%, #0b1736 35%, #142850 70%, #1d4ed8 100%);
          color: #fff;
          position: relative;
          overflow: hidden;
          box-shadow:
            0 24px 70px rgba(15, 23, 42, 0.16),
            0 8px 24px rgba(59,130,246,0.08);
        }

        .admin-dashboard-hero::before {
          content: "";
          position: absolute;
          inset: 0;
          background:
            radial-gradient(circle at 18% 22%, rgba(255,255,255,0.12), transparent 22%),
            radial-gradient(circle at 82% 74%, rgba(255,255,255,0.08), transparent 18%);
          pointer-events: none;
        }

        .admin-dashboard-chip {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          border-radius: 999px;
          background: rgba(255,255,255,0.12);
          border: 1px solid rgba(255,255,255,0.18);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          font-size: 0.8rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 18px;
        }

        .admin-dashboard-title {
          font-size: 2.2rem;
          font-weight: 800;
          letter-spacing: -0.03em;
          margin-bottom: 10px;
        }

        .admin-dashboard-text {
          color: rgba(255,255,255,0.82);
          line-height: 1.8;
          margin-bottom: 0;
          max-width: 760px;
        }

        .admin-stat-card {
          border-radius: 28px;
          border: 1px solid rgba(255,255,255,0.45);
          background: rgba(255,255,255,0.78);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          box-shadow:
            0 22px 65px rgba(15, 23, 42, 0.10),
            0 8px 20px rgba(59,130,246,0.05);
          padding: 24px;
          height: 100%;
          transition: all 0.35s ease;
          -webkit-transition: all 0.35s ease;
        }

        .admin-stat-card:hover {
          transform: translateY(-4px);
          -webkit-transform: translateY(-4px);
        }

        .admin-stat-label {
          font-size: 0.9rem;
          color: #64748b;
          margin-bottom: 8px;
          font-weight: 600;
        }

        .admin-stat-value {
          font-size: 2rem;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 0;
        }

        .admin-section-card {
          border: 1px solid rgba(255,255,255,0.42);
          background: rgba(255,255,255,0.72);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          box-shadow:
            0 24px 70px rgba(15, 23, 42, 0.14),
            0 8px 24px rgba(59,130,246,0.08);
          border-radius: 28px;
        }

        .admin-section-title {
          font-size: 1.35rem;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 10px;
        }

        .admin-section-subtitle {
          color: #64748b;
          line-height: 1.8;
          margin-bottom: 22px;
        }

        .admin-recent-card {
          border-radius: 22px;
          border: 1px solid #e2e8f0;
          background: #ffffff;
          padding: 18px;
          height: 100%;
        }

        .admin-recent-title {
          font-size: 1.08rem;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 8px;
        }

        .admin-mini-text {
          color: #64748b;
          line-height: 1.7;
          font-size: 0.95rem;
        }

        .admin-action-btn {
          min-height: 48px;
          border-radius: 16px;
          font-weight: 800;
        }

        @keyframes adminDashboardFloat {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
          }
          50% {
            transform: translateY(-18px) translateX(10px);
          }
        }

        @media (max-width: 991px) {
          .admin-dashboard-title {
            font-size: 1.95rem;
          }
        }

        @media (max-width: 767px) {
          .admin-dashboard-page {
            padding: 22px 0;
          }

          .admin-dashboard-title {
            font-size: 1.7rem;
          }
        }
      `}</style>

      <div className="admin-dashboard-page py-4 py-lg-5">
        <div className="admin-dashboard-orb admin-dashboard-orb-1"></div>
        <div className="admin-dashboard-orb admin-dashboard-orb-2"></div>

        <div className="container admin-dashboard-shell">
          {toast.show && (
            <div
              style={{
                position: "fixed",
                top: "96px",
                right: "24px",
                zIndex: 9999,
                minWidth: "280px",
                maxWidth: "380px",
              }}
            >
              <div
                className="shadow-lg rounded-4 px-4 py-3"
                style={{
                  background:
                    toast.type === "success"
                      ? "linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)"
                      : "linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)",
                  border:
                    toast.type === "success"
                      ? "1px solid #86efac"
                      : "1px solid #fca5a5",
                }}
              >
                <div
                  className={`fw-bold mb-1 ${
                    toast.type === "success" ? "text-success" : "text-danger"
                  }`}
                >
                  {toast.type === "success" ? "Success" : "Error"}
                </div>
                <div className="text-dark small">{toast.message}</div>
              </div>
            </div>
          )}

          <div className="card admin-dashboard-hero border-0 rounded-5 mb-4">
            <div className="card-body p-4 p-md-5">
              <div className="row g-4 align-items-center">
                <div className="col-lg-8">
                  <div className="admin-dashboard-chip">Internova Admin Overview</div>
                  <h1 className="admin-dashboard-title">Admin Dashboard Stats</h1>
                  <p className="admin-dashboard-text">
                    Monitor programs, modules, videos, quizzes, and recent internship activity
                    from one clean premium admin overview panel.
                  </p>
                </div>

                <div className="col-lg-4">
                  <div className="d-grid gap-3">
                    <Link
                      to="/admin/internships"
                      className="btn btn-light admin-action-btn"
                    >
                      Manage Internships
                    </Link>

                    <Link
                      to="/dashboard"
                      className="btn btn-outline-light admin-action-btn"
                    >
                      Back to User Dashboard
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row g-4 mb-4">
            <div className="col-md-6 col-xl-4">
              <div className="admin-stat-card">
                <div className="admin-stat-label">Total Programs</div>
                <h3 className="admin-stat-value">{stats.totalPrograms || 0}</h3>
              </div>
            </div>

            <div className="col-md-6 col-xl-4">
              <div className="admin-stat-card">
                <div className="admin-stat-label">Active Programs</div>
                <h3 className="admin-stat-value">{stats.activePrograms || 0}</h3>
              </div>
            </div>

            <div className="col-md-6 col-xl-4">
              <div className="admin-stat-card">
                <div className="admin-stat-label">Inactive Programs</div>
                <h3 className="admin-stat-value">{stats.inactivePrograms || 0}</h3>
              </div>
            </div>

            <div className="col-md-6 col-xl-4">
              <div className="admin-stat-card">
                <div className="admin-stat-label">Total Modules</div>
                <h3 className="admin-stat-value">{stats.totalModules || 0}</h3>
              </div>
            </div>

            <div className="col-md-6 col-xl-4">
              <div className="admin-stat-card">
                <div className="admin-stat-label">Total Videos</div>
                <h3 className="admin-stat-value">{stats.totalVideos || 0}</h3>
              </div>
            </div>

            <div className="col-md-6 col-xl-4">
              <div className="admin-stat-card">
                <div className="admin-stat-label">Total Quiz Questions</div>
                <h3 className="admin-stat-value">{stats.totalQuizQuestions || 0}</h3>
              </div>
            </div>
          </div>

          <div className="admin-section-card p-4 p-md-5">
            <h3 className="admin-section-title">Recent Internships</h3>
            <p className="admin-section-subtitle">
              Quickly review your latest created or updated internship programs.
            </p>

            <div className="row g-4">
              {recentInternships.map((item) => (
                <div className="col-md-6 col-xl-4" key={item._id}>
                  <div className="admin-recent-card">
                    <div className="d-flex justify-content-between align-items-start gap-3 flex-wrap mb-2">
                      <h5 className="admin-recent-title mb-0">{item.title}</h5>
                      <div>{getStatusBadge(item.isActive)}</div>
                    </div>

                    <p className="admin-mini-text mb-1">
                      <strong>Branch:</strong> {item.branch || "N/A"}
                    </p>
                    <p className="admin-mini-text mb-1">
                      <strong>Category:</strong> {item.category || "N/A"}
                    </p>
                    <p className="admin-mini-text mb-1">
                      <strong>Modules:</strong> {item.modulesCount || 0}
                    </p>
                    <p className="admin-mini-text mb-1">
                      <strong>Videos:</strong> {item.videosCount || 0}
                    </p>
                    <p className="admin-mini-text mb-3">
                      <strong>Quiz:</strong> {item.quizCount || 0}
                    </p>

                    <Link
                      to="/admin/internships"
                      className="btn btn-outline-dark admin-action-btn w-100"
                    >
                      Open Manager
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {recentInternships.length === 0 && (
              <div
                className="rounded-4 p-4 mt-3"
                style={{
                  background: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",
                  border: "1px solid #93c5fd",
                  color: "#1e3a8a",
                }}
              >
                <h5 className="fw-bold mb-2">No Internship Data Found</h5>
                <p className="mb-0">
                  No programs are available right now. Create your first internship from the admin manager.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminDashboard;