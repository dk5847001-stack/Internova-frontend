import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [search, setSearch] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const handleSearch = (e) => {
    e.preventDefault();

    if (!search.trim()) return;

    navigate(`/internships?search=${encodeURIComponent(search.trim())}`);
    setSearch("");
  };

  const isActive = (path) => {
    if (path === "/dashboard") return location.pathname === "/dashboard";
    if (path === "/internships") return location.pathname.startsWith("/internships");
    if (path === "/my-purchases") return location.pathname.startsWith("/my-purchases");
    if (path === "/verify") return location.pathname.startsWith("/verify");
    return false;
  };

  return (
    <>
      <style>{`
        .internova-navbar {
          background: rgba(255, 255, 255, 0.72);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-bottom: 1px solid rgba(226, 232, 240, 0.85);
          box-shadow: 0 10px 35px rgba(15, 23, 42, 0.06);
          -webkit-box-shadow: 0 10px 35px rgba(15, 23, 42, 0.06);
          padding-top: 12px;
          padding-bottom: 12px;
          z-index: 1100;
        }

        .internova-brand {
          text-decoration: none;
          -webkit-transition: all 0.3s ease;
          transition: all 0.3s ease;
          min-width: 0;
        }

        .internova-brand:hover {
          transform: translateY(-1px);
          -webkit-transform: translateY(-1px);
        }

        .internova-logo-circle {
          width: 48px;
          height: 48px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #0b1736 0%, #142850 45%, #1d4ed8 100%);
          color: #fff;
          font-weight: 800;
          font-size: 1.1rem;
          box-shadow:
            0 14px 28px rgba(29, 78, 216, 0.22),
            0 6px 14px rgba(11, 23, 54, 0.18);
          -webkit-box-shadow:
            0 14px 28px rgba(29, 78, 216, 0.22),
            0 6px 14px rgba(11, 23, 54, 0.18);
          flex-shrink: 0;
        }

        .brand-main {
          display: block;
          font-size: 1.08rem;
          font-weight: 800;
          color: #0f172a;
          line-height: 1.1;
          letter-spacing: -0.02em;
        }

        .brand-sub {
          font-size: 0.74rem;
          color: #64748b;
          line-height: 1.2;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }

        .internova-toggler {
          border: 1px solid #dbe3f0;
          border-radius: 14px;
          padding: 8px 10px;
          box-shadow: none !important;
          -webkit-transition: all 0.25s ease;
          transition: all 0.25s ease;
        }

        .internova-toggler:hover {
          background: #f8fafc;
        }

        .internova-toggler:focus {
          box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.12) !important;
          -webkit-box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.12) !important;
        }

        .internova-link {
          position: relative;
          color: #475569 !important;
          font-weight: 700;
          padding: 10px 16px !important;
          border-radius: 14px;
          -webkit-transition: all 0.28s ease;
          transition: all 0.28s ease;
          white-space: nowrap;
        }

        .internova-link:hover {
          color: #0f172a !important;
          background: #f8fafc;
          transform: translateY(-1px);
          -webkit-transform: translateY(-1px);
        }

        .internova-link.active {
          color: #0f172a !important;
          background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
          box-shadow: inset 0 0 0 1px #dbeafe;
          -webkit-box-shadow: inset 0 0 0 1px #dbeafe;
        }

        .internova-right-zone {
          display: flex;
          align-items: center;
          gap: 12px;
          min-width: 0;
          flex-wrap: nowrap;
        }

        .internova-search-wrap {
          display: flex;
          align-items: center;
          background: #f8fafc;
          border: 1px solid #dbe3f0;
          border-radius: 18px;
          padding: 4px;
          min-height: 54px;
          width: 320px;
          max-width: 320px;
          min-width: 0;
          flex-shrink: 1;
          -webkit-transition: all 0.3s ease;
          transition: all 0.3s ease;
        }

        .internova-search-wrap:focus-within {
          background: #ffffff;
          border-color: #60a5fa;
          box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.12);
          -webkit-box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.12);
        }

        .internova-search {
          border: none;
          outline: none;
          background: transparent;
          padding: 0 14px;
          flex: 1;
          color: #0f172a;
          font-weight: 600;
          min-width: 0;
        }

        .internova-search::placeholder {
          color: #94a3b8;
          font-weight: 500;
        }

        .internova-search-btn {
          border: none;
          min-height: 44px;
          padding: 0 18px;
          border-radius: 14px;
          font-weight: 800;
          color: #fff;
          background: linear-gradient(135deg, #0b1736 0%, #142850 40%, #1d4ed8 100%);
          box-shadow:
            0 12px 25px rgba(29, 78, 216, 0.18),
            0 6px 14px rgba(11, 23, 54, 0.14);
          -webkit-box-shadow:
            0 12px 25px rgba(29, 78, 216, 0.18),
            0 6px 14px rgba(11, 23, 54, 0.14);
          -webkit-transition: all 0.28s ease;
          transition: all 0.28s ease;
          white-space: nowrap;
          flex-shrink: 0;
        }

        .internova-search-btn:hover {
          transform: translateY(-1px);
          -webkit-transform: translateY(-1px);
        }

        .internova-user-actions {
          display: flex;
          align-items: center;
          gap: 10px;
          min-width: 0;
          flex-shrink: 1;
        }

        .internova-user-pill {
          display: inline-flex;
          align-items: center;
          min-height: 44px;
          max-width: 210px;
          min-width: 0;
          padding: 0 16px;
          border-radius: 999px;
          background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
          color: #0f172a;
          font-weight: 800;
          border: 1px solid #dbeafe;
          overflow: hidden;
          flex-shrink: 1;
          -webkit-transition: all 0.3s ease;
          transition: all 0.3s ease;
        }

        .internova-user-name {
          display: block;
          max-width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .internova-logout-btn,
        .internova-auth-btn,
        .internova-auth-outline-btn {
          min-height: 46px;
          padding: 0 18px;
          border-radius: 16px;
          font-weight: 800;
          -webkit-transition: all 0.3s ease;
          transition: all 0.3s ease;
          white-space: nowrap;
        }

        .internova-logout-btn,
        .internova-auth-btn {
          border: none;
          color: #fff;
          background: linear-gradient(135deg, #0b1736 0%, #142850 40%, #1d4ed8 100%);
          box-shadow:
            0 12px 25px rgba(29, 78, 216, 0.18),
            0 6px 14px rgba(11, 23, 54, 0.14);
          -webkit-box-shadow:
            0 12px 25px rgba(29, 78, 216, 0.18),
            0 6px 14px rgba(11, 23, 54, 0.14);
        }

        .internova-auth-outline-btn {
          border: 1px solid #dbe3f0;
          background: rgba(255,255,255,0.7);
          color: #0f172a;
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
        }

        .internova-logout-btn:hover,
        .internova-auth-btn:hover,
        .internova-auth-outline-btn:hover {
          transform: translateY(-2px);
          -webkit-transform: translateY(-2px);
        }

        @media (max-width: 1399px) {
          .internova-search-wrap {
            width: 280px;
            max-width: 280px;
          }

          .internova-user-pill {
            max-width: 180px;
          }
        }

        @media (max-width: 1199px) {
          .internova-search-wrap {
            width: 240px;
            max-width: 240px;
          }

          .internova-user-pill {
            max-width: 150px;
          }

          .internova-link {
            padding: 10px 12px !important;
          }
        }

        @media (max-width: 991px) {
          .internova-navbar {
            padding-top: 10px;
            padding-bottom: 10px;
          }

          .navbar-collapse {
            margin-top: 14px;
            padding-top: 14px;
            border-top: 1px solid #e2e8f0;
          }

          .internova-link {
            width: 100%;
          }

          .internova-right-zone {
            flex-direction: column;
            align-items: stretch;
            width: 100%;
          }

          .internova-search-wrap {
            width: 100%;
            max-width: 100%;
          }

          .internova-user-actions {
            width: 100%;
            justify-content: space-between;
            flex-wrap: wrap;
          }

          .internova-user-pill {
            max-width: 100%;
          }
        }

        @media (max-width: 767px) {
          .brand-main {
            font-size: 1rem;
          }

          .brand-sub {
            font-size: 0.68rem;
          }

          .internova-logo-circle {
            width: 44px;
            height: 44px;
            border-radius: 14px;
          }

          .internova-user-actions {
            flex-direction: column;
            align-items: stretch;
          }

          .internova-user-pill,
          .internova-logout-btn {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>

      <nav className="navbar navbar-expand-lg internova-navbar sticky-top">
        <div className="container">
          <Link
            className="navbar-brand internova-brand d-flex align-items-center gap-2"
            to="/dashboard"
          >
            <div className="internova-logo-circle">I</div>
            <div>
              <span className="brand-main">Internova</span>
              <span className="brand-sub d-block">Learning Platform</span>
            </div>
          </Link>

          <button
            className="navbar-toggler internova-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#internovaNavbar"
            aria-controls="internovaNavbar"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="internovaNavbar">
            <ul className="navbar-nav mx-auto mb-2 mb-lg-0 align-items-lg-center gap-lg-2">
              <li className="nav-item">
                <Link
                  className={`nav-link internova-link ${
                    isActive("/dashboard") ? "active" : ""
                  }`}
                  to="/dashboard"
                >
                  Dashboard
                </Link>
              </li>

              <li className="nav-item">
                <Link
                  className={`nav-link internova-link ${
                    isActive("/internships") ? "active" : ""
                  }`}
                  to="/internships"
                >
                  Programs
                </Link>
              </li>

              <li className="nav-item">
                <Link
                  className={`nav-link internova-link ${
                    isActive("/my-purchases") ? "active" : ""
                  }`}
                  to="/my-purchases"
                >
                  My Enrollments
                </Link>
              </li>

              <li className="nav-item">
                <Link
                  className={`nav-link internova-link ${
                    isActive("/verify") ? "active" : ""
                  }`}
                  to="/verify"
                >
                  Verify
                </Link>
              </li>
            </ul>

            <div className="internova-right-zone">
              <form className="internova-search-wrap" onSubmit={handleSearch}>
                <input
                  type="text"
                  className="internova-search"
                  placeholder="Search programs..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <button type="submit" className="internova-search-btn">
                  Search
                </button>
              </form>

              {token ? (
                <div className="internova-user-actions">
                  <span
                    className="internova-user-pill"
                    title={user?.name || "User"}
                  >
                    <span className="internova-user-name">
                      {user?.name || "User"}
                    </span>
                  </span>

                  <button
                    className="btn internova-logout-btn"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="d-flex gap-2">
                  <Link to="/" className="btn internova-auth-btn">
                    Login
                  </Link>
                  <Link to="/register" className="btn internova-auth-outline-btn">
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;