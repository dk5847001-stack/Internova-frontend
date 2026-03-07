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
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);
  const [result, setResult] = useState(null);

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
      setAlreadySubmitted(data.alreadySubmitted);
      setResult(data.result);
    } catch (error) {
      console.error("Failed to fetch quiz:", error);
      alert(error.response?.data?.message || "Failed to load quiz");
      navigate("/my-purchases");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuiz();
  }, [internshipId]);

  const handleOptionChange = (questionIndex, optionIndex) => {
    const updated = [...answers];
    updated[questionIndex] = optionIndex;
    setAnswers(updated);
  };

  const handleSubmit = async () => {
    const unanswered = answers.some((a) => a === -1);

    if (unanswered) {
      return alert("Please answer all questions before submitting.");
    }

    try {
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
      setAlreadySubmitted(true);

      if (data.result?.passed) {
        alert("Quiz passed successfully!");
      } else {
        alert("Quiz submitted, but you did not pass.");
      }
    } catch (error) {
      console.error("Quiz submit failed:", error);
      alert(error.response?.data?.message || "Failed to submit quiz");
    }
  };

  if (loading) {
    return <div className="container py-5">Loading quiz...</div>;
  }

  return (
    <div className="container py-5">
      <button className="btn btn-outline-dark mb-4" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className="card shadow-sm p-4">
        <h2 className="mb-3">{title} - Mini Test</h2>

        {alreadySubmitted && result ? (
          <div className={`alert ${result.passed ? "alert-success" : "alert-danger"}`}>
            <h5 className="mb-2">Test Already Submitted</h5>
            <p className="mb-1"><strong>Score:</strong> {result.score}/{result.totalQuestions}</p>
            <p className="mb-1"><strong>Percentage:</strong> {result.percentage}%</p>
            <p className="mb-0"><strong>Status:</strong> {result.passed ? "Passed" : "Failed"}</p>
          </div>
        ) : null}

        {!alreadySubmitted &&
          quiz.map((q, qIndex) => (
            <div key={qIndex} className="border rounded p-3 mb-4">
              <h5 className="mb-3">
                Q{qIndex + 1}. {q.question}
              </h5>

              {q.options.map((option, oIndex) => (
                <div className="form-check mb-2" key={oIndex}>
                  <input
                    className="form-check-input"
                    type="radio"
                    name={`question-${qIndex}`}
                    id={`q${qIndex}-o${oIndex}`}
                    checked={answers[qIndex] === oIndex}
                    onChange={() => handleOptionChange(qIndex, oIndex)}
                  />
                  <label className="form-check-label" htmlFor={`q${qIndex}-o${oIndex}`}>
                    {option}
                  </label>
                </div>
              ))}
            </div>
          ))}

        {!alreadySubmitted && quiz.length > 0 && (
          <button className="btn btn-dark" onClick={handleSubmit}>
            Submit Test
          </button>
        )}

        {!alreadySubmitted && quiz.length === 0 && (
          <div className="alert alert-info mb-0">No quiz available for this internship yet.</div>
        )}
      </div>
    </div>
  );
}

export default QuizPage;