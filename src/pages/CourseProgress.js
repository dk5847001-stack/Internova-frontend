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
      alert(error.response?.data?.message || "Failed to load course");
      navigate("/my-purchases");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourse();
  }, [internshipId]);

  const handleToggleModule = async (moduleIndex) => {
    try {
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
    } catch (error) {
      console.error("Toggle module failed:", error);
      alert(error.response?.data?.message || "Failed to update progress");
    }
  };

  if (loading) {
    return <div className="container py-5">Loading course...</div>;
  }

  if (!internship || !progress) {
    return <div className="container py-5">Course not found.</div>;
  }

  return (
    <div className="container py-5">
      <button className="btn btn-outline-dark mb-4" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className="card shadow-sm p-4 mb-4">
        <h2>{internship.title}</h2>
        <p className="mb-1"><strong>Branch:</strong> {internship.branch}</p>
        <p className="mb-1"><strong>Category:</strong> {internship.category}</p>
        <p className="mb-3">{internship.description}</p>

        <h5>Progress: {progress.progressPercent}%</h5>
        <div className="progress mb-3" style={{ height: "22px" }}>
          <div
            className="progress-bar"
            role="progressbar"
            style={{ width: `${progress.progressPercent}%` }}
            aria-valuenow={progress.progressPercent}
            aria-valuemin="0"
            aria-valuemax="100"
          >
            {progress.progressPercent}%
          </div>
        </div>

        {progress.certificateEligible ? (
          <div className="alert alert-success mb-0">
            Great! You have reached 80% progress and are now eligible for the next step.
          </div>
        ) : (
          <div className="alert alert-warning mb-0">
            Complete at least 80% of modules to become certificate-eligible.
          </div>
        )}
      </div>

      <div className="card shadow-sm p-4">
        <h4 className="mb-4">Course Modules</h4>

        {internship.modules?.length ? (
          internship.modules.map((module, index) => {
            const isCompleted = progress.completedModules.includes(index);

            return (
              <div
                key={index}
                className="d-flex justify-content-between align-items-start border rounded p-3 mb-3"
              >
                <div>
                  <h5 className="mb-1">
                    Module {index + 1}: {module.title}
                  </h5>
                  <p className="mb-0 text-muted">{module.description}</p>
                </div>

                <button
                  className={`btn ${isCompleted ? "btn-success" : "btn-outline-success"}`}
                  onClick={() => handleToggleModule(index)}
                >
                  {isCompleted ? "Completed" : "Mark Complete"}
                </button>
              </div>
            );
          })
        ) : (
          <div className="alert alert-info mb-0">
            No modules available for this internship yet.
          </div>
        )}
      </div>
    </div>
  );
}

<button
  className="btn btn-dark mt-3"
  onClick={() => navigate(`/quiz/${internshipId}`)}
>
  Open Mini Test
</button>

export default CourseProgress;