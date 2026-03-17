import React, { useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setMessage("");

      const { data } = await API.post("/auth/forgot-password", { email });

      setMessage(
        data.message || "If an account exists with this email, a reset link will be sent."
      );
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to send reset link");
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
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
        }

        .forgot-card {
          width: 100%;
          max-width: 560px;
          border: 1px solid rgba(255,255,255,0.45);
          background: rgba(255,255,255,0.76);
          backdrop-filter: blur(16px);
          border-radius: 28px;
          box-shadow:
            0 24px 70px rgba(15, 23, 42, 0.14),
            0 8px 24px rgba(59, 130, 246, 0.08);
          padding: 32px;
        }

        .forgot-kicker {
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
          color: #0f172a;
          margin-bottom: 8px;
        }

        .forgot-text {
          color: #64748b;
          line-height: 1.7;
          margin-bottom: 22px;
        }

        .forgot-label {
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 9px;
        }

        .forgot-input {
          min-height: 58px;
          border-radius: 18px;
          border: 1px solid #dbe3f0;
          background: #f8fafc;
          padding: 14px 18px;
        }

        .forgot-input:focus {
          border-color: #60a5fa;
          background: #ffffff;
          box-shadow: 0 0 0 4px rgba(37,99,235,0.12);
        }

        .forgot-btn {
          min-height: 58px;
          border: none;
          border-radius: 18px;
          font-weight: 800;
          color: #fff;
          background: linear-gradient(135deg, #0b1736 0%, #142850 40%, #1d4ed8 100%);
          margin-top: 16px;
        }

        .forgot-alert {
          border-radius: 16px;
          padding: 14px 16px;
          font-weight: 600;
          margin-bottom: 18px;
          background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
          color: #1d4ed8;
          border: 1px solid #bfdbfe;
        }

        .forgot-footer {
          margin-top: 18px;
          text-align: center;
          color: #64748b;
        }

        .forgot-link {
          color: #2563eb;
          text-decoration: none;
          font-weight: 700;
        }
      `}</style>

      <div className="forgot-page">
        <div className="forgot-card">
          <div className="forgot-kicker">Password Recovery</div>
          <h1 className="forgot-heading">Forgot your password?</h1>
          <p className="forgot-text">
            Enter your registered email address. We will send you a secure reset
            link to create a new password.
          </p>

          {message && <div className="forgot-alert">{message}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="forgot-label">Email Address</label>
              <input
                type="email"
                className="form-control forgot-input"
                placeholder="Enter your registered email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn forgot-btn w-100"
              disabled={loading}
            >
              {loading ? "Sending Reset Link..." : "Send Reset Link"}
            </button>
          </form>

          <p className="forgot-footer">
            Back to{" "}
            <Link to="/" className="forgot-link">
              Login
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}

export default ForgotPassword;