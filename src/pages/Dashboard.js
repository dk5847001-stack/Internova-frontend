import React from "react";
import { useNavigate, Link } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <>
      <style>{`
        .dashboard-page {
          min-height: 100vh;
          background:
            radial-gradient(circle at top left, rgba(59,130,246,0.18), transparent 28%),
            radial-gradient(circle at bottom right, rgba(99,102,241,0.16), transparent 32%),
            linear-gradient(135deg, #f8fafc 0%, #eef2ff 48%, #f8fafc 100%);
          position: relative;
          overflow: hidden;
        }

        .dashboard-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(10px);
          opacity: 0.55;
          animation: dashboardFloat 9s ease-in-out infinite;
          -webkit-animation: dashboardFloat 9s ease-in-out infinite;
          pointer-events: none;
        }

        .dashboard-orb-1 {
          width: 220px;
          height: 220px;
          top: 70px;
          left: -60px;
          background: linear-gradient(135deg, rgba(37,99,235,0.25), rgba(14,165,233,0.18));
        }

        .dashboard-orb-2 {
          width: 280px;
          height: 280px;
          right: -80px;
          bottom: 70px;
          background: linear-gradient(135deg, rgba(99,102,241,0.18), rgba(59,130,246,0.22));
          animation-delay: 1.2s;
          -webkit-animation-delay: 1.2s;
        }

        .dashboard-shell {
          position: relative;
          z-index: 2;
        }

        .dashboard-hero-card {
          border: 1px solid rgba(255,255,255,0.42);
          background:
            linear-gradient(135deg, #081226 0%, #0b1736 35%, #142850 70%, #1d4ed8 100%);
          color: #fff;
          overflow: hidden;
          position: relative;
          box-shadow:
            0 24px 70px rgba(15, 23, 42, 0.16),
            0 8px 24px rgba(59,130,246,0.08);
          -webkit-box-shadow:
            0 24px 70px rgba(15, 23, 42, 0.16),
            0 8px 24px rgba(59,130,246,0.08);
        }

        .dashboard-hero-card::before {
          content: "";
          position: absolute;
          inset: 0;
          background:
            radial-gradient(circle at 18% 22%, rgba(255,255,255,0.12), transparent 22%),
            radial-gradient(circle at 82% 74%, rgba(255,255,255,0.08), transparent 18%);
          pointer-events: none;
        }

        .dashboard-chip {
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

        .dashboard-hero-title {
          font-size: 2.3rem;
          font-weight: 800;
          letter-spacing: -0.03em;
          margin-bottom: 10px;
        }

        .dashboard-hero-subtitle {
          color: rgba(255,255,255,0.82);
          line-height: 1.8;
          margin-bottom: 0;
          max-width: 720px;
        }

        .dashboard-stat-card {
          background: rgba(255,255,255,0.12);
          border: 1px solid rgba(255,255,255,0.16);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border-radius: 24px;
          padding: 20px;
          height: 100%;
          -webkit-transition: all 0.3s ease;
          transition: all 0.3s ease;
        }

        .dashboard-stat-card:hover {
          transform: translateY(-4px);
          -webkit-transform: translateY(-4px);
          background: rgba(255,255,255,0.16);
        }

        .dashboard-stat-label {
          font-size: 0.82rem;
          color: rgba(255,255,255,0.75);
          margin-bottom: 6px;
        }

        .dashboard-stat-value {
          font-size: 1.7rem;
          font-weight: 800;
          color: #fff;
          margin-bottom: 0;
        }

        .dashboard-glass-card {
          border: 1px solid rgba(255,255,255,0.42);
          background: rgba(255,255,255,0.72);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          box-shadow:
            0 22px 65px rgba(15, 23, 42, 0.12),
            0 8px 22px rgba(59,130,246,0.06);
          -webkit-box-shadow:
            0 22px 65px rgba(15, 23, 42, 0.12),
            0 8px 22px rgba(59,130,246,0.06);
          -webkit-transition: all 0.35s ease;
          transition: all 0.35s ease;
        }

        .dashboard-glass-card:hover {
          transform: translateY(-4px);
          -webkit-transform: translateY(-4px);
        }

        .dashboard-profile-title {
          font-size: 1.7rem;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 14px;
        }

        .dashboard-profile-subtitle {
          color: #64748b;
          line-height: 1.8;
          margin-bottom: 24px;
        }

        .dashboard-info-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 14px;
        }

        .dashboard-info-box {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 20px;
          padding: 16px 18px;
          min-height: 96px;
        }

        .dashboard-info-label {
          font-size: 0.82rem;
          color: #64748b;
          margin-bottom: 6px;
        }

        .dashboard-info-value {
          font-size: 1rem;
          font-weight: 700;
          color: #0f172a;
          word-break: break-word;
        }

        .dashboard-panel-title {
          font-size: 1.25rem;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 16px;
        }

        .dashboard-panel-subtitle {
          color: #64748b;
          margin-bottom: 20px;
          line-height: 1.7;
        }

        .dashboard-action-btn {
          min-height: 54px;
          border-radius: 18px;
          font-weight: 700;
          -webkit-transition: all 0.3s ease;
          transition: all 0.3s ease;
          box-shadow: 0 10px 25px rgba(15, 23, 42, 0.05);
          -webkit-box-shadow: 0 10px 25px rgba(15, 23, 42, 0.05);
        }

        .dashboard-action-btn:hover {
          transform: translateY(-2px);
          -webkit-transform: translateY(-2px);
        }

        .dashboard-primary-btn {
          border: none;
          color: #fff;
          background: linear-gradient(135deg, #0b1736 0%, #142850 40%, #1d4ed8 100%);
          box-shadow:
            0 18px 35px rgba(29, 78, 216, 0.18),
            0 8px 20px rgba(11, 23, 54, 0.14);
          -webkit-box-shadow:
            0 18px 35px rgba(29, 78, 216, 0.18),
            0 8px 20px rgba(11, 23, 54, 0.14);
        }

        .dashboard-primary-btn:hover {
          color: #fff;
        }

        .dashboard-feature-card {
          border-radius: 28px;
          border: 1px solid rgba(255,255,255,0.45);
          background: rgba(255,255,255,0.72);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          box-shadow:
            0 22px 65px rgba(15, 23, 42, 0.1),
            0 8px 20px rgba(59,130,246,0.05);
          -webkit-box-shadow:
            0 22px 65px rgba(15, 23, 42, 0.1),
            0 8px 20px rgba(59,130,246,0.05);
          padding: 28px;
          height: 100%;
          -webkit-transition: all 0.35s ease;
          transition: all 0.35s ease;
        }

        .dashboard-feature-card:hover {
          transform: translateY(-6px);
          -webkit-transform: translateY(-6px);
        }

        .dashboard-feature-icon {
          width: 58px;
          height: 58px;
          border-radius: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.35rem;
          margin-bottom: 18px;
          background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
          color: #1d4ed8;
          border: 1px solid #dbeafe;
        }

        .dashboard-feature-title {
          font-size: 1.2rem;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 10px;
        }

        .dashboard-feature-text {
          color: #64748b;
          line-height: 1.8;
          margin-bottom: 0;
        }

        @keyframes dashboardFloat {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
          }
          50% {
            transform: translateY(-18px) translateX(10px);
          }
        }

        @-webkit-keyframes dashboardFloat {
          0%, 100% {
            -webkit-transform: translateY(0px) translateX(0px);
          }
          50% {
            -webkit-transform: translateY(-18px) translateX(10px);
          }
        }

        @media (max-width: 991px) {
          .dashboard-hero-title {
            font-size: 2rem;
          }

          .dashboard-profile-title {
            font-size: 1.55rem;
          }
        }

        @media (max-width: 767px) {
          .dashboard-page {
            padding: 22px 0;
          }

          .dashboard-hero-title {
            font-size: 1.75rem;
          }

          .dashboard-info-grid {
            grid-template-columns: 1fr;
          }

          .dashboard-feature-card {
            padding: 22px;
          }
        }
      `}</style>

      <div className="dashboard-page py-4 py-lg-5">
        <div className="dashboard-orb dashboard-orb-1"></div>
        <div className="dashboard-orb dashboard-orb-2"></div>

        <div className="container dashboard-shell">
          <div className="card dashboard-hero-card border-0 rounded-5 mb-4">
            <div className="card-body p-4 p-md-5">
              <div className="row g-4 align-items-center">
                <div className="col-lg-8">
                  <div className="dashboard-chip">Internova Premium Workspace</div>
                  <h1 className="dashboard-hero-title">
                    Welcome to Internova, {user?.name || "User"} 👋
                  </h1>
                  <p className="dashboard-hero-subtitle">
                    Track your learning progress, manage course access, download
                     offer letters, complete mini tests, and generate verified
                    certificates from one elegant dashboard.
                  </p>
                </div>

                <div className="col-lg-4">
                  <div className="row g-3">
                    <div className="col-6">
                      <div className="dashboard-stat-card">
                        <div className="dashboard-stat-label">Account Role</div>
                        <h4 className="dashboard-stat-value">
                          {user?.role || "User"}
                        </h4>
                      </div>
                    </div>

                    <div className="col-6">
                      <div className="dashboard-stat-card">
                        <div className="dashboard-stat-label">Access Level</div>
                        <h4 className="dashboard-stat-value">
                          {user?.role === "admin" ? "Admin" : "Member"}
                        </h4>
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="dashboard-stat-card">
                        <div className="dashboard-stat-label">Workspace</div>
                        <h4 className="dashboard-stat-value">Learning Ready</h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row g-4 mb-4">
            <div className="col-lg-7">
              <div className="card dashboard-glass-card border-0 rounded-5 h-100">
                <div className="card-body p-4 p-md-5">
                  <h2 className="dashboard-profile-title">Your Profile Overview</h2>
                  <p className="dashboard-profile-subtitle">
                    Keep track of your account details and access your full
                    learning workspace with a clean premium experience.
                  </p>

                  <div className="dashboard-info-grid">
                    <div className="dashboard-info-box">
                      <div className="dashboard-info-label">Full Name</div>
                      <div className="dashboard-info-value">
                        {user?.name || "User"}
                      </div>
                    </div>

                    <div className="dashboard-info-box">
                      <div className="dashboard-info-label">Email Address</div>
                      <div className="dashboard-info-value">
                        {user?.email || "N/A"}
                      </div>
                    </div>

                    <div className="dashboard-info-box">
                      <div className="dashboard-info-label">Role</div>
                      <div className="dashboard-info-value">
                        {user?.role || "User"}
                      </div>
                    </div>

                    <div className="dashboard-info-box">
                      <div className="dashboard-info-label">Status</div>
                      <div className="dashboard-info-value">Active Account</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-5">
              <div className="card dashboard-glass-card border-0 rounded-5 h-100">
                <div className="card-body p-4 p-md-5">
                  <h3 className="dashboard-panel-title">Quick Actions</h3>
                  <p className="dashboard-panel-subtitle">
                    Access the most important sections of your Internova account instantly.
                  </p>

                  <div className="d-grid gap-3">
                    <Link
                      to="/internships"
                      className="btn dashboard-action-btn dashboard-primary-btn"
                    >
                      Explore Programs
                    </Link>

                    <Link
                      to="/my-purchases"
                      className="btn btn-success dashboard-action-btn"
                    >
                      My Enrollments & Progress
                    </Link>

                    <Link
                      to="/verify"
                      className="btn btn-outline-dark dashboard-action-btn"
                    >
                      Verify Certificate
                    </Link>

                    {user?.role === "admin" && (
                      <>
                        <Link
                          to="/admin/dashboard"
                          className="btn btn-outline-primary dashboard-action-btn"
                        >
                          Admin Dashboard
                        </Link>

                        <Link
                          to="/admin/internships"
                          className="btn btn-outline-dark dashboard-action-btn"
                        >
                          Manage Internships
                        </Link>
                      </>
                    )}

                    <button
                      onClick={handleLogout}
                      className="btn btn-danger dashboard-action-btn"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row g-4">
            <div className="col-md-4">
              <div className="dashboard-feature-card">
                <div className="dashboard-feature-icon">🚀</div>
                <h4 className="dashboard-feature-title">Programs</h4>
                <p className="dashboard-feature-text">
                  Browse domain-based Internship Programs with flexible durations,
                  guided learning paths, and a clean premium experience.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="dashboard-feature-card">
                <div className="dashboard-feature-icon">📈</div>
                <h4 className="dashboard-feature-title">Progress</h4>
                <p className="dashboard-feature-text">
                  Open your course, track real learning progress, unlock mini
                  tests, and move toward certificate eligibility.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="dashboard-feature-card">
                <div className="dashboard-feature-icon">🏆</div>
                <h4 className="dashboard-feature-title">Certificates</h4>
                <p className="dashboard-feature-text">
                  Generate, download, and verify official Internova certificates
                  with branded document support and trusted validation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;