import React from "react";

function PrivacyPolicy() {
  return (
    <>
      <style>{`
        .legal-page-wrap {
          min-height: 100vh;
          background:
            radial-gradient(circle at top left, rgba(59,130,246,0.10), transparent 30%),
            radial-gradient(circle at bottom right, rgba(30,64,175,0.10), transparent 30%),
            linear-gradient(135deg, #f8fbff 0%, #eef4ff 48%, #eaf2ff 100%);
          padding: 80px 0;
        }

        .legal-shell {
          border-radius: 30px;
          background: rgba(255,255,255,0.82);
          border: 1px solid rgba(255,255,255,0.75);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          box-shadow: 0 20px 50px rgba(15,23,42,0.08);
          -webkit-box-shadow: 0 20px 50px rgba(15,23,42,0.08);
          padding: 42px;
        }

        .legal-badge {
          display: inline-flex;
          padding: 9px 16px;
          border-radius: 999px;
          background: rgba(37,99,235,0.10);
          border: 1px solid rgba(37,99,235,0.14);
          color: #1d4ed8;
          font-weight: 700;
          font-size: 0.82rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: 18px;
        }

        .legal-title {
          font-size: 2.5rem;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.03em;
          margin-bottom: 12px;
        }

        .legal-subtitle {
          color: #475569;
          line-height: 1.9;
          margin-bottom: 28px;
        }

        .legal-section {
          border-radius: 22px;
          background: rgba(255,255,255,0.90);
          border: 1px solid rgba(148,163,184,0.16);
          box-shadow: 0 12px 30px rgba(15,23,42,0.05);
          -webkit-box-shadow: 0 12px 30px rgba(15,23,42,0.05);
          padding: 24px;
          margin-bottom: 18px;
          -webkit-transition: all 0.28s ease;
          transition: all 0.28s ease;
        }

        .legal-section:hover {
          transform: translateY(-4px);
          -webkit-transform: translateY(-4px);
          box-shadow: 0 22px 40px rgba(15,23,42,0.09);
          -webkit-box-shadow: 0 22px 40px rgba(15,23,42,0.09);
        }

        .legal-section h4 {
          font-size: 1.08rem;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 10px;
        }

        .legal-section p {
          color: #475569;
          line-height: 1.9;
          margin-bottom: 0;
        }

        @media (max-width: 767px) {
          .legal-page-wrap {
            padding: 50px 0;
          }

          .legal-shell {
            padding: 24px;
            border-radius: 22px;
          }

          .legal-title {
            font-size: 2rem;
          }
        }
      `}</style>

      <div className="legal-page-wrap">
        <div className="container">
          <div className="legal-shell">
            <div className="legal-badge">Privacy Policy</div>
            <h1 className="legal-title">Your Data Matters to Us</h1>
            <p className="legal-subtitle">
              Internova values your privacy and is committed to protecting your
              personal information. This Privacy Policy explains how we collect,
              use, and protect your information when you use our platform.
            </p>

            <div className="legal-section">
              <h4>Information We Collect</h4>
              <p>
                We may collect your name, email address, phone number, payment-related
                details, and program activity data when you register, enroll, or use
                our services.
              </p>
            </div>

            <div className="legal-section">
              <h4>How We Use Your Information</h4>
              <p>
                We use your information to provide platform access, manage enrollments,
                process payments, track learner progress, generate certificates, and
                improve your overall user experience.
              </p>
            </div>

            <div className="legal-section">
              <h4>Payment Information</h4>
              <p>
                Payments on our platform are processed through trusted third-party
                payment partners. We do not store your complete card or banking details
                on our own servers.
              </p>
            </div>

            <div className="legal-section">
              <h4>Data Protection</h4>
              <p>
                We take reasonable technical and administrative measures to protect your
                information from unauthorized access, misuse, alteration, or disclosure.
              </p>
            </div>

            <div className="legal-section">
              <h4>Sharing of Information</h4>
              <p>
                We do not sell your personal information. Limited information may be
                shared only when required for payment processing, legal compliance,
                or essential platform operations.
              </p>
            </div>

            <div className="legal-section">
              <h4>Contact</h4>
              <p>
                For privacy-related concerns, please contact us at support@internova.com.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default PrivacyPolicy;