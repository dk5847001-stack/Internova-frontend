import React, { useEffect, useState } from "react";
import API from "../services/api";
import { useParams, useNavigate } from "react-router-dom";

function CourseProgress() {
  const { internshipId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [internship, setInternship] = useState(null);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingModule, setUpdatingModule] = useState(null);

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

  const fetchCourse = async () => {
    try {
      const { data } = await API.get(`/progress/${internshipId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setInternship(data.internship);
      setProgress(data.progress);
    } catch (error) {
      console.error("Failed to fetch course progress:", error);
      showToast(
        "error",
        error.response?.data?.message || "Failed to load course"
      );
      navigate("/my-purchases");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourse();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [internshipId]);

  const handleToggleModule = async (moduleIndex) => {
    try {
      setUpdatingModule(moduleIndex);

      const { data } = await API.post(
        `/progress/${internshipId}/toggle-module`,
        { moduleIndex },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setProgress(data.progress);
      showToast("success", "Module progress updated successfully");
    } catch (error) {
      console.error("Toggle module failed:", error);
      showToast(
        "error",
        error.response?.data?.message || "Failed to update progress"
      );
    } finally {
      setUpdatingModule(null);
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
          <div className="fw-semibold text-dark">Loading course...</div>
        </div>
      </div>
    );
  }

  if (!internship || !progress) {
    return (
      <div
        className="min-vh-100 d-flex align-items-center justify-content-center"
        style={{
          background:
            "linear-gradient(135deg, #f8fafc 0%, #eef2ff 45%, #f8fafc 100%)",
        }}
      >
        <div className="text-center">
          <div className="fs-1 mb-3">📘</div>
          <h4 className="fw-bold text-dark">Course not found</h4>
          <p className="text-secondary mb-0">
            We could not find this course right now.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        .course-progress-page {
          min-height: 100vh;
          background:
            radial-gradient(circle at top left, rgba(59,130,246,0.18), transparent 28%),
            radial-gradient(circle at bottom right, rgba(99,102,241,0.16), transparent 32%),
            linear-gradient(135deg, #f8fafc 0%, #eef2ff 48%, #f8fafc 100%);
          position: relative;
          overflow: hidden;
        }

        .course-progress-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(10px);
          opacity: 0.55;
          animation: courseFloat 9s ease-in-out infinite;
          -webkit-animation: courseFloat 9s ease-in-out infinite;
          pointer-events: none;
        }

        .course-progress-orb-1 {
          width: 220px;
          height: 220px;
          top: 70px;
          left: -60px;
          background: linear-gradient(135deg, rgba(37,99,235,0.25), rgba(14,165,233,0.18));
        }

        .course-progress-orb-2 {
          width: 280px;
          height: 280px;
          right: -80px;
          bottom: 70px;
          background: linear-gradient(135deg, rgba(99,102,241,0.18), rgba(59,130,246,0.22));
          animation-delay: 1.2s;
          -webkit-animation-delay: 1.2s;
        }

        .course-progress-shell {
          position: relative;
          z-index: 2;
        }

        .course-back-btn {
          border-radius: 999px;
          padding: 10px 18px;
          font-weight: 700;
          -webkit-transition: all 0.3s ease;
          transition: all 0.3s ease;
        }

        .course-back-btn:hover {
          transform: translateY(-2px);
          -webkit-transform: translateY(-2px);
        }

        .course-hero-card {
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

        .course-hero-card::before {
          content: "";
          position: absolute;
          inset: 0;
          background:
            radial-gradient(circle at 18% 22%, rgba(255,255,255,0.12), transparent 22%),
            radial-gradient(circle at 82% 74%, rgba(255,255,255,0.08), transparent 18%);
          pointer-events: none;
        }

        .course-chip {
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

        .course-hero-title {
          font-size: 2.15rem;
          font-weight: 800;
          letter-spacing: -0.03em;
          margin-bottom: 10px;
        }

        .course-hero-text {
          color: rgba(255,255,255,0.82);
          line-height: 1.8;
          margin-bottom: 0;
          max-width: 720px;
        }

        .course-stat-card {
          background: rgba(255,255,255,0.12);
          border: 1px solid rgba(255,255,255,0.16);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border-radius: 22px;
          padding: 18px;
          height: 100%;
          -webkit-transition: all 0.3s ease;
          transition: all 0.3s ease;
        }

        .course-stat-card:hover {
          transform: translateY(-4px);
          -webkit-transform: translateY(-4px);
        }

        .course-stat-label {
          font-size: 0.82rem;
          color: rgba(255,255,255,0.75);
          margin-bottom: 6px;
        }

        .course-stat-value {
          font-size: 1.6rem;
          font-weight: 800;
          color: #fff;
          margin-bottom: 0;
        }

        .course-glass-card {
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

        .course-section-title {
          font-size: 1.35rem;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 12px;
        }

        .course-section-text {
          color: #64748b;
          line-height: 1.8;
        }

        .course-meta-card {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 24px;
          padding: 18px;
          height: 100%;
          -webkit-transition: all 0.3s ease;
          transition: all 0.3s ease;
        }

        .course-meta-card:hover {
          transform: translateY(-3px);
          -webkit-transform: translateY(-3px);
          box-shadow: 0 12px 30px rgba(15, 23, 42, 0.06);
          -webkit-box-shadow: 0 12px 30px rgba(15, 23, 42, 0.06);
        }

        .course-meta-label {
          font-size: 0.82rem;
          color: #64748b;
          margin-bottom: 6px;
        }

        .course-meta-value {
          font-size: 1rem;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 0;
        }

        .course-progress-wrap {
          margin-top: 20px;
          margin-bottom: 22px;
        }

        .course-progress-title {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
          font-weight: 800;
          color: #0f172a;
        }

        .course-progress-bar-outer {
          width: 100%;
          height: 22px;
          border-radius: 999px;
          background: #e2e8f0;
          overflow: hidden;
          box-shadow: inset 0 2px 4px rgba(15,23,42,0.06);
          -webkit-box-shadow: inset 0 2px 4px rgba(15,23,42,0.06);
        }

        .course-progress-bar-inner {
          height: 100%;
          border-radius: 999px;
          background: linear-gradient(90deg, #1d4ed8 0%, #2563eb 45%, #10b981 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-size: 0.8rem;
          font-weight: 800;
          -webkit-transition: width 0.45s ease;
          transition: width 0.45s ease;
        }

        .course-status-card {
          border-radius: 22px;
          padding: 18px 20px;
          font-weight: 600;
          margin-bottom: 22px;
        }

        .course-status-success {
          background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
          border: 1px solid #86efac;
          color: #065f46;
        }

        .course-status-warning {
          background: linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%);
          border: 1px solid #fdba74;
          color: #9a3412;
        }

        .course-action-btn {
          min-height: 56px;
          border-radius: 18px;
          font-weight: 800;
          -webkit-transition: all 0.32s ease;
          transition: all 0.32s ease;
          box-shadow: 0 10px 25px rgba(15, 23, 42, 0.05);
          -webkit-box-shadow: 0 10px 25px rgba(15, 23, 42, 0.05);
        }

        .course-action-btn:hover {
          transform: translateY(-2px);
          -webkit-transform: translateY(-2px);
        }

        .course-module-card {
          border-radius: 28px;
          border: 1px solid rgba(255,255,255,0.45);
          background: rgba(255,255,255,0.78);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          box-shadow:
            0 22px 65px rgba(15, 23, 42, 0.10),
            0 8px 20px rgba(59,130,246,0.05);
          -webkit-box-shadow:
            0 22px 65px rgba(15, 23, 42, 0.10),
            0 8px 20px rgba(59,130,246,0.05);
          padding: 22px;
          margin-bottom: 18px;
          -webkit-transition: all 0.35s ease;
          transition: all 0.35s ease;
        }

        .course-module-card:hover {
          transform: translateY(-4px);
          -webkit-transform: translateY(-4px);
          box-shadow:
            0 28px 75px rgba(15, 23, 42, 0.13),
            0 10px 24px rgba(59,130,246,0.07);
          -webkit-box-shadow:
            0 28px 75px rgba(15, 23, 42, 0.13),
            0 10px 24px rgba(59,130,246,0.07);
        }

        .course-module-title {
          font-size: 1.08rem;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 8px;
          line-height: 1.7;
        }

        .course-module-text {
          color: #64748b;
          line-height: 1.8;
          margin-bottom: 0;
        }

        .course-module-btn {
          min-width: 150px;
          min-height: 48px;
          border-radius: 16px;
          font-weight: 800;
          -webkit-transition: all 0.3s ease;
          transition: all 0.3s ease;
        }

        .course-module-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          -webkit-transform: translateY(-2px);
        }

        .course-empty-card {
          border-radius: 24px;
          padding: 22px;
          background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
          border: 1px solid #93c5fd;
          color: #1e3a8a;
        }

        @keyframes courseFloat {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
          }
          50% {
            transform: translateY(-18px) translateX(10px);
          }
        }

        @-webkit-keyframes courseFloat {
          0%, 100% {
            -webkit-transform: translateY(0px) translateX(0px);
          }
          50% {
            -webkit-transform: translateY(-18px) translateX(10px);
          }
        }

        @media (max-width: 991px) {
          .course-hero-title {
            font-size: 1.9rem;
          }
        }

        @media (max-width: 767px) {
          .course-progress-page {
            padding: 22px 0;
          }

          .course-hero-title {
            font-size: 1.7rem;
          }

          .course-module-card {
            padding: 18px;
          }
        }
      `}</style>

      <div className="course-progress-page py-4 py-lg-5">
        <div className="course-progress-orb course-progress-orb-1"></div>
        <div className="course-progress-orb course-progress-orb-2"></div>

        <div className="container course-progress-shell">
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
            className="btn btn-outline-dark course-back-btn mb-4"
            onClick={() => navigate(-1)}
          >
            ← Back
          </button>

          {/* HERO */}
          <div className="card course-hero-card border-0 rounded-5 mb-4">
            <div className="card-body p-4 p-md-5">
              <div className="row g-4 align-items-center">
                <div className="col-lg-8">
                  <div className="course-chip">Internova Learning Workspace</div>
                  <h1 className="course-hero-title">{internship.title}</h1>
                  <p className="course-hero-text">
                    Track your course progress, complete all learning modules,
                    unlock your mini test, and move step-by-step toward final
                    certificate eligibility.
                  </p>
                </div>

                <div className="col-lg-4">
                  <div className="row g-3">
                    <div className="col-6">
                      <div className="course-stat-card">
                        <div className="course-stat-label">Progress</div>
                        <h4 className="course-stat-value">
                          {progress.progressPercent}%
                        </h4>
                      </div>
                    </div>

                    <div className="col-6">
                      <div className="course-stat-card">
                        <div className="course-stat-label">Modules</div>
                        <h4 className="course-stat-value">
                          {internship.modules?.length || 0}
                        </h4>
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="course-stat-card">
                        <div className="course-stat-label">Eligibility</div>
                        <h4 className="course-stat-value">
                          {progress.certificateEligible ? "Unlocked" : "Pending"}
                        </h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* OVERVIEW */}
          <div className="card course-glass-card border-0 rounded-5 mb-4">
            <div className="card-body p-4 p-md-5">
              <div className="row g-4">
                <div className="col-md-4">
                  <div className="course-meta-card">
                    <div className="course-meta-label">Branch</div>
                    <p className="course-meta-value">{internship.branch}</p>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="course-meta-card">
                    <div className="course-meta-label">Category</div>
                    <p className="course-meta-value">{internship.category}</p>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="course-meta-card">
                    <div className="course-meta-label">Completed Modules</div>
                    <p className="course-meta-value">
                      {progress.completedModules?.length || 0}/
                      {internship.modules?.length || 0}
                    </p>
                  </div>
                </div>
              </div>

              <div className="course-progress-wrap">
                <div className="course-progress-title">
                  <span>Learning Progress</span>
                  <span>{progress.progressPercent}%</span>
                </div>

                <div className="course-progress-bar-outer">
                  <div
                    className="course-progress-bar-inner"
                    style={{ width: `${progress.progressPercent}%` }}
                  >
                    {progress.progressPercent}%
                  </div>
                </div>
              </div>

              {progress.certificateEligible ? (
                <div className="course-status-card course-status-success">
                  Great! You have reached 80% progress and are now eligible for
                  the next step.
                </div>
              ) : (
                <div className="course-status-card course-status-warning">
                  Complete at least 80% of modules to become certificate-eligible.
                </div>
              )}

              <div className="d-flex gap-3 flex-wrap">
                <button
                  className="btn btn-dark course-action-btn"
                  onClick={() => navigate(`/quiz/${internshipId}`)}
                >
                  Open Mini Test
                </button>

                <button
                  className="btn btn-success course-action-btn"
                  onClick={() => navigate(`/certificate/${internshipId}`)}
                >
                  Final Certificate
                </button>
              </div>
            </div>
          </div>

          {/* MODULES */}
          <div className="card course-glass-card border-0 rounded-5">
            <div className="card-body p-4 p-md-5">
              <h3 className="course-section-title">Course Modules</h3>
              <p className="course-section-text mb-4">
                Complete each module to increase your course progress and unlock
                the next stage of your internship journey.
              </p>

              {internship.modules?.length ? (
                internship.modules.map((module, index) => {
                  const isCompleted = progress.completedModules.includes(index);

                  return (
                    <div
                      key={index}
                      className="course-module-card d-flex justify-content-between align-items-start gap-3 flex-wrap"
                    >
                      <div className="flex-grow-1">
                        <h5 className="course-module-title">
                          Module {index + 1}: {module.title}
                        </h5>
                        <p className="course-module-text">
                          {module.description}
                        </p>
                      </div>

                      <button
                        className={`btn course-module-btn ${isCompleted ? "btn-success" : "btn-outline-success"
                          }`}
                        onClick={() => handleToggleModule(index)}
                        disabled={updatingModule === index}
                      >
                        {updatingModule === index
                          ? "Updating..."
                          : isCompleted
                            ? "Completed"
                            : "Mark Complete"}
                      </button>
                    </div>
                  );
                })
              ) : (
                <div className="course-empty-card">
                  <h5 className="fw-bold mb-2">No Modules Available</h5>
                  <p className="mb-0">
                    No modules are available for this internship yet. Please
                    check back later.
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

export default CourseProgress;