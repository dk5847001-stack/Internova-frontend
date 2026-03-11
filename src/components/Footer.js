import React, { useState } from "react";
import { Link } from "react-router-dom";

function Footer() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setMessage("Please enter your email address.");
      return;
    }

    setMessage("Thanks for subscribing to Internova updates!");
    setEmail("");

    setTimeout(() => {
      setMessage("");
    }, 3000);
  };

  return (
    <>
      <style>{`
        .internova-footer {
          position: relative;
          overflow: hidden;
          background:
            linear-gradient(135deg, #081226 0%, #0b1736 35%, #142850 70%, #1d4ed8 100%);
          color: #fff;
          margin-top: 80px;
          border-top: 1px solid rgba(255,255,255,0.08);
        }

        .internova-footer::before {
          content: "";
          position: absolute;
          inset: 0;
          background:
            radial-gradient(circle at 15% 20%, rgba(255,255,255,0.10), transparent 20%),
            radial-gradient(circle at 85% 75%, rgba(255,255,255,0.08), transparent 18%);
          pointer-events: none;
        }

        .internova-footer-shell {
          position: relative;
          z-index: 2;
        }

        .footer-top-card {
          border-radius: 28px;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.12);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          padding: 24px;
          -webkit-transition: all 0.35s ease;
          transition: all 0.35s ease;
          height: 100%;
        }

        .footer-top-card:hover {
          transform: translateY(-4px);
          -webkit-transform: translateY(-4px);
          background: rgba(255,255,255,0.10);
        }

        .footer-brand-wrap {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 18px;
        }

        .footer-logo {
          width: 52px;
          height: 52px;
          border-radius: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255,255,255,0.12);
          border: 1px solid rgba(255,255,255,0.14);
          color: #fff;
          font-size: 1.15rem;
          font-weight: 800;
          box-shadow: 0 12px 25px rgba(0,0,0,0.15);
          -webkit-box-shadow: 0 12px 25px rgba(0,0,0,0.15);
          flex-shrink: 0;
        }

        .footer-brand-title {
          font-size: 1.5rem;
          font-weight: 800;
          letter-spacing: -0.02em;
          margin-bottom: 2px;
        }

        .footer-brand-sub {
          color: rgba(255,255,255,0.70);
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .footer-text {
          color: rgba(255,255,255,0.78);
          line-height: 1.9;
          margin-bottom: 0;
        }

        .footer-heading {
          font-size: 1.05rem;
          font-weight: 800;
          margin-bottom: 18px;
          color: #ffffff;
        }

        .footer-links {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .footer-links li {
          margin-bottom: 12px;
        }

        .footer-links a,
        .footer-links span {
          color: rgba(255,255,255,0.78);
          text-decoration: none;
          -webkit-transition: all 0.25s ease;
          transition: all 0.25s ease;
          line-height: 1.7;
        }

        .footer-links a:hover {
          color: #ffffff;
          transform: translateX(4px);
          -webkit-transform: translateX(4px);
          display: inline-block;
        }

        .footer-highlight-box {
          border-radius: 22px;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.12);
          padding: 18px;
          margin-bottom: 16px;
          -webkit-transition: all 0.3s ease;
          transition: all 0.3s ease;
        }

        .footer-highlight-box:hover {
          background: rgba(255,255,255,0.10);
          transform: translateY(-3px);
          -webkit-transform: translateY(-3px);
        }

        .footer-highlight-title {
          font-size: 0.98rem;
          font-weight: 800;
          margin-bottom: 6px;
          color: #ffffff;
        }

        .footer-highlight-text {
          color: rgba(255,255,255,0.74);
          margin-bottom: 0;
          line-height: 1.8;
          font-size: 0.94rem;
        }

        .footer-subscribe-box {
          border-radius: 28px;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.12);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          padding: 28px;
          margin-top: 28px;
        }

        .footer-subscribe-title {
          font-size: 1.35rem;
          font-weight: 800;
          margin-bottom: 8px;
          color: #ffffff;
        }

        .footer-subscribe-text {
          color: rgba(255,255,255,0.76);
          line-height: 1.8;
          margin-bottom: 18px;
        }

        .footer-subscribe-form {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .footer-input {
          flex: 1;
          min-width: 240px;
          min-height: 54px;
          border-radius: 16px;
          border: 1px solid rgba(255,255,255,0.16);
          background: rgba(255,255,255,0.10);
          color: #ffffff;
          padding: 0 16px;
          outline: none;
          -webkit-transition: all 0.3s ease;
          transition: all 0.3s ease;
        }

        .footer-input::placeholder {
          color: rgba(255,255,255,0.58);
        }

        .footer-input:focus {
          background: rgba(255,255,255,0.14);
          border-color: rgba(255,255,255,0.28);
          box-shadow: 0 0 0 4px rgba(255,255,255,0.08);
          -webkit-box-shadow: 0 0 0 4px rgba(255,255,255,0.08);
        }

        .footer-subscribe-btn {
          min-height: 54px;
          padding: 0 22px;
          border: none;
          border-radius: 16px;
          font-weight: 800;
          color: #0f172a;
          background: linear-gradient(135deg, #ffffff 0%, #dbeafe 100%);
          box-shadow: 0 14px 30px rgba(255,255,255,0.14);
          -webkit-box-shadow: 0 14px 30px rgba(255,255,255,0.14);
          -webkit-transition: all 0.3s ease;
          transition: all 0.3s ease;
        }

        .footer-subscribe-btn:hover {
          transform: translateY(-2px);
          -webkit-transform: translateY(-2px);
        }

        .footer-message {
          margin-top: 14px;
          font-weight: 700;
          color: #d1fae5;
        }

        .internova-footer-bottom {
          border-top: 1px solid rgba(255,255,255,0.10);
        }

        .footer-copy {
          color: rgba(255,255,255,0.72);
        }

        .footer-socials {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .footer-socials a {
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
          -webkit-transition: all 0.28s ease;
          transition: all 0.28s ease;
        }

        .footer-socials a:hover {
          transform: translateY(-2px);
          -webkit-transform: translateY(-2px);
          background: rgba(255,255,255,0.12);
          color: #ffffff;
        }

        .footer-mini-badges {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 18px;
        }

        .footer-mini-badge {
          padding: 8px 12px;
          border-radius: 999px;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.12);
          color: rgba(255,255,255,0.82);
          font-size: 0.8rem;
          font-weight: 700;
        }

        @media (max-width: 767px) {
          .footer-subscribe-form {
            flex-direction: column;
          }

          .footer-input,
          .footer-subscribe-btn {
            width: 100%;
          }

          .footer-brand-title {
            font-size: 1.3rem;
          }
        }
      `}</style>

      <footer className="internova-footer">
        <div className="container py-5 internova-footer-shell">
          <div className="row g-4">
            <div className="col-lg-4">
              <div className="footer-top-card">
                <div className="footer-brand-wrap">
                  <div className="footer-logo">I</div>
                  <div>
                    <h4 className="footer-brand-title mb-0">Internova</h4>
                    <small className="footer-brand-sub">
                      Learning & Certification Platform
                    </small>
                  </div>
                </div>

                <p className="footer-text">
                  Internova helps learners access structured training programs,
                  track progress, complete assessments, generate certificates,
                  and verify credentials through a premium digital learning
                  experience.
                </p>

                <div className="footer-mini-badges">
                  <span className="footer-mini-badge">Verified Certificates</span>
                  <span className="footer-mini-badge">Premium UI/UX</span>
                  <span className="footer-mini-badge">Learning Progress</span>
                </div>
              </div>
            </div>

            <div className="col-lg-3 col-md-4">
              <div className="footer-top-card">
                <h5 className="footer-heading">Quick Links</h5>
                <ul className="footer-links">
                  <li><Link to="/dashboard">Dashboard</Link></li>
                  <li><Link to="/internships">Programs</Link></li>
                  <li><Link to="/my-purchases">My Purchases</Link></li>
                  <li><Link to="/verify">Verify Certificate</Link></li>
                  <li><Link to="/about">About Us</Link></li>
                  <li><Link to="/contact">Contact Us</Link></li>
                  <li><Link to="/privacy-policy">Privacy Policy</Link></li>
                  <li><Link to="/terms-and-conditions">Terms & Conditions</Link></li>
                  <li><Link to="/refund-policy">Refund Policy</Link></li>
                </ul>
              </div>
            </div>

            <div className="col-lg-2 col-md-4">
              <div className="footer-top-card">
                <h5 className="footer-heading">Programs</h5>
                <ul className="footer-links">
                  <li><span>Web Development</span></li>
                  <li><span>AI & ML</span></li>
                  <li><span>Digital Marketing</span></li>
                  <li><span>Business Analytics</span></li>
                  <li><span>Data Science</span></li>
                </ul>
              </div>
            </div>

            <div className="col-lg-3 col-md-4">
              <div className="footer-top-card">
                <h5 className="footer-heading">Get in Touch</h5>

                <div className="footer-highlight-box">
                  <h6 className="footer-highlight-title">Support</h6>
                  <p className="footer-highlight-text">
                    support@internova.com
                  </p>
                </div>

                <div className="footer-highlight-box">
                  <h6 className="footer-highlight-title">Message</h6>
                  <p className="footer-highlight-text">
                    We help with learning access, certificate issues, payment
                    queries, and account-related questions.
                  </p>
                </div>

                <div className="footer-highlight-box mb-0">
                  <h6 className="footer-highlight-title">Hours</h6>
                  <p className="footer-highlight-text">
                    Mon - Sat • 9:00 AM to 6:00 PM
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="footer-subscribe-box">
            <div className="row g-4 align-items-center">
              <div className="col-lg-7">
                <h4 className="footer-subscribe-title">
                  Subscribe for Updates & Opportunities
                </h4>
                <p className="footer-subscribe-text">
                  Get training program updates, new announcements, platform
                  improvements, and premium learning insights delivered to your inbox.
                </p>

                <form className="footer-subscribe-form" onSubmit={handleSubscribe}>
                  <input
                    type="email"
                    className="footer-input"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <button type="submit" className="footer-subscribe-btn">
                    Subscribe
                  </button>
                </form>

                {message && <div className="footer-message">{message}</div>}
              </div>

              <div className="col-lg-5">
                <div className="footer-highlight-box">
                  <h6 className="footer-highlight-title">Need Help Fast?</h6>
                  <p className="footer-highlight-text">
                    Use the platform to access training programs, track modules,
                    attempt assessments, and verify official certificates.
                  </p>
                </div>

                <div className="footer-highlight-box mb-0">
                  <h6 className="footer-highlight-title">
                    Secure Learning Access
                  </h6>
                  <p className="footer-highlight-text">
                    Premium learning dashboard, certificate generation,
                    verification support, and structured progress tracking.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="internova-footer-bottom mt-4 pt-4">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
              <p className="mb-0 footer-copy">
                © 2026 Internova. All rights reserved.
              </p>

              <div className="footer-socials">
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