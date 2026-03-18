import React, { useMemo, useState } from "react";
import API from "../services/api";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";

function ResetPassword() {
  const navigate = useNavigate();
  const { token: routeToken } = useParams();
  const [searchParams] = useSearchParams();

  const token = useMemo(() => {
    return (
      routeToken ||
      searchParams.get("token") ||
      searchParams.get("resetToken") ||
      ""
    );
  }, [routeToken, searchParams]);

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const password = formData.password.trim();
    const confirmPassword = formData.confirmPassword.trim();

    if (!token) {
      setMessage("Reset token is missing or invalid.");
      return;
    }

    if (!password || !confirmPassword) {
      setMessage("Please fill in both password fields.");
      return;
    }

    if (password.length < 6) {
      setMessage("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Password and confirm password do not match.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const payload = {
        token,
        password,
      };

      const { data } = await API.post("/auth/reset-password", payload);

      setMessage(data?.message || "Password reset successful.");

      setTimeout(() => {
        navigate("/");
      }, 1200);
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        .reset-page {
          min-height: 100vh;
          background:
            radial-gradient(circle at top left, rgba(59,130,246,0.18), transparent 28%),
            radial-gradient(circle at bottom right, rgba(99,102,241,0.16), transparent 32%),
            linear-gradient(135deg, #f8fafc 0%, #eef2ff 48%, #f8fafc 100%);
          position: relative;
          overflow: hidden;
        }

        .reset-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(10px);
          opacity: 0.55;
          animation: resetFloat 9s ease-in-out infinite;
          pointer-events: none;
        }

        .reset-orb-1 {
          width: 220px;
          height: 220px;
          top: 70px;
          left: -60px;
          background: linear-gradient(135deg, rgba(37,99,235,0.25), rgba(14,165,233,0.18));
        }

        .reset-orb-2 {
          width: 280px;
          height: 280px;
          right: -80px;
          bottom: 60px;
          background: linear-gradient(135deg, rgba(99,102,241,0.18), rgba(59,130,246,0.22));
          animation-delay: 1.5s;
        }

        .reset-shell {
          position: relative;
          z-index: 2;
        }

        .reset-main-card {
          border: 1px solid rgba(255,255,255,0.45);
          background: rgba(255,255,255,0.72);
          backdrop-filter: blur(16px);
          box-shadow:
            0 24px 70px rgba(15, 23, 42, 0.14),
            0 8px 24px rgba(59, 130, 246, 0.08);
          transition: all 0.35s ease;
        }

        .reset-main-card:hover {
          transform: translateY(-4px);
          box-shadow:
            0 30px 80px rgba(15, 23, 42, 0.18),
            0 10px 30px rgba(59, 130, 246, 0.1);
        }

        .reset-brand-panel {
          background:
            linear-gradient(145deg, #081226 0%, #0b1736 35%, #142850 75%, #1d4ed8 100%);
          color: #fff;
          position: relative;
          overflow: hidden;
        }

        .reset-brand-panel::before {
          content: "";
          position: absolute;
          inset: 0;
          background:
            radial-gradient(circle at 20% 20%, rgba(255,255,255,0.12), transparent 22%),
            radial-gradient(circle at 80% 75%, rgba(255,255,255,0.10), transparent 18%);
          pointer-events: none;
        }

        .reset-chip {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          border-radius: 999px;
          background: rgba(255,255,255,0.12);
          border: 1px solid rgba(255,255,255,0.18);
          font-size: 0.8rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 20px;
        }

        .reset-brand-logo {
          width: 52px;
          height: 52px;
          border-radius: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255,255,255,0.12);
          border: 1px solid rgba(255,255,255,0.16);
          font-size: 1.15rem;
          font-weight: 800;
          margin-bottom: 18px;
        }

        .reset-brand-title {
          font-size: 2.2rem;
          font-weight: 800;
          letter-spacing: -0.03em;
          margin-bottom: 10px;
        }

        .reset-brand-subtitle {
          font-size: 1.05rem;
          color: rgba(255,255,255,0.82);
          line-height: 1.8;
          margin-bottom: 28px;
          max-width: 460px;
        }

        .reset-feature-list {
          display: grid;
          gap: 12px;
        }

        .reset-feature-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 14px;
          border-radius: 18px;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.10);
          color: rgba(255,255,255,0.92);
          font-size: 0.95rem;
        }

        .reset-feature-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #93c5fd;
          box-shadow: 0 0 0 5px rgba(147,197,253,0.15);
          flex-shrink: 0;
        }

        .reset-form-panel {
          background: rgba(255,255,255,0.82);
        }

        .reset-form-wrap {
          max-width: 460px;
          margin: 0 auto;
        }

        .reset-form-kicker {
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

        .reset-heading {
          font-size: 2rem;
          font-weight: 800;
          letter-spacing: -0.03em;
          color: #0f172a;
          margin-bottom: 8px;
        }

        .reset-subheading {
          color: #64748b;
          line-height: 1.7;
          margin-bottom: 24px;
        }

        .reset-alert {
          border: none;
          border-radius: 18px;
          padding: 14px 16px;
          font-weight: 600;
          margin-bottom: 22px;
        }

        .reset-alert-success {
          background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
          color: #065f46;
          border: 1px solid #86efac;
        }

        .reset-alert-error {
          background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
          color: #991b1b;
          border: 1px solid #fca5a5;
        }

        .reset-label {
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 9px;
          font-size: 0.95rem;
        }

        .reset-input-wrap {
          position: relative;
        }

        .reset-input-icon {
          position: absolute;
          top: 50%;
          left: 16px;
          transform: translateY(-50%);
          width: 20px;
          height: 20px;
          color: #64748b;
          pointer-events: none;
          z-index: 2;
        }

        .reset-input {
          min-height: 60px;
          border-radius: 18px;
          border: 1px solid #dbe3f0;
          background: #f8fafc;
          padding: 14px 18px 14px 50px;
          color: #0f172a;
          font-size: 1rem;
          transition: all 0.3s ease;
        }

        .reset-input.password-with-toggle {
          padding-right: 82px;
        }

        .reset-input:focus {
          border-color: #60a5fa;
          background: #ffffff;
          box-shadow:
            0 0 0 4px rgba(37,99,235,0.12),
            0 12px 28px rgba(37,99,235,0.08);
          transform: translateY(-1px);
        }

        .reset-input::placeholder {
          color: #94a3b8;
        }

        .reset-password-toggle {
          position: absolute;
          top: 50%;
          right: 14px;
          transform: translateY(-50%);
          border: none;
          background: transparent;
          color: #475569;
          font-weight: 700;
          font-size: 0.9rem;
          padding: 8px 10px;
          border-radius: 12px;
          transition: all 0.25s ease;
          z-index: 3;
        }

        .reset-password-toggle:hover {
          background: #e2e8f0;
          color: #0f172a;
        }

        .reset-submit-btn {
          min-height: 60px;
          border-radius: 18px;
          font-weight: 800;
          font-size: 1rem;
          border: none;
          color: #fff;
          background: linear-gradient(135deg, #0b1736 0%, #142850 40%, #1d4ed8 100%);
          box-shadow:
            0 18px 35px rgba(29, 78, 216, 0.22),
            0 8px 20px rgba(11, 23, 54, 0.18);
          transition: all 0.32s ease;
        }

        .reset-submit-btn:hover:not(:disabled) {
          transform: translateY(-2px) scale(1.01);
        }

        .reset-submit-btn:disabled {
          opacity: 0.8;
          cursor: not-allowed;
        }

        .reset-footer-text {
          text-align: center;
          color: #64748b;
          margin-top: 22px;
          margin-bottom: 0;
        }

        .reset-link {
          color: #2563eb;
          text-decoration: none;
          font-weight: 700;
        }

        .reset-link:hover {
          color: #1d4ed8;
          text-decoration: none;
        }

        @keyframes resetFloat {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-18px) translateX(10px); }
        }

        @media (max-width: 767px) {
          .reset-page {
            padding: 24px 0;
          }

          .reset-brand-panel,
          .reset-form-panel {
            border-radius: 0 !important;
          }

          .reset-brand-title {
            font-size: 1.7rem;
          }

          .reset-heading {
            font-size: 1.6rem;
          }
        }
      `}</style>

      <div className="reset-page d-flex align-items-center py-4 py-lg-5">
        <div className="reset-orb reset-orb-1"></div>
        <div className="reset-orb reset-orb-2"></div>

        <div className="container reset-shell">
          <div className="row justify-content-center align-items-center min-vh-100">
            <div className="col-xl-11 col-xxl-10">
              <div className="card reset-main-card border-0 rounded-5 overflow-hidden">
                <div className="row g-0">
                  <div className="col-lg-6 reset-brand-panel d-flex flex-column justify-content-center p-4 p-md-5 p-xl-5">
                    <div className="reset-chip">Password Update</div>
                    <div className="reset-brand-logo">IN</div>

                    <h1 className="reset-brand-title">Create New Password</h1>
                    <p className="reset-brand-subtitle">
                      Set a fresh secure password for your Internova account and
                      continue learning with protected access to your dashboard,
                      tests, and certificates.
                    </p>

                    <div className="reset-feature-list">
                      <div className="reset-feature-item">
                        <span className="reset-feature-dot"></span>
                        Secure password reset process
                      </div>
                      <div className="reset-feature-item">
                        <span className="reset-feature-dot"></span>
                        Quick access recovery for your account
                      </div>
                      <div className="reset-feature-item">
                        <span className="reset-feature-dot"></span>
                        Safe return to dashboard and learning tools
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-6 reset-form-panel">
                    <div className="p-4 p-md-5 p-xl-5 h-100 d-flex align-items-center">
                      <div className="reset-form-wrap w-100">
                        <div className="reset-form-kicker">Set New Password</div>
                        <h2 className="reset-heading">Reset your password</h2>
                        <p className="reset-subheading">
                          Enter your new password below. Make sure it is strong,
                          secure, and easy for you to remember.
                        </p>

                        {message && (
                          <div
                            className={`reset-alert ${
                              message.toLowerCase().includes("successful") ||
                              message.toLowerCase().includes("success")
                                ? "reset-alert-success"
                                : "reset-alert-error"
                            }`}
                          >
                            {message}
                          </div>
                        )}

                        <form onSubmit={handleSubmit}>
                          <div className="mb-3">
                            <label className="reset-label">New Password</label>
                            <div className="reset-input-wrap">
                              <svg
                                className="reset-input-icon"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M7 10V8a5 5 0 0110 0v2"
                                  stroke="currentColor"
                                  strokeWidth="1.8"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <rect
                                  x="4"
                                  y="10"
                                  width="16"
                                  height="10"
                                  rx="3"
                                  stroke="currentColor"
                                  strokeWidth="1.8"
                                />
                                <circle cx="12" cy="15" r="1.5" fill="currentColor" />
                              </svg>

                              <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                className="form-control reset-input password-with-toggle"
                                placeholder="Enter new password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                              />

                              <button
                                type="button"
                                className="reset-password-toggle"
                                onClick={() => setShowPassword((prev) => !prev)}
                              >
                                {showPassword ? "Hide" : "Show"}
                              </button>
                            </div>
                          </div>

                          <div className="mb-3">
                            <label className="reset-label">Confirm Password</label>
                            <div className="reset-input-wrap">
                              <svg
                                className="reset-input-icon"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M7 10V8a5 5 0 0110 0v2"
                                  stroke="currentColor"
                                  strokeWidth="1.8"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <rect
                                  x="4"
                                  y="10"
                                  width="16"
                                  height="10"
                                  rx="3"
                                  stroke="currentColor"
                                  strokeWidth="1.8"
                                />
                                <circle cx="12" cy="15" r="1.5" fill="currentColor" />
                              </svg>

                              <input
                                type={showConfirmPassword ? "text" : "password"}
                                name="confirmPassword"
                                className="form-control reset-input password-with-toggle"
                                placeholder="Confirm new password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                              />

                              <button
                                type="button"
                                className="reset-password-toggle"
                                onClick={() =>
                                  setShowConfirmPassword((prev) => !prev)
                                }
                              >
                                {showConfirmPassword ? "Hide" : "Show"}
                              </button>
                            </div>
                          </div>

                          <button
                            type="submit"
                            className="btn reset-submit-btn w-100 mt-2"
                            disabled={loading}
                          >
                            {loading ? "Updating Password..." : "Reset Password"}
                          </button>
                        </form>

                        <p className="reset-footer-text">
                          Back to{" "}
                          <Link to="/" className="reset-link">
                            Login
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

export default ResetPassword;