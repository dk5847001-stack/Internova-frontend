import React from "react";

function MiniTestActionCard({
  progress,
  requiredProgress,
  miniTestPassed,
  onOpenMiniTest,
}) {
  const unlocked = progress >= requiredProgress;

  return (
    <div className="course-action-card premium-action-card mini-test-action-card">
      <div className="course-action-top">
        <div className="course-action-icon">📝</div>
        <div>
          <p className="course-action-kicker">Assessment</p>
          <h3>Mini Test</h3>
        </div>
      </div>

      <p className="course-action-text">
        Complete the mini test after reaching the required learning progress.
        Passing this test is necessary for certificate eligibility.
      </p>

      <div className="course-action-status-group">
        <div
          className={`course-action-status-chip ${
            miniTestPassed
              ? "success"
              : unlocked
              ? "active"
              : "locked"
          }`}
        >
          {miniTestPassed
            ? "Passed"
            : unlocked
            ? "Unlocked"
            : "Locked"}
        </div>

        <div className="course-action-meta">
          Required Progress: <strong>{requiredProgress}%</strong>
        </div>

        <div className="course-action-meta">
          Current Progress: <strong>{progress}%</strong>
        </div>
      </div>

      <button
        type="button"
        className={`course-action-btn ${
          miniTestPassed
            ? "success"
            : unlocked
            ? "primary"
            : "disabled"
        }`}
        disabled={!unlocked}
        onClick={onOpenMiniTest}
      >
        {miniTestPassed
          ? "View Passed Test"
          : unlocked
          ? "Start Mini Test"
          : `Unlock at ${requiredProgress}%`}
      </button>
    </div>
  );
}

export default MiniTestActionCard;