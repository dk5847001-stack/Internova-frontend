import React, { useState } from "react";
import API from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import {
  clearPendingVerificationEmail,
  saveAuthSession,
  setPendingVerificationEmail,
} from "../utils/authStorage";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const saveAuthAndRedirect = (data) => {
    clearPendingVerificationEmail();
    saveAuthSession({
      token: data?.token,
      user: data?.user,
    });

    navigate("/dashboard");
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedName = formData.name.trim();
    const trimmedEmail = formData.email.trim();
    const password = formData.password;

    if (trimmedName.length < 2) {
      setMessage("Name must be at least 2 characters long.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setMessage("Please enter a valid email address.");
      return;
    }

    if (password.length < 8 || !/[A-Za-z]/.test(password) || !/\d/.test(password)) {
      setMessage(
        "Password must be at least 8 characters long and include letters and numbers."
      );
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const payload = {
        name: trimmedName,
        email: trimmedEmail,
        phone: formData.phone.trim(),
        password,
      };

      const { data } = await API.post("/auth/register", payload);

      if (data?.requiresEmailVerification) {
        setPendingVerificationEmail(payload.email);
        setMessage("Registration successful. OTP sent to your email.");
        setTimeout(() => {
          navigate("/verify-email-otp", {
            state: { email: payload.email },
          });
        }, 700);
        return;
      }

      saveAuthAndRedirect(data);
    } catch (error) {
      setMessage(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      setGoogleLoading(true);
      setMessage("");

      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();

      const { data } = await API.post("/auth/google-login", { idToken });
      saveAuthAndRedirect(data);
    } catch (error) {
      console.error("GOOGLE SIGNUP ERROR:", error);
      setMessage(
        error.response?.data?.message ||
          error.message ||
          "Google sign up failed"
      );
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <>
      <style>{`
        .register-page {
          min-height: 100vh;
          background:
            radial-gradient(circle at top left, rgba(59,130,246,0.18), transparent 28%),
            radial-gradient(circle at bottom right, rgba(99,102,241,0.16), transparent 32%),
            linear-gradient(135deg, #f8fafc 0%, #eef2ff 48%, #f8fafc 100%);
          position: relative;
          overflow: hidden;
        }

        .register-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(10px);
          opacity: 0.55;
          animation: floatOrbRegister 9s ease-in-out infinite;
          pointer-events: none;
        }

        .register-orb-1 {
          width: 240px;
          height: 240px;
          top: 60px;
          left: -70px;
          background: linear-gradient(135deg, rgba(37,99,235,0.25), rgba(14,165,233,0.18));
        }

        .register-orb-2 {
          width: 290px;
          height: 290px;
          right: -90px;
          bottom: 40px;
          background: linear-gradient(135deg, rgba(99,102,241,0.18), rgba(59,130,246,0.22));
          animation-delay: 1.3s;
        }

        .register-shell {
          position: relative;
          z-index: 2;
        }

        .register-main-card {
          border: 1px solid rgba(255,255,255,0.45);
          background: rgba(255,255,255,0.72);
          backdrop-filter: blur(16px);
          box-shadow:
            0 24px 70px rgba(15, 23, 42, 0.14),
            0 8px 24px rgba(59, 130, 246, 0.08);
          transition: all 0.35s ease;
        }

        .register-main-card:hover {
          transform: translateY(-4px);
          box-shadow:
            0 30px 80px rgba(15, 23, 42, 0.18),
            0 10px 30px rgba(59, 130, 246, 0.1);
        }

        .register-brand-panel {
          background:
            linear-gradient(145deg, #081226 0%, #0b1736 35%, #142850 75%, #1d4ed8 100%);
          color: #fff;
          position: relative;
          overflow: hidden;
        }

        .register-brand-panel::before {
          content: "";
          position: absolute;
          inset: 0;
          background:
            radial-gradient(circle at 18% 22%, rgba(255,255,255,0.12), transparent 22%),
            radial-gradient(circle at 82% 74%, rgba(255,255,255,0.10), transparent 18%);
          pointer-events: none;
        }

        .register-brand-panel::after {
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

        .register-chip {
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

        .register-brand-logo {
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

        .register-brand-title {
          font-size: 2.2rem;
          font-weight: 800;
          letter-spacing: -0.03em;
          margin-bottom: 10px;
        }

        .register-brand-subtitle {
          font-size: 1.05rem;
          color: rgba(255,255,255,0.82);
          line-height: 1.8;
          margin-bottom: 28px;
          max-width: 460px;
        }

        .register-feature-list {
          display: grid;
          gap: 12px;
        }

        .register-feature-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 14px;
          border-radius: 18px;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.10);
          color: rgba(255,255,255,0.92);
          font-size: 0.95rem;
          transition: all 0.3s ease;
        }

        .register-feature-item:hover {
          transform: translateX(4px);
          background: rgba(255,255,255,0.12);
        }

        .register-feature-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #93c5fd;
          box-shadow: 0 0 0 5px rgba(147,197,253,0.15);
          flex-shrink: 0;
        }

        .register-form-panel {
          background: rgba(255,255,255,0.82);
        }

        .register-form-wrap {
          max-width: 460px;
          margin: 0 auto;
        }

        .register-form-top {
          margin-bottom: 28px;
        }

        .register-form-kicker {
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

        .register-heading {
          font-size: 2rem;
          font-weight: 800;
          letter-spacing: -0.03em;
          color: #0f172a;
          margin-bottom: 8px;
        }

        .register-subheading {
          color: #64748b;
          margin-bottom: 0;
          line-height: 1.7;
        }

        .register-alert {
          border: none;
          border-radius: 18px;
          padding: 14px 16px;
          font-weight: 600;
          margin-bottom: 22px;
        }

        .register-alert-success {
          background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
          color: #065f46;
          border: 1px solid #86efac;
        }

        .register-alert-error {
          background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
          color: #991b1b;
          border: 1px solid #fca5a5;
        }

        .register-label {
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 9px;
          font-size: 0.95rem;
        }

        .register-input-wrap {
          position: relative;
        }

        .register-input-icon {
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

        .register-input {
          min-height: 60px;
          border-radius: 18px;
          border: 1px solid #dbe3f0;
          background: #f8fafc;
          padding: 14px 18px 14px 50px;
          color: #0f172a;
          font-size: 1rem;
          transition: all 0.3s ease;
        }

        .register-input.password-with-toggle {
          padding-right: 82px;
        }

        .register-input:focus {
          border-color: #60a5fa;
          background: #ffffff;
          box-shadow:
            0 0 0 4px rgba(37,99,235,0.12),
            0 12px 28px rgba(37,99,235,0.08);
          transform: translateY(-1px);
        }

        .register-input::placeholder {
          color: #94a3b8;
        }

        .register-password-toggle {
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

        .register-password-toggle:hover {
          background: #e2e8f0;
          color: #0f172a;
        }

        .register-submit-btn,
        .register-google-btn {
          min-height: 60px;
          border-radius: 18px;
          font-weight: 800;
          font-size: 1rem;
          letter-spacing: 0.01em;
          transition: all 0.32s ease;
        }

        .register-submit-btn {
          border: none;
          color: #fff;
          background: linear-gradient(135deg, #0b1736 0%, #142850 40%, #1d4ed8 100%);
          box-shadow:
            0 18px 35px rgba(29, 78, 216, 0.22),
            0 8px 20px rgba(11, 23, 54, 0.18);
        }

        .register-google-btn {
          border: 1px solid #dbe3f0;
          background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
          color: #0f172a;
          box-shadow:
            0 10px 24px rgba(15, 23, 42, 0.06),
            inset 0 1px 0 rgba(255,255,255,0.9);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          position: relative;
          overflow: hidden;
        }

        .register-google-btn::before {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(120deg, transparent 0%, rgba(255,255,255,0.7) 45%, transparent 100%);
          transform: translateX(-120%);
          transition: transform 0.7s ease;
        }

        .register-google-btn:hover::before {
          transform: translateX(120%);
        }

        .register-submit-btn:hover:not(:disabled),
        .register-google-btn:hover:not(:disabled) {
          transform: translateY(-2px) scale(1.01);
        }

        .register-google-btn:hover:not(:disabled) {
          border-color: #cbd5e1;
          box-shadow:
            0 16px 30px rgba(15, 23, 42, 0.10),
            0 8px 18px rgba(59, 130, 246, 0.06);
        }

        .register-submit-btn:disabled,
        .register-google-btn:disabled {
          opacity: 0.82;
          cursor: not-allowed;
        }

        .register-google-icon-wrap {
          width: 36px;
          height: 36px;
          min-width: 36px;
          border-radius: 50%;
          background: #ffffff;
          border: 1px solid #e5e7eb;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 10px rgba(15, 23, 42, 0.06);
          position: relative;
          z-index: 1;
        }

        .register-google-icon {
          width: 18px;
          height: 18px;
          display: block;
        }

        .register-google-text {
          position: relative;
          z-index: 1;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .register-google-badge {
          font-size: 0.7rem;
          font-weight: 800;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          color: #475569;
          background: #eef2ff;
          border: 1px solid #dbeafe;
          padding: 5px 9px;
          border-radius: 999px;
        }

        .register-footer-text {
          text-align: center;
          color: #64748b;
          margin-top: 22px;
          margin-bottom: 0;
        }

        .register-link {
          color: #2563eb;
          text-decoration: none;
          font-weight: 700;
          transition: all 0.25s ease;
        }

        .register-link:hover {
          color: #1d4ed8;
          text-decoration: none;
          transform: translateY(-1px);
        }

        .register-divider {
          position: relative;
          text-align: center;
          margin: 24px 0 18px;
        }

        .register-divider::before {
          content: "";
          position: absolute;
          top: 50%;
          left: 0;
          width: 100%;
          height: 1px;
          background: linear-gradient(90deg, transparent, #e2e8f0, transparent);
          transform: translateY(-50%);
        }

        .register-divider span {
          position: relative;
          z-index: 1;
          display: inline-block;
          padding: 0 14px;
          background: rgba(255,255,255,0.92);
          color: #64748b;
          font-size: 0.82rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          border-radius: 999px;
        }

        @keyframes floatOrbRegister {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-18px) translateX(10px); }
        }

        @media (max-width: 991px) {
          .register-brand-panel {
            min-height: 340px;
          }

          .register-brand-title {
            font-size: 1.9rem;
          }

          .register-heading {
            font-size: 1.8rem;
          }
        }

        @media (max-width: 767px) {
          .register-page {
            padding: 24px 0;
          }

          .register-brand-panel,
          .register-form-panel {
            border-radius: 0 !important;
          }

          .register-brand-title {
            font-size: 1.75rem;
          }

          .register-heading {
            font-size: 1.65rem;
          }

          .register-feature-list {
            gap: 10px;
          }

          .register-feature-item {
            font-size: 0.9rem;
          }

          .register-google-badge {
            display: none;
          }
        }
      `}</style>

      <div className="register-page d-flex align-items-center py-4 py-lg-5">
        <div className="register-orb register-orb-1"></div>
        <div className="register-orb register-orb-2"></div>

        <div className="container register-shell">
          <div className="row justify-content-center align-items-center min-vh-100">
            <div className="col-xl-11 col-xxl-10">
              <div className="card register-main-card border-0 rounded-5 overflow-hidden">
                <div className="row g-0">
                  <div className="col-lg-6 register-brand-panel d-flex flex-column justify-content-center p-4 p-md-5 p-xl-5">
                    <div className="register-chip">Internova New Account</div>

                    <div className="register-brand-logo">IN</div>

                    <h1 className="register-brand-title">Create Your Account</h1>
                    <p className="register-brand-subtitle">
                      Register to explore Internship Programs, complete learning
                      modules, attempt mini tests, and earn premium verified
                      certificates with a seamless professional experience.
                    </p>

                    <div className="register-feature-list">
                      <div className="register-feature-item">
                        <span className="register-feature-dot"></span>
                        Access training courses and guided learning modules
                      </div>
                      <div className="register-feature-item">
                        <span className="register-feature-dot"></span>
                        Download branded Learning Offer Letter and certificates
                      </div>
                      <div className="register-feature-item">
                        <span className="register-feature-dot"></span>
                        Complete mini tests and unlock final certification
                      </div>
                      <div className="register-feature-item">
                        <span className="register-feature-dot"></span>
                        Join a premium, trusted Internova workspace
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-6 register-form-panel">
                    <div className="p-4 p-md-5 p-xl-5 h-100 d-flex align-items-center">
                      <div className="register-form-wrap w-100">
                        <div className="register-form-top">
                          <div className="register-form-kicker">Account Registration</div>
                          <h2 className="register-heading">Get started now</h2>
                          <p className="register-subheading">
                            Fill in your details to create your Internova account
                            and access all Internship Programs tools in one place.
                          </p>
                        </div>

                        {message && (
                          <div
                            className={`register-alert ${
                              message.toLowerCase().includes("successful") ||
                              message.toLowerCase().includes("otp") ||
                              message.toLowerCase().includes("sent")
                                ? "register-alert-success"
                                : "register-alert-error"
                            }`}
                          >
                            {message}
                          </div>
                        )}

                        <form onSubmit={handleSubmit}>
                          <div className="mb-3">
                            <label className="register-label">Full Name</label>
                            <div className="register-input-wrap">
                              <svg
                                className="register-input-icon"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z"
                                  stroke="currentColor"
                                  strokeWidth="1.8"
                                />
                                <path
                                  d="M4 20C4.8 16.9 7.7 15 12 15C16.3 15 19.2 16.9 20 20"
                                  stroke="currentColor"
                                  strokeWidth="1.8"
                                  strokeLinecap="round"
                                />
                              </svg>

                              <input
                                type="text"
                                name="name"
                                placeholder="Enter your full name"
                                className="form-control register-input"
                                value={formData.name}
                                onChange={handleChange}
                                required
                              />
                            </div>
                          </div>

                          <div className="mb-3">
                            <label className="register-label">Email Address</label>
                            <div className="register-input-wrap">
                              <svg
                                className="register-input-icon"
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
                                name="email"
                                placeholder="Enter your email"
                                className="form-control register-input"
                                value={formData.email}
                                onChange={handleChange}
                                required
                              />
                            </div>
                          </div>

                          <div className="mb-3">
                            <label className="register-label">Mobile Number</label>
                            <div className="register-input-wrap">
                              <svg
                                className="register-input-icon"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <rect
                                  x="7"
                                  y="2.5"
                                  width="10"
                                  height="19"
                                  rx="2.5"
                                  stroke="currentColor"
                                  strokeWidth="1.8"
                                />
                                <path
                                  d="M11 18.5H13"
                                  stroke="currentColor"
                                  strokeWidth="1.8"
                                  strokeLinecap="round"
                                />
                              </svg>

                              <input
                                type="tel"
                                name="phone"
                                placeholder="Enter your mobile number"
                                className="form-control register-input"
                                value={formData.phone}
                                onChange={handleChange}
                              />
                            </div>
                          </div>

                          <div className="mb-3">
                            <label className="register-label">Password</label>
                            <div className="register-input-wrap">
                              <svg
                                className="register-input-icon"
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
                                placeholder="Create a password"
                                className="form-control register-input password-with-toggle"
                                value={formData.password}
                                onChange={handleChange}
                                required
                              />
                              <button
                                type="button"
                                className="register-password-toggle"
                                onClick={() => setShowPassword((prev) => !prev)}
                              >
                                {showPassword ? "Hide" : "Show"}
                              </button>
                            </div>
                          </div>

                          <button
                            type="submit"
                            className="btn register-submit-btn w-100 mt-2"
                            disabled={loading}
                          >
                            {loading ? "Creating Account..." : "Register"}
                          </button>
                        </form>

                        <div className="register-divider">
                          <span>or continue with</span>
                        </div>

                        <button
                          type="button"
                          className="btn register-google-btn w-100"
                          onClick={handleGoogleSignup}
                          disabled={googleLoading}
                        >
                          <span className="register-google-icon-wrap">
                            <svg
                              className="register-google-icon"
                              viewBox="0 0 48 48"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                fill="#FFC107"
                                d="M43.611 20.083H42V20H24v8h11.303C33.655 32.657 29.215 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.27 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
                              />
                              <path
                                fill="#FF3D00"
                                d="M6.306 14.691l6.571 4.819C14.655 16.108 18.961 13 24 13c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.27 4 24 4c-7.682 0-14.297 4.337-17.694 10.691z"
                              />
                              <path
                                fill="#4CAF50"
                                d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.143 35.091 26.715 36 24 36c-5.194 0-9.625-3.33-11.283-7.946l-6.522 5.025C9.548 39.556 16.227 44 24 44z"
                              />
                              <path
                                fill="#1976D2"
                                d="M43.611 20.083H42V20H24v8h11.303c-.792 2.238-2.231 4.166-4.094 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
                              />
                            </svg>
                          </span>

                          <span className="register-google-text">
                            {googleLoading
                              ? "Continuing with Google..."
                              : "Continue with Google"}
                            {!googleLoading && (
                              <span className="register-google-badge">Quick Start</span>
                            )}
                          </span>
                        </button>

                        <p className="register-footer-text">
                          Already have an account?{" "}
                          <Link to="/login" className="register-link fw-semibold">
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

export default Register;
