import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";

export default function VerifyOfferLetter() {
  const { offerLetterId } = useParams();

  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setResult(null);
    setError("");

    API.get(
      `/purchases/offer-letters/verify/${encodeURIComponent(
        offerLetterId || ""
      )}`
    )
      .then(({ data }) => setResult(data))
      .catch((e) =>
        setError(
          e?.response?.data?.message ||
            "Unable to verify this offer letter."
        )
      );
  }, [offerLetterId]);

  const copyReferenceId = async () => {
    if (!result?.offerLetter?.referenceId) return;

    try {
      await navigator.clipboard.writeText(
        result.offerLetter.referenceId
      );

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  const formattedDate = result?.offerLetter?.issueDate
    ? new Date(result.offerLetter.issueDate).toLocaleDateString(
        "en-IN",
        {
          day: "2-digit",
          month: "long",
          year: "numeric",
        }
      )
    : "—";

  return (
    <main className="verify-page">
      {/* Background Effects */}
      <div className="ambient ambient-one"></div>
      <div className="ambient ambient-two"></div>
      <div className="grid-overlay"></div>

      <div className="container position-relative">
        {/* Header */}
        <div className="verify-header text-center">
          <div className="brand-mark">
            <span className="brand-icon">I</span>
          </div>

          <div className="eyebrow">
            <span className="pulse-dot"></span>
            SECURE DOCUMENT VERIFICATION
          </div>

          <h1>
            Verify your
            <span> Offer Letter</span>
          </h1>

          <p>
            Authenticate the validity of an InternovaTech internship
            offer letter using its unique document reference.
          </p>
        </div>

        {/* Main Card */}
        <div className="verification-card mx-auto">
          {/* Top Glow */}
          <div className="card-glow"></div>

          {/* Card Header */}
          <div className="verification-card-header">
            <div>
              <div className="mini-label">
                INTERNOVATECH
              </div>

              <h2>Document Authentication</h2>
            </div>

            <div className="secure-badge">
              <span className="secure-icon">✓</span>
              Secure
            </div>
          </div>

          <div className="divider"></div>

          {/* Loading */}
          {!result && !error && (
            <div className="verification-loading">
              <div className="scanner">
                <div className="scanner-line"></div>
              </div>

              <h3>Verifying document</h3>

              <p>
                Checking the document against InternovaTech's
                verification records...
              </p>

              <div className="loading-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="error-state">
              <div className="error-icon">!</div>

              <h3>Verification Failed</h3>

              <p>{error}</p>

              <div className="error-reference">
                <span>DOCUMENT ID</span>
                <strong>{offerLetterId || "Unknown"}</strong>
              </div>

              <button
                className="retry-btn"
                onClick={() => window.location.reload()}
              >
                Try Again
              </button>
            </div>
          )}

          {/* Result */}
          {result && (
            <>
              {/* Status */}
              <div
                className={`verification-status ${
                  result.valid ? "valid" : "revoked"
                }`}
              >
                <div className="status-icon">
                  {result.valid ? "✓" : "!"}
                </div>

                <div className="status-content">
                  <span className="status-label">
                    VERIFICATION RESULT
                  </span>

                  <h3>
                    {result.valid
                      ? "Offer Letter Valid"
                      : "Offer Letter Revoked"}
                  </h3>

                  <p>
                    {result.valid
                      ? "This document has been successfully authenticated and is recognized as an official InternovaTech document."
                      : "This offer letter is no longer valid according to InternovaTech verification records."}
                  </p>
                </div>

                <div className="status-badge">
                  {result.valid ? "AUTHENTIC" : "REVOKED"}
                </div>
              </div>

              {/* Reference */}
              <div className="reference-box">
                <div>
                  <span className="field-label">
                    DOCUMENT REFERENCE ID
                  </span>

                  <div className="reference-id">
                    {result.offerLetter.referenceId}
                  </div>
                </div>

                <button
                  className="copy-btn"
                  onClick={copyReferenceId}
                  title="Copy Reference ID"
                >
                  {copied ? "✓ Copied" : "Copy ID"}
                </button>
              </div>

              {/* Details */}
              <div className="details-section">
                <div className="section-heading">
                  <span className="section-line"></span>

                  <span>DOCUMENT DETAILS</span>
                </div>

                <div className="details-grid">
                  {/* Candidate */}
                  <div className="detail-item">
                    <div className="detail-icon">
                      👤
                    </div>

                    <div>
                      <span>Candidate</span>
                      <strong>
                        {result.offerLetter.candidateName ||
                          "—"}
                      </strong>
                    </div>
                  </div>

                  {/* Domain */}
                  <div className="detail-item">
                    <div className="detail-icon">
                      ◈
                    </div>

                    <div>
                      <span>Internship Domain</span>
                      <strong>
                        {result.offerLetter.internshipDomain ||
                          "—"}
                      </strong>
                    </div>
                  </div>

                  {/* Issue Date */}
                  <div className="detail-item">
                    <div className="detail-icon">
                      ◷
                    </div>

                    <div>
                      <span>Issue Date</span>
                      <strong>{formattedDate}</strong>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="detail-item">
                    <div className="detail-icon">
                      ◉
                    </div>

                    <div>
                      <span>Document Status</span>

                      <strong className="text-capitalize">
                        {result.status || "—"}
                      </strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Authenticity Notice */}
              <div className="authenticity-box">
                <div className="authenticity-icon">
                  ✓
                </div>

                <div>
                  <strong>
                    Official Verification Record
                  </strong>

                  <p>
                    This verification result was generated from
                    InternovaTech's document verification system.
                    Reference IDs are unique to each document.
                  </p>
                </div>
              </div>
            </>
          )}

          {/* Footer */}
          <div className="verification-footer">
            <div>
              <span className="footer-dot"></span>
              SYSTEM OPERATIONAL
            </div>

            <span>
              © {new Date().getFullYear()} InternovaTech
            </span>
          </div>
        </div>

        {/* Bottom Security Text */}
        <div className="security-footer">
          <span>🔒 Encrypted Verification</span>
          <span className="security-separator">•</span>
          <span>Official Document Portal</span>
          <span className="security-separator">•</span>
          <span>InternovaTech</span>
        </div>
      </div>
    </main>
  );
}