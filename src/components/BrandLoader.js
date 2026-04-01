import React, { useEffect, useState } from "react";
const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "https://api.internovatech.in/api";

const BRAND_LOGO_URL = `${API_BASE_URL.replace(
  /\/api\/?$/,
  ""
)}/uploads/branding/${encodeURIComponent("brand logo.png")}`;

const STATUS_TEXTS = [
  "Preparing your InternovaTech experience",
  "Loading premium Internship Programs",
  "Syncing categories and learning paths",
  "Optimizing your browsing experience",
];

function BrandLoader({
  title = "Loading internships",
  subtitle,
  fullScreen = true,
  minHeight = "100vh",
}) {
  const [logoFailed, setLogoFailed] = useState(false);
  const [statusIndex, setStatusIndex] = useState(0);

  useEffect(() => {
    if (subtitle) return;

    const interval = setInterval(() => {
      setStatusIndex((prev) => (prev + 1) % STATUS_TEXTS.length);
    }, 1600);

    return () => clearInterval(interval);
  }, [subtitle]);

  const displaySubtitle = subtitle || STATUS_TEXTS[statusIndex];

  return (
    <>
      <style>{`
        .brand-v2-loader-page {
          min-height: ${minHeight};
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          position: relative;
          overflow: hidden;
          background:
            radial-gradient(circle at top left, rgba(59,130,246,0.14), transparent 26%),
            radial-gradient(circle at 85% 15%, rgba(99,102,241,0.12), transparent 22%),
            radial-gradient(circle at bottom right, rgba(16,185,129,0.08), transparent 24%),
            linear-gradient(135deg, #f8fbff 0%, #eef4ff 48%, #f8fbff 100%);
        }

        .brand-v2-loader-page::before {
          content: "";
          position: absolute;
          inset: 0;
          background:
            repeating-linear-gradient(
              90deg,
              rgba(255,255,255,0.05) 0px,
              rgba(255,255,255,0.05) 1px,
              transparent 1px,
              transparent 120px
            );
          pointer-events: none;
        }

        .brand-v2-orb,
        .brand-v2-particle {
          position: absolute;
          pointer-events: none;
        }

        .brand-v2-orb {
          border-radius: 50%;
          filter: blur(18px);
          opacity: 0.45;
          animation: brandV2Float 8s ease-in-out infinite;
        }

        .brand-v2-orb-1 {
          width: 220px;
          height: 220px;
          top: 8%;
          left: -60px;
          background: linear-gradient(135deg, rgba(29,78,216,0.18), rgba(14,165,233,0.12));
        }

        .brand-v2-orb-2 {
          width: 280px;
          height: 280px;
          right: -90px;
          top: 14%;
          background: linear-gradient(135deg, rgba(99,102,241,0.14), rgba(59,130,246,0.14));
          animation-delay: 1.6s;
        }

        .brand-v2-orb-3 {
          width: 190px;
          height: 190px;
          right: 14%;
          bottom: 7%;
          background: linear-gradient(135deg, rgba(16,185,129,0.10), rgba(37,99,235,0.08));
          animation-delay: 2.4s;
        }

        .brand-v2-particle {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: rgba(37,99,235,0.18);
          box-shadow: 0 0 18px rgba(37,99,235,0.10);
          animation: brandV2Particle 5s ease-in-out infinite;
        }

        .brand-v2-particle-1 {
          top: 18%;
          left: 24%;
        }

        .brand-v2-particle-2 {
          top: 28%;
          right: 20%;
          animation-delay: 1s;
        }

        .brand-v2-particle-3 {
          bottom: 20%;
          left: 22%;
          animation-delay: 2s;
        }

        .brand-v2-particle-4 {
          bottom: 14%;
          right: 26%;
          animation-delay: 3s;
        }

        .brand-v2-loader-card {
          position: relative;
          z-index: 2;
          width: 100%;
          max-width: 390px;
          border-radius: 30px;
          padding: 1px;
          background: linear-gradient(
            135deg,
            rgba(37,99,235,0.28),
            rgba(255,255,255,0.88),
            rgba(16,185,129,0.18),
            rgba(29,78,216,0.28)
          );
          background-size: 250% 250%;
          animation: brandV2GradientMove 5s ease infinite;
          box-shadow:
            0 24px 60px rgba(15,23,42,0.08),
            0 10px 24px rgba(37,99,235,0.06);
        }

        .brand-v2-loader-inner {
          position: relative;
          border-radius: 29px;
          padding: 28px 24px 22px;
          text-align: center;
          background: rgba(255,255,255,0.72);
          border: 1px solid rgba(255,255,255,0.84);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          overflow: hidden;
        }

        .brand-v2-loader-inner::before {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.34), transparent 42%);
          pointer-events: none;
        }

        .brand-v2-logo-wrap {
          position: relative;
          width: 98px;
          height: 98px;
          margin: 0 auto 18px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .brand-v2-logo-glow {
          position: absolute;
          width: 96px;
          height: 96px;
          border-radius: 30px;
          background: radial-gradient(circle, rgba(37,99,235,0.14) 0%, rgba(37,99,235,0.04) 56%, transparent 76%);
          filter: blur(12px);
          animation: brandV2Glow 2s ease-in-out infinite;
        }

        .brand-v2-logo-shell {
          position: relative;
          width: 78px;
          height: 78px;
          border-radius: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255,255,255,0.92);
          border: 1px solid rgba(255,255,255,0.96);
          box-shadow:
            0 16px 34px rgba(15,23,42,0.10),
            0 8px 18px rgba(37,99,235,0.08),
            inset 0 1px 0 rgba(255,255,255,0.90);
          overflow: hidden;
          animation: brandV2Pulse 1.8s ease-in-out infinite;
        }

        .brand-v2-logo-shell::before {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(
            135deg,
            rgba(255,255,255,0.42) 0%,
            transparent 55%
          );
          pointer-events: none;
        }

        .brand-v2-logo {
          width: 50px;
          height: 50px;
          object-fit: contain;
          position: relative;
          z-index: 2;
          animation: brandV2Blink 1.8s ease-in-out infinite;
          filter: drop-shadow(0 4px 10px rgba(37,99,235,0.08));
        }

        .brand-v2-fallback {
          position: relative;
          z-index: 2;
          font-size: 1.7rem;
          font-weight: 900;
          color: #1d4ed8;
          animation: brandV2Blink 1.8s ease-in-out infinite;
        }

        .brand-v2-reflection {
          position: absolute;
          bottom: -10px;
          left: 50%;
          transform: translateX(-50%);
          width: 56px;
          height: 10px;
          border-radius: 999px;
          background: radial-gradient(circle, rgba(37,99,235,0.14) 0%, transparent 72%);
          filter: blur(8px);
          opacity: 0.7;
        }

        .brand-v2-title {
          font-size: 1rem;
          font-weight: 900;
          color: #0f172a;
          margin: 0 0 7px 0;
          letter-spacing: -0.02em;
        }

        .brand-v2-subtitle {
          font-size: 0.88rem;
          color: #64748b;
          line-height: 1.65;
          margin: 0 0 16px 0;
          font-weight: 600;
          min-height: 2.8em;
          transition: opacity 0.25s ease;
        }

        .brand-v2-progress-track {
          width: 100%;
          height: 10px;
          border-radius: 999px;
          background: rgba(148,163,184,0.16);
          overflow: hidden;
          position: relative;
          margin-bottom: 14px;
        }

        .brand-v2-progress-track::before {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(
            90deg,
            rgba(255,255,255,0),
            rgba(255,255,255,0.28),
            rgba(255,255,255,0)
          );
          animation: brandV2Shine 1.8s linear infinite;
        }

        .brand-v2-progress-bar {
          width: 42%;
          height: 100%;
          border-radius: 999px;
          background: linear-gradient(135deg, #081226 0%, #102247 45%, #1d4ed8 100%);
          box-shadow: 0 6px 16px rgba(29,78,216,0.18);
          animation: brandV2Slide 1.35s ease-in-out infinite;
        }

        .brand-v2-footer {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.84rem;
          color: #64748b;
          font-weight: 700;
        }

        .brand-v2-dots {
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }

        .brand-v2-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #2563eb;
          opacity: 0.28;
          box-shadow: 0 0 10px rgba(37,99,235,0.14);
          animation: brandV2Dots 1.2s infinite ease-in-out;
        }

        .brand-v2-dot:nth-child(2) {
          animation-delay: 0.18s;
        }

        .brand-v2-dot:nth-child(3) {
          animation-delay: 0.36s;
        }

        @keyframes brandV2Pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.04); }
        }

        @keyframes brandV2Glow {
          0%, 100% {
            transform: scale(0.94);
            opacity: 0.6;
          }
          50% {
            transform: scale(1.08);
            opacity: 1;
          }
        }

        @keyframes brandV2Blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.58; }
        }

        @keyframes brandV2Slide {
          0% { transform: translateX(-120%); }
          100% { transform: translateX(320%); }
        }

        @keyframes brandV2Shine {
          0% { transform: translateX(-140%); }
          100% { transform: translateX(180%); }
        }

        @keyframes brandV2Dots {
          0%, 80%, 100% {
            opacity: 0.25;
            transform: translateY(0);
          }
          40% {
            opacity: 1;
            transform: translateY(-2px);
          }
        }

        @keyframes brandV2Float {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-16px) translateX(8px); }
        }

        @keyframes brandV2Particle {
          0%, 100% {
            transform: translateY(0) scale(1);
            opacity: 0.25;
          }
          50% {
            transform: translateY(-10px) scale(1.2);
            opacity: 0.8;
          }
        }

        @keyframes brandV2GradientMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        @media (max-width: 767px) {
          .brand-v2-loader-card {
            max-width: 332px;
            border-radius: 26px;
          }

          .brand-v2-loader-inner {
            border-radius: 25px;
            padding: 24px 18px 20px;
          }

          .brand-v2-logo-wrap {
            width: 88px;
            height: 88px;
            margin-bottom: 16px;
          }

          .brand-v2-logo-glow {
            width: 86px;
            height: 86px;
          }

          .brand-v2-logo-shell {
            width: 70px;
            height: 70px;
            border-radius: 22px;
          }

          .brand-v2-logo {
            width: 44px;
            height: 44px;
          }

          .brand-v2-title {
            font-size: 0.94rem;
          }

          .brand-v2-subtitle {
            font-size: 0.82rem;
            min-height: 2.6em;
          }
        }
      `}</style>

      <div
        className="brand-v2-loader-page"
        style={!fullScreen ? { minHeight } : undefined}
      >
        <div className="brand-v2-orb brand-v2-orb-1"></div>
        <div className="brand-v2-orb brand-v2-orb-2"></div>
        <div className="brand-v2-orb brand-v2-orb-3"></div>

        <div className="brand-v2-particle brand-v2-particle-1"></div>
        <div className="brand-v2-particle brand-v2-particle-2"></div>
        <div className="brand-v2-particle brand-v2-particle-3"></div>
        <div className="brand-v2-particle brand-v2-particle-4"></div>

        <div className="brand-v2-loader-card">
          <div className="brand-v2-loader-inner">
            <div className="brand-v2-logo-wrap">
              <div className="brand-v2-logo-glow"></div>

              <div className="brand-v2-logo-shell">
                {!logoFailed ? (
                  <img
                    src={BRAND_LOGO_URL}
                    alt="InternovaTech Brand Logo"
                    className="brand-v2-logo"
                    onError={() => setLogoFailed(true)}
                  />
                ) : (
                  <div className="brand-v2-fallback">I</div>
                )}
              </div>

              <div className="brand-v2-reflection"></div>
            </div>

            {title ? <p className="brand-v2-title">{title}</p> : null}

            <p className="brand-v2-subtitle">{displaySubtitle}</p>

            <div className="brand-v2-progress-track">
              <div className="brand-v2-progress-bar"></div>
            </div>

            <div className="brand-v2-footer">
              Please wait
              <span className="brand-v2-dots">
                <span className="brand-v2-dot"></span>
                <span className="brand-v2-dot"></span>
                <span className="brand-v2-dot"></span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default BrandLoader;
