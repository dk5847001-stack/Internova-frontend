import React from "react";

function TermsAndConditions() {
  return (
    <>
      <style>{`
        .legal-page-wrap {
          min-height: 100vh;
          background:
            radial-gradient(circle at top right, rgba(37,99,235,0.10), transparent 30%),
            radial-gradient(circle at bottom left, rgba(59,130,246,0.10), transparent 30%),
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
            <div className="legal-badge">Terms & Conditions</div>
            <h1 className="legal-title">Rules for Using Internova</h1>
            <p className="legal-subtitle">
              By accessing and using Internova, you agree to comply with these
              Terms and Conditions.
            </p>

            <div className="legal-section">
              <h4>Platform Use</h4>
              <p>
                Internova provides access to digital learning programs, assessments,
                progress tracking, and certificate-related services. Users must provide
                accurate information during registration and enrollment.
              </p>
            </div>

            <div className="legal-section">
              <h4>User Responsibility</h4>
              <p>
                You are responsible for maintaining the confidentiality of your account
                credentials and for all activities carried out under your account.
              </p>
            </div>

            <div className="legal-section">
              <h4>Payments</h4>
              <p>
                Payments made on Internova are for enrollment, program access, and
                related digital services as described on the platform.
              </p>
            </div>

            <div className="legal-section">
              <h4>Certificates</h4>
              <p>
                Certificates, where applicable, are issued based on eligibility criteria,
                completion requirements, or assessment conditions defined for the program.
              </p>
            </div>

            <div className="legal-section">
              <h4>Prohibited Use</h4>
              <p>
                Users may not misuse the platform, copy protected content without
                permission, attempt unauthorized access, or engage in fraudulent activity.
              </p>
            </div>

            <div className="legal-section">
              <h4>Modification of Services</h4>
              <p>
                Internova may update, modify, or discontinue platform features or program
                structures at any time in order to improve service quality.
              </p>
            </div>

            <div className="legal-section">
              <h4>Contact</h4>
              <p>
                For questions regarding these terms, please contact support@internova.com.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default TermsAndConditions;