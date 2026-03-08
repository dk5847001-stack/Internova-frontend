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
    <div
      className="min-vh-100 py-5"
      style={{
        background:
          "linear-gradient(135deg, #f8fafc 0%, #eef2ff 45%, #f8fafc 100%)",
      }}
    >
      <div className="container">
        {toast.show && (
          <div
            style={{
              position: "fixed",
              top: "96px",
              zIndex: 99999,
              right: "24px",
              zIndex: 9999,
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
                className={`fw-bold mb-1 ${toast.type === "success" ? "text-success" : "text-danger"
                  }`}
              >
                {toast.type === "success" ? "Success" : "Error"}
              </div>
              <div className="text-dark small">{toast.message}</div>
            </div>
          </div>
        )}

        <button
          className="btn btn-outline-dark rounded-pill px-4 mb-4"
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>

        {/* HERO */}
        <div
          className="card border-0 shadow-lg rounded-5 overflow-hidden mb-4"
          style={{
            background:
              "linear-gradient(135deg, #0b1736 0%, #142850 45%, #1d4ed8 100%)",
          }}
        >
          <div className="card-body p-4 p-md-5 text-white">
            <div className="row align-items-center g-4">
              <div className="col-lg-8">
                <div className="d-inline-block px-3 py-1 rounded-pill mb-3 fw-semibold small bg-light text-dark">
                  INTERNOVA • DOCUMENT AUTHENTICITY PORTAL
                </div>

                <h1 className="fw-bold mb-3" style={{ fontSize: "2rem" }}>
                  Certificate Verification Center
                </h1>

                <p className="mb-0 text-light" style={{ maxWidth: "700px" }}>
                  Verify the authenticity of an Internova certificate using the
                  certificate ID or by opening the QR-linked verification page.
                </p>
              </div>

              <div className="col-lg-4">
                <div
                  className="rounded-4 p-4 h-100"
                  style={{
                    background: "rgba(255,255,255,0.12)",
                    border: "1px solid rgba(255,255,255,0.16)",
                    backdropFilter: "blur(10px)",
                  }}
                >
                  <div className="fw-semibold mb-2">Why verify?</div>
                  <ul className="mb-0 ps-3 small text-light">
                    <li>Confirms document authenticity</li>
                    <li>Shows candidate and internship details</li>
                    <li>Validates issue date and status</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SEARCH CARD */}
        <div className="card border-0 shadow-sm rounded-5 mb-4">
          <div className="card-body p-4">
            <div className="row g-3 align-items-center">
              <div className="col-lg-9">
                <label className="form-label fw-semibold text-dark">
                  Enter Certificate ID
                </label>
                <input
                  type="text"
                  className="form-control form-control-lg rounded-4 border-0 shadow-sm"
                  placeholder="Example: CERT-1741258432-123456"
                  value={certificateId}
                  onChange={(e) => setCertificateId(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleVerify();
                  }}
                  style={{
                    background: "#f8fafc",
                    minHeight: "58px",
                  }}
                />
              </div>

              <div className="col-lg-3">
                <label className="form-label fw-semibold text-dark d-block">
                  &nbsp;
                </label>
                <button
                  className="btn w-100 btn-dark rounded-4 fw-semibold"
                  onClick={() => handleVerify()}
                  disabled={loading}
                  style={{ minHeight: "58px" }}
                >
                  {loading ? "Checking..." : "Verify Certificate"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* RESULT */}
        {searched && result && (
          <div className="card border-0 shadow-lg rounded-5 overflow-hidden">
            <div
              className="px-4 px-md-5 py-4"
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
                <div>
                  <span
                    className={`badge px-4 py-2 rounded-pill fs-6 ${verified ? "bg-success" : "bg-danger"
                      }`}
                  >
                    {verified ? "VERIFIED" : "INVALID"}
                  </span>
                </div>

                <div
                  className={`fw-bold fs-5 ${verified ? "text-success" : "text-danger"
                    }`}
                >
                  {verified
                    ? "Authentic Internova Certificate"
                    : "Verification Failed"}
                </div>
              </div>
            </div>

            <div className="card-body p-4 p-md-5">
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
                    the Internova system.
                  </div>

                  <div className="row g-4">
                    <div className="col-lg-6">
                      <div
                        className="h-100 rounded-4 p-4 shadow-sm"
                        style={{
                          background: "#f8fafc",
                          border: "1px solid #e2e8f0",
                        }}
                      >
                        <h5 className="fw-bold mb-3 text-dark">
                          Candidate Information
                        </h5>

                        <div className="mb-3">
                          <div className="text-secondary small mb-1">
                            Certificate ID
                          </div>
                          <div className="fw-semibold text-dark">
                            {result.certificate?.certificateId || "N/A"}
                          </div>
                        </div>

                        <div className="mb-3">
                          <div className="text-secondary small mb-1">
                            Candidate Name
                          </div>
                          <div className="fw-semibold text-dark">
                            {result.certificate?.candidateName || "N/A"}
                          </div>
                        </div>

                        <div className="mb-3">
                          <div className="text-secondary small mb-1">
                            Candidate Email
                          </div>
                          <div className="fw-semibold text-dark">
                            {result.certificate?.candidateEmail || "N/A"}
                          </div>
                        </div>

                        <div className="mb-0">
                          <div className="text-secondary small mb-1">Status</div>
                          <span className="badge bg-success-subtle text-success border px-3 py-2 rounded-pill">
                            {result.certificate?.status || "Verified"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="col-lg-6">
                      <div
                        className="h-100 rounded-4 p-4 shadow-sm"
                        style={{
                          background: "#f8fafc",
                          border: "1px solid #e2e8f0",
                        }}
                      >
                        <h5 className="fw-bold mb-3 text-dark">
                          Internship Details
                        </h5>

                        <div className="mb-3">
                          <div className="text-secondary small mb-1">
                            Internship Title
                          </div>
                          <div className="fw-semibold text-dark">
                            {result.certificate?.internshipTitle || "N/A"}
                          </div>
                        </div>

                        <div className="mb-3">
                          <div className="text-secondary small mb-1">Branch</div>
                          <div className="fw-semibold text-dark">
                            {result.certificate?.branch || "N/A"}
                          </div>
                        </div>

                        <div className="mb-3">
                          <div className="text-secondary small mb-1">
                            Category
                          </div>
                          <div className="fw-semibold text-dark">
                            {result.certificate?.category || "N/A"}
                          </div>
                        </div>

                        <div className="mb-0">
                          <div className="text-secondary small mb-1">
                            Issued At
                          </div>
                          <div className="fw-semibold text-dark">
                            {result.certificate?.issuedAt
                              ? new Date(
                                result.certificate.issuedAt
                              ).toLocaleString()
                              : "N/A"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    className="rounded-4 p-4 mt-4"
                    style={{
                      background:
                        "linear-gradient(135deg, #eff6ff 0%, #f8fafc 100%)",
                      border: "1px solid #dbeafe",
                    }}
                  >
                    <div className="row g-3 align-items-center">
                      <div className="col-md-8">
                        <h6 className="fw-bold mb-1 text-dark">
                          Verified by Internova
                        </h6>
                        <p className="mb-0 text-secondary">
                          This certificate record exists in the official
                          Internova database and matches the verification ID.
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
                    className="rounded-4 p-4"
                    style={{
                      background: "#fff7ed",
                      border: "1px solid #fed7aa",
                    }}
                  >
                    <h6 className="fw-bold mb-2" style={{ color: "#9a3412" }}>
                      Please check the following
                    </h6>
                    <ul className="mb-0 ps-3" style={{ color: "#9a3412" }}>
                      <li>Enter the full certificate ID correctly</li>
                      <li>Make sure there are no extra spaces</li>
                      <li>Use the ID printed on the PDF certificate</li>
                    </ul>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default VerifyCertificate;