import React from "react";

function RefundPolicy() {
  return (
    <>
      <style>{`
        .legal-page-wrap {
          min-height: 100vh;
          background:
            radial-gradient(circle at top left, rgba(59,130,246,0.10), transparent 30%),
            radial-gradient(circle at bottom right, rgba(37,99,235,0.10), transparent 30%),
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
            <div className="legal-badge">Refund Policy</div>
            <h1 className="legal-title">Refund and Payment Support Information</h1>
            <p className="legal-subtitle">
              Please read our refund policy carefully before making any payment on Internova.
            </p>

            <div className="legal-section">
              <h4>Digital Access and Enrollment</h4>
              <p>
                Payments made for enrollment, digital program access, and related services
                are generally non-refundable once access has been granted.
              </p>
            </div>

            <div className="legal-section">
              <h4>Duplicate Transactions</h4>
              <p>
                In case of duplicate payment or failed transaction with amount deduction,
                users may contact our support team for verification and assistance.
              </p>
            </div>

            <div className="legal-section">
              <h4>Technical Issues</h4>
              <p>
                If you face a genuine technical issue that prevents access to the purchased
                program, please contact support for resolution. Refunds, if applicable,
                will be reviewed on a case-by-case basis.
              </p>
            </div>

            <div className="legal-section">
              <h4>Processing Time</h4>
              <p>
                Approved refund requests, where applicable, may take 5 to 7 business days
                to reflect in the original payment method.
              </p>
            </div>

            <div className="legal-section">
              <h4>Contact</h4>
              <p>
                For refund-related help, contact internova.support@gmail.com.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default RefundPolicy;