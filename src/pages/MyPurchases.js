import React, { useEffect, useMemo, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api";

function MyPurchases() {
  const [purchases, setPurchases] = useState([]);
  const [statusMap, setStatusMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState(null);
  const [toast, setToast] = useState({
    show: false,
    type: "success",
    message: "",
  });

  const navigate = useNavigate();

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

  const fetchPurchases = async () => {
    try {
      setLoading(true);

      const { data } = await API.get("/purchases/my-purchases");
      const purchaseList = data.purchases || [];

      setPurchases(purchaseList);
      await fetchPurchaseStatuses(purchaseList);
    } catch (error) {
      console.error("Failed to fetch purchases:", error);
      showToast("error", "Failed to fetch purchases");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchases();
  }, []);

  const handleDownload = async (item) => {
    try {
      setDownloadingId(item._id);

      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_BASE_URL}/purchases/offer-letter/${item._id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to download offer letter");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const safeTitle = (
        item.internshipTitle ||
        item.internshipId?.title ||
        "offer_letter"
      )
        .replace(/[^a-z0-9]/gi, "_")
        .replace(/_+/g, "_")
        .replace(/^_|_$/g, "");

      const a = document.createElement("a");
      a.href = url;
      a.download = `${safeTitle}_offer_letter.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();

      showToast("success", "Offer letter downloaded successfully");
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Offer letter download error:", error);
      showToast("error", "Offer letter download failed");
    } finally {
      setDownloadingId(null);
    }
  };

  const getStatusBadge = (status) => {
    const normalized = String(status || "").toLowerCase();

    if (normalized === "paid") {
      return (
        <span className="badge bg-success-subtle text-success border px-3 py-2 rounded-pill">
          PAID
        </span>
      );
    }

    if (normalized === "pending") {
      return (
        <span className="badge bg-warning-subtle text-warning border px-3 py-2 rounded-pill">
          PENDING
        </span>
      );
    }

    return (
      <span className="badge bg-secondary-subtle text-dark border px-3 py-2 rounded-pill">
        {status || "UNKNOWN"}
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
            "linear-gradient(135deg, #f8fafc 0%, #eef2ff 45%, #f8fafc 100%)",
        }}
      >
        <div className="text-center">
          <div className="spinner-border text-dark mb-3" role="status"></div>
          <div className="fw-semibold text-dark">Loading enrollments...</div>
        </div>
      </div>
    );
  }

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
                  INTERNOVA • ENROLLMENTS DASHBOARD
                </div>

                <h1 className="fw-bold mb-3" style={{ fontSize: "2rem" }}>
                  My Enrolled Programs
                </h1>

                <p className="mb-0 text-light" style={{ maxWidth: "720px" }}>
                  Access your purchased programs, open course content, track
                  progress, attempt mini tests, download offer letters, and
                  generate final certificates from one place.
                </p>
              </div>

              <div className="col-lg-4">
                <div className="row g-3">
                  <div className="col-4">
                    <div
                      className="rounded-4 p-3 h-100"
                      style={{
                        background: "rgba(255,255,255,0.12)",
                        border: "1px solid rgba(255,255,255,0.16)",
                        backdropFilter: "blur(10px)",
                      }}
                    >
                      <div className="small text-light mb-2">Enrolled</div>
                      <div className="fw-bold fs-3">{enrolledCount}</div>
                    </div>
                  </div>

                  <div className="col-4">
                    <div
                      className="rounded-4 p-3 h-100"
                      style={{
                        background: "rgba(255,255,255,0.12)",
                        border: "1px solid rgba(255,255,255,0.16)",
                        backdropFilter: "blur(10px)",
                      }}
                    >
                      <div className="small text-light mb-2">Tests Passed</div>
                      <div className="fw-bold fs-3">{passedCount}</div>
                    </div>
                  </div>

                  <div className="col-4">
                    <div
                      className="rounded-4 p-3 h-100"
                      style={{
                        background: "rgba(255,255,255,0.12)",
                        border: "1px solid rgba(255,255,255,0.16)",
                        backdropFilter: "blur(10px)",
                      }}
                    >
                      <div className="small text-light mb-2">Cert Ready</div>
                      <div className="fw-bold fs-3">{certificateReadyCount}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {purchases.length === 0 ? (
          <div className="card border-0 shadow-sm rounded-5">
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
                <div className="col-lg-6" key={item._id}>
                  <div
                    className="card border-0 shadow-lg rounded-5 h-100 overflow-hidden"
                    style={{
                      background:
                        "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
                    }}
                  >
                    <div
                      className="px-4 py-3"
                      style={{
                        background:
                          "linear-gradient(135deg, #eff6ff 0%, #f8fafc 100%)",
                        borderBottom: "1px solid #dbeafe",
                      }}
                    >
                      <div className="d-flex justify-content-between align-items-start gap-3 flex-wrap">
                        <div>
                          <div className="small text-secondary mb-1">
                            Enrolled Program
                          </div>
                          <h4 className="fw-bold text-dark mb-0">
                            {internshipTitle}
                          </h4>
                        </div>
                        <div>{getStatusBadge(item.paymentStatus)}</div>
                      </div>
                    </div>

                    <div className="card-body p-4">
                      <div className="row g-3 mb-4">
                        <div className="col-sm-6">
                          <div
                            className="rounded-4 p-3 h-100"
                            style={{
                              background: "#f8fafc",
                              border: "1px solid #e2e8f0",
                            }}
                          >
                            <div className="small text-secondary mb-1">Branch</div>
                            <div className="fw-semibold text-dark">{branch}</div>
                          </div>
                        </div>

                        <div className="col-sm-6">
                          <div
                            className="rounded-4 p-3 h-100"
                            style={{
                              background: "#f8fafc",
                              border: "1px solid #e2e8f0",
                            }}
                          >
                            <div className="small text-secondary mb-1">
                              Category
                            </div>
                            <div className="fw-semibold text-dark">{category}</div>
                          </div>
                        </div>

                        <div className="col-sm-6">
                          <div
                            className="rounded-4 p-3 h-100"
                            style={{
                              background: "#f8fafc",
                              border: "1px solid #e2e8f0",
                            }}
                          >
                            <div className="small text-secondary mb-1">
                              Duration
                            </div>
                            <div className="fw-semibold text-dark">
                              {item.durationLabel || "N/A"}
                            </div>
                          </div>
                        </div>

                        <div className="col-sm-6">
                          <div
                            className="rounded-4 p-3 h-100"
                            style={{
                              background: "#f8fafc",
                              border: "1px solid #e2e8f0",
                            }}
                          >
                            <div className="small text-secondary mb-1">
                              Amount Paid
                            </div>
                            <div className="fw-semibold text-dark">
                              ₹{item.amount}
                            </div>
                          </div>
                        </div>

                        <div className="col-sm-6">
                          <div
                            className="rounded-4 p-3 h-100"
                            style={{
                              background: "#f8fafc",
                              border: "1px solid #e2e8f0",
                            }}
                          >
                            <div className="small text-secondary mb-1">
                              Course Progress
                            </div>
                            <div className="fw-semibold text-dark">
                              {currentStatus.overallProgress}%
                            </div>
                          </div>
                        </div>

                        <div className="col-sm-6">
                          <div
                            className="rounded-4 p-3 h-100"
                            style={{
                              background: "#f8fafc",
                              border: "1px solid #e2e8f0",
                            }}
                          >
                            <div className="small text-secondary mb-1">
                              Mini Test
                            </div>
                            <div className="fw-semibold text-dark">
                              {currentStatus.miniTestPassed
                                ? "Passed"
                                : miniTestUnlocked
                                ? "Unlocked"
                                : `Unlock at ${currentStatus.miniTestUnlockProgress}%`}
                            </div>
                          </div>
                        </div>

                        {item.issueDate && (
                          <div className="col-sm-6">
                            <div
                              className="rounded-4 p-3 h-100"
                              style={{
                                background: "#f8fafc",
                                border: "1px solid #e2e8f0",
                              }}
                            >
                              <div className="small text-secondary mb-1">
                                Issue Date
                              </div>
                              <div className="fw-semibold text-dark">
                                {item.issueDate}
                              </div>
                            </div>
                          </div>
                        )}

                        {item.referenceId && (
                          <div className="col-sm-6">
                            <div
                              className="rounded-4 p-3 h-100"
                              style={{
                                background: "#f8fafc",
                                border: "1px solid #e2e8f0",
                              }}
                            >
                              <div className="small text-secondary mb-1">
                                Reference ID
                              </div>
                              <div className="fw-semibold text-dark">
                                {item.referenceId}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="d-flex flex-wrap gap-2 mb-4">
                        <span
                          className={`badge rounded-pill px-3 py-2 ${
                            currentStatus.overallProgress >= 80
                              ? "bg-success-subtle text-success border"
                              : "bg-warning-subtle text-warning border"
                          }`}
                        >
                          Progress {currentStatus.overallProgress}%
                        </span>

                        <span
                          className={`badge rounded-pill px-3 py-2 ${
                            currentStatus.miniTestPassed
                              ? "bg-success-subtle text-success border"
                              : miniTestUnlocked
                              ? "bg-primary-subtle text-primary border"
                              : "bg-secondary-subtle text-dark border"
                          }`}
                        >
                          {currentStatus.miniTestPassed
                            ? "Mini Test Passed"
                            : miniTestUnlocked
                            ? "Mini Test Unlocked"
                            : "Mini Test Locked"}
                        </span>

                        <span
                          className={`badge rounded-pill px-3 py-2 ${
                            currentStatus.durationCompleted
                              ? "bg-success-subtle text-success border"
                              : "bg-secondary-subtle text-dark border"
                          }`}
                        >
                          {currentStatus.durationCompleted
                            ? "Duration Completed"
                            : "Duration Pending"}
                        </span>

                        <span
                          className={`badge rounded-pill px-3 py-2 ${
                            currentStatus.certificateEligible
                              ? "bg-success-subtle text-success border"
                              : "bg-secondary-subtle text-dark border"
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
                          className="btn btn-primary btn-lg rounded-4 fw-semibold"
                          onClick={() => {
                            if (internshipId) {
                              navigate(`/course/${internshipId}`);
                            }
                          }}
                        >
                          Open Course
                        </button>

                        <div className="row g-3">
                          <div className="col-md-6">
                            <button
                              className="btn btn-dark w-100 rounded-4 fw-semibold"
                              onClick={() => handleDownload(item)}
                              disabled={downloadingId === item._id}
                            >
                              {downloadingId === item._id
                                ? "Downloading..."
                                : "Download Offer Letter"}
                            </button>
                          </div>

                          <div className="col-md-6">
                            <button
                              className={`btn w-100 rounded-4 fw-semibold ${
                                miniTestUnlocked
                                  ? "btn-outline-dark"
                                  : "btn-outline-secondary"
                              }`}
                              disabled={!miniTestUnlocked}
                              onClick={() => {
                                if (internshipId && miniTestUnlocked) {
                                  navigate(`/quiz/${internshipId}`);
                                }
                              }}
                            >
                              {currentStatus.miniTestPassed
                                ? "View Passed Mini Test"
                                : miniTestUnlocked
                                ? "Open Mini Test"
                                : `Unlock at ${currentStatus.miniTestUnlockProgress}%`}
                            </button>
                          </div>

                          <div className="col-12">
                            <button
                              className={`btn w-100 rounded-4 fw-semibold ${
                                currentStatus.certificateEligible
                                  ? "btn-outline-success"
                                  : "btn-outline-secondary"
                              }`}
                              onClick={() => {
                                if (internshipId) {
                                  navigate(`/certificate/${internshipId}`);
                                }
                              }}
                            >
                              {currentStatus.certificateEligible
                                ? currentStatus.certificateExists
                                  ? "Download / View Certificate"
                                  : "Open Certificate Dashboard"
                                : "Certificate Dashboard"}
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
  );
}

export default MyPurchases;