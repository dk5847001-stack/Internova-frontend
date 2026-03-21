import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

function Footer() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [subscribing, setSubscribing] = useState(false);

  const token = localStorage.getItem("token");

  const quickLinks = useMemo(() => {
    const baseLinks = [
      { to: "/", label: "Home" },
      { to: "/internships", label: "Programs" },
      { to: "/verify", label: "Verify Certificate" },
      { to: "/about", label: "About Us" },
      { to: "/contact", label: "Contact Us" },
      { to: "/privacy-policy", label: "Privacy Policy" },
      { to: "/terms-and-conditions", label: "Terms & Conditions" },
      { to: "/refund-policy", label: "Refund Policy" },
    ];

    if (token) {
      return [
        ...baseLinks,
        { to: "/dashboard", label: "Dashboard" },
        { to: "/my-purchases", label: "My Enrollments" },
      ];
    }

    return [
      ...baseLinks,
      { to: "/login", label: "Login" },
      { to: "/register", label: "Register" },
    ];
  }, [token]);

  const showMessage = (type, text) => {
    setMessageType(type);
    setMessage(text);

    setTimeout(() => {
      setMessage("");
      setMessageType("success");
    }, 3000);
  };

  const isValidEmail = (value) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).trim());
  };

  const handleSubscribe = async (e) => {
    e.preventDefault();

    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedEmail) {
      showMessage("error", "Please enter your email address.");
      return;
    }

    if (!isValidEmail(trimmedEmail)) {
      showMessage("error", "Please enter a valid email address.");
      return;
    }

    try {
      setSubscribing(true);

      const { data } = await API.post("/subscribers", {
        email: trimmedEmail,
        source: "footer",
      });

      showMessage(
        "success",
        data?.message || "Thanks for subscribing to InternovaTech updates!"
      );
      setEmail("");
    } catch (error) {
      console.error("Subscribe failed:", error);

      showMessage(
        "error",
        error?.response?.data?.message || "Failed to subscribe right now."
      );
    } finally {
      setSubscribing(false);
    }
  };

  return (
    <>
      <style>{`
        .footer-v60 {
          position: relative;
          overflow: hidden;
          background:
            radial-gradient(circle at top left, rgba(59,130,246,0.14), transparent 24%),
            radial-gradient(circle at 84% 18%, rgba(99,102,241,0.12), transparent 22%),
            linear-gradient(135deg, #050d1e 0%, #081226 26%, #102247 62%, #1d4ed8 100%);
          color: #fff;
          margin-top: 84px;
          border-top: 1px solid rgba(255,255,255,0.08);
        }

        .footer-v60::before {
          content: "";
          position: absolute;
          inset: 0;
          background:
            radial-gradient(circle at 14% 18%, rgba(255,255,255,0.08), transparent 18%),
            radial-gradient(circle at 86% 74%, rgba(255,255,255,0.05), transparent 18%),
            repeating-linear-gradient(
              90deg,
              rgba(255,255,255,0.03) 0px,
              rgba(255,255,255,0.03) 1px,
              transparent 1px,
              transparent 140px
            );
          pointer-events: none;
        }

        .footer-v60-shell {
          position: relative;
          z-index: 2;
        }

        .footer-v60-topbar {
          border-radius: 30px;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.12);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          padding: 26px;
          margin-bottom: 26px;
          box-shadow: 0 18px 42px rgba(0,0,0,0.12);
          -webkit-box-shadow: 0 18px 42px rgba(0,0,0,0.12);
        }

        .footer-v60-topbar-title {
          font-size: 1.65rem;
          font-weight: 900;
          letter-spacing: -0.03em;
          margin-bottom: 8px;
          color: #fff;
        }

        .footer-v60-topbar-text {
          color: rgba(255,255,255,0.76);
          line-height: 1.85;
          margin-bottom: 0;
        }

        .footer-v60-topbar-actions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          justify-content: flex-end;
        }

        .footer-v60-btn-primary,
        .footer-v60-btn-outline {
          min-height: 52px;
          padding: 0 20px;
          border-radius: 16px;
          font-weight: 800;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          -webkit-transition: all 0.3s ease;
        }

        .footer-v60-btn-primary {
          color: #fff;
          background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
          border: none;
          box-shadow: 0 16px 34px rgba(37,99,235,0.22);
          -webkit-box-shadow: 0 16px 34px rgba(37,99,235,0.22);
        }

        .footer-v60-btn-primary:hover {
          color: #fff;
          transform: translateY(-2px);
          -webkit-transform: translateY(-2px);
        }

        .footer-v60-btn-outline {
          color: #fff;
          border: 1px solid rgba(255,255,255,0.18);
          background: rgba(255,255,255,0.08);
        }

        .footer-v60-btn-outline:hover {
          color: #fff;
          background: rgba(255,255,255,0.12);
          transform: translateY(-2px);
          -webkit-transform: translateY(-2px);
        }

        .footer-v60-card {
          height: 100%;
          border-radius: 28px;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.12);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          padding: 26px;
          transition: all 0.35s ease;
          -webkit-transition: all 0.35s ease;
          box-shadow: 0 18px 42px rgba(0,0,0,0.10);
          -webkit-box-shadow: 0 18px 42px rgba(0,0,0,0.10);
          overflow: hidden;
          position: relative;
        }

        .footer-v60-card::after {
          content: "";
          position: absolute;
          inset: auto auto 0 0;
          width: 100%;
          height: 3px;
          background: linear-gradient(135deg, #60a5fa 0%, #34d399 100%);
          opacity: 0.95;
        }

        .footer-v60-card:hover {
          transform: translateY(-5px);
          -webkit-transform: translateY(-5px);
          background: rgba(255,255,255,0.10);
          box-shadow: 0 24px 56px rgba(0,0,0,0.14);
          -webkit-box-shadow: 0 24px 56px rgba(0,0,0,0.14);
        }

        .footer-v60-brand-wrap {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 18px;
        }

        .footer-v60-logo {
          width: 56px;
          height: 56px;
          border-radius: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.10) 100%);
          border: 1px solid rgba(255,255,255,0.18);
          color: #fff;
          font-size: 1.2rem;
          font-weight: 900;
          box-shadow: 0 12px 28px rgba(0,0,0,0.14);
          -webkit-box-shadow: 0 12px 28px rgba(0,0,0,0.14);
          flex-shrink: 0;
        }

        .footer-v60-brand-title {
          font-size: 1.55rem;
          font-weight: 900;
          letter-spacing: -0.03em;
          margin-bottom: 2px;
        }

        .footer-v60-brand-sub {
          color: rgba(255,255,255,0.70);
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .footer-v60-text {
          color: rgba(255,255,255,0.78);
          line-height: 1.9;
          margin-bottom: 0;
        }

        .footer-v60-heading {
          font-size: 1.08rem;
          font-weight: 900;
          margin-bottom: 18px;
          color: #ffffff;
          letter-spacing: -0.02em;
        }

        .footer-v60-links {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .footer-v60-links li {
          margin-bottom: 12px;
        }

        .footer-v60-links a,
        .footer-v60-links span {
          color: rgba(255,255,255,0.78);
          text-decoration: none;
          transition: all 0.25s ease;
          -webkit-transition: all 0.25s ease;
          line-height: 1.7;
        }

        .footer-v60-links a:hover {
          color: #ffffff;
          transform: translateX(4px);
          -webkit-transform: translateX(4px);
          display: inline-block;
        }

        .footer-v60-mini-badges {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 18px;
        }

        .footer-v60-mini-badge {
          padding: 8px 12px;
          border-radius: 999px;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.12);
          color: rgba(255,255,255,0.84);
          font-size: 0.8rem;
          font-weight: 700;
          transition: all 0.28s ease;
          -webkit-transition: all 0.28s ease;
        }

        .footer-v60-mini-badge:hover {
          background: rgba(255,255,255,0.12);
          transform: translateY(-2px);
          -webkit-transform: translateY(-2px);
        }

        .footer-v60-info-box {
          border-radius: 22px;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.12);
          padding: 18px;
          margin-bottom: 16px;
          transition: all 0.3s ease;
          -webkit-transition: all 0.3s ease;
        }

        .footer-v60-info-box:hover {
          background: rgba(255,255,255,0.12);
          transform: translateY(-3px);
          -webkit-transform: translateY(-3px);
        }

        .footer-v60-info-title {
          font-size: 0.98rem;
          font-weight: 900;
          margin-bottom: 6px;
          color: #ffffff;
          letter-spacing: -0.01em;
        }

        .footer-v60-info-text {
          color: rgba(255,255,255,0.74);
          margin-bottom: 0;
          line-height: 1.8;
          font-size: 0.94rem;
        }

        .footer-v60-subscribe {
          border-radius: 30px;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.12);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          padding: 28px;
          margin-top: 28px;
          box-shadow: 0 18px 42px rgba(0,0,0,0.10);
          -webkit-box-shadow: 0 18px 42px rgba(0,0,0,0.10);
        }

        .footer-v60-subscribe-title {
          font-size: 1.42rem;
          font-weight: 900;
          margin-bottom: 8px;
          color: #ffffff;
          letter-spacing: -0.02em;
        }

        .footer-v60-subscribe-text {
          color: rgba(255,255,255,0.76);
          line-height: 1.8;
          margin-bottom: 18px;
        }

        .footer-v60-subscribe-form {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .footer-v60-input {
          flex: 1;
          min-width: 240px;
          min-height: 56px;
          border-radius: 18px;
          border: 1px solid rgba(255,255,255,0.16);
          background: rgba(255,255,255,0.10);
          color: #ffffff;
          padding: 0 16px;
          outline: none;
          transition: all 0.3s ease;
          -webkit-transition: all 0.3s ease;
        }

        .footer-v60-input::placeholder {
          color: rgba(255,255,255,0.58);
        }

        .footer-v60-input:focus {
          background: rgba(255,255,255,0.14);
          border-color: rgba(255,255,255,0.28);
          box-shadow: 0 0 0 4px rgba(255,255,255,0.08);
          -webkit-box-shadow: 0 0 0 4px rgba(255,255,255,0.08);
        }

        .footer-v60-input:disabled {
          opacity: 0.75;
          cursor: not-allowed;
        }

        .footer-v60-subscribe-btn {
          min-height: 56px;
          padding: 0 22px;
          border: none;
          border-radius: 18px;
          font-weight: 900;
          color: #0f172a;
          background: linear-gradient(135deg, #ffffff 0%, #dbeafe 100%);
          box-shadow: 0 14px 30px rgba(255,255,255,0.14);
          -webkit-box-shadow: 0 14px 30px rgba(255,255,255,0.14);
          transition: all 0.3s ease;
          -webkit-transition: all 0.3s ease;
        }

        .footer-v60-subscribe-btn:hover {
          transform: translateY(-2px);
          -webkit-transform: translateY(-2px);
        }

        .footer-v60-subscribe-btn:disabled {
          opacity: 0.75;
          cursor: not-allowed;
          transform: none !important;
          -webkit-transform: none !important;
        }

        .footer-v60-message {
          margin-top: 14px;
          font-weight: 700;
        }

        .footer-v60-message.success {
          color: #d1fae5;
        }

        .footer-v60-message.error {
          color: #fecaca;
        }

        .footer-v60-bottom {
          border-top: 1px solid rgba(255,255,255,0.10);
          margin-top: 28px;
          padding-top: 24px;
        }

        .footer-v60-copy {
          color: rgba(255,255,255,0.72);
          margin-bottom: 0;
        }

        .footer-v60-socials {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .footer-v60-socials a {
          min-height: 42px;
          padding: 0 16px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 999px;
          text-decoration: none;
          color: #ffffff;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.12);
          transition: all 0.28s ease;
          -webkit-transition: all 0.28s ease;
        }

        .footer-v60-socials a:hover {
          transform: translateY(-2px);
          -webkit-transform: translateY(-2px);
          background: rgba(255,255,255,0.12);
          color: #ffffff;
        }

        @media (max-width: 991px) {
          .footer-v60-topbar {
            padding: 22px;
          }

          .footer-v60-topbar-actions {
            justify-content: flex-start;
            margin-top: 14px;
          }
        }

        @media (max-width: 767px) {
          .footer-v60-topbar,
          .footer-v60-card,
          .footer-v60-subscribe {
            padding: 22px;
            border-radius: 22px;
          }

          .footer-v60-subscribe-form {
            flex-direction: column;
          }

          .footer-v60-input,
          .footer-v60-subscribe-btn {
            width: 100%;
          }

          .footer-v60-brand-title {
            font-size: 1.34rem;
          }

          .footer-v60-topbar-title {
            font-size: 1.35rem;
          }

          .footer-v60-subscribe-title {
            font-size: 1.22rem;
          }
        }
      `}</style>

      <footer className="footer-v60">
        <div className="container py-5 footer-v60-shell">
          <div className="footer-v60-topbar">
            <div className="row align-items-center g-4">
              <div className="col-lg-8">
                <h2 className="footer-v60-topbar-title">
                  Build skills, track progress, and validate achievement with InternovaTech
                </h2>
                <p className="footer-v60-topbar-text">
                  Explore premium online Internship Programs, complete guided learning,
                  monitor progress, and access trusted certificate verification inside one
                  polished digital platform.
                </p>
              </div>

              <div className="col-lg-4">
                <div className="footer-v60-topbar-actions">
                  <Link to="/internships" className="footer-v60-btn-primary">
                    Explore Programs
                  </Link>
                  <Link to="/verify" className="footer-v60-btn-outline">
                    Verify Certificate
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="row g-4">
            <div className="col-lg-4">
              <div className="footer-v60-card">
                <div className="footer-v60-brand-wrap">
                  <div className="footer-v60-logo">I</div>
                  <div>
                    <h4 className="footer-v60-brand-title mb-0">InternovaTech</h4>
                    <small className="footer-v60-brand-sub">
                      Online Internship Programs & Certificate Platform
                    </small>
                  </div>
                </div>

                <p className="footer-v60-text">
                  InternovaTech helps students and learners access structured online
                  Internship Programs, practical modules, progress tracking, mini assessments,
                  and verified certificates through a premium SaaS-style learning experience.
                </p>

                <div className="footer-v60-mini-badges">
                  <span className="footer-v60-mini-badge">Verified Certificates</span>
                  <span className="footer-v60-mini-badge">Online Internship Programs</span>
                  <span className="footer-v60-mini-badge">Premium Dashboard</span>
                  <span className="footer-v60-mini-badge">Practical Learning</span>
                </div>
              </div>
            </div>

            <div className="col-lg-3 col-md-4">
              <div className="footer-v60-card">
                <h5 className="footer-v60-heading">Quick Links</h5>
                <ul className="footer-v60-links">
                  {quickLinks.map((item, index) => (
                    <li key={`${item.to}-${index}`}>
                      <Link to={item.to}>{item.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="col-lg-2 col-md-4">
              <div className="footer-v60-card">
                <h5 className="footer-v60-heading">Programs</h5>
                <ul className="footer-v60-links">
                  <li><span>Web Development</span></li>
                  <li><span>AI & ML</span></li>
                  <li><span>Digital Marketing</span></li>
                  <li><span>Business Analytics</span></li>
                  <li><span>Data Science</span></li>
                  <li><span>Finance</span></li>
                </ul>
              </div>
            </div>

            <div className="col-lg-3 col-md-4">
              <div className="footer-v60-card">
                <h5 className="footer-v60-heading">Get in Touch</h5>

                <div className="footer-v60-info-box">
                  <h6 className="footer-v60-info-title">Support</h6>
                  <p className="footer-v60-info-text">
                    internova.support@gmail.com
                  </p>
                </div>

                <div className="footer-v60-info-box">
                  <h6 className="footer-v60-info-title">Message</h6>
                  <p className="footer-v60-info-text">
                    We help with Internship Programs access, verification support, account help,
                    and learning-related questions.
                  </p>
                </div>

                <div className="footer-v60-info-box mb-0">
                  <h6 className="footer-v60-info-title">Hours</h6>
                  <p className="footer-v60-info-text">
                    Mon - Sat • 9:00 AM to 6:00 PM
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="footer-v60-subscribe">
            <div className="row g-4 align-items-center">
              <div className="col-lg-7">
                <h4 className="footer-v60-subscribe-title">
                  Subscribe for updates and new opportunities
                </h4>
                <p className="footer-v60-subscribe-text">
                  Get program launches, learning updates, platform announcements,
                  and career-focused insights directly in your inbox.
                </p>

                <form className="footer-v60-subscribe-form" onSubmit={handleSubscribe}>
                  <input
                    type="email"
                    className="footer-v60-input"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={subscribing}
                  />
                  <button
                    type="submit"
                    className="footer-v60-subscribe-btn"
                    disabled={subscribing}
                  >
                    {subscribing ? "Subscribing..." : "Subscribe"}
                  </button>
                </form>

                {message && (
                  <div className={`footer-v60-message ${messageType}`}>
                    {message}
                  </div>
                )}
              </div>

              <div className="col-lg-5">
                <div className="footer-v60-info-box">
                  <h6 className="footer-v60-info-title">Need Help Fast?</h6>
                  <p className="footer-v60-info-text">
                    Use InternovaTech to explore programs, track progress,
                    complete learning stages, and verify official certificates.
                  </p>
                </div>

                <div className="footer-v60-info-box mb-0">
                  <h6 className="footer-v60-info-title">Premium Learning Flow</h6>
                  <p className="footer-v60-info-text">
                    Clean UX, practical structure, verified completion workflow,
                    and a more trusted learner experience in one platform.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="footer-v60-bottom">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
              <p className="footer-v60-copy">
                © 2026 InternovaTech. All rights reserved.
              </p>

              <div className="footer-v60-socials">
                <a href="/" onClick={(e) => e.preventDefault()}>LinkedIn</a>
                <a href="/" onClick={(e) => e.preventDefault()}>GitHub</a>
                <a href="/" onClick={(e) => e.preventDefault()}>Instagram</a>
                <Link to="/contact">Support</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Footer;