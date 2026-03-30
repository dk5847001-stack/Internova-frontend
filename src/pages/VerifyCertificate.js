import React, { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate, useParams } from "react-router-dom";

function VerifyCertificate() {
  const { certificateId: routeCertificateId } = useParams();
  const navigate = useNavigate();

  const [certificateId, setCertificateId] = useState(routeCertificateId || "");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [searched, setSearched] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    type: "success",
    message: "",
  });

  useEffect(() => {
    document.title =
      "Verify Certificate | InternovaTech Official Verification Portal";

    const metaDescription = document.querySelector('meta[name="description"]');
    const previousDescription = metaDescription?.getAttribute("content") || "";

    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        "Verify InternovaTech certificates using the official certificate ID. Confirm candidate details, Internship Programs details, issue date, and certificate authenticity."
      );
    }

    let canonicalTag = document.querySelector('link[rel="canonical"]');
    const canonicalAlreadyExists = !!canonicalTag;

    if (!canonicalTag) {
      canonicalTag = document.createElement("link");
      canonicalTag.setAttribute("rel", "canonical");
      document.head.appendChild(canonicalTag);
    }

    canonicalTag.setAttribute(
      "href",
      routeCertificateId
        ? `https://www.internovatech.in/verify/${routeCertificateId}`
        : "https://www.internovatech.in/verify"
    );

    return () => {
      document.title =
        "InternovaTech - Online Internship Programs, Certificates and Tech Training";

      if (metaDescription) {
        metaDescription.setAttribute("content", previousDescription);
      }

      if (!canonicalAlreadyExists && canonicalTag) {
        canonicalTag.remove();
      }
    };
  }, [routeCertificateId]);

  const showToast = (type, message) => {
    setToast({ show: true, type, message });

    setTimeout(() => {
      setToast({ show: false, type: "success", message: "" });
    }, 3000);
  };

  const handleVerify = async (customId) => {
    const idToCheck = customId || certificateId;

    if (!idToCheck.trim()) {
      showToast("error", "Please enter a certificate ID");
      return;
    }

    try {
      setLoading(true);
      setSearched(true);

      const { data } = await API.get(`/certificates/verify/${idToCheck.trim()}`);
      setResult(data);

      if (data?.verified) {
        showToast("success", "Certificate verified successfully");
      } else {
        showToast(
          "error",
          data?.message || "Invalid certificate. Verification failed."
        );
      }
    } catch (error) {
      console.error("Verification failed:", error);

      const errorMessage =
        error.response?.data?.message || "Certificate verification failed";

      setResult({
        success: false,
        verified: false,
        message: errorMessage,
      });

      showToast("error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (routeCertificateId) {
      handleVerify(routeCertificateId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routeCertificateId]);

  const verified = result?.verified;

  return (
    <>
      <style>{`
        .verify-v61-page {
          min-height: 100vh;
          background:
            radial-gradient(circle at top left, rgba(59,130,246,0.16), transparent 28%),
            radial-gradient(circle at 82% 12%, rgba(99,102,241,0.14), transparent 24%),
            radial-gradient(circle at bottom right, rgba(16,185,129,0.10), transparent 24%),
            linear-gradient(135deg, #f8fbff 0%, #eef4ff 48%, #f8fbff 100%);
          position: relative;
          overflow: hidden;
          padding: 34px 0 72px;
        }

        .verify-v61-page::before {
          content: "";
          position: absolute;
          inset: 0;
          background:
            linear-gradient(rgba(255,255,255,0.22), rgba(255,255,255,0.16)),
            repeating-linear-gradient(
              90deg,
              rgba(255,255,255,0.04) 0px,
              rgba(255,255,255,0.04) 1px,
              transparent 1px,
              transparent 120px
            );
          pointer-events: none;
        }

        .verify-v61-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(14px);
          opacity: 0.54;
          pointer-events: none;
          animation: verifyV61Float 10s ease-in-out infinite;
          -webkit-animation: verifyV61Float 10s ease-in-out infinite;
        }

        .verify-v61-orb-1 {
          width: 240px;
          height: 240px;
          top: 90px;
          left: -70px;
          background: linear-gradient(135deg, rgba(29,78,216,0.22), rgba(14,165,233,0.16));
        }

        .verify-v61-orb-2 {
          width: 310px;
          height: 310px;
          right: -80px;
          top: 140px;
          background: linear-gradient(135deg, rgba(99,102,241,0.18), rgba(59,130,246,0.18));
          animation-delay: 1.5s;
          -webkit-animation-delay: 1.5s;
        }

        .verify-v61-orb-3 {
          width: 210px;
          height: 210px;
          right: 14%;
          bottom: 5%;
          background: linear-gradient(135deg, rgba(16,185,129,0.12), rgba(37,99,235,0.10));
          animation-delay: 2.2s;
          -webkit-animation-delay: 2.2s;
        }

        .verify-v61-shell {
          position: relative;
          z-index: 2;
        }

        .verify-v61-toast {
          position: fixed;
          top: 96px;
          right: 24px;
          z-index: 9999;
          min-width: 280px;
          max-width: 390px;
        }

        .verify-v61-back {
          min-height: 48px;
          padding: 0 18px;
          border-radius: 16px;
          font-weight: 800;
          transition: all 0.3s ease;
          -webkit-transition: all 0.3s ease;
        }

        .verify-v61-back:hover {
          transform: translateY(-2px);
          -webkit-transform: translateY(-2px);
        }

        .verify-v61-hero {
          position: relative;
          overflow: hidden;
          border-radius: 36px;
          padding: 32px;
          background:
            linear-gradient(135deg, rgba(255,255,255,0.82) 0%, rgba(255,255,255,0.70) 100%);
          border: 1px solid rgba(255,255,255,0.76);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          box-shadow:
            0 30px 80px rgba(15,23,42,0.10),
            0 12px 30px rgba(59,130,246,0.06);
          -webkit-box-shadow:
            0 30px 80px rgba(15,23,42,0.10),
            0 12px 30px rgba(59,130,246,0.06);
          margin-bottom: 28px;
        }

        .verify-v61-hero::before {
          content: "";
          position: absolute;
          inset: 0;
          background:
            radial-gradient(circle at 18% 18%, rgba(255,255,255,0.38), transparent 18%),
            radial-gradient(circle at 86% 72%, rgba(255,255,255,0.24), transparent 20%);
          pointer-events: none;
        }

        .verify-v61-badge {
          position: relative;
          z-index: 2;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 18px;
          border-radius: 999px;
          background: rgba(37,99,235,0.10);
          border: 1px solid rgba(37,99,235,0.16);
          color: #1d4ed8;
          font-weight: 800;
          font-size: 0.82rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: 18px;
        }

        .verify-v61-title {
          position: relative;
          z-index: 2;
          font-size: 3rem;
          line-height: 1.05;
          font-weight: 900;
          letter-spacing: -0.05em;
          color: #0f172a;
          margin-bottom: 14px;
        }

        .verify-v61-title-accent {
          background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 42%, #0f172a 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          -webkit-text-fill-color: transparent;
        }

        .verify-v61-text {
          position: relative;
          z-index: 2;
          color: #475569;
          line-height: 1.9;
          font-size: 1.05rem;
          margin-bottom: 0;
          max-width: 820px;
        }

        .verify-v61-glass-card {
          border-radius: 30px;
          background: rgba(255,255,255,0.80);
          border: 1px solid rgba(255,255,255,0.76);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          box-shadow:
            0 24px 60px rgba(15,23,42,0.08),
            0 8px 20px rgba(59,130,246,0.05);
          -webkit-box-shadow:
            0 24px 60px rgba(15,23,42,0.08),
            0 8px 20px rgba(59,130,246,0.05);
          padding: 28px;
          transition: all 0.35s ease;
          -webkit-transition: all 0.35s ease;
        }

        .verify-v61-glass-card:hover {
          transform: translateY(-5px);
          -webkit-transform: translateY(-5px);
        }

        .verify-v61-card-title {
          font-size: 1.24rem;
          font-weight: 900;
          color: #0f172a;
          margin-bottom: 10px;
          letter-spacing: -0.02em;
        }

        .verify-v61-card-text {
          color: #64748b;
          line-height: 1.85;
          margin-bottom: 0;
        }

        .verify-v61-mini-card {
          border-radius: 22px;
          background: rgba(255,255,255,0.10);
          border: 1px solid rgba(255,255,255,0.14);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          padding: 18px;
          height: 100%;
        }

        .verify-v61-mini-title {
          font-size: 1rem;
          font-weight: 900;
          color: #0f172a;
          margin-bottom: 10px;
        }

        .verify-v61-mini-list {
          margin-bottom: 0;
          padding-left: 18px;
          color: #475569;
          line-height: 1.8;
        }

        .verify-v61-input {
          min-height: 58px;
          border-radius: 18px;
          border: 1px solid #dbe3f0;
          background: rgba(248,250,252,0.96);
          transition: all 0.3s ease;
          -webkit-transition: all 0.3s ease;
          box-shadow: none;
          -webkit-box-shadow: none;
        }

        .verify-v61-input:focus {
          border-color: #60a5fa;
          background: #ffffff;
          box-shadow: 0 0 0 4px rgba(37,99,235,0.12);
          -webkit-box-shadow: 0 0 0 4px rgba(37,99,235,0.12);
        }

        .verify-v61-btn {
          min-height: 58px;
          border-radius: 18px;
          font-weight: 900;
          border: none;
          color: #fff;
          background: linear-gradient(135deg, #081226 0%, #102247 45%, #1d4ed8 100%);
          box-shadow:
            0 18px 35px rgba(29,78,216,0.18),
            0 8px 20px rgba(8,18,38,0.14);
          -webkit-box-shadow:
            0 18px 35px rgba(29,78,216,0.18),
            0 8px 20px rgba(8,18,38,0.14);
          transition: all 0.32s ease;
          -webkit-transition: all 0.32s ease;
        }

        .verify-v61-btn:hover {
          transform: translateY(-2px);
          -webkit-transform: translateY(-2px);
          color: #fff;
        }

        .verify-v61-result {
          margin-top: 28px;
          border-radius: 32px;
          overflow: hidden;
          background: rgba(255,255,255,0.82);
          border: 1px solid rgba(255,255,255,0.76);
          box-shadow:
            0 26px 62px rgba(15,23,42,0.08),
            0 10px 24px rgba(59,130,246,0.05);
          -webkit-box-shadow:
            0 26px 62px rgba(15,23,42,0.08),
            0 10px 24px rgba(59,130,246,0.05);
        }

        .verify-v61-result-head {
          padding: 24px 28px;
        }

        .verify-v61-result-body {
          padding: 28px;
        }

        .verify-v61-status-badge {
          padding: 10px 18px;
          border-radius: 999px;
          font-size: 0.92rem;
          font-weight: 900;
          letter-spacing: 0.04em;
        }

        .verify-v61-record-card {
          height: 100%;
          border-radius: 26px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          padding: 22px;
          transition: all 0.3s ease;
          -webkit-transition: all 0.3s ease;
        }

        .verify-v61-record-card:hover {
          transform: translateY(-4px);
          -webkit-transform: translateY(-4px);
          box-shadow: 0 12px 30px rgba(15,23,42,0.06);
          -webkit-box-shadow: 0 12px 30px rgba(15,23,42,0.06);
        }

        .verify-v61-record-title {
          font-size: 1.1rem;
          font-weight: 900;
          color: #0f172a;
          margin-bottom: 14px;
          letter-spacing: -0.02em;
        }

        .verify-v61-info-block {
          margin-bottom: 14px;
        }

        .verify-v61-info-label {
          color: #64748b;
          font-size: 0.8rem;
          margin-bottom: 4px;
          text-transform: uppercase;
          letter-spacing: 0.07em;
          font-weight: 800;
        }

        .verify-v61-info-value {
          color: #0f172a;
          font-weight: 800;
          margin-bottom: 0;
          line-height: 1.7;
          word-break: break-word;
        }

        .verify-v61-note {
          border-radius: 24px;
          padding: 22px;
          margin-top: 22px;
        }

        .verify-v61-note-title {
          font-size: 1rem;
          font-weight: 900;
          margin-bottom: 8px;
        }

        .verify-v61-note-text,
        .verify-v61-note-list {
          line-height: 1.8;
          margin-bottom: 0;
        }

        .verify-v61-note-list {
          padding-left: 18px;
        }

        @keyframes verifyV61Float {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
          }
          50% {
            transform: translateY(-18px) translateX(10px);
          }
        }

        @-webkit-keyframes verifyV61Float {
          0%, 100% {
            -webkit-transform: translateY(0px) translateX(0px);
          }
          50% {
            -webkit-transform: translateY(-18px) translateX(10px);
          }
        }

        @media (max-width: 991px) {
          .verify-v61-title {
            font-size: 2.3rem;
          }

          .verify-v61-hero,
          .verify-v61-glass-card,
          .verify-v61-result-body,
          .verify-v61-result-head {
            padding: 24px;
          }
        }

        @media (max-width: 767px) {
          .verify-v61-title {
            font-size: 1.95rem;
            line-height: 1.12;
          }

          .verify-v61-text,
          .verify-v61-card-text,
          .verify-v61-note-text,
          .verify-v61-note-list {
            line-height: 1.8;
          }

          .verify-v61-hero,
          .verify-v61-glass-card,
          .verify-v61-result-body,
          .verify-v61-result-head,
          .verify-v61-record-card,
          .verify-v61-note {
            padding: 22px;
            border-radius: 22px;
          }
        }
      `}</style>

      <div className="verify-v61-page">
        <div className="verify-v61-orb verify-v61-orb-1"></div>
        <div className="verify-v61-orb verify-v61-orb-2"></div>
        <div className="verify-v61-orb verify-v61-orb-3"></div>

        <div className="container verify-v61-shell">
          {toast.show && (
            <div className="verify-v61-toast">
              <div
                className="shadow-lg rounded-4 px-4 py-3"
                style={{
                  background:
                    toast.type === "success"
                      ? "linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)"
                      : "linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)",
                  border:
                    toast.type === "success"
                      ? "1px solid #86efac"
                      : "1px solid #fca5a5",
                }}
              >
                <div
                  className={`fw-bold mb-1 ${
                    toast.type === "success" ? "text-success" : "text-danger"
                  }`}
                >
                  {toast.type === "success" ? "Success" : "Error"}
                </div>
                <div className="text-dark small">{toast.message}</div>
              </div>
            </div>
          )}

          <button
            className="btn btn-outline-dark verify-v61-back mb-4"
            onClick={() => navigate(-1)}
          >
            ← Back
          </button>

          <section className="verify-v61-hero">
            <div className="row g-4 align-items-center">
              <div className="col-lg-8">
                <div className="verify-v61-badge">
                  InternovaTech Authenticity Portal
                </div>

                <h1 className="verify-v61-title">
                  Verify <span className="verify-v61-title-accent">certificate authenticity</span> with the official InternovaTech validation system
                </h1>

                <p className="verify-v61-text">
                  Confirm certificate authenticity using the official certificate
                  ID or by opening the QR-linked verification page. Review
                  candidate details, Internship Programs information, issue date, and
                  verification status through the InternovaTech portal.
                </p>
              </div>

              <div className="col-lg-4">
                <div
                  className="verify-v61-mini-card"
                  style={{
                    background: "rgba(255,255,255,0.72)",
                    border: "1px solid rgba(148,163,184,0.16)",
                  }}
                >
                  <h3 className="verify-v61-mini-title">Why verify?</h3>
                  <ul className="verify-v61-mini-list">
                    <li>Confirms document authenticity</li>
                    <li>Shows candidate and Internship Programs details</li>
                    <li>Validates issue date and status</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          <section className="verify-v61-glass-card">
            <h2 className="verify-v61-card-title">Enter Certificate ID</h2>
            <p className="verify-v61-card-text mb-4">
              Use the certificate ID printed on the PDF certificate to verify
              authenticity through the official InternovaTech system.
            </p>

            <div className="row g-3 align-items-center">
              <div className="col-lg-9">
                <input
                  type="text"
                  className="form-control verify-v61-input"
                  placeholder="Example: CERT-1741258432-123456"
                  value={certificateId}
                  onChange={(e) => setCertificateId(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleVerify();
                  }}
                />
              </div>

              <div className="col-lg-3">
                <button
                  className="btn w-100 verify-v61-btn"
                  onClick={() => handleVerify()}
                  disabled={loading}
                >
                  {loading ? "Checking..." : "Verify Certificate"}
                </button>
              </div>
            </div>
          </section>

          {searched && result && (
            <section className="verify-v61-result">
              <div
                className="verify-v61-result-head"
                style={{
                  background: verified
                    ? "linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)"
                    : "linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)",
                  borderBottom: verified
                    ? "1px solid #a7f3d0"
                    : "1px solid #fecaca",
                }}
              >
                <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
                  <span
                    className={`verify-v61-status-badge ${
                      verified ? "bg-success text-white" : "bg-danger text-white"
                    }`}
                  >
                    {verified ? "VERIFIED" : "INVALID"}
                  </span>

                  <div
                    className={`fw-bold fs-5 ${
                      verified ? "text-success" : "text-danger"
                    }`}
                  >
                    {verified
                      ? "Authentic InternovaTech Certificate"
                      : "Verification Failed"}
                  </div>
                </div>
              </div>

              <div className="verify-v61-result-body">
                {verified ? (
                  <>
                    <div
                      className="alert border-0 rounded-4 mb-4"
                      style={{
                        background: "#ecfdf5",
                        color: "#065f46",
                      }}
                    >
                      Certificate is valid and has been successfully verified in
                      the official InternovaTech system.
                    </div>

                    <div className="row g-4">
                      <div className="col-lg-6">
                        <div className="verify-v61-record-card">
                          <h3 className="verify-v61-record-title">
                            Candidate Information
                          </h3>

                          <div className="verify-v61-info-block">
                            <div className="verify-v61-info-label">
                              Certificate ID
                            </div>
                            <p className="verify-v61-info-value">
                              {result.certificate?.certificateId || "N/A"}
                            </p>
                          </div>

                          <div className="verify-v61-info-block">
                            <div className="verify-v61-info-label">
                              Candidate Name
                            </div>
                            <p className="verify-v61-info-value">
                              {result.certificate?.candidateName || "N/A"}
                            </p>
                          </div>

                          <div className="verify-v61-info-block">
                            <div className="verify-v61-info-label">
                              Candidate Email (masked)
                            </div>
                            <p className="verify-v61-info-value">
                              {result.certificate?.candidateEmail || "N/A"}
                            </p>
                          </div>

                          <div className="verify-v61-info-block mb-0">
                            <div className="verify-v61-info-label">Status</div>
                            <p className="verify-v61-info-value">
                              {result.certificate?.status || "Verified"}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="col-lg-6">
                        <div className="verify-v61-record-card">
                          <h3 className="verify-v61-record-title">
                            Internship Programs Details
                          </h3>

                          <div className="verify-v61-info-block">
                            <div className="verify-v61-info-label">
                              Internship Programs Title
                            </div>
                            <p className="verify-v61-info-value">
                              {result.certificate?.internshipTitle || "N/A"}
                            </p>
                          </div>

                          <div className="verify-v61-info-block">
                            <div className="verify-v61-info-label">Branch</div>
                            <p className="verify-v61-info-value">
                              {result.certificate?.branch || "N/A"}
                            </p>
                          </div>

                          <div className="verify-v61-info-block">
                            <div className="verify-v61-info-label">Category</div>
                            <p className="verify-v61-info-value">
                              {result.certificate?.category || "N/A"}
                            </p>
                          </div>

                          <div className="verify-v61-info-block mb-0">
                            <div className="verify-v61-info-label">
                              Issued At
                            </div>
                            <p className="verify-v61-info-value">
                              {result.certificate?.issuedAt
                                ? new Date(
                                    result.certificate.issuedAt
                                  ).toLocaleString()
                                : "N/A"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div
                      className="verify-v61-note"
                      style={{
                        background:
                          "linear-gradient(135deg, #eff6ff 0%, #f8fafc 100%)",
                        border: "1px solid #dbeafe",
                      }}
                    >
                      <div className="row g-3 align-items-center">
                        <div className="col-md-8">
                          <h4
                            className="verify-v61-note-title"
                            style={{ color: "#0f172a" }}
                          >
                            Verified by InternovaTech
                          </h4>
                          <p
                            className="verify-v61-note-text"
                            style={{ color: "#64748b" }}
                          >
                            This certificate record exists in the official
                            InternovaTech database and matches the verification ID.
                          </p>
                        </div>

                        <div className="col-md-4 text-md-end">
                          <button
                            className="btn btn-outline-dark rounded-pill px-4"
                            onClick={() =>
                              navigate(
                                `/verify/${result.certificate?.certificateId || ""}`
                              )
                            }
                          >
                            Refresh Check
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div
                      className="alert border-0 rounded-4 mb-4"
                      style={{
                        background: "#fef2f2",
                        color: "#991b1b",
                      }}
                    >
                      {result.message ||
                        "Invalid certificate. Verification failed."}
                    </div>

                    <div
                      className="verify-v61-note"
                      style={{
                        background: "#fff7ed",
                        border: "1px solid #fed7aa",
                      }}
                    >
                      <h4
                        className="verify-v61-note-title"
                        style={{ color: "#9a3412" }}
                      >
                        Please check the following
                      </h4>
                      <ul
                        className="verify-v61-note-list"
                        style={{ color: "#9a3412" }}
                      >
                        <li>Enter the full certificate ID correctly</li>
                        <li>Make sure there are no extra spaces</li>
                        <li>Use the ID printed on the PDF certificate</li>
                      </ul>
                    </div>
                  </>
                )}
              </div>
            </section>
          )}
        </div>
      </div>
    </>
  );
}

export default VerifyCertificate;
