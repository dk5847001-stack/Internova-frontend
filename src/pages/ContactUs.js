import React from "react";

function AboutUs() {
  return (
    <>
      <style>{`
        .policy-page-wrap {
          min-height: 100vh;
          background:
            radial-gradient(circle at top left, rgba(59,130,246,0.10), transparent 30%),
            radial-gradient(circle at bottom right, rgba(37,99,235,0.10), transparent 30%),
            linear-gradient(135deg, #f8fbff 0%, #eef4ff 50%, #eaf2ff 100%);
          padding: 80px 0;
        }

        .policy-hero-card {
          border-radius: 30px;
          background: rgba(255,255,255,0.75);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255,255,255,0.7);
          box-shadow: 0 20px 50px rgba(15, 23, 42, 0.08);
          -webkit-box-shadow: 0 20px 50px rgba(15, 23, 42, 0.08);
          padding: 42px;
          overflow: hidden;
          position: relative;
          -webkit-transition: all 0.35s ease;
          transition: all 0.35s ease;
        }

        .policy-hero-card:hover {
          transform: translateY(-4px);
          -webkit-transform: translateY(-4px);
          box-shadow: 0 30px 60px rgba(15, 23, 42, 0.12);
          -webkit-box-shadow: 0 30px 60px rgba(15, 23, 42, 0.12);
        }

        .policy-badge {
          display: inline-flex;
          align-items: center;
          padding: 9px 16px;
          border-radius: 999px;
          background: rgba(37,99,235,0.10);
          border: 1px solid rgba(37,99,235,0.14);
          color: #1d4ed8;
          font-weight: 700;
          font-size: 0.82rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: 18px;
        }

        .policy-title {
          font-size: 2.6rem;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.03em;
          margin-bottom: 14px;
        }

        .policy-subtitle {
          color: #475569;
          font-size: 1.05rem;
          line-height: 1.9;
          max-width: 900px;
          margin-bottom: 0;
        }

        .policy-info-grid {
          margin-top: 28px;
        }

        .policy-info-card {
          height: 100%;
          border-radius: 24px;
          background: rgba(255,255,255,0.82);
          border: 1px solid rgba(148,163,184,0.18);
          box-shadow: 0 14px 34px rgba(15,23,42,0.05);
          -webkit-box-shadow: 0 14px 34px rgba(15,23,42,0.05);
          padding: 26px;
          -webkit-transition: all 0.3s ease;
          transition: all 0.3s ease;
        }

        .policy-info-card:hover {
          transform: translateY(-5px);
          -webkit-transform: translateY(-5px);
          box-shadow: 0 24px 44px rgba(15,23,42,0.10);
          -webkit-box-shadow: 0 24px 44px rgba(15,23,42,0.10);
        }

        .policy-info-title {
          font-size: 1.1rem;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 12px;
        }

        .policy-info-text {
          color: #475569;
          line-height: 1.9;
          margin-bottom: 0;
        }

        @media (max-width: 767px) {
          .policy-page-wrap {
            padding: 50px 0;
          }

          .policy-hero-card {
            padding: 24px;
            border-radius: 22px;
          }

          .policy-title {
            font-size: 2rem;
          }
        }
      `}</style>

      <div className="policy-page-wrap">
        <div className="container">
          <div className="policy-hero-card">
            <div className="policy-badge">About Internova</div>
            <h1 className="policy-title">Learning, Growth, and Certification in One Platform</h1>
            <p className="policy-subtitle">
              Internova is a modern digital learning platform built to help students and
              freshers improve their practical skills through structured training programs,
              assessments, progress tracking, and certificate-based learning experiences.
            </p>

            <div className="row g-4 policy-info-grid">
              <div className="col-lg-4 col-md-6">
                <div className="policy-info-card">
                  <h4 className="policy-info-title">Structured Learning</h4>
                  <p className="policy-info-text">
                    We provide guided program access with organized modules, assessments,
                    and digital support so learners can focus on real improvement.
                  </p>
                </div>
              </div>

              <div className="col-lg-4 col-md-6">
                <div className="policy-info-card">
                  <h4 className="policy-info-title">Progress Tracking</h4>
                  <p className="policy-info-text">
                    Learners can monitor their performance, continue their training flow,
                    and complete tasks inside a premium digital dashboard experience.
                  </p>
                </div>
              </div>

              <div className="col-lg-4 col-md-12">
                <div className="policy-info-card">
                  <h4 className="policy-info-title">Certification Support</h4>
                  <p className="policy-info-text">
                    Eligible learners can access certificate-related services, verification
                    support, and completion-based digital credentials through the platform.
                  </p>
                </div>
              </div>
            </div>

            <div className="row g-4 policy-info-grid">
              <div className="col-md-6">
                <div className="policy-info-card">
                  <h4 className="policy-info-title">Our Mission</h4>
                  <p className="policy-info-text">
                    Our mission is to make digital learning more accessible, professional,
                    and experience-driven by combining structured training, assessments,
                    and transparent learner support in one place.
                  </p>
                </div>
              </div>

              <div className="col-md-6">
                <div className="policy-info-card">
                  <h4 className="policy-info-title">What We Focus On</h4>
                  <p className="policy-info-text">
                    Internova focuses on skill development, training participation,
                    assessment readiness, certificate eligibility, and a seamless learner
                    experience across every stage of platform use.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AboutUs;