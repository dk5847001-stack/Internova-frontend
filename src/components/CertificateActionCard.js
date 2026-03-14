import React from "react";

function CertificateActionCard({ eligibility, onOpenCertificate }) {
  const isEligible = !!eligibility?.eligible;
  const progressCompleted = !!eligibility?.progressCompleted;
  const miniTestCompleted = !!eligibility?.miniTestCompleted;
  const durationCompleted = !!eligibility?.durationCompleted;

  return (
    <div className="course-action-card premium-action-card certificate-action-card">
      <div className="course-action-top">
        <div className="course-action-icon">🏆</div>
        <div>
          <p className="course-action-kicker">Certification</p>
          <h3>Certificate</h3>
        </div>
      </div>

      <p className="course-action-text">
        Your internship completion certificate becomes available only after
        required progress, mini test, and duration conditions are fully met.
      </p>

      <div className="certificate-check-list">
        <div
          className={`certificate-check-item ${
            progressCompleted ? "done" : "pending"
          }`}
        >
          <span>{progressCompleted ? "✅" : "⏳"}</span>
          <span>Required course progress completed</span>
        </div>

        <div
          className={`certificate-check-item ${
            miniTestCompleted ? "done" : "pending"
          }`}
        >
          <span>{miniTestCompleted ? "✅" : "⏳"}</span>
          <span>Mini test passed</span>
        </div>

        <div
          className={`certificate-check-item ${
            durationCompleted ? "done" : "pending"
          }`}
        >
          <span>{durationCompleted ? "✅" : "⏳"}</span>
          <span>Selected duration completed</span>
        </div>
      </div>

      <div
        className={`course-action-status-chip ${
          isEligible ? "success" : "locked"
        }`}
      >
        {isEligible ? "Eligible Now" : "Locked"}
      </div>

      <button
        type="button"
        className={`course-action-btn ${isEligible ? "primary" : "disabled"}`}
        disabled={!isEligible}
        onClick={onOpenCertificate}
      >
        {isEligible ? "Open Certificate" : "Certificate Locked"}
      </button>
    </div>
  );
}

export default CertificateActionCard;