import React, { useEffect, useMemo, useState } from "react";
import API, { downloadProtectedPdf } from "../services/api";
import { useParams, useNavigate, Link } from "react-router-dom";
import BrandLoader from "../components/BrandLoader";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api";

function InternshipDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [internship, setInternship] = useState(null);
  const [selectedDuration, setSelectedDuration] = useState("");
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [certificateLoading, setCertificateLoading] = useState(false);
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

  const user = JSON.parse(localStorage.getItem("user") || "null");
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
        label: internship.duration || `${internship.durationDays || 30} Days`,
        price: internship.price || 0,
        durationDays: internship.durationDays || 30,
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

  const lowestPrice = useMemo(() => {
    if (!normalizedDurations.length) return 0;
    return Math.min(...normalizedDurations.map((item) => Number(item.price) || 0));
  }, [normalizedDurations]);

  const fetchInternship = async () => {
    try {
      setPageLoading(true);

      const { data } = await API.get(`/internships/${id}`);
      const internshipData = data?.internship || null;

      setInternship(internshipData);

      if (internshipData?.title) {
        document.title = `${internshipData.title} | InternovaTech Internship Program`;

        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
          const shortDescription =
            internshipData.description?.length > 155
              ? `${internshipData.description.slice(0, 152)}...`
              : internshipData.description ||
                `Explore the ${internshipData.title} internship program on InternovaTech with practical learning, assessments, and verified certificate support.`;

          metaDescription.setAttribute("content", shortDescription);
        }

        let canonicalTag = document.querySelector('link[rel="canonical"]');
        if (!canonicalTag) {
          canonicalTag = document.createElement("link");
          canonicalTag.setAttribute("rel", "canonical");
          document.head.appendChild(canonicalTag);
        }

        canonicalTag.setAttribute(
          "href",
          `https://www.internovatech.in/internships/${internshipData._id || id}`
        );
      }

      if (internshipData?.durations?.length > 0 && !selectedDuration) {
        setSelectedDuration(internshipData.durations[0].label);
      } else if (!selectedDuration) {
        setSelectedDuration(
          internshipData?.duration || `${internshipData?.durationDays || 30} Days`
        );
      }
    } catch (error) {
      console.error("Failed to fetch Internship Programs details:", error);
      showToast("error", "Failed to load Internship Programs details");
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
    document.title = "Internship Programs Details | InternovaTech";
    fetchInternship();
    checkCertificateEligibility();

    return () => {
      document.title =
        "InternovaTech - Online Internship Programs, Certificates and Tech Training";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const goToPostPaymentDestination = (verifyData) => {
    const redirectTo = verifyData?.redirectTo || "";
    const purchaseInternshipId =
      verifyData?.purchase?.internshipId || internship?._id || id;

    if (redirectTo && typeof redirectTo === "string") {
      navigate("/my-purchases", {
        replace: true,
        state: {
          refreshPurchases: true,
          justPaid: true,
          internshipId: purchaseInternshipId,
          redirectTo,
          ts: Date.now(),
        },
      });
      return;
    }

    navigate("/my-purchases", {
      replace: true,
      state: {
        refreshPurchases: true,
        justPaid: true,
        internshipId: purchaseInternshipId,
        ts: Date.now(),
      },
    });
  };

  const handleBuyNow = async () => {
    if (paymentLoading) return;

    try {
      if (!token) {
        showToast("error", "Please login first");
        navigate("/login");
        return;
      }

      if (!selectedPlan?.label) {
        showToast("error", "Please select a valid duration plan");
        return;
      }

      if (!window.Razorpay) {
        showToast(
          "error",
          "Payment gateway failed to load. Please refresh and try again."
        );
        return;
      }

      setPaymentLoading(true);

      const { data } = await API.post("/payments/create-order", {
        internshipId: id,
        durationLabel: selectedPlan.label,
      });

      const options = {
        key: data.key,
        amount: data.order.amount,
        currency: data.order.currency,
        name: "InternovaTech",
        description: `InternovaTech - ${data?.internship?.title || internship?.title || "Program"} (${data?.duration?.label || selectedPlan.label})`,
        order_id: data.order.id,
        handler: async function (response) {
          console.log("RAZORPAY SUCCESS RESPONSE:", response);
          console.log("VERIFY API CALL STARTING...");
          try {
            const verifyRes = await API.post("/payments/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verifyRes?.data?.success) {
              const verifyData = verifyRes.data;
              showToast("success", "Payment successful! Finalizing enrollment...");

              const slipDownloadUrl = verifyData?.slipDownloadUrl;

              if (slipDownloadUrl) {
                try {
                  const normalizedSlipUrl = slipDownloadUrl.startsWith("/api")
                    ? slipDownloadUrl.replace(/^\/api/, "")
                    : slipDownloadUrl;

                  await downloadProtectedPdf(
                    normalizedSlipUrl,
                    `${(data?.internship?.title || internship?.title || "payment_slip")
                      .replace(/[^a-z0-9]/gi, "_")
                      .replace(/_+/g, "_")
                      .replace(/^_|_$/g, "")}_payment_slip.pdf`
                  );
                } catch (slipError) {
                  console.error("Payment slip auto-download failed:", slipError);
                }
              }

              await checkCertificateEligibility();

              setTimeout(() => {
                goToPostPaymentDestination(verifyData);
              }, 500);
            } else {
              showToast("error", "Payment verification failed");
            }
          } catch (error) {
            console.error("Verification error:", error);
            showToast(
              "error",
              error?.response?.data?.message || "Payment verification failed"
            );
          } finally {
            setPaymentLoading(false);
          }
        },
        modal: {
          ondismiss: function () {
            setPaymentLoading(false);
          },
        },
        prefill: {
          name: user?.name || "",
          email: user?.email || "",
          contact: user?.phone || user?.mobile || "",
        },
        notes: {
          internshipId: id,
          durationLabel: selectedPlan.label,
        },
        theme: {
          color: "#1d4ed8",
        },
      };

      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", function (response) {
        console.log("RAZORPAY PAYMENT FAILED EVENT:", response);
        console.error("Razorpay payment failed:", response);
        showToast(
          "error",
          response?.error?.description || "Payment failed. Please try again."
        );
        setPaymentLoading(false);
      });

      rzp.open();
    } catch (error) {
      console.error("Payment start error:", error);
      showToast(
        "error",
        error?.response?.data?.message || "Failed to initiate payment"
      );
      setPaymentLoading(false);
    }
  };

  const handleGenerateCertificate = async () => {
    if (certificateLoading) return;

    try {
      if (!token) {
        showToast("error", "Please login first");
        navigate("/login");
        return;
      }

      setCertificateLoading(true);

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
        error?.response?.data?.message || "Failed to generate certificate"
      );
    } finally {
      setCertificateLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div
        className="min-vh-100 d-flex align-items-center justify-content-center"
        style={{
          background:
            "linear-gradient(135deg, #f8fbff 0%, #eef4ff 48%, #f8fbff 100%)",
        }}
      >
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status"></div>
          <div className="fw-bold text-dark">
            Loading InternovaTech program details...
          </div>
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
            "linear-gradient(135deg, #f8fbff 0%, #eef4ff 48%, #f8fbff 100%)",
        }}
      >
        <div className="text-center px-3">
          <div className="fw-bold text-dark mb-2">Internship program not found</div>
          <div className="text-muted mb-3">Please go back and try again.</div>
          <Link to="/internships" className="btn btn-dark rounded-pill px-4">
            Back to Programs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        .details-v61-page {
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

        .details-v61-page::before {
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

        .details-v61-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(14px);
          opacity: 0.54;
          pointer-events: none;
          animation: detailsV61Float 10s ease-in-out infinite;
          -webkit-animation: detailsV61Float 10s ease-in-out infinite;
        }

        .details-v61-orb-1 {
          width: 240px;
          height: 240px;
          top: 90px;
          left: -70px;
          background: linear-gradient(135deg, rgba(29,78,216,0.22), rgba(14,165,233,0.16));
        }

        .details-v61-orb-2 {
          width: 310px;
          height: 310px;
          right: -80px;
          top: 140px;
          background: linear-gradient(135deg, rgba(99,102,241,0.18), rgba(59,130,246,0.18));
          animation-delay: 1.5s;
          -webkit-animation-delay: 1.5s;
        }

        .details-v61-orb-3 {
          width: 210px;
          height: 210px;
          right: 14%;
          bottom: 5%;
          background: linear-gradient(135deg, rgba(16,185,129,0.12), rgba(37,99,235,0.10));
          animation-delay: 2.2s;
          -webkit-animation-delay: 2.2s;
        }

        .details-v61-shell {
          position: relative;
          z-index: 2;
        }

        .details-v61-toast {
          position: fixed;
          top: 96px;
          right: 24px;
          z-index: 99999;
          min-width: 280px;
          max-width: 390px;
        }

        .details-v61-back {
          min-height: 48px;
          padding: 0 18px;
          border-radius: 16px;
          font-weight: 800;
          transition: all 0.3s ease;
          -webkit-transition: all 0.3s ease;
        }

        .details-v61-back:hover {
          transform: translateY(-2px);
          -webkit-transform: translateY(-2px);
        }

        .details-v61-main {
          position: relative;
          overflow: hidden;
          border-radius: 36px;
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
        }

        .details-v61-main::before {
          content: "";
          position: absolute;
          inset: 0;
          background:
            radial-gradient(circle at 18% 18%, rgba(255,255,255,0.38), transparent 18%),
            radial-gradient(circle at 86% 72%, rgba(255,255,255,0.24), transparent 20%);
          pointer-events: none;
        }

        .details-v61-image-wrap {
          position: relative;
          min-height: 100%;
          height: 100%;
          overflow: hidden;
          background: linear-gradient(135deg, #dbeafe 0%, #eff6ff 100%);
        }

        .details-v61-image-wrap::after {
          content: "";
          position: absolute;
          inset: 0;
          background:
            linear-gradient(
              to top,
              rgba(8,18,38,0.26) 0%,
              rgba(8,18,38,0.06) 46%,
              rgba(8,18,38,0) 100%
            );
          pointer-events: none;
        }

        .details-v61-image {
          width: 100%;
          height: 100%;
          min-height: 520px;
          object-fit: cover;
          transition: transform 0.7s ease;
          -webkit-transition: -webkit-transform 0.7s ease;
        }

        .details-v61-main:hover .details-v61-image {
          transform: scale(1.04);
          -webkit-transform: scale(1.04);
        }

        .details-v61-body {
          position: relative;
          z-index: 2;
          padding: 34px;
        }

        .details-v61-badge-row {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
          margin-bottom: 16px;
        }

        .details-v61-badge {
          padding: 9px 14px;
          border-radius: 999px;
          font-size: 0.8rem;
          font-weight: 800;
          line-height: 1;
        }

        .details-v61-badge-branch {
          background: linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%);
          color: #0f172a;
          border: 1px solid #cbd5e1;
        }

        .details-v61-badge-category {
          background: linear-gradient(135deg, #081226 0%, #1d4ed8 100%);
          color: #fff;
          border: 1px solid rgba(29,78,216,0.18);
        }

        .details-v61-title {
          font-size: 2.45rem;
          line-height: 1.08;
          font-weight: 900;
          letter-spacing: -0.045em;
          color: #0f172a;
          margin-bottom: 14px;
        }

        .details-v61-description {
          color: #475569;
          line-height: 1.92;
          margin-bottom: 22px;
          font-size: 1rem;
        }

        .details-v61-price-strip {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 14px;
          margin-bottom: 22px;
        }

        .details-v61-price-card {
          border-radius: 22px;
          background: rgba(255,255,255,0.82);
          border: 1px solid rgba(148,163,184,0.16);
          padding: 18px;
          box-shadow: 0 16px 36px rgba(15,23,42,0.05);
          -webkit-box-shadow: 0 16px 36px rgba(15,23,42,0.05);
          transition: all 0.3s ease;
          -webkit-transition: all 0.3s ease;
        }

        .details-v61-price-card:hover {
          transform: translateY(-4px);
          -webkit-transform: translateY(-4px);
          box-shadow: 0 22px 44px rgba(15,23,42,0.08);
          -webkit-box-shadow: 0 22px 44px rgba(15,23,42,0.08);
        }

        .details-v61-price-label {
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #64748b;
          font-weight: 800;
          margin-bottom: 8px;
        }

        .details-v61-price-value {
          font-size: 1.35rem;
          font-weight: 900;
          color: #0f172a;
          letter-spacing: -0.03em;
          margin-bottom: 0;
        }

        .details-v61-card {
          border-radius: 28px;
          background: rgba(255,255,255,0.82);
          border: 1px solid rgba(255,255,255,0.76);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          box-shadow:
            0 24px 60px rgba(15,23,42,0.08),
            0 8px 20px rgba(59,130,246,0.05);
          -webkit-box-shadow:
            0 24px 60px rgba(15,23,42,0.08),
            0 8px 20px rgba(59,130,246,0.05);
          padding: 24px;
          transition: all 0.35s ease;
          -webkit-transition: all 0.35s ease;
          margin-bottom: 18px;
        }

        .details-v61-card:hover {
          transform: translateY(-4px);
          -webkit-transform: translateY(-4px);
        }

        .details-v61-card-title {
          font-size: 1.1rem;
          font-weight: 900;
          color: #0f172a;
          margin-bottom: 14px;
          letter-spacing: -0.02em;
        }

        .details-v61-select {
          min-height: 58px;
          border-radius: 18px;
          border: 1px solid #dbe3f0;
          background: rgba(248,250,252,0.96);
          transition: all 0.3s ease;
          -webkit-transition: all 0.3s ease;
          box-shadow: none;
          -webkit-box-shadow: none;
        }

        .details-v61-select:focus {
          border-color: #60a5fa;
          background: #ffffff;
          box-shadow: 0 0 0 4px rgba(37,99,235,0.12);
          -webkit-box-shadow: 0 0 0 4px rgba(37,99,235,0.12);
        }

        .details-v61-status {
          border-radius: 22px;
          padding: 18px 20px;
          font-weight: 700;
          line-height: 1.75;
          margin-bottom: 18px;
        }

        .details-v61-status-success {
          background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
          border: 1px solid #86efac;
          color: #065f46;
        }

        .details-v61-status-warning {
          background: linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%);
          border: 1px solid #fdba74;
          color: #9a3412;
        }

        .details-v61-status-neutral {
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          border: 1px solid #cbd5e1;
          color: #334155;
        }

        .details-v61-action-grid {
          display: grid;
          gap: 12px;
          margin-bottom: 18px;
        }

        .details-v61-btn-buy,
        .details-v61-btn-certificate {
          min-height: 58px;
          border-radius: 18px;
          font-weight: 900;
          border: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: all 0.32s ease;
          -webkit-transition: all 0.32s ease;
          text-decoration: none;
          width: 100%;
        }

        .details-v61-btn-buy {
          color: #fff;
          background: linear-gradient(135deg, #059669 0%, #10b981 100%);
          box-shadow: 0 18px 35px rgba(16,185,129,0.20);
          -webkit-box-shadow: 0 18px 35px rgba(16,185,129,0.20);
        }

        .details-v61-btn-buy:hover {
          color: #fff;
          transform: translateY(-2px);
          -webkit-transform: translateY(-2px);
        }

        .details-v61-btn-buy:disabled,
        .details-v61-btn-certificate:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none !important;
          -webkit-transform: none !important;
        }

        .details-v61-btn-certificate {
          color: #fff;
          background: linear-gradient(135deg, #081226 0%, #102247 45%, #1d4ed8 100%);
          box-shadow:
            0 18px 35px rgba(29,78,216,0.20),
            0 8px 20px rgba(8,18,38,0.16);
          -webkit-box-shadow:
            0 18px 35px rgba(29,78,216,0.20),
            0 8px 20px rgba(8,18,38,0.16);
        }

        .details-v61-btn-certificate:hover {
          color: #fff;
          transform: translateY(-2px);
          -webkit-transform: translateY(-2px);
        }

        .details-v61-list {
          padding-left: 18px;
          margin-bottom: 0;
          color: #475569;
          line-height: 1.9;
        }

        .details-v61-note {
          color: #64748b;
          font-size: 0.96rem;
          line-height: 1.84;
          margin-bottom: 0;
        }

        .details-v61-mini-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
        }

        .details-v61-mini-card {
          border-radius: 20px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          padding: 16px;
          transition: all 0.3s ease;
          -webkit-transition: all 0.3s ease;
        }

        .details-v61-mini-card:hover {
          transform: translateY(-3px);
          -webkit-transform: translateY(-3px);
          box-shadow: 0 12px 30px rgba(15,23,42,0.06);
          -webkit-box-shadow: 0 12px 30px rgba(15,23,42,0.06);
        }

        .details-v61-mini-label {
          color: #64748b;
          font-size: 0.82rem;
          margin-bottom: 6px;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          font-weight: 800;
        }

        .details-v61-mini-value {
          font-weight: 900;
          color: #0f172a;
          margin-bottom: 0;
          letter-spacing: -0.02em;
        }

        .details-v61-footer-band {
          margin-top: 22px;
          border-radius: 24px;
          overflow: hidden;
          position: relative;
          background:
            linear-gradient(135deg, #081226 0%, #102247 42%, #1d4ed8 100%);
          color: #fff;
          box-shadow:
            0 30px 80px rgba(15,23,42,0.14),
            0 10px 28px rgba(29,78,216,0.08);
          -webkit-box-shadow:
            0 30px 80px rgba(15,23,42,0.14),
            0 10px 28px rgba(29,78,216,0.08);
        }

        .details-v61-footer-band::before {
          content: "";
          position: absolute;
          inset: 0;
          background:
            radial-gradient(circle at 14% 18%, rgba(255,255,255,0.14), transparent 18%),
            radial-gradient(circle at 86% 74%, rgba(255,255,255,0.08), transparent 20%);
          pointer-events: none;
        }

        .details-v61-footer-inner {
          position: relative;
          z-index: 2;
          padding: 22px;
        }

        .details-v61-footer-title {
          font-size: 1.2rem;
          font-weight: 900;
          margin-bottom: 8px;
          letter-spacing: -0.02em;
        }

        .details-v61-footer-text {
          color: rgba(255,255,255,0.80);
          line-height: 1.8;
          margin-bottom: 0;
        }

        @keyframes detailsV61Float {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
          }
          50% {
            transform: translateY(-18px) translateX(10px);
          }
        }

        @-webkit-keyframes detailsV61Float {
          0%, 100% {
            -webkit-transform: translateY(0px) translateX(0px);
          }
          50% {
            -webkit-transform: translateY(-18px) translateX(10px);
          }
        }

        @media (max-width: 1199px) {
          .details-v61-title {
            font-size: 2.1rem;
          }
        }

        @media (max-width: 991px) {
          .details-v61-page {
            padding: 28px 0 62px;
          }

          .details-v61-body {
            padding: 24px;
          }

          .details-v61-image {
            min-height: 320px;
          }

          .details-v61-price-strip {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 767px) {
          .details-v61-title {
            font-size: 1.82rem;
            line-height: 1.12;
          }

          .details-v61-description,
          .details-v61-note,
          .details-v61-footer-text {
            line-height: 1.8;
          }

          .details-v61-body,
          .details-v61-card,
          .details-v61-main,
          .details-v61-footer-inner,
          .details-v61-price-card {
            padding: 22px;
            border-radius: 22px;
          }

          .details-v61-image {
            min-height: 250px;
          }

          .details-v61-mini-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="details-v61-page">
        <div className="details-v61-orb details-v61-orb-1"></div>
        <div className="details-v61-orb details-v61-orb-2"></div>
        <div className="details-v61-orb details-v61-orb-3"></div>

        <div className="container details-v61-shell">
          {toast.show && (
            <div className="details-v61-toast">
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
            className="btn btn-outline-dark details-v61-back mb-4"
            onClick={() => navigate(-1)}
          >
            ← Back
          </button>

          <section className="details-v61-main">
            <div className="row g-0">
              <div className="col-lg-6">
                <div className="details-v61-image-wrap">
                  <img
                    src={
                      internship.thumbnail ||
                      "https://via.placeholder.com/600x350"
                    }
                    alt={internship.title || "InternovaTech internship program"}
                    className="details-v61-image"
                  />
                </div>
              </div>

              <div className="col-lg-6">
                <div className="details-v61-body">
                  <div className="details-v61-badge-row">
                    <span className="details-v61-badge details-v61-badge-branch">
                      {internship.branch}
                    </span>
                    <span className="details-v61-badge details-v61-badge-category">
                      {internship.category}
                    </span>
                  </div>

                  <h1 className="details-v61-title">{internship.title}</h1>

                  <p className="details-v61-description">
                    {internship.description}
                  </p>

                  <div className="details-v61-price-strip">
                    <div className="details-v61-price-card">
                      <div className="details-v61-price-label">Starting Price</div>
                      <p className="details-v61-price-value">INR {lowestPrice}</p>
                    </div>

                    <div className="details-v61-price-card">
                      <div className="details-v61-price-label">Plan Options</div>
                      <p className="details-v61-price-value">
                        {normalizedDurations.length}
                      </p>
                    </div>

                    <div className="details-v61-price-card">
                      <div className="details-v61-price-label">Certificate</div>
                      <p className="details-v61-price-value">Eligible Workflow</p>
                    </div>
                  </div>

                  <div className="details-v61-card">
                    <h2 className="details-v61-card-title">Select Duration Plan</h2>
                    <select
                      className="form-select details-v61-select"
                      value={selectedPlan?.label || selectedDuration}
                      onChange={(e) => setSelectedDuration(e.target.value)}
                      disabled={paymentLoading}
                    >
                      {normalizedDurations.map((item, index) => (
                        <option key={index} value={item.label}>
                          {item.label} - INR {item.price}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="details-v61-card">
                    <h2 className="details-v61-card-title">Selected Plan Summary</h2>
                    <div className="details-v61-mini-grid">
                      <div className="details-v61-mini-card">
                        <div className="details-v61-mini-label">Duration</div>
                        <p className="details-v61-mini-value">
                          {selectedPlan ? selectedPlan.label : "N/A"}
                        </p>
                      </div>

                      <div className="details-v61-mini-card">
                        <div className="details-v61-mini-label">Price</div>
                        <p className="details-v61-mini-value">
                          INR {selectedPlan ? selectedPlan.price : 0}
                        </p>
                      </div>
                    </div>
                  </div>

                  {checkingCertificate ? (
                    <div className="details-v61-status details-v61-status-neutral">
                      Checking certificate status...
                    </div>
                  ) : certificateEligible ? (
                    <div className="details-v61-status details-v61-status-success">
                      {eligibilityMessage ||
                        "You are eligible to claim your certificate for this Internship Programs."}
                    </div>
                  ) : (
                    <div className="details-v61-status details-v61-status-warning">
                      {eligibilityMessage ||
                        "Complete the required course progress and mini test to become certificate-eligible."}
                    </div>
                  )}

                  <div className="details-v61-action-grid">
                    <button
                      className="details-v61-btn-buy"
                      onClick={handleBuyNow}
                      disabled={paymentLoading || certificateLoading}
                    >
                      {paymentLoading ? "Processing..." : "Enroll Now"}
                    </button>

                    {!checkingCertificate && certificateEligible && (
                      <button
                        className="details-v61-btn-certificate"
                        onClick={handleGenerateCertificate}
                        disabled={paymentLoading || certificateLoading}
                      >
                        {certificateLoading
                          ? "Processing..."
                          : certificateExists
                          ? "Download Certificate"
                          : "Generate Certificate"}
                      </button>
                    )}
                  </div>

                  <div className="details-v61-card">
                    <h2 className="details-v61-card-title">What you get</h2>
                    <ul className="details-v61-list">
                      <li>Program access after successful enrollment</li>
                      <li>Premium offer letter download</li>
                      <li>Premium payment slip download</li>
                      <li>Course modules and progress tracking</li>
                      <li>Mini test and retake support</li>
                      <li>Certificate generation after eligibility</li>
                      <li>Public certificate verification via ID or QR</li>
                    </ul>
                  </div>

                  <p className="details-v61-note">
                    After successful payment, this program will appear in My
                    Enrollments, where you can access the course, learning access
                    letter, payment slip, mini test, and certificate workflow.
                  </p>

                  <div className="details-v61-footer-band">
                    <div className="details-v61-footer-inner">
                      <h3 className="details-v61-footer-title">
                        Built for structured, trackable learning
                      </h3>
                      <p className="details-v61-footer-text">
                        InternovaTech combines guided learning, progress
                        visibility, assessments, and trusted certificate support
                        inside one polished Internship Programs experience.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

export default InternshipDetails;