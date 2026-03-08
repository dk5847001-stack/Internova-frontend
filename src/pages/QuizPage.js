import React, { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate, useParams } from "react-router-dom";

function QuizPage() {
  const { internshipId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [title, setTitle] = useState("");
  const [quiz, setQuiz] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [locked, setLocked] = useState(false);
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);

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

  const fetchQuiz = async () => {
    try {
      const { data } = await API.get(`/quiz/${internshipId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTitle(data.title);
      setQuiz(data.quiz || []);
      setAnswers(new Array((data.quiz || []).length).fill(-1));
      setLocked(!!data.locked);
      setResult(data.result || null);
    } catch (error) {
      console.error("Failed to fetch quiz:", error);
      showToast(
        "error",
        error.response?.data?.message || "Failed to load quiz"
      );
      navigate("/my-purchases");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuiz();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [internshipId]);

  const handleOptionChange = (questionIndex, optionIndex) => {
    const updated = [...answers];
    updated[questionIndex] = optionIndex;
    setAnswers(updated);
  };

  const handleSubmit = async () => {
    const unanswered = answers.some((a) => a === -1);

    if (unanswered) {
      showToast("error", "Please answer all questions before submitting.");
      return;
    }

    try {
      setSubmitting(true);

      const { data } = await API.post(
        `/quiz/${internshipId}/submit`,
        { answers },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setResult(data.result);

      if (data.result?.passed) {
        setLocked(true);
        showToast("success", "Quiz passed successfully!");
      } else {
        setLocked(false);
        showToast("error", "Quiz submitted. You can retry again.");
        setAnswers(new Array(quiz.length).fill(-1));
      }
    } catch (error) {
      console.error("Quiz submit failed:", error);
      showToast(
        "error",
        error.response?.data?.message || "Failed to submit quiz"
      );
    } finally {
      setSubmitting(false);
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
          <div className="fw-semibold text-dark">Loading quiz...</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        .quiz-page {
          min-height: 100vh;
          background:
            radial-gradient(circle at top left, rgba(59,130,246,0.18), transparent 28%),
            radial-gradient(circle at bottom right, rgba(99,102,241,0.16), transparent 32%),
            linear-gradient(135deg, #f8fafc 0%, #eef2ff 48%, #f8fafc 100%);
          position: relative;
          overflow: hidden;
        }

        .quiz-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(10px);
          opacity: 0.55;
          animation: quizFloat 9s ease-in-out infinite;
          -webkit-animation: quizFloat 9s ease-in-out infinite;
          pointer-events: none;
        }

        .quiz-orb-1 {
          width: 220px;
          height: 220px;
          top: 70px;
          left: -60px;
          background: linear-gradient(135deg, rgba(37,99,235,0.25), rgba(14,165,233,0.18));
        }

        .quiz-orb-2 {
          width: 280px;
          height: 280px;
          right: -80px;
          bottom: 70px;
          background: linear-gradient(135deg, rgba(99,102,241,0.18), rgba(59,130,246,0.22));
          animation-delay: 1.2s;
          -webkit-animation-delay: 1.2s;
        }

        .quiz-shell {
          position: relative;
          z-index: 2;
        }

        .quiz-back-btn {
          border-radius: 999px;
          padding: 10px 18px;
          font-weight: 700;
          -webkit-transition: all 0.3s ease;
          transition: all 0.3s ease;
        }

        .quiz-back-btn:hover {
          transform: translateY(-2px);
          -webkit-transform: translateY(-2px);
        }

        .quiz-hero {
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

        .quiz-hero::before {
          content: "";
          position: absolute;
          inset: 0;
          background:
            radial-gradient(circle at 18% 22%, rgba(255,255,255,0.12), transparent 22%),
            radial-gradient(circle at 82% 74%, rgba(255,255,255,0.08), transparent 18%);
          pointer-events: none;
        }

        .quiz-chip {
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

        .quiz-hero-title {
          font-size: 2.15rem;
          font-weight: 800;
          letter-spacing: -0.03em;
          margin-bottom: 10px;
        }

        .quiz-hero-text {
          color: rgba(255,255,255,0.82);
          line-height: 1.8;
          margin-bottom: 0;
          max-width: 720px;
        }

        .quiz-stat-card {
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

        .quiz-stat-card:hover {
          transform: translateY(-4px);
          -webkit-transform: translateY(-4px);
        }

        .quiz-stat-label {
          font-size: 0.82rem;
          color: rgba(255,255,255,0.75);
          margin-bottom: 6px;
        }

        .quiz-stat-value {
          font-size: 1.6rem;
          font-weight: 800;
          color: #fff;
          margin-bottom: 0;
        }

        .quiz-main-card {
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

        .quiz-result-card {
          border-radius: 24px;
          padding: 22px;
          margin-bottom: 24px;
        }

        .quiz-result-success {
          background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
          border: 1px solid #86efac;
          color: #065f46;
        }

        .quiz-result-warning {
          background: linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%);
          border: 1px solid #fdba74;
          color: #9a3412;
        }

        .quiz-state-card {
          border-radius: 24px;
          padding: 22px;
        }

        .quiz-state-info {
          background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
          border: 1px solid #93c5fd;
          color: #1e3a8a;
        }

        .quiz-state-danger {
          background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
          border: 1px solid #fca5a5;
          color: #991b1b;
        }

        .quiz-state-empty {
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          border: 1px solid #cbd5e1;
          color: #334155;
        }

        .quiz-question-card {
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
          padding: 24px;
          margin-bottom: 24px;
          -webkit-transition: all 0.35s ease;
          transition: all 0.35s ease;
        }

        .quiz-question-card:hover {
          transform: translateY(-4px);
          -webkit-transform: translateY(-4px);
          box-shadow:
            0 28px 75px rgba(15, 23, 42, 0.13),
            0 10px 24px rgba(59,130,246,0.07);
          -webkit-box-shadow:
            0 28px 75px rgba(15, 23, 42, 0.13),
            0 10px 24px rgba(59,130,246,0.07);
        }

        .quiz-question-title {
          font-size: 1.1rem;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 18px;
          line-height: 1.7;
        }

        .quiz-option-item {
          position: relative;
          margin-bottom: 12px;
        }

        .quiz-option-input {
          position: absolute;
          opacity: 0;
          pointer-events: none;
        }

        .quiz-option-label {
          display: block;
          cursor: pointer;
          border-radius: 18px;
          border: 1px solid #dbe3f0;
          background: #f8fafc;
          padding: 14px 16px 14px 46px;
          color: #0f172a;
          font-weight: 600;
          position: relative;
          -webkit-transition: all 0.28s ease;
          transition: all 0.28s ease;
        }

        .quiz-option-label::before {
          content: "";
          position: absolute;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          border: 2px solid #94a3b8;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          -webkit-transform: translateY(-50%);
          background: #fff;
          -webkit-transition: all 0.28s ease;
          transition: all 0.28s ease;
        }

        .quiz-option-label:hover {
          transform: translateY(-2px);
          -webkit-transform: translateY(-2px);
          border-color: #93c5fd;
          box-shadow: 0 12px 24px rgba(37,99,235,0.07);
          -webkit-box-shadow: 0 12px 24px rgba(37,99,235,0.07);
        }

        .quiz-option-input:checked + .quiz-option-label {
          border-color: #60a5fa;
          background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
          box-shadow: 0 0 0 4px rgba(37,99,235,0.10);
          -webkit-box-shadow: 0 0 0 4px rgba(37,99,235,0.10);
        }

        .quiz-option-input:checked + .quiz-option-label::before {
          border-color: #2563eb;
          background: #2563eb;
          box-shadow: inset 0 0 0 4px #fff;
          -webkit-box-shadow: inset 0 0 0 4px #fff;
        }

        .quiz-submit-btn {
          min-height: 58px;
          border-radius: 18px;
          font-weight: 800;
          padding: 0 24px;
          border: none;
          color: #fff;
          background: linear-gradient(135deg, #0b1736 0%, #142850 40%, #1d4ed8 100%);
          box-shadow:
            0 18px 35px rgba(29, 78, 216, 0.20),
            0 8px 20px rgba(11, 23, 54, 0.16);
          -webkit-box-shadow:
            0 18px 35px rgba(29, 78, 216, 0.20),
            0 8px 20px rgba(11, 23, 54, 0.16);
          -webkit-transition: all 0.32s ease;
          transition: all 0.32s ease;
        }

        .quiz-submit-btn:hover:not(:disabled) {
          color: #fff;
          transform: translateY(-2px);
          -webkit-transform: translateY(-2px);
        }

        .quiz-submit-btn:disabled {
          opacity: 0.82;
          cursor: not-allowed;
        }

        @keyframes quizFloat {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
          }
          50% {
            transform: translateY(-18px) translateX(10px);
          }
        }

        @-webkit-keyframes quizFloat {
          0%, 100% {
            -webkit-transform: translateY(0px) translateX(0px);
          }
          50% {
            -webkit-transform: translateY(-18px) translateX(10px);
          }
        }

        @media (max-width: 991px) {
          .quiz-hero-title {
            font-size: 1.9rem;
          }
        }

        @media (max-width: 767px) {
          .quiz-page {
            padding: 22px 0;
          }

          .quiz-hero-title {
            font-size: 1.7rem;
          }

          .quiz-question-card {
            padding: 20px;
          }
        }
      `}</style>

      <div className="quiz-page py-4 py-lg-5">
        <div className="quiz-orb quiz-orb-1"></div>
        <div className="quiz-orb quiz-orb-2"></div>

        <div className="container quiz-shell">
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
            className="btn btn-outline-dark quiz-back-btn mb-4"
            onClick={() => navigate(-1)}
          >
            ← Back
          </button>

          {/* HERO */}
          <div className="card quiz-hero border-0 rounded-5 mb-4">
            <div className="card-body p-4 p-md-5">
              <div className="row g-4 align-items-center">
                <div className="col-lg-8">
                  <div className="quiz-chip">Internova Mini Test Portal</div>
                  <h1 className="quiz-hero-title">
                    {title || "Internship"} - Mini Test
                  </h1>
                  <p className="quiz-hero-text">
                    Complete this assessment to measure your learning progress
                    and move one step closer to certificate eligibility.
                  </p>
                </div>

                <div className="col-lg-4">
                  <div className="row g-3">
                    <div className="col-6">
                      <div className="quiz-stat-card">
                        <div className="quiz-stat-label">Questions</div>
                        <h4 className="quiz-stat-value">{quiz.length}</h4>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="quiz-stat-card">
                        <div className="quiz-stat-label">Status</div>
                        <h4 className="quiz-stat-value">
                          {locked ? "Passed" : "Active"}
                        </h4>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="quiz-stat-card">
                        <div className="quiz-stat-label">Attempts</div>
                        <h4 className="quiz-stat-value">
                          {result ? "Attempted" : "New Test"}
                        </h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* MAIN */}
          <div className="card quiz-main-card border-0 rounded-5">
            <div className="card-body p-4 p-md-5">
              {result && (
                <div
                  className={`quiz-result-card ${result.passed ? "quiz-result-success" : "quiz-result-warning"
                    }`}
                >
                  <h5 className="mb-3 fw-bold">
                    {result.passed ? "Test Passed" : "Previous Attempt Result"}
                  </h5>
                  <div className="row g-3">
                    <div className="col-md-4">
                      <strong>Score:</strong> {result.score}/{result.totalQuestions}
                    </div>
                    <div className="col-md-4">
                      <strong>Percentage:</strong> {result.percentage}%
                    </div>
                    <div className="col-md-4">
                      <strong>Status:</strong> {result.passed ? "Passed" : "Failed"}
                    </div>
                  </div>
                </div>
              )}

              {locked ? (
                <div className="quiz-state-card quiz-state-info">
                  <h5 className="fw-bold mb-2">Test Already Passed</h5>
                  <p className="mb-0">
                    You have already passed this mini test. No further attempt
                    is required for this internship.
                  </p>
                </div>
              ) : quiz.length > 0 ? (
                <>
                  {result && !result.passed && (
                    <div className="quiz-state-card quiz-state-danger mb-4">
                      <h5 className="fw-bold mb-2">Retake Available</h5>
                      <p className="mb-0">
                        You did not pass the previous attempt. Review your
                        answers carefully and retake the test now.
                      </p>
                    </div>
                  )}

                  {quiz.map((q, qIndex) => (
                    <div key={qIndex} className="quiz-question-card">
                      <h5 className="quiz-question-title">
                        Q{qIndex + 1}. {q.question}
                      </h5>

                      {q.options.map((option, oIndex) => (
                        <div className="quiz-option-item" key={oIndex}>
                          <input
                            className="quiz-option-input"
                            type="radio"
                            name={`question-${qIndex}`}
                            id={`q${qIndex}-o${oIndex}`}
                            checked={answers[qIndex] === oIndex}
                            onChange={() => handleOptionChange(qIndex, oIndex)}
                          />
                          <label
                            className="quiz-option-label"
                            htmlFor={`q${qIndex}-o${oIndex}`}
                          >
                            {option}
                          </label>
                        </div>
                      ))}
                    </div>
                  ))}

                  <button
                    className="btn quiz-submit-btn"
                    onClick={handleSubmit}
                    disabled={submitting}
                  >
                    {submitting
                      ? "Submitting..."
                      : result && !result.passed
                        ? "Retake Test"
                        : "Submit Test"}
                  </button>
                </>
              ) : (
                <div className="quiz-state-card quiz-state-empty">
                  <h5 className="fw-bold mb-2">No Quiz Available</h5>
                  <p className="mb-0">
                    No quiz is available for this internship yet. Please check
                    back later.
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

export default QuizPage;