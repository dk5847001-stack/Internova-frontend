import React, { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate, useParams } from "react-router-dom";

function CertificatePage() {
  const { internshipId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [eligibility, setEligibility] = useState(null);
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const fetchEligibility = async () => {
    try {
      const { data } = await API.get(
        `/certificates/eligibility/${internshipId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setEligibility(data);
    } catch (error) {
      console.error("Eligibility error:", error);
      alert(error.response?.data?.message || "Failed to check eligibility");
      navigate("/my-purchases");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEligibility();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [internshipId]);

  const handleGenerate = async () => {
    try {
      setGenerating(true);

      const { data } = await API.post(
        `/certificates/generate/${internshipId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCertificate(data.certificate);
      alert("Certificate generated successfully!");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to generate certificate");
    } finally {
      setGenerating(false);
    }
  };

  const handleDownload = async () => {
  try {
    const response = await fetch(
      `http://localhost:5000/api/certificates/${certificate.certificateId}/download`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to download certificate");
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    const safeName = (certificate?.candidateName || "candidate")
      .replace(/[^a-z0-9]/gi, "_")
      .replace(/_+/g, "_")
      .replace(/^_|_$/g, "");

    const safeCertificateId = (certificate?.certificateId || "certificate")
      .replace(/[^a-z0-9-]/gi, "_");

    const a = document.createElement("a");
    a.href = url;
    a.download = `${safeName}_${safeCertificateId}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();

    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error(error);
    alert("Certificate download failed");
  }
};

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
          <div className="fw-semibold text-dark">Checking eligibility...</div>
        </div>
      </div>
    );
  }

  const progressPercent = eligibility?.progress?.progressPercent ?? 0;
  const testPassed = eligibility?.progress?.testPassed;
  const finalEligible = eligibility?.progress?.finalEligible;

  return (
    <div
      className="min-vh-100 py-5"
      style={{
        background:
          "linear-gradient(135deg, #f8fafc 0%, #eef2ff 45%, #f8fafc 100%)",
      }}
    >
      <div className="container">
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
            <div className="row g-4 align-items-center">
              <div className="col-lg-8">
                <div className="d-inline-block px-3 py-1 rounded-pill mb-3 fw-semibold small bg-light text-dark">
                  INTERNOVA • FINAL CERTIFICATE PORTAL
                </div>

                <h1 className="fw-bold mb-3" style={{ fontSize: "2rem" }}>
                  Certificate Generation Dashboard
                </h1>

                <p className="mb-0 text-light" style={{ maxWidth: "720px" }}>
                  Check your eligibility, generate your final certificate, and
                  download the official Internova document with verification
                  support.
                </p>
              </div>

              <div className="col-lg-4">
                <div
                  className="rounded-4 p-4"
                  style={{
                    background: "rgba(255,255,255,0.12)",
                    border: "1px solid rgba(255,255,255,0.16)",
                    backdropFilter: "blur(10px)",
                  }}
                >
                  <div className="small text-light mb-2">Eligibility Rule</div>
                  <div className="fw-bold fs-5">80% Progress + Mini Test</div>
                  <div className="small text-light mt-2">
                    Complete the required progress and pass the mini test to
                    unlock certificate generation.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* MAIN CARD */}
        <div className="card border-0 shadow-lg rounded-5 overflow-hidden">
          <div className="card-body p-4 p-md-5">
            {eligibility?.eligible ? (
              <>
                <div
                  className="rounded-4 p-4 mb-4"
                  style={{
                    background:
                      "linear-gradient(135deg, #ecfdf5 0%, #f0fdf4 100%)",
                    border: "1px solid #bbf7d0",
                  }}
                >
                  <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
                    <div>
                      <span className="badge bg-success px-4 py-2 rounded-pill fs-6">
                        ELIGIBLE
                      </span>
                    </div>
                    <div className="fw-bold text-success fs-5">
                      You can generate your certificate now
                    </div>
                  </div>
                </div>

                {eligibility?.progress && (
                  <div className="row g-4 mb-4">
                    <div className="col-md-4">
                      <div
                        className="rounded-4 p-4 h-100 shadow-sm"
                        style={{
                          background: "#f8fafc",
                          border: "1px solid #e2e8f0",
                        }}
                      >
                        <div className="text-secondary small mb-1">Progress</div>
                        <div className="fw-bold fs-2 text-dark">
                          {progressPercent}%
                        </div>
                        <div className="progress mt-3" style={{ height: "10px" }}>
                          <div
                            className="progress-bar bg-success"
                            role="progressbar"
                            style={{ width: `${progressPercent}%` }}
                            aria-valuenow={progressPercent}
                            aria-valuemin="0"
                            aria-valuemax="100"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div
                        className="rounded-4 p-4 h-100 shadow-sm"
                        style={{
                          background: "#f8fafc",
                          border: "1px solid #e2e8f0",
                        }}
                      >
                        <div className="text-secondary small mb-1">
                          Mini Test Status
                        </div>
                        <div
                          className={`fw-bold fs-3 ${
                            testPassed ? "text-success" : "text-danger"
                          }`}
                        >
                          {testPassed ? "Passed" : "Not Passed"}
                        </div>
                        <div className="small text-secondary mt-2">
                          Required for final certificate generation.
                        </div>
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div
                        className="rounded-4 p-4 h-100 shadow-sm"
                        style={{
                          background: "#f8fafc",
                          border: "1px solid #e2e8f0",
                        }}
                      >
                        <div className="text-secondary small mb-1">
                          Final Eligibility
                        </div>
                        <div
                          className={`fw-bold fs-3 ${
                            finalEligible ? "text-success" : "text-warning"
                          }`}
                        >
                          {finalEligible ? "Approved" : "Pending"}
                        </div>
                        <div className="small text-secondary mt-2">
                          Your current certificate access status.
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {!certificate ? (
                  <div
                    className="rounded-4 p-4"
                    style={{
                      background:
                        "linear-gradient(135deg, #eff6ff 0%, #f8fafc 100%)",
                      border: "1px solid #dbeafe",
                    }}
                  >
                    <div className="row g-3 align-items-center">
                      <div className="col-lg-8">
                        <h5 className="fw-bold mb-2 text-dark">
                          Generate Final Certificate
                        </h5>
                        <p className="mb-0 text-secondary">
                          Your certificate is ready to be created in the
                          Internova system. Once generated, you can download and
                          verify it anytime.
                        </p>
                      </div>

                      <div className="col-lg-4 text-lg-end">
                        <button
                          className="btn btn-dark btn-lg rounded-4 px-4 fw-semibold"
                          onClick={handleGenerate}
                          disabled={generating}
                        >
                          {generating
                            ? "Generating..."
                            : "Generate Certificate"}
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    className="rounded-4 p-4"
                    style={{
                      background:
                        "linear-gradient(135deg, #ecfeff 0%, #f8fafc 100%)",
                      border: "1px solid #bae6fd",
                    }}
                  >
                    <div className="row g-4 align-items-center">
                      <div className="col-lg-7">
                        <h5 className="fw-bold mb-3 text-dark">
                          Certificate Generated Successfully
                        </h5>

                        <div className="mb-2">
                          <div className="text-secondary small mb-1">
                            Certificate ID
                          </div>
                          <div className="fw-semibold text-dark">
                            {certificate.certificateId}
                          </div>
                        </div>

                        <div>
                          <div className="text-secondary small mb-1">
                            Issued At
                          </div>
                          <div className="fw-semibold text-dark">
                            {certificate.issuedAt
                              ? new Date(certificate.issuedAt).toLocaleString()
                              : "N/A"}
                          </div>
                        </div>
                      </div>

                      <div className="col-lg-5">
                        <div className="d-grid gap-3">
                          <button
                            className="btn btn-success btn-lg rounded-4 fw-semibold"
                            onClick={handleDownload}
                          >
                            Download Certificate
                          </button>

                          <button
                            className="btn btn-outline-dark btn-lg rounded-4 fw-semibold"
                            onClick={() =>
                              navigate(`/verify/${certificate.certificateId}`)
                            }
                          >
                            Verify Certificate
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div
                className="rounded-4 p-4"
                style={{
                  background:
                    "linear-gradient(135deg, #fff7ed 0%, #fffbeb 100%)",
                  border: "1px solid #fed7aa",
                }}
              >
                <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-3">
                  <span className="badge bg-warning text-dark px-4 py-2 rounded-pill fs-6">
                    NOT ELIGIBLE YET
                  </span>
                  <div className="fw-bold fs-5 text-dark">
                    Complete the remaining requirements
                  </div>
                </div>

                <p className="mb-3 text-secondary">
                  You are not eligible for certificate generation yet. Complete
                  at least 80% progress and pass the mini test to unlock the
                  certificate.
                </p>

                {eligibility?.progress && (
                  <div className="row g-4">
                    <div className="col-md-4">
                      <div
                        className="rounded-4 p-4 h-100 shadow-sm"
                        style={{
                          background: "#fff",
                          border: "1px solid #fde68a",
                        }}
                      >
                        <div className="text-secondary small mb-1">Progress</div>
                        <div className="fw-bold fs-2 text-dark">
                          {progressPercent}%
                        </div>
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div
                        className="rounded-4 p-4 h-100 shadow-sm"
                        style={{
                          background: "#fff",
                          border: "1px solid #fde68a",
                        }}
                      >
                        <div className="text-secondary small mb-1">
                          Mini Test
                        </div>
                        <div
                          className={`fw-bold fs-3 ${
                            testPassed ? "text-success" : "text-danger"
                          }`}
                        >
                          {testPassed ? "Passed" : "Pending"}
                        </div>
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div
                        className="rounded-4 p-4 h-100 shadow-sm"
                        style={{
                          background: "#fff",
                          border: "1px solid #fde68a",
                        }}
                      >
                        <div className="text-secondary small mb-1">
                          Final Status
                        </div>
                        <div className="fw-bold fs-3 text-warning">
                          Incomplete
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CertificatePage;