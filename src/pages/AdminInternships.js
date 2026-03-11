import React, { useEffect, useState } from "react";
import API from "../services/api";

const initialForm = {
  title: "",
  branch: "",
  category: "",
  description: "",
  thumbnail: "",
  durations: [
    { label: "1 Month", price: 1 },
    { label: "3 Months", price: 990 },
    { label: "6 Months", price: 1490 },
  ],
  modules: [{ title: "", description: "" }],
  quiz: [
    {
      question: "",
      options: ["", "", "", ""],
      correctAnswer: 0,
    },
  ],
};

function AdminInternships() {
  const [internships, setInternships] = useState([]);
  const [formData, setFormData] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

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

  const fetchInternships = async () => {
    try {
      const { data } = await API.get("/internships");
      setInternships(data.internships || []);
    } catch (error) {
      console.error("Failed to fetch internships:", error);
      showToast("error", "Failed to fetch internships");
    }
  };

  useEffect(() => {
    fetchInternships();
  }, []);

  const handleBasicChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleDurationChange = (index, field, value) => {
    const updated = [...formData.durations];
    updated[index][field] = field === "price" ? Number(value) : value;
    setFormData((prev) => ({ ...prev, durations: updated }));
  };

  const handleModuleChange = (index, field, value) => {
    const updated = [...formData.modules];
    updated[index][field] = value;
    setFormData((prev) => ({ ...prev, modules: updated }));
  };

  const handleQuizChange = (qIndex, field, value) => {
    const updated = [...formData.quiz];
    updated[qIndex][field] =
      field === "correctAnswer" ? Number(value) : value;
    setFormData((prev) => ({ ...prev, quiz: updated }));
  };

  const handleQuizOptionChange = (qIndex, oIndex, value) => {
    const updated = [...formData.quiz];
    updated[qIndex].options[oIndex] = value;
    setFormData((prev) => ({ ...prev, quiz: updated }));
  };

  const addModule = () => {
    setFormData((prev) => ({
      ...prev,
      modules: [...prev.modules, { title: "", description: "" }],
    }));
  };

  const addQuizQuestion = () => {
    setFormData((prev) => ({
      ...prev,
      quiz: [
        ...prev.quiz,
        { question: "", options: ["", "", "", ""], correctAnswer: 0 },
      ],
    }));
  };

  const resetForm = () => {
    setFormData(initialForm);
    setEditingId(null);
    showToast("success", "Form reset successfully");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const payload = {
  ...formData,
  durations: formData.durations
    .filter((d) => d.label.trim() && Number(d.price) >= 0)
    .map((d) => ({
      label: d.label.trim(),
      price: Number(d.price),
    })),

  modules: formData.modules
    .filter((m) => m.title.trim())
    .map((m) => ({
      title: m.title.trim(),
      description: m.description.trim(),
    })),

  quiz: formData.quiz
    .filter(
      (q) =>
        q.question.trim() &&
        Array.isArray(q.options) &&
        q.options.length === 4 &&
        q.options.every((opt) => opt.trim() !== "")
    )
    .map((q) => ({
      question: q.question.trim(),
      options: q.options.map((opt) => opt.trim()),
      correctAnswer: Number(q.correctAnswer),
    })),
};

      if (editingId) {
        await API.put(`/internships/${editingId}`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        showToast("success", "Internship updated successfully");
      } else {
        await API.post("/internships", payload, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        showToast("success", "Internship created successfully");
      }

      resetForm();
      fetchInternships();
    } catch (error) {
      console.error("Save internship failed:", error);
      showToast(
        "error",
        error.response?.data?.message || "Failed to save internship"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (id) => {
    try {
      const { data } = await API.get(`/internships/${id}`);
      const internship = data.internship;

      setFormData({
        title: internship.title || "",
        branch: internship.branch || "",
        category: internship.category || "",
        description: internship.description || "",
        thumbnail: internship.thumbnail || "",
        durations: internship.durations?.length
          ? internship.durations
          : initialForm.durations,
        modules: internship.modules?.length
          ? internship.modules
          : [{ title: "", description: "" }],
        quiz: internship.quiz?.length
          ? internship.quiz
          : [{ question: "", options: ["", "", "", ""], correctAnswer: 0 }],
      });

      setEditingId(id);
      window.scrollTo({ top: 0, behavior: "smooth" });
      showToast("success", "Internship loaded for editing");
    } catch (error) {
      console.error("Failed to load internship for edit:", error);
      showToast("error", "Failed to load internship for editing");
    }
  };

  const handleDelete = async (id) => {
    const ok = window.confirm("Are you sure you want to delete this internship?");
    if (!ok) return;

    try {
      await API.delete(`/internships/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      showToast("success", "Internship deleted successfully");
      fetchInternships();
    } catch (error) {
      console.error("Delete internship failed:", error);
      showToast(
        "error",
        error.response?.data?.message || "Failed to delete internship"
      );
    }
  };

  return (
    <>
      <style>{`
        .admin-internships-page {
          min-height: 100vh;
          background:
            radial-gradient(circle at top left, rgba(59,130,246,0.18), transparent 28%),
            radial-gradient(circle at bottom right, rgba(99,102,241,0.16), transparent 32%),
            linear-gradient(135deg, #f8fafc 0%, #eef2ff 48%, #f8fafc 100%);
          position: relative;
          overflow: hidden;
        }

        .admin-internships-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(10px);
          opacity: 0.55;
          animation: adminFloat 9s ease-in-out infinite;
          -webkit-animation: adminFloat 9s ease-in-out infinite;
          pointer-events: none;
        }

        .admin-internships-orb-1 {
          width: 220px;
          height: 220px;
          top: 70px;
          left: -60px;
          background: linear-gradient(135deg, rgba(37,99,235,0.25), rgba(14,165,233,0.18));
        }

        .admin-internships-orb-2 {
          width: 280px;
          height: 280px;
          right: -80px;
          bottom: 70px;
          background: linear-gradient(135deg, rgba(99,102,241,0.18), rgba(59,130,246,0.22));
          animation-delay: 1.2s;
          -webkit-animation-delay: 1.2s;
        }

        .admin-internships-shell {
          position: relative;
          z-index: 2;
        }

        .admin-hero {
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

        .admin-hero::before {
          content: "";
          position: absolute;
          inset: 0;
          background:
            radial-gradient(circle at 18% 22%, rgba(255,255,255,0.12), transparent 22%),
            radial-gradient(circle at 82% 74%, rgba(255,255,255,0.08), transparent 18%);
          pointer-events: none;
        }

        .admin-chip {
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

        .admin-hero-title {
          font-size: 2.2rem;
          font-weight: 800;
          letter-spacing: -0.03em;
          margin-bottom: 10px;
        }

        .admin-hero-text {
          color: rgba(255,255,255,0.82);
          line-height: 1.8;
          margin-bottom: 0;
          max-width: 760px;
        }

        .admin-stat-card {
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

        .admin-stat-card:hover {
          transform: translateY(-4px);
          -webkit-transform: translateY(-4px);
        }

        .admin-stat-label {
          font-size: 0.82rem;
          color: rgba(255,255,255,0.75);
          margin-bottom: 6px;
        }

        .admin-stat-value {
          font-size: 1.6rem;
          font-weight: 800;
          color: #fff;
          margin-bottom: 0;
        }

        .admin-glass-card {
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

        .admin-section-title {
          font-size: 1.35rem;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 10px;
        }

        .admin-section-subtitle {
          color: #64748b;
          line-height: 1.8;
          margin-bottom: 22px;
        }

        .admin-label {
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 9px;
        }

        .admin-input,
        .admin-textarea,
        .admin-select {
          min-height: 54px;
          border-radius: 16px;
          border: 1px solid #dbe3f0;
          background: #f8fafc;
          -webkit-transition: all 0.3s ease;
          transition: all 0.3s ease;
        }

        .admin-textarea {
          min-height: 110px;
          resize: vertical;
        }

        .admin-input:focus,
        .admin-textarea:focus,
        .admin-select:focus {
          border-color: #60a5fa;
          background: #fff;
          box-shadow: 0 0 0 4px rgba(37,99,235,0.12);
          -webkit-box-shadow: 0 0 0 4px rgba(37,99,235,0.12);
        }

        .admin-sub-card {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 24px;
          padding: 20px;
          -webkit-transition: all 0.3s ease;
          transition: all 0.3s ease;
        }

        .admin-sub-card:hover {
          transform: translateY(-3px);
          -webkit-transform: translateY(-3px);
          box-shadow: 0 12px 30px rgba(15, 23, 42, 0.06);
          -webkit-box-shadow: 0 12px 30px rgba(15, 23, 42, 0.06);
        }

        .admin-mini-title {
          font-size: 1.05rem;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 14px;
        }

        .admin-action-btn {
          min-height: 52px;
          border-radius: 16px;
          font-weight: 800;
          -webkit-transition: all 0.32s ease;
          transition: all 0.32s ease;
        }

        .admin-action-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          -webkit-transform: translateY(-2px);
        }

        .admin-primary-btn {
          border: none;
          color: #fff;
          background: linear-gradient(135deg, #0b1736 0%, #142850 40%, #1d4ed8 100%);
          box-shadow:
            0 18px 35px rgba(29, 78, 216, 0.18),
            0 8px 20px rgba(11, 23, 54, 0.14);
          -webkit-box-shadow:
            0 18px 35px rgba(29, 78, 216, 0.18),
            0 8px 20px rgba(11, 23, 54, 0.14);
        }

        .admin-primary-btn:hover {
          color: #fff;
        }

        .admin-list-card {
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
          height: 100%;
          -webkit-transition: all 0.35s ease;
          transition: all 0.35s ease;
        }

        .admin-list-card:hover {
          transform: translateY(-5px);
          -webkit-transform: translateY(-5px);
          box-shadow:
            0 28px 75px rgba(15, 23, 42, 0.14),
            0 10px 24px rgba(59,130,246,0.07);
          -webkit-box-shadow:
            0 28px 75px rgba(15, 23, 42, 0.14),
            0 10px 24px rgba(59,130,246,0.07);
        }

        .admin-list-title {
          font-size: 1.15rem;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 10px;
        }

        .admin-list-text {
          color: #64748b;
          line-height: 1.8;
        }

        .admin-empty-card {
          border-radius: 24px;
          padding: 22px;
          background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
          border: 1px solid #93c5fd;
          color: #1e3a8a;
        }

        @keyframes adminFloat {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
          }
          50% {
            transform: translateY(-18px) translateX(10px);
          }
        }

        @-webkit-keyframes adminFloat {
          0%, 100% {
            -webkit-transform: translateY(0px) translateX(0px);
          }
          50% {
            -webkit-transform: translateY(-18px) translateX(10px);
          }
        }

        @media (max-width: 991px) {
          .admin-hero-title {
            font-size: 1.95rem;
          }
        }

        @media (max-width: 767px) {
          .admin-internships-page {
            padding: 22px 0;
          }

          .admin-hero-title {
            font-size: 1.7rem;
          }
        }
      `}</style>

      <div className="admin-internships-page py-4 py-lg-5">
        <div className="admin-internships-orb admin-internships-orb-1"></div>
        <div className="admin-internships-orb admin-internships-orb-2"></div>

        <div className="container admin-internships-shell">
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

          {/* HERO */}
          <div className="card admin-hero border-0 rounded-5 mb-4">
            <div className="card-body p-4 p-md-5">
              <div className="row g-4 align-items-center">
                <div className="col-lg-8">
                  <div className="admin-chip">Internova Admin Control Center</div>
                  <h1 className="admin-hero-title">Admin Internship Manager</h1>
                  <p className="admin-hero-text">
                    Create, edit, organize, and manage internship programs,
                    modules, durations, and quiz questions from one premium
                    admin workspace.
                  </p>
                </div>

                <div className="col-lg-4">
                  <div className="row g-3">
                    <div className="col-6">
                      <div className="admin-stat-card">
                        <div className="admin-stat-label">Programs</div>
                        <h4 className="admin-stat-value">{internships.length}</h4>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="admin-stat-card">
                        <div className="admin-stat-label">Mode</div>
                        <h4 className="admin-stat-value">
                          {editingId ? "Edit" : "Create"}
                        </h4>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="admin-stat-card">
                        <div className="admin-stat-label">Workspace</div>
                        <h4 className="admin-stat-value">Premium Admin</h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* FORM */}
          <div className="card admin-glass-card border-0 rounded-5 overflow-hidden mb-4">
            <div className="card-body p-4 p-md-5">
              <h3 className="admin-section-title">
                {editingId ? "Edit Program" : "Create Program"}
              </h3>
              <p className="admin-section-subtitle">
                Fill in the details below to build a complete training
                experience with durations, modules, and quiz questions.
              </p>

              <form onSubmit={handleSubmit}>
                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <label className="admin-label">Title</label>
                    <input
                      type="text"
                      className="form-control admin-input"
                      name="title"
                      value={formData.title}
                      onChange={handleBasicChange}
                      required
                    />
                  </div>

                  <div className="col-md-3">
                    <label className="admin-label">Branch</label>
                    <input
                      type="text"
                      className="form-control admin-input"
                      name="branch"
                      value={formData.branch}
                      onChange={handleBasicChange}
                      required
                    />
                  </div>

                  <div className="col-md-3">
                    <label className="admin-label">Category</label>
                    <input
                      type="text"
                      className="form-control admin-input"
                      name="category"
                      value={formData.category}
                      onChange={handleBasicChange}
                      required
                    />
                  </div>

                  <div className="col-md-12">
                    <label className="admin-label">Thumbnail URL</label>
                    <input
                      type="text"
                      className="form-control admin-input"
                      name="thumbnail"
                      value={formData.thumbnail}
                      onChange={handleBasicChange}
                    />
                  </div>

                  <div className="col-md-12">
                    <label className="admin-label">Description</label>
                    <textarea
                      className="form-control admin-textarea"
                      rows="4"
                      name="description"
                      value={formData.description}
                      onChange={handleBasicChange}
                      required
                    />
                  </div>
                </div>

                <div className="admin-sub-card mb-4">
                  <h5 className="admin-mini-title">Durations</h5>
                  <div className="row g-3">
                    {formData.durations.map((duration, index) => (
                      <React.Fragment key={index}>
                        <div className="col-md-6">
                          <input
                            type="text"
                            className="form-control admin-input"
                            value={duration.label}
                            onChange={(e) =>
                              handleDurationChange(index, "label", e.target.value)
                            }
                            placeholder="Duration Label"
                          />
                        </div>
                        <div className="col-md-6">
                          <input
                            type="number"
                            className="form-control admin-input"
                            value={duration.price}
                            onChange={(e) =>
                              handleDurationChange(index, "price", e.target.value)
                            }
                            placeholder="Price"
                          />
                        </div>
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                <div className="admin-sub-card mb-4">
                  <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-3">
                    <h5 className="admin-mini-title mb-0">Modules</h5>
                    <button
                      type="button"
                      className="btn btn-outline-dark admin-action-btn"
                      onClick={addModule}
                    >
                      Add Module
                    </button>
                  </div>

                  {formData.modules.map((module, index) => (
                    <div className="row g-3 mb-3" key={index}>
                      <div className="col-md-6">
                        <input
                          type="text"
                          className="form-control admin-input"
                          placeholder={`Module ${index + 1} Title`}
                          value={module.title}
                          onChange={(e) =>
                            handleModuleChange(index, "title", e.target.value)
                          }
                        />
                      </div>
                      <div className="col-md-6">
                        <input
                          type="text"
                          className="form-control admin-input"
                          placeholder={`Module ${index + 1} Description`}
                          value={module.description}
                          onChange={(e) =>
                            handleModuleChange(index, "description", e.target.value)
                          }
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="admin-sub-card mb-4">
                  <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-3">
                    <h5 className="admin-mini-title mb-0">Quiz Questions</h5>
                    <button
                      type="button"
                      className="btn btn-outline-dark admin-action-btn"
                      onClick={addQuizQuestion}
                    >
                      Add Question
                    </button>
                  </div>

                  {formData.quiz.map((q, qIndex) => (
                    <div className="admin-sub-card mb-3" key={qIndex}>
                      <div className="mb-3">
                        <label className="admin-label">
                          Question {qIndex + 1}
                        </label>
                        <input
                          type="text"
                          className="form-control admin-input"
                          value={q.question}
                          onChange={(e) =>
                            handleQuizChange(qIndex, "question", e.target.value)
                          }
                        />
                      </div>

                      <div className="row g-3">
                        {q.options.map((option, oIndex) => (
                          <div className="col-md-6" key={oIndex}>
                            <input
                              type="text"
                              className="form-control admin-input"
                              placeholder={`Option ${oIndex + 1}`}
                              value={option}
                              onChange={(e) =>
                                handleQuizOptionChange(qIndex, oIndex, e.target.value)
                              }
                            />
                          </div>
                        ))}
                      </div>

                      <div className="mt-3">
                        <label className="admin-label">Correct Answer Index</label>
                        <select
                          className="form-select admin-select"
                          value={q.correctAnswer}
                          onChange={(e) =>
                            handleQuizChange(
                              qIndex,
                              "correctAnswer",
                              e.target.value
                            )
                          }
                        >
                          <option value={0}>Option 1</option>
                          <option value={1}>Option 2</option>
                          <option value={2}>Option 3</option>
                          <option value={3}>Option 4</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="d-flex gap-3 flex-wrap">
                  <button
                    className="btn admin-action-btn admin-primary-btn"
                    type="submit"
                    disabled={loading}
                  >
                    {loading
                      ? "Saving..."
                      : editingId
                        ? "Update Internship"
                        : "Create Internship"}
                  </button>

                  <button
                    className="btn btn-outline-secondary admin-action-btn"
                    type="button"
                    onClick={resetForm}
                  >
                    Reset
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* EXISTING INTERNSHIPS */}
          <div className="card admin-glass-card border-0 rounded-5 overflow-hidden">
            <div className="card-body p-4 p-md-5">
              <h3 className="admin-section-title">Existing Internships</h3>
              <p className="admin-section-subtitle">
                Review, edit, or remove existing internship programs from your
                admin inventory.
              </p>

              <div className="row g-4">
                {internships.map((item) => (
                  <div className="col-md-6" key={item._id}>
                    <div className="admin-list-card">
                      <div className="card-body p-4">
                        <h4 className="admin-list-title">{item.title}</h4>
                        <p className="mb-1">
                          <strong>Branch:</strong> {item.branch}
                        </p>
                        <p className="mb-1">
                          <strong>Category:</strong> {item.category}
                        </p>
                        <p className="admin-list-text mb-3">
                          {item.description?.slice(0, 120)}...
                        </p>

                        <div className="d-flex gap-2 flex-wrap">
                          <button
                            className="btn btn-outline-dark admin-action-btn"
                            onClick={() => handleEdit(item._id)}
                          >
                            Edit
                          </button>

                          <button
                            className="btn btn-danger admin-action-btn"
                            onClick={() => handleDelete(item._id)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {internships.length === 0 && (
                <div className="admin-empty-card mt-4">
                  <h5 className="fw-bold mb-2">No Internships Available</h5>
                  <p className="mb-0">
                    No internships have been created yet. Start by creating your
                    first internship program.
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

export default AdminInternships;