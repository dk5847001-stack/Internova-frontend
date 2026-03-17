import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import API from "../services/api";

function VerifyEmailOtp() {
  const navigate = useNavigate();
  const location = useLocation();

  const prefilledEmail = useMemo(() => {
    return (
      location.state?.email ||
      localStorage.getItem("pendingVerificationEmail") ||
      ""
    );
  }, [location.state]);

  const [email, setEmail] = useState(prefilledEmail);
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);

  useEffect(() => {
    if (prefilledEmail) {
      setEmail(prefilledEmail);
    }
  }, [prefilledEmail]);

  useEffect(() => {
    if (resendTimer <= 0) return;

    const timer = setTimeout(() => {
      setResendTimer((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [resendTimer]);

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setMessage("");

      const { data } = await API.post("/auth/verify-email-otp", {
        email,
        otp,
      });

      localStorage.removeItem("pendingVerificationEmail");
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setMessage("Email verified successfully");
      setTimeout(() => {
        navigate("/dashboard");
      }, 700);
    } catch (error) {
      setMessage(error.response?.data?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      setResendLoading(true);
      setMessage("");

      const { data } = await API.post("/auth/resend-email-otp", { email });

      localStorage.setItem("pendingVerificationEmail", email);
      setMessage(data.message || "A new OTP has been sent");
      setResendTimer(30);
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to resend OTP");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <>
      <style>{`
        .verify-page {
          min-height: 100vh;
          background:
            radial-gradient(circle at top left, rgba(59,130,246,0.18), transparent 28%),
            radial-gradient(circle at bottom right, rgba(99,102,241,0.16), transparent 32%),
            linear-gradient(135deg, #f8fafc 0%, #eef2ff 48%, #f8fafc 100%);
          position: relative;
          overflow: hidden;
        }

        .verify-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(10px);
          opacity: 0.55;
          pointer-events: none;
          animation: verifyFloat 9s ease-in-out infinite;
        }

        .verify-orb-1 {
          width: 220px;
          height: 220px;
          top: 70px;
          left: -60px;
          background: linear-gradient(135deg, rgba(37,99,235,0.25), rgba(14,165,233,0.18));
        }

        .verify-orb-2 {
          width: 280px;
          height: 280px;
          right: -80px;
          bottom: 60px;
          background: linear-gradient(135deg, rgba(99,102,241,0.18), rgba(59,130,246,0.22));
          animation-delay: 1.5s;
        }

        .verify-shell {
          position: relative;
          z-index: 2;
        }

        .verify-card {
          border: 1px solid rgba(255,255,255,0.45);
          background: rgba(255,255,255,0.76);
          backdrop-filter: blur(16px);
          box-shadow:
            0 24px 70px rgba(15, 23, 42, 0.14),
            0 8px 24px rgba(59, 130, 246, 0.08);
        }

        .verify-brand-panel {
          background:
            linear-gradient(145deg, #081226 0%, #0b1736 35%, #142850 75%, #1d4ed8 100%);
          color: #fff;
          position: relative;
          overflow: hidden;
        }

        .verify-brand-panel::before {
          content: "";
          position: absolute;
          inset: 0;
          background:
            radial-gradient(circle at 20% 20%, rgba(255,255,255,0.12), transparent 22%),
            radial-gradient(circle at 80% 75%, rgba(255,255,255,0.10), transparent 18%);
          pointer-events: none;
        }

        .verify-chip {
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

        .verify-brand-logo {
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

        .verify-title {
          font-size: 2rem;
          font-weight: 800;
          margin-bottom: 10px;
        }

        .verify-subtitle {
          font-size: 1rem;
          color: rgba(255,255,255,0.84);
          line-height: 1.8;
          margin-bottom: 24px;
        }

        .verify-feature {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 14px;
          border-radius: 18px;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.10);
          margin-bottom: 12px;
        }

        .verify-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #93c5fd;
          box-shadow: 0 0 0 5px rgba(147,197,253,0.15);
          flex-shrink: 0;
        }

        .verify-form-panel {
          background: rgba(255,255,255,0.84);
        }

        .verify-wrap {
          max-width: 460px;
          margin: 0 auto;
        }

        .verify-kicker {
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

        .verify-heading {
          font-size: 2rem;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 8px;
        }

        .verify-text {
          color: #64748b;
          margin-bottom: 24px;
          line-height: 1.7;
        }

        .verify-alert {
          border: none;
          border-radius: 18px;
          padding: 14px 16px;
          font-weight: 600;
          margin-bottom: 22px;
        }

        .verify-alert-success {
          background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
          color: #065f46;
          border: 1px solid #86efac;
        }

        .verify-alert-error {
          background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
          color: #991b1b;
          border: 1px solid #fca5a5;
        }

        .verify-label {
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 9px;
          font-size: 0.95rem;
        }

        .verify-input {
          min-height: 60px;
          border-radius: 18px;
          border: 1px solid #dbe3f0;
          background: #f8fafc;
          padding: 14px 18px;
          color: #0f172a;
          font-size: 1rem;
          transition: all 0.3s ease;
        }

        .verify-input:focus {
          border-color: #60a5fa;
          background: #ffffff;
          box-shadow:
            0 0 0 4px rgba(37,99,235,0.12),
            0 12px 28px rgba(37,99,235,0.08);
          transform: translateY(-1px);
        }

        .verify-otp-input {
          letter-spacing: 0.45em;
          text-align: center;
          font-weight: 800;
          font-size: 1.2rem;
        }

        .verify-primary-btn,
        .verify-secondary-btn {
          min-height: 56px;
          border-radius: 18px;
          font-weight: 800;
          transition: all 0.3s ease;
        }

        .verify-primary-btn {
          border: none;
          color: #fff;
          background: linear-gradient(135deg, #0b1736 0%, #142850 40%, #1d4ed8 100%);
          box-shadow:
            0 18px 35px rgba(29, 78, 216, 0.22),
            0 8px 20px rgba(11, 23, 54, 0.18);
        }

        .verify-secondary-btn {
          border: 1px solid #dbe3f0;
          background: rgba(255,255,255,0.7);
          color: #0f172a;
        }

        .verify-primary-btn:hover:not(:disabled),
        .verify-secondary-btn:hover:not(:disabled) {
          transform: translateY(-2px);
        }

        .verify-primary-btn:disabled,
        .verify-secondary-btn:disabled {
          opacity: 0.75;
          cursor: not-allowed;
        }

        .verify-footer {
          text-align: center;
          color: #64748b;
          margin-top: 20px;
          margin-bottom: 0;
        }

        .verify-link {
          color: #2563eb;
          text-decoration: none;
          font-weight: 700;
        }

        .verify-link:hover {
          color: #1d4ed8;
          text-decoration: none;
        }

        .verify-timer-text {
          margin-top: 12px;
          text-align: center;
          color: #64748b;
          font-weight: 600;
        }

        @keyframes verifyFloat {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-18px) translateX(10px); }
        }

        @media (max-width: 991px) {
          .verify-title,
          .verify-heading {
            font-size: 1.8rem;
          }
        }
      `}</style>

      <div className="verify-page d-flex align-items-center py-4 py-lg-5">
        <div className="verify-orb verify-orb-1"></div>
        <div className="verify-orb verify-orb-2"></div>

        <div className="container verify-shell">
          <div className="row justify-content-center align-items-center min-vh-100">
            <div className="col-xl-11 col-xxl-10">
              <div className="card verify-card border-0 rounded-5 overflow-hidden">
                <div className="row g-0">
                  <div className="col-lg-6 verify-brand-panel d-flex flex-column justify-content-center p-4 p-md-5 p-xl-5">
                    <div className="verify-chip">Internova Email Security</div>
                    <div className="verify-brand-logo">IN</div>
                    <h1 className="verify-title">Verify Your Email</h1>
                    <p className="verify-subtitle">
                      Enter the OTP sent to your email address to activate your
                      Internova account and continue securely.
                    </p>

                    <div className="verify-feature">
                      <span className="verify-dot"></span>
                      OTP expires in 10 minutes for better account protection
                    </div>
                    <div className="verify-feature">
                      <span className="verify-dot"></span>
                      Verified access unlocks dashboard and learning tools
                    </div>
                    <div className="verify-feature">
                      <span className="verify-dot"></span>
                      Secure login for certificates, tests and enrollments
                    </div>
                  </div>

                  <div className="col-lg-6 verify-form-panel">
                    <div className="p-4 p-md-5 p-xl-5 h-100 d-flex align-items-center">
                      <div className="verify-wrap w-100">
                        <div className="verify-kicker">OTP Verification</div>
                        <h2 className="verify-heading">Confirm your account</h2>
                        <p className="verify-text">
                          Use the 6-digit OTP sent to your email. You can also
                          request a new OTP if needed.
                        </p>

                        {message && (
                          <div
                            className={`verify-alert ${
                              message.toLowerCase().includes("success") ||
                              message.toLowerCase().includes("sent") ||
                              message.toLowerCase().includes("already verified")
                                ? "verify-alert-success"
                                : "verify-alert-error"
                            }`}
                          >
                            {message}
                          </div>
                        )}

                        <form onSubmit={handleVerifyOtp}>
                          <div className="mb-3">
                            <label className="verify-label">Email Address</label>
                            <input
                              type="email"
                              className="form-control verify-input"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              placeholder="Enter your registered email"
                              required
                            />
                          </div>

                          <div className="mb-3">
                            <label className="verify-label">OTP Code</label>
                            <input
                              type="text"
                              className="form-control verify-input verify-otp-input"
                              value={otp}
                              onChange={(e) =>
                                setOtp(
                                  e.target.value.replace(/\D/g, "").slice(0, 6)
                                )
                              }
                              placeholder="123456"
                              required
                              maxLength={6}
                            />
                          </div>

                          <button
                            type="submit"
                            className="btn verify-primary-btn w-100"
                            disabled={loading}
                          >
                            {loading ? "Verifying..." : "Verify Email OTP"}
                          </button>
                        </form>

                        <button
                          type="button"
                          className="btn verify-secondary-btn w-100 mt-3"
                          onClick={handleResendOtp}
                          disabled={resendLoading || !email || resendTimer > 0}
                        >
                          {resendLoading
                            ? "Sending New OTP..."
                            : resendTimer > 0
                            ? `Resend OTP in ${resendTimer}s`
                            : "Resend OTP"}
                        </button>

                        {resendTimer > 0 && (
                          <p className="verify-timer-text">
                            You can request a new OTP after {resendTimer} seconds.
                          </p>
                        )}

                        <p className="verify-footer">
                          Back to{" "}
                          <Link to="/" className="verify-link">
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