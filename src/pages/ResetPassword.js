import React, { useMemo, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import API from "../services/api";

function ResetPassword() {
  const navigate = useNavigate();
  const { token } = useParams();
  const [searchParams] = useSearchParams();

  const email = useMemo(() => searchParams.get("email") || "", [searchParams]);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setMessage("Reset email is missing. Please request a new reset link.");
      return;
    }

    if (!token) {
      setMessage("Reset token is missing. Please request a new reset link.");
      return;
    }

    if (password.length < 6) {
      setMessage("Password must be at least 6 characters long");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const { data } = await API.post("/auth/reset-password", {
        email,
        token,
        password,
      });

      setMessage(data.message || "Password reset successful");

      setTimeout(() => {
        navigate("/");
      }, 1200);
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to reset password");
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
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
        }

        .reset-card {
          width: 100%;
          max-width: 580px;
          border: 1px solid rgba(255,255,255,0.45);
          background: rgba(255,255,255,0.76);
          backdrop-filter: blur(16px);
          border-radius: 28px;
          box-shadow:
            0 24px 70px rgba(15, 23, 42, 0.14),
            0 8px 24px rgba(59, 130, 246, 0.08);
          padding: 32px;
        }

        .reset-kicker {
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
          color: #0f172a;
          margin-bottom: 8px;
        }

        .reset-text {
          color: #64748b;
          line-height: 1.7;
          margin-bottom: 22px;
        }

        .reset-label {
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 9px;
        }

        .reset-input {
          min-height: 58px;
          border-radius: 18px;
          border: 1px solid #dbe3f0;
          background: #f8fafc;
          padding: 14px 18px;
        }

        .reset-input:focus {
          border-color: #60a5fa;
          background: #ffffff;
          box-shadow: 0 0 0 4px rgba(37,99,235,0.12);
        }

        .reset-btn {
          min-height: 58px;
          border: none;
          border-radius: 18px;
          font-weight: 800;
          color: #fff;
          background: linear-gradient(135deg, #0b1736 0%, #142850 40%, #1d4ed8 100%);
          margin-top: 16px;
        }

        .reset-alert {
          border-radius: 16px;
          padding: 14px 16px;
          font-weight: 600;
          margin-bottom: 18px;
          background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
          color: #1d4ed8;
          border: 1px solid #bfdbfe;
        }

        .reset-footer {
          margin-top: 18px;
          text-align: center;
          color: #64748b;
        }

        .reset-link {
          color: #2563eb;
          text-decoration: none;
          font-weight: 700;
        }

        .reset-email-note {
          font-size: 0.95rem;
          color: #475569;
          margin-bottom: 16px;
          word-break: break-word;
        }
      `}</style>

      <div className="reset-page">
        <div className="reset-card">
          <div className="reset-kicker">Create New Password</div>
          <h1 className="reset-heading">Reset your password</h1>
          <p className="reset-text">
            Create a new secure password for your Internova account.
          </p>

          {email && (
            <p className="reset-email-note">
              Resetting password for: <strong>{email}</strong>
            </p>
          )}

          {message && <div className="reset-alert">{message}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="reset-label">New Password</label>
              <input
                type="password"
                className="form-control reset-input"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="reset-label">Confirm New Password</label>
              <input
                type="password"
                className="form-control reset-input"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn reset-btn w-100"
              disabled={loading}
            >
              {loading ? "Updating Password..." : "Reset Password"}
            </button>
          </form>

          <p className="reset-footer">
            Back to{" "}
            <Link to="/" className="reset-link">
              Login
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}

export default ResetPassword;