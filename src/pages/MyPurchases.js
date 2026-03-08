import React, { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api";


function MyPurchases() {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState(null);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const fetchPurchases = async () => {
    try {
      const { data } = await API.get("/purchases/my-purchases", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setPurchases(data.purchases || []);
    } catch (error) {
      console.error("Failed to fetch purchases:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchases();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDownload = async (item) => {
    try {
      setDownloadingId(item._id);

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

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      alert("Offer letter download failed");
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
          <div className="fw-semibold text-dark">Loading purchases...</div>
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
                  INTERNOVA • PURCHASE DASHBOARD
                </div>

                <h1 className="fw-bold mb-3" style={{ fontSize: "2rem" }}>
                  My Purchased Internships
                </h1>

                <p className="mb-0 text-light" style={{ maxWidth: "720px" }}>
                  Access your purchased internships, open course content,
                  download offer letters, attempt mini tests, and generate your
                  final certificates from one place.
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
                  <div className="small text-light mb-2">Total Purchases</div>
                  <div className="fw-bold fs-2">{purchases.length}</div>
                  <div className="small text-light mt-2">
                    Manage all paid internship enrollments and related documents.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* EMPTY STATE */}
        {purchases.length === 0 ? (
          <div className="card border-0 shadow-sm rounded-5">
            <div className="card-body p-5 text-center">
              <div className="mb-3" style={{ fontSize: "3rem" }}>
                📘
              </div>
              <h4 className="fw-bold text-dark mb-2">No Purchases Found</h4>
              <p className="text-secondary mb-0">
                You have not purchased any internship yet.
              </p>
            </div>
          </div>
        ) : (
          <div className="row g-4">
            {purchases.map((item) => {
              const internshipTitle =
                item.internshipTitle || item.internshipId?.title || "N/A";
              const branch = item.branch || item.internshipId?.branch || "N/A";
              const category =
                item.category || item.internshipId?.category || "N/A";
              const internshipId = item.internshipId?._id || item.internshipId;

              return (
                <div className="col-lg-6" key={item._id}>
                  <div
                    className="card border-0 shadow-lg rounded-5 h-100 overflow-hidden"
                    style={{
                      background: "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
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
                            Internship Program
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
                            <div className="small text-secondary mb-1">
                              Branch
                            </div>
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
                            <div className="fw-semibold text-dark">
                              {category}
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

                      <div className="d-grid gap-3">
                        <button
                          className="btn btn-primary btn-lg rounded-4 fw-semibold"
                          onClick={() => navigate(`/course/${internshipId}`)}
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
                              className="btn btn-outline-dark w-100 rounded-4 fw-semibold"
                              onClick={() => navigate(`/quiz/${internshipId}`)}
                            >
                              Mini Test
                            </button>
                          </div>

                          <div className="col-12">
                            <button
                              className="btn btn-outline-success w-100 rounded-4 fw-semibold"
                              onClick={() => navigate(`/certificate/${internshipId}`)}
                            >
                              Certificate Dashboard
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