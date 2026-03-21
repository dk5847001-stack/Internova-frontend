import React, { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate, useParams } from "react-router-dom";

function CertificatePage() {
  const { internshipId } = useParams();
  const navigate = useNavigate();

  const [eligibility, setEligibility] = useState(null);
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const [toast, setToast] = useState({
    show: false,
    type: "success",
    message: "",
  });

  const showToast = (type, message) => {
    setToast({ show: true, type, message });

    setTimeout(() => {
      setToast({ show: false, type: "success", message: "" });
    }, 3000);
  };

  const fetchEligibility = async () => {
    try {
      setLoading(true);

      const { data } = await API.get(
        `/certificates/eligibility/${internshipId}`
      );

      if (data?.success) {
        setEligibility(data.progress || null);
        setCertificate(data.certificate || null);
      } else {
        setEligibility(null);
        setCertificate(null);
      }
    } catch (error) {
      console.error("Certificate eligibility fetch failed:", error);

      if (error?.response?.status === 403) {
        showToast(
          "error",
          error?.response?.data?.message ||
            "You are not eligible for certificate yet"
        );
      } else {
        showToast(
          "error",
          error?.response?.data?.message ||
            "Failed to load certificate status"
        );
      }

      setEligibility(null);
      setCertificate(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEligibility();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [internshipId]);

  const downloadCertificateFile = async (certificateId) => {
    try {
      if (!certificateId) {
        showToast("error", "Certificate is not available for download yet");
        return;
      }

      setDownloading(true);

      const response = await API.get(
        `/certificates/${certificateId}/download`,
        {
          responseType: "blob",
        }
      );

      const contentDisposition = response.headers["content-disposition"] || "";
      let fileName = "certificate.pdf";

      const fileNameMatch = contentDisposition.match(/filename="([^"]+)"/i);
      if (fileNameMatch?.[1]) {
        fileName = fileNameMatch[1];
      }

      const blob = new Blob([response.data], {
        type: "application/pdf",
      });

      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(blobUrl);

      showToast("success", "Certificate downloaded successfully");
    } catch (error) {
      console.error("Certificate download error:", error);
      showToast(
        "error",
        error?.response?.data?.message || "Failed to download certificate"
      );
    } finally {
      setDownloading(false);
    }
  };

  const handleGenerateCertificate = async () => {
    try {
      setGenerating(true);

      const { data } = await API.post(
        `/certificates/generate/${internshipId}`,
        {}
      );

      if (data?.success) {
        const generatedCertificate = data.certificate || null;
        setCertificate(generatedCertificate);
        showToast(
          "success",
          data.message || "Certificate generated successfully"
        );

        await fetchEligibility();

        if (generatedCertificate?.certificateId) {
          await downloadCertificateFile(generatedCertificate.certificateId);
        }
      } else {
        showToast("error", "Certificate generation failed");
      }
    } catch (error) {
      console.error("Certificate generation error:", error);
      showToast(
        "error",
        error?.response?.data?.message || "Failed to generate certificate"
      );
    } finally {
      setGenerating(false);
    }
  };

  const handleDownloadCertificate = async () => {
    if (!certificate?.certificateId) {
      showToast("error", "Certificate is not available for download yet");
      return;
    }

    await downloadCertificateFile(certificate.certificateId);
  };

  const isEligible = !!eligibility?.certificateEligible;
  const overallProgress = eligibility?.overallProgress || 0;
  const miniTestPassed = !!eligibility?.miniTestPassed;
  const durationCompleted = !!eligibility?.durationCompleted;

  if (loading) {
    return (
      <div
        className="min-vh-100 d-flex align-items-center justify-content-center"
        style={{
          background:
            "linear-gradient(135deg, #f8fafc 0%, #eef2ff 45%, #f8fafc 100%)",
        }}
      >
        <div className="text-center">
          <div className="spinner-border text-dark mb-3" role="status"></div>
          <div className="fw-semibold text-dark">
            Loading certificate status...
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        .certificate-page {
          min-height: 100vh;
          background:
            radial-gradient(circle at top left, rgba(59,130,246,0.18), transparent 28%),
            radial-gradient(circle at bottom right, rgba(99,102,241,0.16), transparent 32%),
            linear-gradient(135deg, #f8fafc 0%, #eef2ff 48%, #f8fafc 100%);
          position: relative;
          overflow: hidden;
        }

        .certificate-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(10px);
          opacity: 0.55;
          animation: certificateFloat 9s ease-in-out infinite;
          -webkit-animation: certificateFloat 9s ease-in-out infinite;
          pointer-events: none;
        }

        .certificate-orb-1 {
          width: 220px;
          height: 220px;
          top: 70px;
          left: -60px;
          background: linear-gradient(135deg, rgba(37,99,235,0.25), rgba(14,165,233,0.18));
        }

        .certificate-orb-2 {
          width: 280px;
          height: 280px;
          right: -80px;
          bottom: 70px;
          background: linear-gradient(135deg, rgba(99,102,241,0.18), rgba(59,130,246,0.22));
          animation-delay: 1.2s;
          -webkit-animation-delay: 1.2s;
        }

        .certificate-shell {
          position: relative;
          z-index: 2;
        }

        .certificate-back-btn {
          border-radius: 999px;
          padding: 10px 18px;
          font-weight: 700;
          transition: all 0.3s ease;
          -webkit-transition: all 0.3s ease;
        }

        .certificate-back-btn:hover {
          transform: translateY(-2px);
          -webkit-transform: translateY(-2px);
        }

        .certificate-hero {
          border: 1px solid rgba(255,255,255,0.42);
          background:
            linear-gradient(135deg, #081226 0%, #0b1736 35%, #142850 70%, #1d4ed8 100%);
          color: #fff;
          position: relative;
          overflow: hidden;
          box-shadow:
            0 24px 70px rgba(15, 23, 42, 0.16),
            0 8px 24px rgba(59,130,246,0.08);
          -webkit-box-shadow:
            0 24px 70px rgba(15, 23, 42, 0.16),
            0 8px 24px rgba(59,130,246,0.08);
        }

        .certificate-hero::before {
          content: "";
          position: absolute;
          inset: 0;
          background:
            radial-gradient(circle at 18% 22%, rgba(255,255,255,0.12), transparent 22%),
            radial-gradient(circle at 82% 74%, rgba(255,255,255,0.08), transparent 18%);
          pointer-events: none;
        }

        .certificate-chip {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          border-radius: 999px;
          background: rgba(255,255,255,0.12);
          border: 1px solid rgba(255,255,255,0.18);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          font-size: 0.8rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 18px;
        }

        .certificate-hero-title {
          font-size: 2.15rem;
          font-weight: 800;
          letter-spacing: -0.03em;
          margin-bottom: 10px;
        }

        .certificate-hero-text {
          color: rgba(255,255,255,0.82);
          line-height: 1.8;
          margin-bottom: 0;
          max-width: 720px;
        }

        .certificate-main-card {
          border: 1px solid rgba(255,255,255,0.42);
          background: rgba(255,255,255,0.74);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          box-shadow:
            0 24px 70px rgba(15, 23, 42, 0.14),
            0 8px 24px rgba(59,130,246,0.08);
          -webkit-box-shadow:
            0 24px 70px rgba(15, 23, 42, 0.14),
            0 8px 24px rgba(59,130,246,0.08);
        }

        .certificate-status-card {
          border-radius: 26px;
          padding: 22px;
          margin-bottom: 24px;
          animation: fadeSlideUp 0.45s ease;
          -webkit-animation: fadeSlideUp 0.45s ease;
        }

        .certificate-status-success {
          background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
          border: 1px solid #86efac;
          color: #065f46;
        }

        .certificate-status-warning {
          background: linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%);
          border: 1px solid #fdba74;
          color: #9a3412;
        }

        .certificate-check-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 16px;
          margin-bottom: 28px;
        }

        .certificate-check-item-card {
          border-radius: 22px;
          padding: 20px;
          background: rgba(255,255,255,0.86);
          border: 1px solid #e2e8f0;
          box-shadow: 0 10px 24px rgba(15, 23, 42, 0.05);
          -webkit-box-shadow: 0 10px 24px rgba(15, 23, 42, 0.05);
          transition: all 0.3s ease;
          -webkit-transition: all 0.3s ease;
        }

        .certificate-check-item-card:hover {
          transform: translateY(-3px);
          -webkit-transform: translateY(-3px);
        }

        .certificate-check-icon {
          font-size: 1.6rem;
          margin-bottom: 10px;
        }

        .certificate-check-title {
          font-size: 1rem;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 6px;
        }

        .certificate-check-desc {
          color: #64748b;
          margin-bottom: 0;
          line-height: 1.7;
        }

        .certificate-actions {
          display: flex;
          gap: 14px;
          flex-wrap: wrap;
        }

        .certificate-action-btn {
          min-height: 56px;
          border-radius: 18px;
          font-weight: 800;
          padding: 0 24px;
          border: none;
          transition: all 0.32s ease;
          -webkit-transition: all 0.32s ease;
        }

        .certificate-action-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          -webkit-transform: translateY(-2px);
        }

        .certificate-primary-btn {
          color: #fff;
          background: linear-gradient(135deg, #0b1736 0%, #142850 40%, #1d4ed8 100%);
          box-shadow:
            0 18px 35px rgba(29, 78, 216, 0.20),
            0 8px 20px rgba(11, 23, 54, 0.16);
          -webkit-box-shadow:
            0 18px 35px rgba(29, 78, 216, 0.20),
            0 8px 20px rgba(11, 23, 54, 0.16);
        }

        .certificate-secondary-btn {
          background: #fff;
          color: #0f172a;
          border: 1px solid #dbe3f0;
          box-shadow: 0 10px 22px rgba(15, 23, 42, 0.05);
          -webkit-box-shadow: 0 10px 22px rgba(15, 23, 42, 0.05);
        }

        .certificate-meta-card {
          margin-top: 24px;
          border-radius: 22px;
          padding: 20px;
          background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
          border: 1px solid #93c5fd;
          color: #1e3a8a;
        }

        @keyframes certificateFloat {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
          }
          50% {
            transform: translateY(-18px) translateX(10px);
          }
        }

        @-webkit-keyframes certificateFloat {
          0%, 100% {
            -webkit-transform: translateY(0px) translateX(0px);
          }
          50% {
            -webkit-transform: translateY(-18px) translateX(10px);
          }
        }

        @keyframes fadeSlideUp {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @-webkit-keyframes fadeSlideUp {
          from {
            opacity: 0;
            -webkit-transform: translateY(12px);
          }
          to {
            opacity: 1;
            -webkit-transform: translateY(0);
          }
        }

        @media (max-width: 991px) {
          .certificate-hero-title {
            font-size: 1.9rem;
          }

          .certificate-check-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 767px) {
          .certificate-page {
            padding: 22px 0;
          }

          .certificate-hero-title {
            font-size: 1.7rem;
          }
        }
      `}</style>

      <div className="certificate-page py-4 py-lg-5">
        <div className="certificate-orb certificate-orb-1"></div>
        <div className="certificate-orb certificate-orb-2"></div>

        <div className="container certificate-shell">
          {toast.show && (
            <div
              style={{
                position: "fixed",
                top: "96px",
                right: "24px",
                zIndex: 99999,
                minWidth: "280px",
                maxWidth: "380px",
              }}
            >
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
            className="btn btn-outline-dark certificate-back-btn mb-4"
            onClick={() => navigate(-1)}
          >
            ← Back
          </button>

          <div className="card certificate-hero border-0 rounded-5 mb-4">
            <div className="card-body p-4 p-md-5">
              <div className="certificate-chip">Internova Certificate Center</div>
              <h1 className="certificate-hero-title">Certificate Dashboard</h1>
              <p className="certificate-hero-text">
                Review your eligibility status and generate or download your
                Internship Programs completion certificate once all conditions are met.
              </p>
            </div>
          </div>

          <div className="card certificate-main-card border-0 rounded-5">
            <div className="card-body p-4 p-md-5">
              <div
                className={`certificate-status-card ${
                  isEligible
                    ? "certificate-status-success"
                    : "certificate-status-warning"
                }`}
              >
                <h4 className="fw-bold mb-2">
                  {isEligible
                    ? "You are eligible for certificate generation"
                    : "Certificate is currently locked"}
                </h4>
                <p className="mb-0">
                  {isEligible
                    ? "All required conditions are completed. You can generate or download your certificate now."
                    : "Complete all required checks below to unlock certificate generation."}
                </p>
              </div>

              <div className="certificate-check-grid">
                <div className="certificate-check-item-card">
                  <div className="certificate-check-icon">
                    {overallProgress >= 80 ? "✅" : "⏳"}
                  </div>
                  <div className="certificate-check-title">Course Progress</div>
                  <p className="certificate-check-desc">
                    Current progress: <strong>{overallProgress}%</strong>
                  </p>
                </div>

                <div className="certificate-check-item-card">
                  <div className="certificate-check-icon">
                    {miniTestPassed ? "✅" : "⏳"}
                  </div>
                  <div className="certificate-check-title">Mini Test</div>
                  <p className="certificate-check-desc">
                    {miniTestPassed
                      ? "Mini test completed successfully."
                      : "Mini test must be passed first."}
                  </p>
                </div>

                <div className="certificate-check-item-card">
                  <div className="certificate-check-icon">
                    {durationCompleted ? "✅" : "⏳"}
                  </div>
                  <div className="certificate-check-title">Duration Rule</div>
                  <p className="certificate-check-desc">
                    {durationCompleted
                      ? "Selected duration requirement completed."
                      : "Selected duration is not completed yet."}
                  </p>
                </div>
              </div>

              <div className="certificate-actions">
                {certificate?.certificateId ? (
                  <button
                    type="button"
                    className="certificate-action-btn certificate-primary-btn"
                    onClick={handleDownloadCertificate}
                    disabled={downloading}
                  >
                    {downloading ? "Downloading..." : "Download Certificate"}
                  </button>
                ) : (
                  <button
                    type="button"
                    className="certificate-action-btn certificate-primary-btn"
                    onClick={handleGenerateCertificate}
                    disabled={!isEligible || generating || downloading}
                  >
                    {generating
                      ? "Generating..."
                      : isEligible
                      ? "Generate Certificate"
                      : "Certificate Locked"}
                  </button>
                )}

                <button
                  type="button"
                  className="certificate-action-btn certificate-secondary-btn"
                  onClick={() => navigate(`/course/${internshipId}`)}
                >
                  Back to Course
                </button>
              </div>

              {certificate?.certificateId && (
                <div className="certificate-meta-card">
                  <h5 className="fw-bold mb-2">Certificate Available</h5>
                  <p className="mb-1">
                    <strong>Certificate ID:</strong> {certificate.certificateId}
                  </p>
                  <p className="mb-0">
                    Your certificate has already been generated and can be
                    downloaded anytime.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CertificatePage;