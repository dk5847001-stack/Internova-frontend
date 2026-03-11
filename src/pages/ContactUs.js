import React from "react";

function ContactUs() {
  return (
    <>
      <style>{`
        .contact-page-wrap {
          min-height: 100vh;
          padding: 90px 0 70px;
          background:
            radial-gradient(circle at top right, rgba(37, 99, 235, 0.12), transparent 28%),
            radial-gradient(circle at bottom left, rgba(59, 130, 246, 0.12), transparent 28%),
            linear-gradient(135deg, #f8fbff 0%, #eef4ff 45%, #e8f1ff 100%);
        }

        .contact-shell {
          position: relative;
          overflow: hidden;
          border-radius: 30px;
          background: rgba(255, 255, 255, 0.80);
          border: 1px solid rgba(255, 255, 255, 0.75);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          box-shadow: 0 20px 50px rgba(15, 23, 42, 0.08);
          -webkit-box-shadow: 0 20px 50px rgba(15, 23, 42, 0.08);
          padding: 42px;
        }

        .contact-shell::before {
          content: "";
          position: absolute;
          inset: 0;
          background:
            radial-gradient(circle at 15% 20%, rgba(37, 99, 235, 0.08), transparent 22%),
            radial-gradient(circle at 85% 80%, rgba(59, 130, 246, 0.08), transparent 18%);
          pointer-events: none;
        }

        .contact-content {
          position: relative;
          z-index: 2;
        }

        .contact-badge {
          display: inline-flex;
          align-items: center;
          padding: 9px 16px;
          border-radius: 999px;
          background: rgba(37, 99, 235, 0.10);
          border: 1px solid rgba(37, 99, 235, 0.14);
          color: #1d4ed8;
          font-weight: 700;
          font-size: 0.82rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: 18px;
        }

        .contact-title {
          font-size: 2.5rem;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.03em;
          margin-bottom: 12px;
        }

        .contact-subtitle {
          color: #475569;
          line-height: 1.9;
          font-size: 1.02rem;
          max-width: 860px;
          margin-bottom: 0;
        }

        .contact-card {
          height: 100%;
          border-radius: 24px;
          background: rgba(255, 255, 255, 0.88);
          border: 1px solid rgba(148, 163, 184, 0.16);
          box-shadow: 0 14px 34px rgba(15, 23, 42, 0.05);
          -webkit-box-shadow: 0 14px 34px rgba(15, 23, 42, 0.05);
          padding: 26px;
          -webkit-transition: all 0.32s ease;
          transition: all 0.32s ease;
        }

        .contact-card:hover {
          transform: translateY(-6px);
          -webkit-transform: translateY(-6px);
          box-shadow: 0 24px 44px rgba(15, 23, 42, 0.10);
          -webkit-box-shadow: 0 24px 44px rgba(15, 23, 42, 0.10);
        }

        .contact-icon {
          width: 54px;
          height: 54px;
          border-radius: 18px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
          color: #1d4ed8;
          font-size: 1.2rem;
          font-weight: 800;
          margin-bottom: 16px;
          box-shadow: 0 12px 24px rgba(59, 130, 246, 0.14);
          -webkit-box-shadow: 0 12px 24px rgba(59, 130, 246, 0.14);
        }

        .contact-card-title {
          font-size: 1.08rem;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 10px;
        }

        .contact-card-text {
          color: #475569;
          line-height: 1.9;
          margin-bottom: 0;
          word-break: break-word;
        }

        .contact-highlight {
          margin-top: 30px;
          border-radius: 28px;
          background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%);
          color: #fff;
          padding: 30px;
          box-shadow: 0 20px 45px rgba(15, 23, 42, 0.16);
          -webkit-box-shadow: 0 20px 45px rgba(15, 23, 42, 0.16);
          -webkit-transition: all 0.3s ease;
          transition: all 0.3s ease;
        }

        .contact-highlight:hover {
          transform: translateY(-4px);
          -webkit-transform: translateY(-4px);
        }

        .contact-highlight h4 {
          font-weight: 800;
          margin-bottom: 10px;
          font-size: 1.2rem;
        }

        .contact-highlight p {
          margin-bottom: 0;
          color: rgba(255,255,255,0.84);
          line-height: 1.9;
        }

        .contact-note {
          margin-top: 22px;
          padding: 18px 20px;
          border-radius: 18px;
          background: rgba(255,255,255,0.78);
          border: 1px solid rgba(148, 163, 184, 0.16);
          color: #475569;
          line-height: 1.8;
          box-shadow: 0 10px 24px rgba(15,23,42,0.04);
          -webkit-box-shadow: 0 10px 24px rgba(15,23,42,0.04);
        }

        @media (max-width: 767px) {
          .contact-page-wrap {
            padding: 55px 0 45px;
          }

          .contact-shell {
            padding: 24px;
            border-radius: 22px;
          }

          .contact-title {
            font-size: 2rem;
          }

          .contact-subtitle {
            font-size: 0.98rem;
          }

          .contact-highlight {
            padding: 22px;
            border-radius: 22px;
          }
        }
      `}</style>

      <div className="contact-page-wrap">
        <div className="container">
          <div className="contact-shell">
            <div className="contact-content">
              <div className="contact-badge">Contact Internova</div>
              <h1 className="contact-title">We’re Here to Help You</h1>
              <p className="contact-subtitle">
                If you have questions about learning access, payments, account issues,
                certificates, or general platform support, you can reach out to us
                using the details below.
              </p>

              <div className="row g-4 mt-1">
                <div className="col-lg-4 col-md-6">
                  <div className="contact-card">
                    <div className="contact-icon">I</div>
                    <h5 className="contact-card-title">Platform Name</h5>
                    <p className="contact-card-text">Internova</p>
                  </div>
                </div>

                <div className="col-lg-4 col-md-6">
                  <div className="contact-card">
                    <div className="contact-icon">@</div>
                    <h5 className="contact-card-title">Support Email</h5>
                    <p className="contact-card-text">internova.support@gmail.com</p>
                  </div>
                </div>

                <div className="col-lg-4 col-md-12">
                  <div className="contact-card">
                    <div className="contact-icon">☎</div>
                    <h5 className="contact-card-title">Phone</h5>
                    <p className="contact-card-text">+91 9905167559</p>
                  </div>
                </div>

                <div className="col-lg-6 col-md-6">
                  <div className="contact-card">
                    <div className="contact-icon">📍</div>
                    <h5 className="contact-card-title">Location</h5>
                    <p className="contact-card-text">Bihar, India</p>
                  </div>
                </div>

                <div className="col-lg-6 col-md-6">
                  <div className="contact-card">
                    <div className="contact-icon">⏰</div>
                    <h5 className="contact-card-title">Support Hours</h5>
                    <p className="contact-card-text">
                      Monday to Saturday, 10:00 AM to 6:00 PM
                    </p>
                  </div>
                </div>
              </div>

              <div className="contact-highlight">
                <h4>Support Note</h4>
                <p>
                  We aim to respond to genuine support and payment-related queries as
                  quickly as possible. For faster resolution, please contact us using
                  the same email address used during registration or enrollment.
                </p>
              </div>

              <div className="contact-note">
                For payment verification, access issues, certificate queries, or account
                support, please include your registered email and a short description of
                the issue in your message.
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ContactUs;