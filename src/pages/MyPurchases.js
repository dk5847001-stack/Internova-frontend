import React, { useEffect, useMemo, useState } from "react";
import API, { downloadProtectedPdf } from "../services/api";
import { useNavigate, useLocation } from "react-router-dom";

function MyPurchases() {
  const [purchases, setPurchases] = useState([]);
  const [statusMap, setStatusMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState(null);
  const [downloadingSlipId, setDownloadingSlipId] = useState(null);
  const [toast, setToast] = useState({
    show: false,
    type: "success",
    message: "",
  });

  const navigate = useNavigate();
  const location = useLocation();

  const showToast = (type, message) => {
    setToast({ show: true, type, message });

    setTimeout(() => {
      setToast({ show: false, type: "success", message: "" });
    }, 3000);
  };

  const fetchPurchaseStatuses = async (purchaseList) => {
    try {
      const results = await Promise.all(
        purchaseList.map(async (item) => {
          const internshipObj = item.internshipId || null;
          const internshipId = internshipObj?._id || item.internshipId || null;

          if (!internshipId) {
            return [item._id, null];
          }

          try {
            const [progressRes, eligibilityRes] = await Promise.allSettled([
              API.get(`/progress/course/${internshipId}`),
              API.get(`/certificates/eligibility/${internshipId}`),
            ]);

            const progressData =
              progressRes.status === "fulfilled"
                ? progressRes.value?.data
                : null;

            const certificateData =
              eligibilityRes.status === "fulfilled"
                ? eligibilityRes.value?.data
                : null;

            const overallProgress =
              progressData?.progress?.overallProgress || 0;

            const miniTestUnlockProgress =
              progressData?.course?.miniTestUnlockProgress || 80;

            const miniTestPassed =
              progressData?.progress?.miniTestPassed || false;

            const durationCompleted =
              progressData?.progress?.durationCompleted || false;

            const certificateEligible =
              certificateData?.progress?.certificateEligible ||
              certificateData?.eligible ||
              false;

            const certificateExists = !!certificateData?.certificate;

            return [
              item._id,
              {
                overallProgress,
                miniTestUnlockProgress,
                miniTestPassed,
                durationCompleted,
                certificateEligible,
                certificateExists,
              },
            ];
          } catch (error) {
            console.error("Failed to fetch purchase status:", error);
            return [
              item._id,
              {
                overallProgress: 0,
                miniTestUnlockProgress: 80,
                miniTestPassed: false,
                durationCompleted: false,
                certificateEligible: false,
                certificateExists: false,
              },
            ];
          }
        })
      );

      const nextStatusMap = Object.fromEntries(results);
      setStatusMap(nextStatusMap);
    } catch (error) {
      console.error("Failed to fetch purchase statuses:", error);
    }
  };

  const fetchPurchases = async ({ silent = false } = {}) => {
    try {
      if (!silent) {
        setLoading(true);
      }

      const { data } = await API.get("/purchases/my-purchases");
      const purchaseList = data.purchases || [];

      setPurchases(purchaseList);
      await fetchPurchaseStatuses(purchaseList);
    } catch (error) {
      console.error("Failed to fetch purchases:", error);
      showToast("error", "Failed to fetch purchases");
    } finally {
      if (!silent) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchPurchases();
  }, []);

  useEffect(() => {
    if (location.state?.refreshPurchases || location.state?.justPaid) {
      fetchPurchases({ silent: false });

      if (location.state?.justPaid) {
        showToast("success", "Enrollment updated successfully");
      }

      navigate(location.pathname, {
        replace: true,
        state: {},
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state]);

  const handleDownloadOfferLetter = async (item) => {
    try {
      setDownloadingId(item._id);

      await downloadProtectedPdf(
        `/purchases/offer-letter/${item._id}`,
        `${(item.internshipTitle || item.internshipId?.title || "offer_letter")
          .replace(/[^a-z0-9]/gi, "_")
          .replace(/_+/g, "_")
          .replace(/^_|_$/g, "")}_offer_letter.pdf`
      );

      showToast("success", "Offer letter downloaded successfully");
    } catch (error) {
      console.error("Offer letter download error:", error);
      showToast("error", "Offer letter download failed");
    } finally {
      setDownloadingId(null);
    }
  };

  const handleDownloadPaymentSlip = async (item) => {
    try {
      setDownloadingSlipId(item._id);

      await downloadProtectedPdf(
        `/payments/slip/${item._id}`,
        `${(item.internshipTitle || item.internshipId?.title || "payment_slip")
          .replace(/[^a-z0-9]/gi, "_")
          .replace(/_+/g, "_")
          .replace(/^_|_$/g, "")}_payment_slip.pdf`
      );

      showToast("success", "Payment slip downloaded successfully");
    } catch (error) {
      console.error("Payment slip download error:", error);
      showToast("error", "Payment slip download failed");
    } finally {
      setDownloadingSlipId(null);
    }
  };

  const getStatusBadge = (status) => {
    const normalized = String(status || "").toLowerCase();

    if (normalized === "paid") {
      return (
        <span className="myp-v2-status-pill myp-v2-status-paid">
          ● PAID
        </span>
      );
    }

    if (normalized === "pending") {
      return (
        <span className="myp-v2-status-pill myp-v2-status-pending">
          ● PENDING
        </span>
      );
    }

    if (normalized === "created") {
      return (
        <span className="myp-v2-status-pill myp-v2-status-pending">
          ● CREATED
        </span>
      );
    }

    return (
      <span className="myp-v2-status-pill myp-v2-status-default">
        ● {status || "UNKNOWN"}
      </span>
    );
  };

  const enrolledCount = purchases.length;

  const passedCount = useMemo(() => {
    return purchases.filter((item) => statusMap[item._id]?.miniTestPassed).length;
  }, [purchases, statusMap]);

  const certificateReadyCount = useMemo(() => {
    return purchases.filter((item) => statusMap[item._id]?.certificateEligible)
      .length;
  }, [purchases, statusMap]);

  if (loading) {
    return (
      <div
        className="min-vh-100 d-flex align-items-center justify-content-center"
        style={{
          background:
            "linear-gradient(135deg, #f8fbff 0%, #eef4ff 45%, #f8fbff 100%)",
        }}
      >
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status"></div>
          <div className="fw-bold text-dark">Loading your premium dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        .myp-v2-page {
          min-height: 100vh;
          padding: 38px 0 80px;
          background:
            radial-gradient(circle at top left, rgba(59,130,246,0.16), transparent 26%),
            radial-gradient(circle at 86% 10%, rgba(99,102,241,0.14), transparent 22%),
            radial-gradient(circle at bottom right, rgba(16,185,129,0.10), transparent 24%),
            linear-gradient(135deg, #f8fbff 0%, #eef4ff 45%, #f8fbff 100%);
          position: relative;
          overflow: hidden;
        }

        .myp-v2-page::before {
          content: "";
          position: absolute;
          inset: 0;
          background:
            repeating-linear-gradient(
              90deg,
              rgba(255,255,255,0.04) 0px,
              rgba(255,255,255,0.04) 1px,
              transparent 1px,
              transparent 120px
            );
          pointer-events: none;
        }

        .myp-v2-shell {
          position: relative;
          z-index: 2;
        }

        .myp-v2-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(16px);
          opacity: 0.55;
          pointer-events: none;
          animation: mypV2Float 10s ease-in-out infinite;
        }

        .myp-v2-orb-1 {
          width: 240px;
          height: 240px;
          top: 80px;
          left: -60px;
          background: linear-gradient(135deg, rgba(29,78,216,0.22), rgba(14,165,233,0.16));
        }

        .myp-v2-orb-2 {
          width: 300px;
          height: 300px;
          top: 120px;
          right: -80px;
          background: linear-gradient(135deg, rgba(99,102,241,0.16), rgba(59,130,246,0.16));
          animation-delay: 1.5s;
        }

        .myp-v2-orb-3 {
          width: 220px;
          height: 220px;
          bottom: 4%;
          right: 15%;
          background: linear-gradient(135deg, rgba(16,185,129,0.12), rgba(37,99,235,0.10));
          animation-delay: 2.2s;
        }

        .myp-v2-toast {
          position: fixed;
          top: 96px;
          right: 24px;
          z-index: 99999;
          min-width: 280px;
          max-width: 390px;
        }

        .myp-v2-hero {
          position: relative;
          overflow: hidden;
          border-radius: 34px;
          background: linear-gradient(135deg, #081226 0%, #102247 42%, #1d4ed8 100%);
          box-shadow:
            0 30px 80px rgba(15,23,42,0.16),
            0 10px 30px rgba(29,78,216,0.10);
        }

        .myp-v2-hero::before {
          content: "";
          position: absolute;
          inset: 0;
          background:
            radial-gradient(circle at 14% 18%, rgba(255,255,255,0.14), transparent 18%),
            radial-gradient(circle at 84% 76%, rgba(255,255,255,0.08), transparent 20%);
          pointer-events: none;
        }

        .myp-v2-hero-inner {
          position: relative;
          z-index: 2;
        }

        .myp-v2-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          border-radius: 999px;
          background: rgba(255,255,255,0.9);
          color: #0f172a;
          font-size: 0.8rem;
          font-weight: 800;
          letter-spacing: 0.04em;
        }

        .myp-v2-hero-title {
          font-size: 2.2rem;
          font-weight: 900;
          line-height: 1.08;
          letter-spacing: -0.04em;
          margin-bottom: 14px;
        }

        .myp-v2-hero-text {
          color: rgba(255,255,255,0.82);
          line-height: 1.85;
          margin-bottom: 0;
          max-width: 720px;
        }

        .myp-v2-stat-card {
          border-radius: 24px;
          padding: 18px;
          height: 100%;
          background: rgba(255,255,255,0.12);
          border: 1px solid rgba(255,255,255,0.16);
          backdrop-filter: blur(10px);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.08);
        }

        .myp-v2-stat-label {
          font-size: 0.8rem;
          color: rgba(255,255,255,0.75);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: 8px;
          font-weight: 700;
        }

        .myp-v2-stat-value {
          font-size: 2rem;
          font-weight: 900;
          color: #fff;
          line-height: 1;
          letter-spacing: -0.04em;
        }

        .myp-v2-empty {
          border-radius: 30px;
          background: rgba(255,255,255,0.82);
          border: 1px solid rgba(255,255,255,0.76);
          backdrop-filter: blur(16px);
          box-shadow:
            0 24px 60px rgba(15,23,42,0.08),
            0 8px 20px rgba(59,130,246,0.05);
        }

        .myp-v2-card {
          position: relative;
          overflow: hidden;
          height: 100%;
          border-radius: 30px;
          background:
            linear-gradient(180deg, rgba(255,255,255,0.92) 0%, rgba(248,250,252,0.96) 100%);
          border: 1px solid rgba(255,255,255,0.76);
          backdrop-filter: blur(16px);
          box-shadow:
            0 26px 70px rgba(15,23,42,0.10),
            0 10px 24px rgba(59,130,246,0.05);
          transition: all 0.35s ease;
        }

        .myp-v2-card:hover {
          transform: translateY(-6px);
          box-shadow:
            0 30px 80px rgba(15,23,42,0.12),
            0 14px 28px rgba(59,130,246,0.08);
        }

        .myp-v2-card::before {
          content: "";
          position: absolute;
          inset: 0;
          background:
            radial-gradient(circle at top right, rgba(255,255,255,0.34), transparent 20%),
            radial-gradient(circle at bottom left, rgba(219,234,254,0.45), transparent 22%);
          pointer-events: none;
        }

        .myp-v2-card-top {
          position: relative;
          z-index: 2;
          padding: 22px 24px 18px;
          background: linear-gradient(135deg, #eff6ff 0%, #f8fafc 100%);
          border-bottom: 1px solid #dbeafe;
        }

        .myp-v2-card-body {
          position: relative;
          z-index: 2;
          padding: 24px;
        }

        .myp-v2-label {
          font-size: 0.8rem;
          color: #64748b;
          margin-bottom: 6px;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          font-weight: 800;
        }

        .myp-v2-title {
          font-size: 1.35rem;
          font-weight: 900;
          color: #0f172a;
          margin-bottom: 0;
          letter-spacing: -0.03em;
        }

        .myp-v2-status-pill {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 10px 16px;
          border-radius: 999px;
          font-size: 0.78rem;
          font-weight: 900;
          letter-spacing: 0.05em;
          border: 1px solid transparent;
          white-space: nowrap;
        }

        .myp-v2-status-paid {
          background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
          color: #065f46;
          border-color: #86efac;
        }

        .myp-v2-status-pending {
          background: linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%);
          color: #9a3412;
          border-color: #fdba74;
        }

        .myp-v2-status-default {
          background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
          color: #334155;
          border-color: #cbd5e1;
        }

        .myp-v2-info-card {
          border-radius: 22px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          padding: 16px;
          height: 100%;
          transition: all 0.3s ease;
        }

        .myp-v2-info-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 14px 28px rgba(15,23,42,0.06);
        }

        .myp-v2-info-title {
          font-size: 0.78rem;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          font-weight: 800;
          margin-bottom: 7px;
        }

        .myp-v2-info-value {
          font-size: 0.98rem;
          color: #0f172a;
          font-weight: 800;
          margin-bottom: 0;
          word-break: break-word;
        }

        .myp-v2-chip-wrap {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 22px;
        }

        .myp-v2-chip {
          padding: 10px 14px;
          border-radius: 999px;
          font-size: 0.8rem;
          font-weight: 800;
          border: 1px solid transparent;
          line-height: 1;
        }

        .myp-v2-chip-success {
          background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
          color: #065f46;
          border-color: #86efac;
        }

        .myp-v2-chip-warning {
          background: linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%);
          color: #9a3412;
          border-color: #fdba74;
        }

        .myp-v2-chip-dark {
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          color: #334155;
          border-color: #cbd5e1;
        }

        .myp-v2-chip-primary {
          background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
          color: #1d4ed8;
          border-color: #93c5fd;
        }

        .myp-v2-btn-main,
        .myp-v2-btn-dark,
        .myp-v2-btn-slip,
        .myp-v2-btn-outline,
        .myp-v2-btn-certificate {
          min-height: 56px;
          border-radius: 18px;
          font-weight: 900;
          border: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          width: 100%;
          transition: all 0.32s ease;
          text-decoration: none;
          box-shadow: none;
        }

        .myp-v2-btn-main {
          color: #fff;
          background: linear-gradient(135deg, #081226 0%, #102247 45%, #1d4ed8 100%);
          box-shadow:
            0 18px 35px rgba(29,78,216,0.20),
            0 8px 20px rgba(8,18,38,0.14);
        }

        .myp-v2-btn-main:hover {
          color: #fff;
          transform: translateY(-2px);
        }

        .myp-v2-btn-dark {
          color: #fff;
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
          box-shadow: 0 18px 35px rgba(15,23,42,0.14);
        }

        .myp-v2-btn-dark:hover {
          color: #fff;
          transform: translateY(-2px);
        }

        .myp-v2-btn-slip {
          color: #fff;
          background: linear-gradient(135deg, #059669 0%, #10b981 100%);
          box-shadow: 0 18px 35px rgba(16,185,129,0.18);
        }

        .myp-v2-btn-slip:hover {
          color: #fff;
          transform: translateY(-2px);
        }

        .myp-v2-btn-outline {
          color: #0f172a;
          background: #ffffff;
          border: 1px solid #dbe3f0;
        }

        .myp-v2-btn-outline:hover {
          color: #0f172a;
          transform: translateY(-2px);
          background: #f8fafc;
        }

        .myp-v2-btn-certificate {
          color: #065f46;
          background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
          border: 1px solid #86efac;
        }

        .myp-v2-btn-certificate:hover {
          color: #065f46;
          transform: translateY(-2px);
        }

        .myp-v2-btn-disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }

        @keyframes mypV2Float {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
          }
          50% {
            transform: translateY(-18px) translateX(10px);
          }
        }

        @media (max-width: 991px) {
          .myp-v2-page {
            padding: 28px 0 70px;
          }

          .myp-v2-hero-title {
            font-size: 1.9rem;
          }
        }

        @media (max-width: 767px) {
          .myp-v2-hero-title {
            font-size: 1.65rem;
          }

          .myp-v2-card-top,
          .myp-v2-card-body {
            padding: 20px;
          }

          .myp-v2-title {
            font-size: 1.15rem;
          }
        }
      `}</style>

      <div className="myp-v2-page">
        <div className="myp-v2-orb myp-v2-orb-1"></div>
        <div className="myp-v2-orb myp-v2-orb-2"></div>
        <div className="myp-v2-orb myp-v2-orb-3"></div>

        <div className="container myp-v2-shell">
          {toast.show && (
            <div className="myp-v2-toast">
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

          <div className="myp-v2-hero mb-4">
            <div className="card-body p-4 p-md-5 text-white myp-v2-hero-inner">
              <div className="row align-items-center g-4">
                <div className="col-lg-8">
                  <div className="myp-v2-badge mb-3">
                    INTERNOVA • PREMIUM ENROLLMENTS DASHBOARD
                  </div>

                  <h1 className="myp-v2-hero-title">My Enrolled Programs</h1>

                  <p className="myp-v2-hero-text">
                    Access your purchased programs, open course content, track
                    progress, attempt mini tests, download offer letters,
                    premium payment slips, and manage certificate workflow from
                    one polished dashboard.
                  </p>
                </div>

                <div className="col-lg-4">
                  <div className="row g-3">
                    <div className="col-4">
                      <div className="myp-v2-stat-card">
                        <div className="myp-v2-stat-label">Enrolled</div>
                        <div className="myp-v2-stat-value">{enrolledCount}</div>
                      </div>
                    </div>

                    <div className="col-4">
                      <div className="myp-v2-stat-card">
                        <div className="myp-v2-stat-label">Passed</div>
                        <div className="myp-v2-stat-value">{passedCount}</div>
                      </div>
                    </div>

                    <div className="col-4">
                      <div className="myp-v2-stat-card">
                        <div className="myp-v2-stat-label">Ready</div>
                        <div className="myp-v2-stat-value">{certificateReadyCount}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {purchases.length === 0 ? (
            <div className="myp-v2-empty">
              <div className="card-body p-5 text-center">
                <div className="mb-3" style={{ fontSize: "3rem" }}>
                  📘
                </div>
                <h4 className="fw-bold text-dark mb-2">No Enrollments Found</h4>
                <p className="text-secondary mb-0">
                  You have not enrolled in any program yet.
                </p>
              </div>
            </div>
          ) : (
            <div className="row g-4">
              {purchases.map((item) => {
                const internshipObj = item.internshipId || null;
                const internshipId = internshipObj?._id || item.internshipId || null;
                const internshipTitle =
                  item.internshipTitle || internshipObj?.title || "N/A";
                const branch = item.branch || internshipObj?.branch || "N/A";
                const category = item.category || internshipObj?.category || "N/A";

                const currentStatus = statusMap[item._id] || {
                  overallProgress: 0,
                  miniTestUnlockProgress: 80,
                  miniTestPassed: false,
                  durationCompleted: false,
                  certificateEligible: false,
                  certificateExists: false,
                };

                const miniTestUnlocked =
                  currentStatus.overallProgress >=
                  currentStatus.miniTestUnlockProgress;

                return (
                  <div className="col-xl-6" key={item._id}>
                    <div className="myp-v2-card">
                      <div className="myp-v2-card-top">
                        <div className="d-flex justify-content-between align-items-start gap-3 flex-wrap">
                          <div>
                            <div className="myp-v2-label">Enrolled Program</div>
                            <h4 className="myp-v2-title">{internshipTitle}</h4>
                          </div>
                          <div>{getStatusBadge(item.paymentStatus)}</div>
                        </div>
                      </div>

                      <div className="myp-v2-card-body">
                        <div className="row g-3 mb-4">
                          <div className="col-sm-6">
                            <div className="myp-v2-info-card">
                              <div className="myp-v2-info-title">Branch</div>
                              <p className="myp-v2-info-value">{branch}</p>
                            </div>
                          </div>

                          <div className="col-sm-6">
                            <div className="myp-v2-info-card">
                              <div className="myp-v2-info-title">Category</div>
                              <p className="myp-v2-info-value">{category}</p>
                            </div>
                          </div>

                          <div className="col-sm-6">
                            <div className="myp-v2-info-card">
                              <div className="myp-v2-info-title">Duration</div>
                              <p className="myp-v2-info-value">
                                {item.durationLabel || "N/A"}
                              </p>
                            </div>
                          </div>

                          <div className="col-sm-6">
                            <div className="myp-v2-info-card">
                              <div className="myp-v2-info-title">Amount Paid</div>
                              <p className="myp-v2-info-value">₹{item.amount}</p>
                            </div>
                          </div>

                          <div className="col-sm-6">
                            <div className="myp-v2-info-card">
                              <div className="myp-v2-info-title">
                                Course Progress
                              </div>
                              <p className="myp-v2-info-value">
                                {currentStatus.overallProgress}%
                              </p>
                            </div>
                          </div>

                          <div className="col-sm-6">
                            <div className="myp-v2-info-card">
                              <div className="myp-v2-info-title">Mini Test</div>
                              <p className="myp-v2-info-value">
                                {currentStatus.miniTestPassed
                                  ? "Passed"
                                  : miniTestUnlocked
                                  ? "Unlocked"
                                  : `Unlock at ${currentStatus.miniTestUnlockProgress}%`}
                              </p>
                            </div>
                          </div>

                          {item.issueDate && (
                            <div className="col-sm-6">
                              <div className="myp-v2-info-card">
                                <div className="myp-v2-info-title">Issue Date</div>
                                <p className="myp-v2-info-value">{item.issueDate}</p>
                              </div>
                            </div>
                          )}

                          {item.referenceId && (
                            <div className="col-sm-6">
                              <div className="myp-v2-info-card">
                                <div className="myp-v2-info-title">
                                  Reference ID
                                </div>
                                <p className="myp-v2-info-value">{item.referenceId}</p>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="myp-v2-chip-wrap">
                          <span
                            className={`myp-v2-chip ${
                              currentStatus.overallProgress >= 80
                                ? "myp-v2-chip-success"
                                : "myp-v2-chip-warning"
                            }`}
                          >
                            Progress {currentStatus.overallProgress}%
                          </span>

                          <span
                            className={`myp-v2-chip ${
                              currentStatus.miniTestPassed
                                ? "myp-v2-chip-success"
                                : miniTestUnlocked
                                ? "myp-v2-chip-primary"
                                : "myp-v2-chip-dark"
                            }`}
                          >
                            {currentStatus.miniTestPassed
                              ? "Mini Test Passed"
                              : miniTestUnlocked
                              ? "Mini Test Unlocked"
                              : "Mini Test Locked"}
                          </span>

                          <span
                            className={`myp-v2-chip ${
                              currentStatus.durationCompleted
                                ? "myp-v2-chip-success"
                                : "myp-v2-chip-dark"
                            }`}
                          >
                            {currentStatus.durationCompleted
                              ? "Duration Completed"
                              : "Duration Pending"}
                          </span>

                          <span
                            className={`myp-v2-chip ${
                              currentStatus.certificateEligible
                                ? "myp-v2-chip-success"
                                : "myp-v2-chip-dark"
                            }`}
                          >
                            {currentStatus.certificateEligible
                              ? currentStatus.certificateExists
                                ? "Certificate Ready"
                                : "Certificate Eligible"
                              : "Certificate Locked"}
                          </span>
                        </div>

                        <div className="d-grid gap-3">
                          <button
                            className="myp-v2-btn-main"
                            onClick={() => {
                              if (internshipId) {
                                navigate(`/course/${internshipId}`);
                              }
                            }}
                          >
                            <span>▶</span>
                            <span>Open Course</span>
                          </button>

                          <div className="row g-3">
                            <div className="col-md-6">
                              <button
                                className="myp-v2-btn-dark"
                                onClick={() => handleDownloadOfferLetter(item)}
                                disabled={downloadingId === item._id}
                              >
                                <span>⬇</span>
                                <span>
                                  {downloadingId === item._id
                                    ? "Downloading..."
                                    : "Offer Letter"}
                                </span>
                              </button>
                            </div>

                            <div className="col-md-6">
                              <button
                                className="myp-v2-btn-slip"
                                onClick={() => handleDownloadPaymentSlip(item)}
                                disabled={downloadingSlipId === item._id}
                              >
                                <span>💳</span>
                                <span>
                                  {downloadingSlipId === item._id
                                    ? "Downloading..."
                                    : "Payment Slip"}
                                </span>
                              </button>
                            </div>

                            <div className="col-md-6">
                              <button
                                className={`${
                                  miniTestUnlocked
                                    ? "myp-v2-btn-outline"
                                    : "myp-v2-btn-outline myp-v2-btn-disabled"
                                }`}
                                disabled={!miniTestUnlocked}
                                onClick={() => {
                                  if (internshipId && miniTestUnlocked) {
                                    navigate(`/quiz/${internshipId}`);
                                  }
                                }}
                              >
                                <span>📝</span>
                                <span>
                                  {currentStatus.miniTestPassed
                                    ? "View Passed Mini Test"
                                    : miniTestUnlocked
                                    ? "Open Mini Test"
                                    : `Unlock at ${currentStatus.miniTestUnlockProgress}%`}
                                </span>
                              </button>
                            </div>

                            <div className="col-md-6">
                              <button
                                className={`${
                                  currentStatus.certificateEligible
                                    ? "myp-v2-btn-certificate"
                                    : "myp-v2-btn-outline"
                                }`}
                                onClick={() => {
                                  if (internshipId) {
                                    navigate(`/certificate/${internshipId}`);
                                  }
                                }}
                              >
                                <span>🏆</span>
                                <span>
                                  {currentStatus.certificateEligible
                                    ? currentStatus.certificateExists
                                      ? "View Certificate"
                                      : "Open Certificate"
                                    : "Certificate Dashboard"}
                                </span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default MyPurchases;