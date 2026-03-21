import React from "react";

function CourseProgressCard({
  overallProgress,
  watchedVideos,
  totalVideos,
  completedModules,
  totalModules,
  completedDays,
  totalDays,
  lockedModules,
}) {
  return (
    <div className="course-progress-section">
      <div className="course-overall-progress-card premium-progress-card">
        <div className="course-overall-progress-top">
          <div>
            <p className="course-overall-label">Learning Progress</p>
            <h3>{overallProgress}% Completed</h3>
          </div>

          <div className="course-overall-circle">
            <strong>{overallProgress}%</strong>
          </div>
        </div>

        <div className="course-overall-bar">
          <div
            className="course-overall-bar-fill"
            style={{ width: `${overallProgress}%` }}
          />
        </div>

        <div className="course-progress-scale">
          <span>0%</span>
          <span>40%</span>
          <span>80%</span>
          <span>100%</span>
        </div>

        <div className="progress-threshold-note">
          <span className="threshold-chip">Certificate unlock target: 80%+</span>
        </div>

        <p className="course-overall-note">
          Keep learning regularly. Certificate unlock needs required progress,
          mini test pass, and Internship Programs duration completion.
        </p>
      </div>

      <div className="course-progress-grid">
        <div className="course-progress-box premium-stat-box">
          <span>Watched Videos</span>
          <strong>
            {watchedVideos}/{totalVideos}
          </strong>
        </div>

        <div className="course-progress-box premium-stat-box">
          <span>Completed Modules</span>
          <strong>
            {completedModules}/{totalModules}
          </strong>
        </div>

        <div className="course-progress-box premium-stat-box">
          <span>Duration Progress</span>
          <strong>
            {completedDays}/{totalDays} Days
          </strong>
        </div>

        <div className="course-progress-box premium-stat-box">
          <span>Locked Modules</span>
          <strong>{lockedModules}</strong>
        </div>
      </div>
    </div>
  );
}

export default CourseProgressCard;