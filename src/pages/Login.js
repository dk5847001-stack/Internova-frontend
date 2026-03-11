import React, { useState } from "react";
import API from "../services/api";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setMessage("");

      const { data } = await API.post("/auth/login", formData);

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setMessage("Login successful");
      setTimeout(() => {
        navigate("/dashboard");
      }, 700);
    } catch (error) {
      setMessage(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        .login-page {
          min-height: 100vh;
          background:
            radial-gradient(circle at top left, rgba(59,130,246,0.18), transparent 28%),
            radial-gradient(circle at bottom right, rgba(99,102,241,0.16), transparent 32%),
            linear-gradient(135deg, #f8fafc 0%, #eef2ff 48%, #f8fafc 100%);
          position: relative;
          overflow: hidden;
        }

        .login-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(10px);
          opacity: 0.55;
          animation: floatOrb 9s ease-in-out infinite;
          -webkit-animation: floatOrb 9s ease-in-out infinite;
          pointer-events: none;
        }

        .login-orb-1 {
          width: 220px;
          height: 220px;
          top: 70px;
          left: -60px;
          background: linear-gradient(135deg, rgba(37,99,235,0.25), rgba(14,165,233,0.18));
        }

        .login-orb-2 {
          width: 280px;
          height: 280px;
          right: -80px;
          bottom: 60px;
          background: linear-gradient(135deg, rgba(99,102,241,0.18), rgba(59,130,246,0.22));
          animation-delay: 1.5s;
          -webkit-animation-delay: 1.5s;
        }

        .login-shell {
          position: relative;
          z-index: 2;
        }

        .login-main-card {
          border: 1px solid rgba(255,255,255,0.45);
          background: rgba(255,255,255,0.72);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          box-shadow:
            0 24px 70px rgba(15, 23, 42, 0.14),
            0 8px 24px rgba(59, 130, 246, 0.08);
          -webkit-box-shadow:
            0 24px 70px rgba(15, 23, 42, 0.14),
            0 8px 24px rgba(59, 130, 246, 0.08);
          -webkit-transition: all 0.35s ease;
          transition: all 0.35s ease;
        }

        .login-main-card:hover {
          transform: translateY(-4px);
          -webkit-transform: translateY(-4px);
          box-shadow:
            0 30px 80px rgba(15, 23, 42, 0.18),
            0 10px 30px rgba(59, 130, 246, 0.1);
          -webkit-box-shadow:
            0 30px 80px rgba(15, 23, 42, 0.18),
            0 10px 30px rgba(59, 130, 246, 0.1);
        }

        .login-brand-panel {
          background:
            linear-gradient(145deg, #081226 0%, #0b1736 35%, #142850 75%, #1d4ed8 100%);
          color: #fff;
          position: relative;
          overflow: hidden;
        }

        .login-brand-panel::before {
          content: "";
          position: absolute;
          inset: 0;
          background:
            radial-gradient(circle at 20% 20%, rgba(255,255,255,0.12), transparent 22%),
            radial-gradient(circle at 80% 75%, rgba(255,255,255,0.10), transparent 18%);
          pointer-events: none;
        }

        .login-brand-panel::after {
          content: "";
          position: absolute;
          width: 220px;
          height: 220px;
          border-radius: 50%;
          background: rgba(255,255,255,0.06);
          bottom: -70px;
          right: -60px;
          filter: blur(2px);
        }

        .brand-chip {
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
          margin-bottom: 20px;
        }

        .brand-logo {
          width: 52px;
          height: 52px;
          border-radius: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255,255,255,0.12);
          border: 1px solid rgba(255,255,255,0.16);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.12);
          -webkit-box-shadow: inset 0 1px 0 rgba(255,255,255,0.12);
          font-size: 1.15rem;
          font-weight: 800;
          margin-bottom: 18px;
        }

        .login-brand-title {
          font-size: 2.2rem;
          font-weight: 800;
          letter-spacing: -0.03em;
          margin-bottom: 10px;
        }

        .login-brand-subtitle {
          font-size: 1.05rem;
          color: rgba(255,255,255,0.82);
          line-height: 1.8;
          margin-bottom: 28px;
          max-width: 460px;
        }

        .login-feature-list {
          display: grid;
          gap: 12px;
        }

        .login-feature-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 14px;
          border-radius: 18px;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.10);
          color: rgba(255,255,255,0.92);
          font-size: 0.95rem;
          -webkit-transition: all 0.3s ease;
          transition: all 0.3s ease;
        }

        .login-feature-item:hover {
          transform: translateX(4px);
          -webkit-transform: translateX(4px);
          background: rgba(255,255,255,0.12);
        }

        .login-feature-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #93c5fd;
          box-shadow: 0 0 0 5px rgba(147,197,253,0.15);
          -webkit-box-shadow: 0 0 0 5px rgba(147,197,253,0.15);
          flex-shrink: 0;
        }

        .login-form-panel {
          background: rgba(255,255,255,0.82);
        }

        .login-form-wrap {
          max-width: 460px;
          margin: 0 auto;
        }

        .login-form-top {
          margin-bottom: 28px;
        }

        .login-form-kicker {
          display: inline-block;
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #2563eb;
          background: #eff6ff;
          border: 1px solid #dbeafe;
          padding: 9px 14px;
          border-radius: 999px;
          margin-bottom: 14px;
        }

        .login-heading {
          font-size: 2rem;
          font-weight: 800;
          letter-spacing: -0.03em;
          color: #0f172a;
          margin-bottom: 8px;
        }

        .login-subheading {
          color: #64748b;
          margin-bottom: 0;
          line-height: 1.7;
        }

        .login-alert {
          border: none;
          border-radius: 18px;
          padding: 14px 16px;
          font-weight: 600;
          margin-bottom: 22px;
          box-shadow: 0 10px 30px rgba(15, 23, 42, 0.06);
          -webkit-box-shadow: 0 10px 30px rgba(15, 23, 42, 0.06);
        }

        .login-alert-success {
          background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
          color: #065f46;
          border: 1px solid #86efac;
        }

        .login-alert-error {
          background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
          color: #991b1b;
          border: 1px solid #fca5a5;
        }

        .login-label {
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 9px;
          font-size: 0.95rem;
        }

        .login-input-wrap {
          position: relative;
        }

        .login-input {
          min-height: 60px;
          border-radius: 18px;
          border: 1px solid #dbe3f0;
          background: #f8fafc;
          padding: 14px 18px;
          color: #0f172a;
          font-size: 1rem;
          box-shadow: inset 0 1px 2px rgba(15,23,42,0.03);
          -webkit-box-shadow: inset 0 1px 2px rgba(15,23,42,0.03);
          -webkit-transition: all 0.3s ease;
          transition: all 0.3s ease;
        }

        .login-input:focus {
          border-color: #60a5fa;
          background: #ffffff;
          box-shadow:
            0 0 0 4px rgba(37,99,235,0.12),
            0 12px 28px rgba(37,99,235,0.08);
          -webkit-box-shadow:
            0 0 0 4px rgba(37,99,235,0.12),
            0 12px 28px rgba(37,99,235,0.08);
          transform: translateY(-1px);
          -webkit-transform: translateY(-1px);
        }

        .login-input::placeholder {
          color: #94a3b8;
        }

        .password-toggle-btn {
          position: absolute;
          top: 50%;
          right: 14px;
          transform: translateY(-50%);
          -webkit-transform: translateY(-50%);
          border: none;
          background: transparent;
          color: #475569;
          font-weight: 700;
          font-size: 0.9rem;
          padding: 8px 10px;
          border-radius: 12px;
          -webkit-transition: all 0.25s ease;
          transition: all 0.25s ease;
        }

        .password-toggle-btn:hover {
          background: #e2e8f0;
          color: #0f172a;
        }

        .login-action-row {
          display: flex;
          justify-content: flex-end;
          margin-bottom: 22px;
        }

        .login-link {
          color: #2563eb;
          text-decoration: none;
          font-weight: 700;
          -webkit-transition: all 0.25s ease;
          transition: all 0.25s ease;
        }

        .login-link:hover {
          color: #1d4ed8;
          text-decoration: none;
          transform: translateY(-1px);
          -webkit-transform: translateY(-1px);
        }

        .login-submit-btn {
          min-height: 60px;
          border: none;
          border-radius: 18px;
          font-weight: 800;
          font-size: 1rem;
          letter-spacing: 0.01em;
          color: #fff;
          background: linear-gradient(135deg, #0b1736 0%, #142850 40%, #1d4ed8 100%);
          box-shadow:
            0 18px 35px rgba(29, 78, 216, 0.22),
            0 8px 20px rgba(11, 23, 54, 0.18);
          -webkit-box-shadow:
            0 18px 35px rgba(29, 78, 216, 0.22),
            0 8px 20px rgba(11, 23, 54, 0.18);
          -webkit-transition: all 0.32s ease;
          transition: all 0.32s ease;
        }

        .login-submit-btn:hover:not(:disabled) {
          transform: translateY(-2px) scale(1.01);
          -webkit-transform: translateY(-2px) scale(1.01);
          box-shadow:
            0 24px 45px rgba(29, 78, 216, 0.28),
            0 10px 24px rgba(11, 23, 54, 0.22);
          -webkit-box-shadow:
            0 24px 45px rgba(29, 78, 216, 0.28),
            0 10px 24px rgba(11, 23, 54, 0.22);
        }

        .login-submit-btn:disabled {
          opacity: 0.8;
          cursor: not-allowed;
        }

        .login-footer-text {
          text-align: center;
          color: #64748b;
          margin-top: 22px;
          margin-bottom: 0;
        }

        .login-footer-text strong,
        .login-footer-text a {
          color: #0f172a;
        }

        .login-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, #e2e8f0, transparent);
          margin: 22px 0 8px;
        }

        @keyframes floatOrb {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
          }
          50% {
            transform: translateY(-18px) translateX(10px);
          }
        }

        @-webkit-keyframes floatOrb {
          0%, 100% {
            -webkit-transform: translateY(0px) translateX(0px);
          }
          50% {
            -webkit-transform: translateY(-18px) translateX(10px);
          }
        }

        @media (max-width: 991px) {
          .login-brand-panel {
            min-height: 340px;
          }

          .login-brand-title {
            font-size: 1.9rem;
          }

          .login-heading {
            font-size: 1.8rem;
          }
        }

        @media (max-width: 767px) {
          .login-page {
            padding: 24px 0;
          }

          .login-brand-panel,
          .login-form-panel {
            border-radius: 0 !important;
          }

          .login-brand-title {
            font-size: 1.75rem;
          }

          .login-heading {
            font-size: 1.65rem;
          }

          .login-feature-list {
            gap: 10px;
          }

          .login-feature-item {
            font-size: 0.9rem;
          }
        }
      `}</style>

      <div className="login-page d-flex align-items-center py-4 py-lg-5">
        <div className="login-orb login-orb-1"></div>
        <div className="login-orb login-orb-2"></div>

        <div className="container login-shell">
          <div className="row justify-content-center align-items-center min-vh-100">
            <div className="col-xl-11 col-xxl-10">
              <div className="card login-main-card border-0 rounded-5 overflow-hidden">
                <div className="row g-0">
                  <div className="col-lg-6 login-brand-panel d-flex flex-column justify-content-center p-4 p-md-5 p-xl-5">
                    <div className="brand-chip">Internova Secure Access</div>

                    <div className="brand-logo">IN</div>

                    <h1 className="login-brand-title">Welcome Back</h1>
                    <p className="login-brand-subtitle">
                      Access your internship dashboard, progress tracking,
                      mini tests, Learning Access Letter, certificates, and verification
                      tools in one premium workspace.
                    </p>

                    <div className="login-feature-list">
                      <div className="login-feature-item">
                        <span className="login-feature-dot"></span>
                        Course access with structured learning flow
                      </div>
                      <div className="login-feature-item">
                        <span className="login-feature-dot"></span>
                        Premium Learning Access Letter and certificate downloads
                      </div>
                      <div className="login-feature-item">
                        <span className="login-feature-dot"></span>
                        QR-based verification and trusted document checks
                      </div>
                      <div className="login-feature-item">
                        <span className="login-feature-dot"></span>
                        Secure access to your full Internova account
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-6 login-form-panel">
                    <div className="p-4 p-md-5 p-xl-5 h-100 d-flex align-items-center">
                      <div className="login-form-wrap w-100">
                        <div className="login-form-top">
                          <div className="login-form-kicker">Account Login</div>
                          <h2 className="login-heading">Sign in to continue</h2>
                          <p className="login-subheading">
                            Enter your registered email and password to access
                            your Internova dashboard.
                          </p>
                        </div>

                        {message && (
                          <div
                            className={`login-alert ${
                              message.toLowerCase().includes("successful")
                                ? "login-alert-success"
                                : "login-alert-error"
                            }`}
                          >
                            {message}
                          </div>
                        )}

                        <form onSubmit={handleSubmit}>
                          <div className="mb-3">
                            <label className="login-label">Email Address</label>
                            <div className="login-input-wrap">
                              <input
                                type="email"
                                name="email"
                                placeholder="Enter your email"
                                className="form-control login-input"
                                value={formData.email}
                                onChange={handleChange}
                                required
                              />
                            </div>
                          </div>

                          <div className="mb-3">
                            <label className="login-label">Password</label>
                            <div className="login-input-wrap">
                              <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Enter your password"
                                className="form-control login-input pe-5"
                                value={formData.password}
                                onChange={handleChange}
                                required
                              />
                              <button
                                type="button"
                                className="password-toggle-btn"
                                onClick={() => setShowPassword((prev) => !prev)}
                              >
                                {showPassword ? "Hide" : "Show"}
                              </button>
                            </div>
                          </div>

                          <div className="login-action-row">
                            <Link to="/forgot-password" className="login-link">
                              Forgot Password?
                            </Link>
                          </div>

                          <button
                            type="submit"
                            className="btn login-submit-btn w-100"
                            disabled={loading}
                          >
                            {loading ? "Signing In..." : "Login"}
                          </button>
                        </form>

                        <div className="login-divider"></div>

                        <p className="login-footer-text">
                          Don’t have an account?{" "}
                          <Link
                            to="/register"
                            className="login-link fw-semibold"
                          >
                            Register
                          </Link>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;