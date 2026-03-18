import React, { useState } from "react";
import API from "../services/api";
import { Link } from "react-router-dom";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setMessage("");

      const { data } = await API.post("/auth/forgot-password", {
        email: email.trim(),
      });

      setMessage(data?.message || "Password reset link sent successfully.");
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Failed to send reset link."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        .forgot-page {
          min-height: 100vh;
          background:
            radial-gradient(circle at top left, rgba(59,130,246,0.18), transparent 28%),
            radial-gradient(circle at bottom right, rgba(99,102,241,0.16), transparent 32%),
            linear-gradient(135deg, #f8fafc 0%, #eef2ff 48%, #f8fafc 100%);
          position: relative;
          overflow: hidden;
        }

        .forgot-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(10px);
          opacity: 0.55;
          animation: forgotFloat 9s ease-in-out infinite;
          pointer-events: none;
        }

        .forgot-orb-1 {
          width: 220px;
          height: 220px;
          top: 70px;
          left: -60px;
          background: linear-gradient(135deg, rgba(37,99,235,0.25), rgba(14,165,233,0.18));
        }

        .forgot-orb-2 {
          width: 280px;
          height: 280px;
          right: -80px;
          bottom: 60px;
          background: linear-gradient(135deg, rgba(99,102,241,0.18), rgba(59,130,246,0.22));
          animation-delay: 1.5s;
        }

        .forgot-shell {
          position: relative;
          z-index: 2;
        }

        .forgot-main-card {
          border: 1px solid rgba(255,255,255,0.45);
          background: rgba(255,255,255,0.72);
          backdrop-filter: blur(16px);
          box-shadow:
            0 24px 70px rgba(15, 23, 42, 0.14),
            0 8px 24px rgba(59, 130, 246, 0.08);
          transition: all 0.35s ease;
        }

        .forgot-main-card:hover {
          transform: translateY(-4px);
          box-shadow:
            0 30px 80px rgba(15, 23, 42, 0.18),
            0 10px 30px rgba(59, 130, 246, 0.1);
        }

        .forgot-brand-panel {
          background:
            linear-gradient(145deg, #081226 0%, #0b1736 35%, #142850 75%, #1d4ed8 100%);
          color: #fff;
          position: relative;
          overflow: hidden;
        }

        .forgot-brand-panel::before {
          content: "";
          position: absolute;
          inset: 0;
          background:
            radial-gradient(circle at 20% 20%, rgba(255,255,255,0.12), transparent 22%),
            radial-gradient(circle at 80% 75%, rgba(255,255,255,0.10), transparent 18%);
          pointer-events: none;
        }

        .forgot-chip {
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

        .forgot-brand-logo {
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

        .forgot-brand-title {
          font-size: 2.2rem;
          font-weight: 800;
          letter-spacing: -0.03em;
          margin-bottom: 10px;
        }

        .forgot-brand-subtitle {
          font-size: 1.05rem;
          color: rgba(255,255,255,0.82);
          line-height: 1.8;
          margin-bottom: 28px;
          max-width: 460px;
        }

        .forgot-feature-list {
          display: grid;
          gap: 12px;
        }

        .forgot-feature-item {
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

        .forgot-feature-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #93c5fd;
          box-shadow: 0 0 0 5px rgba(147,197,253,0.15);
          flex-shrink: 0;
        }

        .forgot-form-panel {
          background: rgba(255,255,255,0.82);
        }

        .forgot-form-wrap {
          max-width: 460px;
          margin: 0 auto;
        }

        .forgot-form-kicker {
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

        .forgot-heading {
          font-size: 2rem;
          font-weight: 800;
          letter-spacing: -0.03em;
          color: #0f172a;
          margin-bottom: 8px;
        }

        .forgot-subheading {
          color: #64748b;
          line-height: 1.7;
          margin-bottom: 24px;
        }

        .forgot-alert {
          border: none;
          border-radius: 18px;
          padding: 14px 16px;
          font-weight: 600;
          margin-bottom: 22px;
        }

        .forgot-alert-success {
          background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
          color: #065f46;
          border: 1px solid #86efac;
        }

        .forgot-alert-error {
          background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
          color: #991b1b;
          border: 1px solid #fca5a5;
        }

        .forgot-label {
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 9px;
          font-size: 0.95rem;
        }

        .forgot-input-wrap {
          position: relative;
        }

        .forgot-input-icon {
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

        .forgot-input {
          min-height: 60px;
          border-radius: 18px;
          border: 1px solid #dbe3f0;
          background: #f8fafc;
          padding: 14px 18px 14px 50px;
          color: #0f172a;
          font-size: 1rem;
          transition: all 0.3s ease;
        }

        .forgot-input:focus {
          border-color: #60a5fa;
          background: #ffffff;
          box-shadow:
            0 0 0 4px rgba(37,99,235,0.12),
            0 12px 28px rgba(37,99,235,0.08);
          transform: translateY(-1px);
        }

        .forgot-submit-btn {
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

        .forgot-submit-btn:hover:not(:disabled) {
          transform: translateY(-2px) scale(1.01);
        }

        .forgot-submit-btn:disabled {
          opacity: 0.8;
          cursor: not-allowed;
        }

        .forgot-footer-text {
          text-align: center;
          color: #64748b;
          margin-top: 22px;
          margin-bottom: 0;
        }

        .forgot-link {
          color: #2563eb;
          text-decoration: none;
          font-weight: 700;
        }

        .forgot-link:hover {
          color: #1d4ed8;
          text-decoration: none;
        }

        @keyframes forgotFloat {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-18px) translateX(10px); }
        }

        @media (max-width: 767px) {
          .forgot-page {
            padding: 24px 0;
          }

          .forgot-brand-panel,
          .forgot-form-panel {
            border-radius: 0 !important;
          }

          .forgot-brand-title {
            font-size: 1.7rem;
          }

          .forgot-heading {
            font-size: 1.6rem;
          }
        }
      `}</style>

      <div className="forgot-page d-flex align-items-center py-4 py-lg-5">
        <div className="forgot-orb forgot-orb-1"></div>
        <div className="forgot-orb forgot-orb-2"></div>

        <div className="container forgot-shell">
          <div className="row justify-content-center align-items-center min-vh-100">
            <div className="col-xl-11 col-xxl-10">
              <div className="card forgot-main-card border-0 rounded-5 overflow-hidden">
                <div className="row g-0">
                  <div className="col-lg-6 forgot-brand-panel d-flex flex-column justify-content-center p-4 p-md-5 p-xl-5">
                    <div className="forgot-chip">Password Recovery</div>
                    <div className="forgot-brand-logo">IN</div>

                    <h1 className="forgot-brand-title">Reset Access Securely</h1>
                    <p className="forgot-brand-subtitle">
                      Recover your Internova account quickly and securely. We
                      will send a reset instruction to your registered email.
                    </p>

                    <div className="forgot-feature-list">
                      <div className="forgot-feature-item">
                        <span className="forgot-feature-dot"></span>
                        Safe recovery flow with email verification
                      </div>
                      <div className="forgot-feature-item">
                        <span className="forgot-feature-dot"></span>
                        Secure access to certificates and dashboard
                      </div>
                      <div className="forgot-feature-item">
                        <span className="forgot-feature-dot"></span>
                        Fast password reset experience
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-6 forgot-form-panel">
                    <div className="p-4 p-md-5 p-xl-5 h-100 d-flex align-items-center">
                      <div className="forgot-form-wrap w-100">
                        <div className="forgot-form-kicker">Recover Account</div>
                        <h2 className="forgot-heading">Forgot your password?</h2>
                        <p className="forgot-subheading">
                          Enter your registered email address and we will send
                          you a password reset link or recovery instruction.
                        </p>

                        {message && (
                          <div
                            className={`forgot-alert ${
                              message.toLowerCase().includes("sent") ||
                              message.toLowerCase().includes("success")
                                ? "forgot-alert-success"
                                : "forgot-alert-error"
                            }`}
                          >
                            {message}
                          </div>
                        )}

                        <form onSubmit={handleSubmit}>
                          <div className="mb-3">
                            <label className="forgot-label">Email Address</label>
                            <div className="forgot-input-wrap">
                              <svg
                                className="forgot-input-icon"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M4 7L10.94 11.76C11.57 12.19 12.43 12.19 13.06 11.76L20 7"
                                  stroke="currentColor"
                                  strokeWidth="1.8"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <rect
                                  x="3"
                                  y="5"
                                  width="18"
                                  height="14"
                                  rx="3"
                                  stroke="currentColor"
                                  strokeWidth="1.8"
                                />
                              </svg>

                              <input
                                type="email"
                                className="form-control forgot-input"
                                placeholder="Enter your registered email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                              />
                            </div>
                          </div>

                          <button
                            type="submit"
                            className="btn forgot-submit-btn w-100 mt-2"
                            disabled={loading}
                          >
                            {loading ? "Sending Reset Link..." : "Send Reset Link"}
                          </button>
                        </form>

                        <p className="forgot-footer-text">
                          Remember your password?{" "}
                          <Link to="/" className="forgot-link">
                            Back to Login
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

export default ForgotPassword;