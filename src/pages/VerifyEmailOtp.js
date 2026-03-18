import React, { useEffect, useState } from "react";
import API from "../services/api";
import { Link, useLocation, useNavigate } from "react-router-dom";

function VerifyEmailOtp() {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState(
    location.state?.email || localStorage.getItem("pendingVerificationEmail") || ""
  );
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    if (email) {
      localStorage.setItem("pendingVerificationEmail", email);
    }
  }, [email]);

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setMessage("");

      const payload = {
        email: email.trim(),
        otp: otp.trim(),
      };

      const { data } = await API.post("/auth/verify-email-otp", payload);

      localStorage.removeItem("pendingVerificationEmail");

      if (data?.token) {
        localStorage.setItem("token", data.token);
      }

      if (data?.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      setMessage(data?.message || "Email verified successfully.");

      setTimeout(() => {
        navigate("/dashboard");
      }, 800);
    } catch (error) {
      setMessage(
        error.response?.data?.message || "OTP verification failed."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      setResending(true);
      setMessage("");

      const { data } = await API.post("/auth/resend-email-otp", {
        email: email.trim(),
      });

      setMessage(data?.message || "OTP resent successfully.");
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to resend OTP.");
    } finally {
      setResending(false);
    }
  };

  return (
    <>
      <style>{`
        .otp-page {
          min-height: 100vh;
          background:
            radial-gradient(circle at top left, rgba(59,130,246,0.18), transparent 28%),
            radial-gradient(circle at bottom right, rgba(99,102,241,0.16), transparent 32%),
            linear-gradient(135deg, #f8fafc 0%, #eef2ff 48%, #f8fafc 100%);
          position: relative;
          overflow: hidden;
        }

        .otp-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(10px);
          opacity: 0.55;
          animation: otpFloat 9s ease-in-out infinite;
          pointer-events: none;
        }

        .otp-orb-1 {
          width: 220px;
          height: 220px;
          top: 70px;
          left: -60px;
          background: linear-gradient(135deg, rgba(37,99,235,0.25), rgba(14,165,233,0.18));
        }

        .otp-orb-2 {
          width: 280px;
          height: 280px;
          right: -80px;
          bottom: 60px;
          background: linear-gradient(135deg, rgba(99,102,241,0.18), rgba(59,130,246,0.22));
          animation-delay: 1.5s;
        }

        .otp-shell {
          position: relative;
          z-index: 2;
        }

        .otp-main-card {
          border: 1px solid rgba(255,255,255,0.45);
          background: rgba(255,255,255,0.72);
          backdrop-filter: blur(16px);
          box-shadow:
            0 24px 70px rgba(15, 23, 42, 0.14),
            0 8px 24px rgba(59, 130, 246, 0.08);
        }

        .otp-brand-panel {
          background:
            linear-gradient(145deg, #081226 0%, #0b1736 35%, #142850 75%, #1d4ed8 100%);
          color: #fff;
          position: relative;
          overflow: hidden;
        }

        .otp-chip {
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

        .otp-brand-logo {
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

        .otp-brand-title {
          font-size: 2.2rem;
          font-weight: 800;
          letter-spacing: -0.03em;
          margin-bottom: 10px;
        }

        .otp-brand-subtitle {
          font-size: 1.05rem;
          color: rgba(255,255,255,0.82);
          line-height: 1.8;
          margin-bottom: 28px;
          max-width: 460px;
        }

        .otp-feature-list {
          display: grid;
          gap: 12px;
        }

        .otp-feature-item {
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

        .otp-feature-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #93c5fd;
          box-shadow: 0 0 0 5px rgba(147,197,253,0.15);
          flex-shrink: 0;
        }

        .otp-form-panel {
          background: rgba(255,255,255,0.82);
        }

        .otp-form-wrap {
          max-width: 460px;
          margin: 0 auto;
        }

        .otp-form-kicker {
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

        .otp-heading {
          font-size: 2rem;
          font-weight: 800;
          letter-spacing: -0.03em;
          color: #0f172a;
          margin-bottom: 8px;
        }

        .otp-subheading {
          color: #64748b;
          line-height: 1.7;
          margin-bottom: 24px;
        }

        .otp-alert {
          border: none;
          border-radius: 18px;
          padding: 14px 16px;
          font-weight: 600;
          margin-bottom: 22px;
        }

        .otp-alert-success {
          background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
          color: #065f46;
          border: 1px solid #86efac;
        }

        .otp-alert-error {
          background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
          color: #991b1b;
          border: 1px solid #fca5a5;
        }

        .otp-label {
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 9px;
          font-size: 0.95rem;
        }

        .otp-input-wrap {
          position: relative;
        }

        .otp-input-icon {
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

        .otp-input {
          min-height: 60px;
          border-radius: 18px;
          border: 1px solid #dbe3f0;
          background: #f8fafc;
          padding: 14px 18px 14px 50px;
          color: #0f172a;
          font-size: 1rem;
          transition: all 0.3s ease;
        }

        .otp-input.otp-code-input {
          letter-spacing: 0.35em;
          font-weight: 800;
          text-transform: uppercase;
        }

        .otp-input:focus {
          border-color: #60a5fa;
          background: #ffffff;
          box-shadow:
            0 0 0 4px rgba(37,99,235,0.12),
            0 12px 28px rgba(37,99,235,0.08);
          transform: translateY(-1px);
        }

        .otp-submit-btn,
        .otp-resend-btn {
          min-height: 58px;
          border-radius: 18px;
          font-weight: 800;
          font-size: 1rem;
          transition: all 0.32s ease;
        }

        .otp-submit-btn {
          border: none;
          color: #fff;
          background: linear-gradient(135deg, #0b1736 0%, #142850 40%, #1d4ed8 100%);
          box-shadow:
            0 18px 35px rgba(29, 78, 216, 0.22),
            0 8px 20px rgba(11, 23, 54, 0.18);
        }

        .otp-resend-btn {
          border: 1px solid #dbe3f0;
          background: #fff;
          color: #0f172a;
        }

        .otp-submit-btn:hover:not(:disabled),
        .otp-resend-btn:hover:not(:disabled) {
          transform: translateY(-2px);
        }

        .otp-submit-btn:disabled,
        .otp-resend-btn:disabled {
          opacity: 0.8;
          cursor: not-allowed;
        }

        .otp-button-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-top: 8px;
        }

        .otp-footer-text {
          text-align: center;
          color: #64748b;
          margin-top: 22px;
          margin-bottom: 0;
        }

        .otp-link {
          color: #2563eb;
          text-decoration: none;
          font-weight: 700;
        }

        .otp-link:hover {
          color: #1d4ed8;
          text-decoration: none;
        }

        @keyframes otpFloat {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-18px) translateX(10px); }
        }

        @media (max-width: 767px) {
          .otp-page {
            padding: 24px 0;
          }

          .otp-brand-panel,
          .otp-form-panel {
            border-radius: 0 !important;
          }

          .otp-brand-title {
            font-size: 1.7rem;
          }

          .otp-heading {
            font-size: 1.6rem;
          }

          .otp-button-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="otp-page d-flex align-items-center py-4 py-lg-5">
        <div className="otp-orb otp-orb-1"></div>
        <div className="otp-orb otp-orb-2"></div>

        <div className="container otp-shell">
          <div className="row justify-content-center align-items-center min-vh-100">
            <div className="col-xl-11 col-xxl-10">
              <div className="card otp-main-card border-0 rounded-5 overflow-hidden">
                <div className="row g-0">
                  <div className="col-lg-6 otp-brand-panel d-flex flex-column justify-content-center p-4 p-md-5 p-xl-5">
                    <div className="otp-chip">Email Verification</div>
                    <div className="otp-brand-logo">IN</div>

                    <h1 className="otp-brand-title">Verify Your Email</h1>
                    <p className="otp-brand-subtitle">
                      Confirm your email with the OTP sent to your inbox and
                      activate your Internova account securely.
                    </p>

                    <div className="otp-feature-list">
                      <div className="otp-feature-item">
                        <span className="otp-feature-dot"></span>
                        Fast OTP verification flow
                      </div>
                      <div className="otp-feature-item">
                        <span className="otp-feature-dot"></span>
                        Secure account activation process
                      </div>
                      <div className="otp-feature-item">
                        <span className="otp-feature-dot"></span>
                        Instant access to dashboard after verification
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-6 otp-form-panel">
                    <div className="p-4 p-md-5 p-xl-5 h-100 d-flex align-items-center">
                      <div className="otp-form-wrap w-100">
                        <div className="otp-form-kicker">OTP Verification</div>
                        <h2 className="otp-heading">Enter verification code</h2>
                        <p className="otp-subheading">
                          Enter your email and the OTP received in your inbox to
                          verify your account and continue.
                        </p>

                        {message && (
                          <div
                            className={`otp-alert ${
                              message.toLowerCase().includes("success") ||
                              message.toLowerCase().includes("verified") ||
                              message.toLowerCase().includes("resent")
                                ? "otp-alert-success"
                                : "otp-alert-error"
                            }`}
                          >
                            {message}
                          </div>
                        )}

                        <form onSubmit={handleVerifyOtp}>
                          <div className="mb-3">
                            <label className="otp-label">Email Address</label>
                            <div className="otp-input-wrap">
                              <svg
                                className="otp-input-icon"
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
                                className="form-control otp-input"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                              />
                            </div>
                          </div>

                          <div className="mb-3">
                            <label className="otp-label">OTP Code</label>
                            <div className="otp-input-wrap">
                              <svg
                                className="otp-input-icon"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <rect
                                  x="3"
                                  y="5"
                                  width="18"
                                  height="14"
                                  rx="3"
                                  stroke="currentColor"
                                  strokeWidth="1.8"
                                />
                                <path
                                  d="M8 10H8.01M12 10H12.01M16 10H16.01"
                                  stroke="currentColor"
                                  strokeWidth="2.2"
                                  strokeLinecap="round"
                                />
                              </svg>

                              <input
                                type="text"
                                className="form-control otp-input otp-code-input"
                                placeholder="Enter OTP"
                                value={otp}
                                onChange={(e) =>
                                  setOtp(e.target.value.replace(/\s/g, ""))
                                }
                                required
                              />
                            </div>
                          </div>

                          <div className="otp-button-grid">
                            <button
                              type="submit"
                              className="btn otp-submit-btn"
                              disabled={loading}
                            >
                              {loading ? "Verifying..." : "Verify OTP"}
                            </button>

                            <button
                              type="button"
                              className="btn otp-resend-btn"
                              onClick={handleResendOtp}
                              disabled={resending || !email.trim()}
                            >
                              {resending ? "Resending..." : "Resend OTP"}
                            </button>
                          </div>
                        </form>

                        <p className="otp-footer-text">
                          Back to{" "}
                          <Link to="/" className="otp-link">
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

export default VerifyEmailOtp;