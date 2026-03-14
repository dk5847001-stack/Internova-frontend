import React, { useEffect, useMemo, useState } from "react";
import API from "../services/api";
import { useParams, useNavigate } from "react-router-dom";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api";

function InternshipDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [internship, setInternship] = useState(null);
  const [selectedDuration, setSelectedDuration] = useState("");
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  const [certificateEligible, setCertificateEligible] = useState(false);
  const [certificateExists, setCertificateExists] = useState(false);
  const [checkingCertificate, setCheckingCertificate] = useState(true);
  const [eligibilityMessage, setEligibilityMessage] = useState("");

  const [toast, setToast] = useState({
    show: false,
    type: "success",
    message: "",
  });

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const showToast = (type, message) => {
    setToast({ show: true, type, message });

    setTimeout(() => {
      setToast({ show: false, type: "success", message: "" });
    }, 3000);
  };

  const normalizedDurations = useMemo(() => {
    if (!internship) return [];

    if (Array.isArray(internship.durations) && internship.durations.length > 0) {
      return internship.durations;
    }

    return [
      {
        label:
          internship.duration ||
          `${internship.durationDays || 30} Days`,
        price: internship.price || 0,
      },
    ];
  }, [internship]);

  const selectedPlan = useMemo(() => {
    if (!normalizedDurations.length) return null;

    return (
      normalizedDurations.find((item) => item.label === selectedDuration) ||
      normalizedDurations[0]
    );
  }, [normalizedDurations, selectedDuration]);

  const fetchInternship = async () => {
    try {
      setPageLoading(true);

      const { data } = await API.get(`/internships/${id}`);
      const internshipData = data?.internship || null;

      setInternship(internshipData);

      if (
        internshipData?.durations?.length > 0 &&
        !selectedDuration
      ) {
        setSelectedDuration(internshipData.durations[0].label);
      } else if (!selectedDuration) {
        setSelectedDuration(
          internshipData?.duration ||
            `${internshipData?.durationDays || 30} Days`
        );
      }
    } catch (error) {
      console.error("Failed to fetch internship details:", error);
      showToast("error", "Failed to load internship details");
    } finally {
      setPageLoading(false);
    }
  };

  const checkCertificateEligibility = async () => {
    try {
      setCheckingCertificate(true);
      setEligibilityMessage("");

      if (!token) {
        setCertificateEligible(false);
        setCertificateExists(false);
        setEligibilityMessage("Login required to check certificate eligibility.");
        return;
      }

      const { data } = await API.get(`/certificates/eligibility/${id}`);

      if (data?.success) {
        setCertificateEligible(!!data.eligible);
        setCertificateExists(!!data.certificate || !!data.certificateExists);
        setEligibilityMessage(
          data.eligible
            ? "You are eligible to claim your certificate."
            : "Complete the required course progress and mini test to become certificate-eligible."
        );
      } else {
        setCertificateEligible(false);
        setCertificateExists(false);
        setEligibilityMessage("Unable to check certificate eligibility right now.");
      }
    } catch (error) {
      const status = error?.response?.status;
      const message =
        error?.response?.data?.message ||
        "Unable to check certificate eligibility";

      if (status === 403) {
        setCertificateEligible(false);
        setCertificateExists(false);
        setEligibilityMessage(
          "Purchase required to unlock certificate eligibility."
        );
      } else {
        console.error("Eligibility check failed:", error);
        setCertificateEligible(false);
        setCertificateExists(false);
        setEligibilityMessage(message);
      }
    } finally {
      setCheckingCertificate(false);
    }
  };

  useEffect(() => {
    fetchInternship();
    checkCertificateEligibility();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleBuyNow = async () => {
    try {
      if (!token) {
        showToast("error", "Please login first");
        navigate("/");
        return;
      }

      if (!selectedPlan?.label) {
        showToast("error", "Please select a valid duration plan");
        return;
      }

      setLoading(true);

      const { data } = await API.post("/payments/create-order", {
        internshipId: id,
        durationLabel: selectedPlan.label,
      });

      const options = {
        key: data.key,
        amount: data.order.amount,
        currency: data.order.currency,
        name: "Internova",
        description: `Internova - ${data.internship.title} (${data.duration.label})`,
        order_id: data.order.id,
        handler: async function (response) {
          try {
            const verifyRes = await API.post("/payments/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verifyRes.data.success) {
              showToast("success", "Payment successful!");
              await checkCertificateEligibility();
              navigate("/my-purchases");
            } else {
              showToast("error", "Payment verification failed");
            }
          } catch (error) {
            console.error("Verification error:", error);
            showToast(
              "error",
              error.response?.data?.message || "Payment verification failed"
            );
          }
        },
        prefill: {
          name: user?.name || "",
          email: user?.email || "",
        },
        theme: {
          color: "#111111",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment start error:", error);
      showToast(
        "error",
        error.response?.data?.message || "Failed to initiate payment"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateCertificate = async () => {
    try {
      if (!token) {
        showToast("error", "Please login first");
        navigate("/");
        return;
      }

      setLoading(true);

      const { data } = await API.post(`/certificates/generate/${id}`, {});

      if (data.success) {
        showToast(
          "success",
          data.message || "Certificate generated successfully"
        );

        if (data.certificate?.certificateId) {
          window.open(
            `${API_BASE_URL}/certificates/${data.certificate.certificateId}/download`,
            "_blank"
          );
        }

        await checkCertificateEligibility();
      } else {
        showToast("error", "Certificate generation failed");
      }
    } catch (error) {
      console.error("Certificate generate error:", error);
      showToast(
        "error",
        error.response?.data?.message || "Failed to generate certificate"
      );
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
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
          <div className="fw-semibold text-dark">Loading details...</div>
        </div>
      </div>
    );
  }

  if (!internship) {
    return (
      <div
        className="min-vh-100 d-flex align-items-center justify-content-center"
        style={{
          background:
            "linear-gradient(135deg, #f8fafc 0%, #eef2ff 45%, #f8fafc 100%)",
        }}
      >
        <div className="text-center">
          <div className="fw-bold text-dark mb-2">Internship not found</div>
          <div className="text-muted">Please go back and try again.</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        .internship-details-page {
          min-height: 100vh;
          background:
            radial-gradient(circle at top left, rgba(59,130,246,0.18), transparent 28%),
            radial-gradient(circle at bottom right, rgba(99,102,241,0.16), transparent 32%),
            linear-gradient(135deg, #f8fafc 0%, #eef2ff 48%, #f8fafc 100%);
          position: relative;
          overflow: hidden;
        }

        .internship-details-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(10px);
          opacity: 0.55;
          animation: internshipDetailsFloat 9s ease-in-out infinite;
          -webkit-animation: internshipDetailsFloat 9s ease-in-out infinite;
          pointer-events: none;
        }

        .internship-details-orb-1 {
          width: 220px;
          height: 220px;
          top: 70px;
          left: -60px;
          background: linear-gradient(135deg, rgba(37,99,235,0.25), rgba(14,165,233,0.18));
        }

        .internship-details-orb-2 {
          width: 280px;
          height: 280px;
          right: -80px;
          bottom: 70px;
          background: linear-gradient(135deg, rgba(99,102,241,0.18), rgba(59,130,246,0.22));
          animation-delay: 1.2s;
          -webkit-animation-delay: 1.2s;
        }

        .internship-details-shell {
          position: relative;
          z-index: 2;
        }

        .internship-back-btn {
          border-radius: 999px;
          padding: 10px 18px;
          font-weight: 700;
          -webkit-transition: all 0.3s ease;
          transition: all 0.3s ease;
        }

        .internship-back-btn:hover {
          transform: translateY(-2px);
          -webkit-transform: translateY(-2px);
        }

        .internship-main-card {
          border: 1px solid rgba(255,255,255,0.42);
          background: rgba(255,255,255,0.72);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          box-shadow:
            0 24px 70px rgba(15, 23, 42, 0.14),
            0 8px 24px rgba(59,130,246,0.08);
          -webkit-box-shadow:
            0 24px 70px rgba(15, 23, 42, 0.14),
            0 8px 24px rgba(59,130,246,0.08);
        }

        .internship-image-wrap {
          height: 100%;
          min-height: 420px;
          position: relative;
          overflow: hidden;
        }

        .internship-main-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          -webkit-transition: transform 0.6s ease;
          transition: transform 0.6s ease;
        }

        .internship-main-card:hover .internship-main-image {
          transform: scale(1.04);
          -webkit-transform: scale(1.04);
        }

        .internship-image-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to top,
            rgba(8, 18, 38, 0.48) 0%,
            rgba(8, 18, 38, 0.10) 45%,
            rgba(8, 18, 38, 0.00) 100%
          );
          pointer-events: none;
        }

        .internship-badge {
          border-radius: 999px;
          padding: 8px 14px;
          font-weight: 700;
          letter-spacing: 0.01em;
        }

        .internship-title {
          font-size: 2rem;
          font-weight: 800;
          letter-spacing: -0.03em;
          color: #0f172a;
          margin-bottom: 8px;
        }

        .internship-description {
          color: #64748b;
          line-height: 1.8;
          margin-bottom: 24px;
        }

        .internship-soft-card {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 24px;
          padding: 20px;
          -webkit-transition: all 0.3s ease;
          transition: all 0.3s ease;
        }

        .internship-soft-card:hover {
          transform: translateY(-3px);
          -webkit-transform: translateY(-3px);
          box-shadow: 0 12px 30px rgba(15, 23, 42, 0.06);
          -webkit-box-shadow: 0 12px 30px rgba(15, 23, 42, 0.06);
        }

        .internship-card-title {
          font-size: 1.05rem;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 14px;
        }

        .internship-select {
          min-height: 56px;
          border-radius: 16px;
          border: 1px solid #dbe3f0;
          background: #ffffff;
          -webkit-transition: all 0.3s ease;
          transition: all 0.3s ease;
        }

        .internship-select:focus {
          border-color: #60a5fa;
          box-shadow: 0 0 0 4px rgba(37,99,235,0.12);
          -webkit-box-shadow: 0 0 0 4px rgba(37,99,235,0.12);
        }

        .internship-status-card {
          border-radius: 22px;
          padding: 18px 20px;
          font-weight: 600;
        }

        .internship-status-success {
          background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
          border: 1px solid #86efac;
          color: #065f46;
        }

        .internship-status-warning {
          background: linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%);
          border: 1px solid #fdba74;
          color: #9a3412;
        }

        .internship-status-neutral {
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          border: 1px solid #cbd5e1;
          color: #334155;
        }

        .internship-action-btn {
          min-height: 58px;
          border-radius: 18px;
          font-weight: 800;
          -webkit-transition: all 0.32s ease;
          transition: all 0.32s ease;
          box-shadow: 0 10px 25px rgba(15, 23, 42, 0.05);
          -webkit-box-shadow: 0 10px 25px rgba(15, 23, 42, 0.05);
        }

        .internship-action-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          -webkit-transform: translateY(-2px);
        }

        .internship-buy-btn {
          border: none;
          color: #fff;
          background: linear-gradient(135deg, #059669 0%, #10b981 100%);
          box-shadow: 0 18px 35px rgba(16,185,129,0.20);
          -webkit-box-shadow: 0 18px 35px rgba(16,185,129,0.20);
        }

        .internship-buy-btn:hover {
          color: #fff;
        }

        .internship-certificate-btn {
          border: none;
          color: #fff;
          background: linear-gradient(135deg, #0b1736 0%, #142850 40%, #1d4ed8 100%);
          box-shadow:
            0 18px 35px rgba(29, 78, 216, 0.20),
            0 8px 20px rgba(11, 23, 54, 0.16);
          -webkit-box-shadow:
            0 18px 35px rgba(29, 78, 216, 0.20),
            0 8px 20px rgba(11, 23, 54, 0.16);
        }

        .internship-certificate-btn:hover {
          color: #fff;
        }

        .internship-list {
          padding-left: 18px;
          margin-bottom: 0;
          color: #475569;
          line-height: 1.9;
        }

        .internship-note {
          color: #64748b;
          font-size: 0.95rem;
          line-height: 1.8;
          margin-bottom: 0;
        }

        .internship-info-label {
          color: #64748b;
          font-size: 0.88rem;
          margin-bottom: 4px;
        }

        .internship-info-value {
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 0;
        }

        @keyframes internshipDetailsFloat {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
          }
          50% {
            transform: translateY(-18px) translateX(10px);
          }
        }

        @-webkit-keyframes internshipDetailsFloat {
          0%, 100% {
            -webkit-transform: translateY(0px) translateX(0px);
          }
          50% {
            -webkit-transform: translateY(-18px) translateX(10px);
          }
        }

        @media (max-width: 991px) {
          .internship-title {
            font-size: 1.75rem;
          }

          .internship-image-wrap {
            min-height: 320px;
          }
        }

        @media (max-width: 767px) {
          .internship-details-page {
            padding: 22px 0;
          }

          .internship-title {
            font-size: 1.55rem;
          }

          .internship-image-wrap {
            min-height: 260px;
          }
        }
      `}</style>

      <div className="internship-details-page py-4 py-lg-5">
        <div className="internship-details-orb internship-details-orb-1"></div>
        <div className="internship-details-orb internship-details-orb-2"></div>

        <div className="container internship-details-shell">
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
            className="btn btn-outline-dark internship-back-btn mb-4"
            onClick={() => navigate(-1)}
          >
            ← Back
          </button>

          <div className="card internship-main-card border-0 rounded-5 overflow-hidden">
            <div className="row g-0">
              <div className="col-lg-6">
                <div className="internship-image-wrap">
                  <img
                    src={
                      internship.thumbnail ||
                      "https://via.placeholder.com/600x350"
                    }
                    alt={internship.title}
                    className="internship-main-image"
                  />
                  <div className="internship-image-overlay"></div>
                </div>
              </div>

              <div className="col-lg-6">
                <div className="p-4 p-lg-5">
                  <div className="d-flex justify-content-between align-items-start flex-wrap gap-3 mb-3">
                    <div>
                      <h2 className="internship-title">{internship.title}</h2>
                      <span className="badge bg-secondary internship-badge">
                        {internship.branch}
                      </span>
                    </div>

                    <span className="badge bg-dark internship-badge">
                      {internship.category}
                    </span>
                  </div>

                  <p className="internship-description">
                    {internship.description}
                  </p>

                  <div className="internship-soft-card mb-4">
                    <h5 className="internship-card-title">Select Duration</h5>
                    <select
                      className="form-select internship-select"
                      value={selectedPlan?.label || selectedDuration}
                      onChange={(e) => setSelectedDuration(e.target.value)}
                    >
                      {normalizedDurations.map((item, index) => (
                        <option key={index} value={item.label}>
                          {item.label} - INR {item.price}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="internship-soft-card mb-4">
                    <h5 className="internship-card-title">Selected Plan</h5>
                    <div className="row g-3">
                      <div className="col-sm-6">
                        <div className="internship-soft-card h-100">
                          <div className="internship-info-label">Duration</div>
                          <p className="internship-info-value mb-0">
                            {selectedPlan ? selectedPlan.label : "N/A"}
                          </p>
                        </div>
                      </div>

                      <div className="col-sm-6">
                        <div className="internship-soft-card h-100">
                          <div className="internship-info-label">Price</div>
                          <p className="internship-info-value mb-0">
                            INR {selectedPlan ? selectedPlan.price : 0}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {checkingCertificate ? (
                    <div className="internship-status-card internship-status-neutral mb-4">
                      Checking certificate status...
                    </div>
                  ) : certificateEligible ? (
                    <div className="internship-status-card internship-status-success mb-4">
                      {eligibilityMessage ||
                        "You are eligible to claim your certificate for this internship."}
                    </div>
                  ) : (
                    <div className="internship-status-card internship-status-warning mb-4">
                      {eligibilityMessage ||
                        "Complete the required course progress and mini test to become certificate-eligible."}
                    </div>
                  )}

                  <div className="d-grid gap-3 mb-4">
                    <button
                      className="btn internship-action-btn internship-buy-btn"
                      onClick={handleBuyNow}
                      disabled={loading}
                    >
                      {loading ? "Processing..." : "Enroll Now"}
                    </button>

                    {!checkingCertificate && certificateEligible && (
                      <button
                        className="btn internship-action-btn internship-certificate-btn"
                        onClick={handleGenerateCertificate}
                        disabled={loading}
                      >
                        {loading
                          ? "Processing..."
                          : certificateExists
                          ? "Download Certificate"
                          : "Generate Certificate"}
                      </button>
                    )}
                  </div>

                  <div className="internship-soft-card mb-3">
                    <h5 className="internship-card-title">What you get</h5>
                    <ul className="internship-list">
                      <li>Program access after successful enrollment</li>
                      <li>Learning Access Letter download</li>
                      <li>Course modules and progress tracking</li>
                      <li>Mini test and retake support</li>
                      <li>Certificate generation after eligibility</li>
                      <li>Public certificate verification via ID / QR</li>
                    </ul>
                  </div>

                  <p className="internship-note">
                    After successful payment, this training program will appear in My
                    Enrollments, where you can access the course, learning access letter,
                    mini test, and certificate flow.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default InternshipDetails;