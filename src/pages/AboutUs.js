import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function AboutUs() {
  const [pointer, setPointer] = useState({ x: 50, y: 22 });

  useEffect(() => {
    document.title =
      "InternovaTech - Online Internships, Verified Certificates and Tech Training";

    const metaDescription = document.querySelector('meta[name="description"]');
    const previousDescription = metaDescription?.getAttribute("content") || "";

    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        "InternovaTech offers premium online internships with practical learning, guided modules, assessments, progress tracking and verified certificates across Web Development, Data Science, Artificial Intelligence, Finance and more."
      );
    }

    let canonicalTag = document.querySelector('link[rel="canonical"]');
    const canonicalAlreadyExists = !!canonicalTag;

    if (!canonicalTag) {
      canonicalTag = document.createElement("link");
      canonicalTag.setAttribute("rel", "canonical");
      document.head.appendChild(canonicalTag);
    }

    canonicalTag.setAttribute("href", "https://www.internovatech.in/");

    return () => {
      document.title =
        "InternovaTech - Online Internships, Certificates and Tech Training";

      if (metaDescription) {
        metaDescription.setAttribute("content", previousDescription);
      }

      if (!canonicalAlreadyExists && canonicalTag) {
        canonicalTag.remove();
      }
    };
  }, []);

  const handleHeroPointerMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setPointer({ x, y });
  };

  const handleHeroPointerLeave = () => {
    setPointer({ x: 50, y: 22 });
  };

  return (
    <>
      <style>{`
        .home-v61-page {
          min-height: 100vh;
          background:
            radial-gradient(circle at top left, rgba(59,130,246,0.16), transparent 28%),
            radial-gradient(circle at 82% 12%, rgba(99,102,241,0.14), transparent 24%),
            radial-gradient(circle at bottom right, rgba(16,185,129,0.10), transparent 24%),
            linear-gradient(135deg, #f8fbff 0%, #eef4ff 48%, #f8fbff 100%);
          position: relative;
          overflow: hidden;
          padding: 38px 0 84px;
        }

        .home-v61-page::before {
          content: "";
          position: absolute;
          inset: 0;
          background:
            linear-gradient(rgba(255,255,255,0.24), rgba(255,255,255,0.18)),
            repeating-linear-gradient(
              90deg,
              rgba(255,255,255,0.04) 0px,
              rgba(255,255,255,0.04) 1px,
              transparent 1px,
              transparent 120px
            );
          pointer-events: none;
        }

        .home-v61-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(16px);
          opacity: 0.52;
          pointer-events: none;
          animation: homeV61Float 10s ease-in-out infinite;
          -webkit-animation: homeV61Float 10s ease-in-out infinite;
        }

        .home-v61-orb-1 {
          width: 280px;
          height: 280px;
          top: 90px;
          left: -80px;
          background: linear-gradient(135deg, rgba(29,78,216,0.24), rgba(14,165,233,0.18));
        }

        .home-v61-orb-2 {
          width: 340px;
          height: 340px;
          right: -90px;
          top: 130px;
          background: linear-gradient(135deg, rgba(99,102,241,0.20), rgba(59,130,246,0.18));
          animation-delay: 1.4s;
          -webkit-animation-delay: 1.4s;
        }

        .home-v61-orb-3 {
          width: 240px;
          height: 240px;
          right: 10%;
          bottom: 4%;
          background: linear-gradient(135deg, rgba(16,185,129,0.14), rgba(37,99,235,0.12));
          animation-delay: 2s;
          -webkit-animation-delay: 2s;
        }

        .home-v61-shell {
          position: relative;
          z-index: 2;
        }

        .home-v61-hero-wrap {
          position: relative;
          overflow: hidden;
          border-radius: 38px;
          padding: 34px;
          background:
            linear-gradient(135deg, rgba(255,255,255,0.82) 0%, rgba(255,255,255,0.70) 100%);
          border: 1px solid rgba(255,255,255,0.74);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          box-shadow:
            0 30px 80px rgba(15,23,42,0.10),
            0 12px 30px rgba(59,130,246,0.06);
          -webkit-box-shadow:
            0 30px 80px rgba(15,23,42,0.10),
            0 12px 30px rgba(59,130,246,0.06);
        }

        .home-v61-hero-wrap::before {
          content: "";
          position: absolute;
          inset: 0;
          background:
            radial-gradient(circle at var(--pointer-x, 50%) var(--pointer-y, 22%), rgba(96,165,250,0.18), transparent 22%),
            radial-gradient(circle at 18% 18%, rgba(255,255,255,0.38), transparent 18%),
            radial-gradient(circle at 86% 72%, rgba(255,255,255,0.24), transparent 20%);
          pointer-events: none;
          transition: background 0.18s ease;
          -webkit-transition: background 0.18s ease;
        }

        .home-v61-hero-wrap::after {
          content: "";
          position: absolute;
          inset: 0;
          background:
            linear-gradient(rgba(255,255,255,0.02), rgba(255,255,255,0.02)),
            repeating-linear-gradient(
              0deg,
              rgba(37,99,235,0.035) 0px,
              rgba(37,99,235,0.035) 1px,
              transparent 1px,
              transparent 42px
            ),
            repeating-linear-gradient(
              90deg,
              rgba(37,99,235,0.035) 0px,
              rgba(37,99,235,0.035) 1px,
              transparent 1px,
              transparent 42px
            );
          mask-image: linear-gradient(to bottom, rgba(0,0,0,0.75), transparent 85%);
          -webkit-mask-image: linear-gradient(to bottom, rgba(0,0,0,0.75), transparent 85%);
          pointer-events: none;
          opacity: 0.85;
        }

        .home-v61-badge {
          position: relative;
          z-index: 2;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 18px;
          border-radius: 999px;
          background: rgba(37,99,235,0.10);
          border: 1px solid rgba(37,99,235,0.16);
          color: #1d4ed8;
          font-weight: 800;
          font-size: 0.82rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: 18px;
          box-shadow: inset 0 0 0 1px rgba(255,255,255,0.18);
          -webkit-box-shadow: inset 0 0 0 1px rgba(255,255,255,0.18);
        }

        .home-v61-title {
          position: relative;
          z-index: 2;
          font-size: 4.1rem;
          line-height: 1.02;
          font-weight: 900;
          letter-spacing: -0.055em;
          color: #0f172a;
          margin-bottom: 18px;
        }

        .home-v61-title-accent {
          background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 42%, #0f172a 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          -webkit-text-fill-color: transparent;
        }

        .home-v61-subtitle {
          position: relative;
          z-index: 2;
          font-size: 1.12rem;
          line-height: 1.95;
          color: #475569;
          margin-bottom: 0;
          max-width: 760px;
        }

        .home-v61-cta-row {
          position: relative;
          z-index: 2;
          display: flex;
          flex-wrap: wrap;
          gap: 14px;
          margin-top: 28px;
        }

        .home-v61-btn-primary,
        .home-v61-btn-success,
        .home-v61-btn-outline {
          min-height: 56px;
          padding: 0 24px;
          border-radius: 18px;
          font-weight: 800;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: all 0.32s ease;
          -webkit-transition: all 0.32s ease;
        }

        .home-v61-btn-primary {
          color: #fff;
          border: none;
          background: linear-gradient(135deg, #081226 0%, #102247 45%, #1d4ed8 100%);
          box-shadow:
            0 20px 38px rgba(29,78,216,0.18),
            0 8px 18px rgba(8,18,38,0.14);
          -webkit-box-shadow:
            0 20px 38px rgba(29,78,216,0.18),
            0 8px 18px rgba(8,18,38,0.14);
        }

        .home-v61-btn-primary:hover {
          color: #fff;
          transform: translateY(-2px);
          -webkit-transform: translateY(-2px);
        }

        .home-v61-btn-success {
          color: #fff;
          border: none;
          background: linear-gradient(135deg, #059669 0%, #10b981 100%);
          box-shadow: 0 18px 36px rgba(16,185,129,0.18);
          -webkit-box-shadow: 0 18px 36px rgba(16,185,129,0.18);
        }

        .home-v61-btn-success:hover {
          color: #fff;
          transform: translateY(-2px);
          -webkit-transform: translateY(-2px);
        }

        .home-v61-btn-outline {
          color: #0f172a;
          border: 1px solid #dbeafe;
          background: rgba(255,255,255,0.78);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          box-shadow: 0 12px 28px rgba(15,23,42,0.05);
          -webkit-box-shadow: 0 12px 28px rgba(15,23,42,0.05);
        }

        .home-v61-btn-outline:hover {
          color: #0f172a;
          background: #ffffff;
          transform: translateY(-2px);
          -webkit-transform: translateY(-2px);
        }

        .home-v61-mini-strip {
          position: relative;
          z-index: 2;
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 26px;
        }

        .home-v61-mini-chip {
          padding: 10px 14px;
          border-radius: 999px;
          background: rgba(255,255,255,0.70);
          border: 1px solid rgba(148,163,184,0.16);
          color: #334155;
          font-size: 0.84rem;
          font-weight: 700;
          box-shadow: 0 10px 24px rgba(15,23,42,0.04);
          -webkit-box-shadow: 0 10px 24px rgba(15,23,42,0.04);
        }

        .home-v61-showcase {
          position: relative;
          height: 100%;
          min-height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .home-v61-dashboard {
          position: relative;
          width: 100%;
          max-width: 520px;
          border-radius: 30px;
          overflow: hidden;
          background:
            linear-gradient(135deg, #081226 0%, #102247 44%, #1d4ed8 100%);
          color: #fff;
          padding: 24px;
          box-shadow:
            0 30px 80px rgba(15,23,42,0.18),
            0 10px 26px rgba(29,78,216,0.10);
          -webkit-box-shadow:
            0 30px 80px rgba(15,23,42,0.18),
            0 10px 26px rgba(29,78,216,0.10);
          animation: homeV61CardFloat 6.2s ease-in-out infinite;
          -webkit-animation: homeV61CardFloat 6.2s ease-in-out infinite;
        }

        .home-v61-dashboard::before {
          content: "";
          position: absolute;
          inset: 0;
          background:
            radial-gradient(circle at 14% 16%, rgba(255,255,255,0.14), transparent 18%),
            radial-gradient(circle at 86% 74%, rgba(255,255,255,0.08), transparent 20%);
          pointer-events: none;
        }

        .home-v61-window-top {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 18px;
        }

        .home-v61-window-dots {
          display: flex;
          gap: 8px;
        }

        .home-v61-window-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: rgba(255,255,255,0.75);
        }

        .home-v61-window-title {
          font-size: 0.86rem;
          font-weight: 800;
          color: rgba(255,255,255,0.82);
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }

        .home-v61-metric-grid {
          position: relative;
          z-index: 2;
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 14px;
          margin-bottom: 16px;
        }

        .home-v61-metric-card {
          border-radius: 22px;
          background: rgba(255,255,255,0.10);
          border: 1px solid rgba(255,255,255,0.14);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          padding: 18px;
          transition: all 0.32s ease;
          -webkit-transition: all 0.32s ease;
        }

        .home-v61-metric-card:hover {
          transform: translateY(-3px);
          -webkit-transform: translateY(-3px);
          background: rgba(255,255,255,0.13);
        }

        .home-v61-metric-label {
          font-size: 0.78rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: rgba(255,255,255,0.68);
          font-weight: 800;
          margin-bottom: 8px;
        }

        .home-v61-metric-value {
          font-size: 1.45rem;
          font-weight: 900;
          color: #fff;
          margin-bottom: 6px;
        }

        .home-v61-metric-text {
          color: rgba(255,255,255,0.74);
          font-size: 0.9rem;
          line-height: 1.65;
          margin-bottom: 0;
        }

        .home-v61-panel {
          position: relative;
          z-index: 2;
          border-radius: 24px;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.12);
          padding: 20px;
          margin-top: 14px;
        }

        .home-v61-panel-title {
          font-size: 1rem;
          font-weight: 900;
          color: #fff;
          margin-bottom: 12px;
          letter-spacing: -0.02em;
        }

        .home-v61-progress-list {
          display: grid;
          gap: 12px;
        }

        .home-v61-progress-item {
          display: grid;
          gap: 8px;
        }

        .home-v61-progress-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          color: rgba(255,255,255,0.82);
          font-weight: 700;
          font-size: 0.92rem;
        }

        .home-v61-progress-bar {
          width: 100%;
          height: 10px;
          border-radius: 999px;
          background: rgba(255,255,255,0.12);
          overflow: hidden;
        }

        .home-v61-progress-fill {
          height: 100%;
          border-radius: 999px;
          background: linear-gradient(135deg, #34d399 0%, #60a5fa 100%);
        }

        .home-v61-floating-card {
          position: absolute;
          border-radius: 22px;
          background: rgba(255,255,255,0.86);
          border: 1px solid rgba(255,255,255,0.88);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          box-shadow: 0 20px 46px rgba(15,23,42,0.10);
          -webkit-box-shadow: 0 20px 46px rgba(15,23,42,0.10);
          padding: 18px;
          transition: all 0.34s ease;
          -webkit-transition: all 0.34s ease;
        }

        .home-v61-floating-card:hover {
          transform: translateY(-5px);
          -webkit-transform: translateY(-5px);
        }

        .home-v61-floating-left {
          left: -20px;
          bottom: 42px;
          width: 210px;
          animation: homeV61FloatMini 5.8s ease-in-out infinite;
          -webkit-animation: homeV61FloatMini 5.8s ease-in-out infinite;
        }

        .home-v61-floating-right {
          right: -16px;
          top: 74px;
          width: 220px;
          animation: homeV61FloatMini 6.4s ease-in-out infinite;
          -webkit-animation: homeV61FloatMini 6.4s ease-in-out infinite;
          animation-delay: 1.1s;
          -webkit-animation-delay: 1.1s;
        }

        .home-v61-floating-title {
          font-size: 0.92rem;
          font-weight: 900;
          color: #0f172a;
          margin-bottom: 6px;
          letter-spacing: -0.02em;
        }

        .home-v61-floating-text {
          font-size: 0.88rem;
          color: #475569;
          line-height: 1.7;
          margin-bottom: 0;
        }

        .home-v61-trust-strip {
          margin-top: 24px;
          border-radius: 24px;
          background: rgba(255,255,255,0.78);
          border: 1px solid rgba(148,163,184,0.14);
          box-shadow: 0 18px 42px rgba(15,23,42,0.06);
          -webkit-box-shadow: 0 18px 42px rgba(15,23,42,0.06);
          padding: 18px 22px;
        }

        .home-v61-trust-row {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 14px;
        }

        .home-v61-trust-item {
          border-radius: 18px;
          background: rgba(248,250,252,0.95);
          border: 1px solid #e2e8f0;
          padding: 16px;
          text-align: center;
          transition: all 0.3s ease;
          -webkit-transition: all 0.3s ease;
        }

        .home-v61-trust-item:hover {
          transform: translateY(-4px);
          -webkit-transform: translateY(-4px);
          box-shadow: 0 14px 30px rgba(15,23,42,0.06);
          -webkit-box-shadow: 0 14px 30px rgba(15,23,42,0.06);
        }

        .home-v61-trust-label {
          font-size: 0.78rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #64748b;
          font-weight: 800;
          margin-bottom: 8px;
        }

        .home-v61-trust-value {
          font-size: 1.08rem;
          font-weight: 900;
          color: #0f172a;
          margin-bottom: 0;
        }

        .home-v61-section {
          margin-top: 34px;
        }

        .home-v61-grid-card {
          height: 100%;
          border-radius: 30px;
          background: rgba(255,255,255,0.78);
          border: 1px solid rgba(255,255,255,0.76);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          box-shadow:
            0 24px 60px rgba(15,23,42,0.08),
            0 8px 20px rgba(59,130,246,0.05);
          -webkit-box-shadow:
            0 24px 60px rgba(15,23,42,0.08),
            0 8px 20px rgba(59,130,246,0.05);
          padding: 28px;
          transition: all 0.35s ease;
          -webkit-transition: all 0.35s ease;
          position: relative;
          overflow: hidden;
        }

        .home-v61-grid-card:hover {
          transform: translateY(-6px);
          -webkit-transform: translateY(-6px);
          box-shadow:
            0 30px 72px rgba(15,23,42,0.11),
            0 10px 24px rgba(59,130,246,0.07);
          -webkit-box-shadow:
            0 30px 72px rgba(15,23,42,0.11),
            0 10px 24px rgba(59,130,246,0.07);
        }

        .home-v61-card-icon {
          width: 62px;
          height: 62px;
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
          color: #1d4ed8;
          font-size: 1.3rem;
          font-weight: 900;
          margin-bottom: 18px;
          border: 1px solid #dbeafe;
          box-shadow: 0 10px 24px rgba(37,99,235,0.08);
          -webkit-box-shadow: 0 10px 24px rgba(37,99,235,0.08);
        }

        .home-v61-card-title {
          font-size: 1.22rem;
          font-weight: 900;
          color: #0f172a;
          margin-bottom: 12px;
          letter-spacing: -0.02em;
        }

        .home-v61-card-text {
          color: #475569;
          line-height: 1.9;
          margin-bottom: 0;
        }

        .home-v61-process-band {
          margin-top: 34px;
          border-radius: 34px;
          overflow: hidden;
          position: relative;
          background:
            linear-gradient(135deg, #081226 0%, #102247 42%, #1d4ed8 100%);
          color: #fff;
          box-shadow:
            0 30px 80px rgba(15,23,42,0.16),
            0 10px 28px rgba(29,78,216,0.10);
          -webkit-box-shadow:
            0 30px 80px rgba(15,23,42,0.16),
            0 10px 28px rgba(29,78,216,0.10);
        }

        .home-v61-process-band::before {
          content: "";
          position: absolute;
          inset: 0;
          background:
            radial-gradient(circle at 14% 18%, rgba(255,255,255,0.14), transparent 18%),
            radial-gradient(circle at 86% 74%, rgba(255,255,255,0.08), transparent 20%);
          pointer-events: none;
        }

        .home-v61-process-inner {
          position: relative;
          z-index: 2;
          padding: 34px;
        }

        .home-v61-process-title {
          font-size: 2.15rem;
          font-weight: 900;
          letter-spacing: -0.04em;
          margin-bottom: 14px;
        }

        .home-v61-process-text {
          color: rgba(255,255,255,0.82);
          line-height: 1.9;
          margin-bottom: 0;
        }

        .home-v61-step-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 14px;
          margin-top: 24px;
        }

        .home-v61-step-card {
          border-radius: 22px;
          background: rgba(255,255,255,0.10);
          border: 1px solid rgba(255,255,255,0.14);
          padding: 18px;
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          transition: all 0.3s ease;
          -webkit-transition: all 0.3s ease;
        }

        .home-v61-step-card:hover {
          transform: translateY(-4px);
          -webkit-transform: translateY(-4px);
          background: rgba(255,255,255,0.14);
        }

        .home-v61-step-number {
          width: 42px;
          height: 42px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255,255,255,0.14);
          border: 1px solid rgba(255,255,255,0.18);
          color: #fff;
          font-weight: 900;
          margin-bottom: 14px;
        }

        .home-v61-step-title {
          font-size: 1rem;
          font-weight: 900;
          color: #fff;
          margin-bottom: 8px;
          letter-spacing: -0.02em;
        }

        .home-v61-step-text {
          color: rgba(255,255,255,0.76);
          line-height: 1.75;
          margin-bottom: 0;
          font-size: 0.92rem;
        }

        .home-v61-final-card {
          margin-top: 34px;
          border-radius: 30px;
          background: rgba(255,255,255,0.84);
          border: 1px solid rgba(148,163,184,0.16);
          box-shadow: 0 20px 52px rgba(15,23,42,0.07);
          -webkit-box-shadow: 0 20px 52px rgba(15,23,42,0.07);
          padding: 30px;
        }

        .home-v61-final-title {
          font-size: 1.6rem;
          font-weight: 900;
          color: #0f172a;
          margin-bottom: 12px;
          letter-spacing: -0.02em;
        }

        .home-v61-final-text {
          color: #475569;
          line-height: 1.9;
          margin-bottom: 0;
        }

        .home-v61-link-row {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 20px;
        }

        .home-v61-link-chip {
          padding: 11px 16px;
          border-radius: 999px;
          background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
          border: 1px solid #dbeafe;
          color: #0f172a;
          font-weight: 800;
          text-decoration: none;
          transition: all 0.28s ease;
          -webkit-transition: all 0.28s ease;
        }

        .home-v61-link-chip:hover {
          color: #0f172a;
          transform: translateY(-2px);
          -webkit-transform: translateY(-2px);
          box-shadow: 0 12px 24px rgba(37,99,235,0.08);
          -webkit-box-shadow: 0 12px 24px rgba(37,99,235,0.08);
        }

        @keyframes homeV61Float {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
          }
          50% {
            transform: translateY(-20px) translateX(10px);
          }
        }

        @-webkit-keyframes homeV61Float {
          0%, 100% {
            -webkit-transform: translateY(0px) translateX(0px);
          }
          50% {
            -webkit-transform: translateY(-20px) translateX(10px);
          }
        }

        @keyframes homeV61CardFloat {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
          }
        }

        @-webkit-keyframes homeV61CardFloat {
          0%, 100% {
            -webkit-transform: translateY(0px);
          }
          50% {
            -webkit-transform: translateY(-8px);
          }
        }

        @keyframes homeV61FloatMini {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-7px);
          }
        }

        @-webkit-keyframes homeV61FloatMini {
          0%, 100% {
            -webkit-transform: translateY(0px);
          }
          50% {
            -webkit-transform: translateY(-7px);
          }
        }

        @media (max-width: 1399px) {
          .home-v61-title {
            font-size: 3.6rem;
          }
        }

        @media (max-width: 1199px) {
          .home-v61-title {
            font-size: 3rem;
          }

          .home-v61-step-grid,
          .home-v61-trust-row {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .home-v61-floating-left {
            left: -8px;
            bottom: 24px;
          }

          .home-v61-floating-right {
            right: -8px;
          }
        }

        @media (max-width: 991px) {
          .home-v61-page {
            padding: 28px 0 64px;
          }

          .home-v61-hero-wrap,
          .home-v61-process-inner,
          .home-v61-final-card,
          .home-v61-trust-strip {
            padding: 24px;
          }

          .home-v61-title {
            font-size: 2.5rem;
            line-height: 1.08;
          }

          .home-v61-process-title {
            font-size: 1.8rem;
          }

          .home-v61-showcase {
            margin-top: 26px;
          }

          .home-v61-dashboard {
            max-width: 100%;
          }

          .home-v61-floating-left,
          .home-v61-floating-right {
            position: relative;
            width: 100%;
            left: auto;
            right: auto;
            top: auto;
            bottom: auto;
            margin-top: 14px;
          }
        }

        @media (max-width: 767px) {
          .home-v61-title {
            font-size: 2.05rem;
          }

          .home-v61-subtitle,
          .home-v61-card-text,
          .home-v61-process-text,
          .home-v61-step-text,
          .home-v61-final-text,
          .home-v61-metric-text {
            line-height: 1.8;
          }

          .home-v61-hero-wrap,
          .home-v61-grid-card,
          .home-v61-dashboard,
          .home-v61-process-inner,
          .home-v61-final-card,
          .home-v61-trust-strip,
          .home-v61-step-card {
            padding: 22px;
            border-radius: 22px;
          }

          .home-v61-cta-row {
            gap: 12px;
          }

          .home-v61-btn-primary,
          .home-v61-btn-success,
          .home-v61-btn-outline {
            width: 100%;
          }

          .home-v61-trust-row,
          .home-v61-step-grid,
          .home-v61-metric-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="home-v61-page">
        <div className="home-v61-orb home-v61-orb-1"></div>
        <div className="home-v61-orb home-v61-orb-2"></div>
        <div className="home-v61-orb home-v61-orb-3"></div>

        <div className="container home-v61-shell">
          <section
            className="home-v61-hero-wrap"
            style={{
              "--pointer-x": `${pointer.x}%`,
              "--pointer-y": `${pointer.y}%`,
            }}
            onMouseMove={handleHeroPointerMove}
            onMouseLeave={handleHeroPointerLeave}
          >
            <div className="row g-4 align-items-center">
              <div className="col-lg-7">
                <div className="home-v61-badge">
                  InternovaTech SaaS Learning Experience
                </div>

                <h1 className="home-v61-title">
                  <span className="home-v61-title-accent">InternovaTech</span> is
                  your premium platform for online internships, practical
                  learning, and verified digital achievement.
                </h1>

                <p className="home-v61-subtitle">
                  InternovaTech helps students, freshers, and learners build
                  real career-focused skills through structured internship
                  programs, guided modules, assessments, progress tracking, and
                  certificate verification support. Our platform is designed to
                  deliver a futuristic, premium, and outcome-driven learning
                  experience across Web Development, Data Science, Artificial
                  Intelligence, Finance, and other in-demand fields.
                </p>

                <div className="home-v61-cta-row">
                  <Link to="/internships" className="home-v61-btn-primary">
                    Explore Internships
                  </Link>

                  <Link to="/verify" className="home-v61-btn-success">
                    Verify Certificate
                  </Link>

                  <Link to="/login" className="home-v61-btn-outline">
                    Login to Dashboard
                  </Link>

                  <Link to="/contact" className="home-v61-btn-outline">
                    Contact Us
                  </Link>
                </div>

                <div className="home-v61-mini-strip">
                  <span className="home-v61-mini-chip">Practical Learning Flow</span>
                  <span className="home-v61-mini-chip">Verified Certificates</span>
                  <span className="home-v61-mini-chip">Premium Dashboard UX</span>
                  <span className="home-v61-mini-chip">
                    Career-Focused Internship Paths
                  </span>
                </div>
              </div>

              <div className="col-lg-5">
                <div className="home-v61-showcase">
                  <div className="home-v61-dashboard">
                    <div className="home-v61-window-top">
                      <div className="home-v61-window-dots">
                        <span className="home-v61-window-dot"></span>
                        <span className="home-v61-window-dot"></span>
                        <span className="home-v61-window-dot"></span>
                      </div>
                      <div className="home-v61-window-title">
                        InternovaTech Workspace
                      </div>
                    </div>

                    <div className="home-v61-metric-grid">
                      <div className="home-v61-metric-card">
                        <div className="home-v61-metric-label">Programs</div>
                        <div className="home-v61-metric-value">Multi-Domain</div>
                        <p className="home-v61-metric-text">
                          Explore role-focused internship paths with premium structure.
                        </p>
                      </div>

                      <div className="home-v61-metric-card">
                        <div className="home-v61-metric-label">Certificates</div>
                        <div className="home-v61-metric-value">Verified</div>
                        <p className="home-v61-metric-text">
                          Public verification makes learning outcomes more trusted.
                        </p>
                      </div>
                    </div>

                    <div className="home-v61-panel">
                      <h3 className="home-v61-panel-title">
                        Learning Progress Preview
                      </h3>
                      <div className="home-v61-progress-list">
                        <div className="home-v61-progress-item">
                          <div className="home-v61-progress-meta">
                            <span>Program Completion</span>
                            <span>82%</span>
                          </div>
                          <div className="home-v61-progress-bar">
                            <div
                              className="home-v61-progress-fill"
                              style={{ width: "82%" }}
                            ></div>
                          </div>
                        </div>

                        <div className="home-v61-progress-item">
                          <div className="home-v61-progress-meta">
                            <span>Assessment Readiness</span>
                            <span>74%</span>
                          </div>
                          <div className="home-v61-progress-bar">
                            <div
                              className="home-v61-progress-fill"
                              style={{ width: "74%" }}
                            ></div>
                          </div>
                        </div>

                        <div className="home-v61-progress-item">
                          <div className="home-v61-progress-meta">
                            <span>Certificate Eligibility</span>
                            <span>90%</span>
                          </div>
                          <div className="home-v61-progress-bar">
                            <div
                              className="home-v61-progress-fill"
                              style={{ width: "90%" }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="home-v61-floating-card home-v61-floating-left">
                    <h4 className="home-v61-floating-title">Trusted Validation</h4>
                    <p className="home-v61-floating-text">
                      Certificate verification and completion-based proof add more credibility.
                    </p>
                  </div>

                  <div className="home-v61-floating-card home-v61-floating-right">
                    <h4 className="home-v61-floating-title">Premium UX</h4>
                    <p className="home-v61-floating-text">
                      Smooth access, clean structure, and dashboard-level experience in one place.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="home-v61-trust-strip">
            <div className="home-v61-trust-row">
              <div className="home-v61-trust-item">
                <div className="home-v61-trust-label">Learning Model</div>
                <p className="home-v61-trust-value">Structured & Practical</p>
              </div>

              <div className="home-v61-trust-item">
                <div className="home-v61-trust-label">Experience</div>
                <p className="home-v61-trust-value">Premium UI / UX</p>
              </div>

              <div className="home-v61-trust-item">
                <div className="home-v61-trust-label">Assessment</div>
                <p className="home-v61-trust-value">Trackable Progress</p>
              </div>

              <div className="home-v61-trust-item">
                <div className="home-v61-trust-label">Trust Layer</div>
                <p className="home-v61-trust-value">Verified Certificates</p>
              </div>
            </div>
          </section>

          <section className="home-v61-section">
            <div className="row g-4">
              <div className="col-lg-4 col-md-6">
                <div className="home-v61-grid-card">
                  <div className="home-v61-card-icon">01</div>
                  <h2 className="home-v61-card-title">Structured Learning Experience</h2>
                  <p className="home-v61-card-text">
                    InternovaTech provides organized access to guided programs,
                    premium visual flow, and learner-first experiences so users
                    can focus on actual improvement instead of complexity.
                  </p>
                </div>
              </div>

              <div className="col-lg-4 col-md-6">
                <div className="home-v61-grid-card">
                  <div className="home-v61-card-icon">02</div>
                  <h2 className="home-v61-card-title">
                    Assessments and Progress Tracking
                  </h2>
                  <p className="home-v61-card-text">
                    Dashboard-driven tracking, mini tests, and structured
                    module progression help learners understand their journey
                    clearly and move forward with confidence.
                  </p>
                </div>
              </div>

              <div className="col-lg-4 col-md-12">
                <div className="home-v61-grid-card">
                  <div className="home-v61-card-icon">03</div>
                  <h2 className="home-v61-card-title">
                    Certificate Verification Support
                  </h2>
                  <p className="home-v61-card-text">
                    Completion-based certificate support with public validation,
                    digital verification, and trusted document credibility helps
                    learners present stronger outcomes.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="home-v61-section">
            <div className="row g-4">
              <div className="col-md-6">
                <div className="home-v61-grid-card">
                  <div className="home-v61-card-icon">04</div>
                  <h2 className="home-v61-card-title">Our Mission</h2>
                  <p className="home-v61-card-text">
                    Our mission is to make online internships and digital
                    learning more accessible, skill-oriented, premium, and
                    professional by combining learner support, structured
                    training, assessments, and verified achievement in one place.
                  </p>
                </div>
              </div>

              <div className="col-md-6">
                <div className="home-v61-grid-card">
                  <div className="home-v61-card-icon">05</div>
                  <h2 className="home-v61-card-title">What We Focus On</h2>
                  <p className="home-v61-card-text">
                    InternovaTech focuses on practical skill development,
                    internship participation, progress visibility, assessment
                    readiness, certificate eligibility, and smoother learning
                    journeys from start to completion.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="home-v61-process-band">
            <div className="home-v61-process-inner">
              <h2 className="home-v61-process-title">How InternovaTech works</h2>
              <p className="home-v61-process-text">
                InternovaTech combines premium SaaS design with structured
                learning flow, helping students and freshers go from exploration
                to completion inside one trusted internship ecosystem.
              </p>

              <div className="home-v61-step-grid">
                <div className="home-v61-step-card">
                  <div className="home-v61-step-number">01</div>
                  <h3 className="home-v61-step-title">Explore</h3>
                  <p className="home-v61-step-text">
                    Discover role-focused internship programs across modern domains.
                  </p>
                </div>

                <div className="home-v61-step-card">
                  <div className="home-v61-step-number">02</div>
                  <h3 className="home-v61-step-title">Enroll</h3>
                  <p className="home-v61-step-text">
                    Select a plan and unlock guided learning access with structure.
                  </p>
                </div>

                <div className="home-v61-step-card">
                  <div className="home-v61-step-number">03</div>
                  <h3 className="home-v61-step-title">Progress</h3>
                  <p className="home-v61-step-text">
                    Continue modules, track milestones, and complete mini tests.
                  </p>
                </div>

                <div className="home-v61-step-card">
                  <div className="home-v61-step-number">04</div>
                  <h3 className="home-v61-step-title">Validate</h3>
                  <p className="home-v61-step-text">
                    Generate and verify certificates through a trusted digital system.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="home-v61-final-card">
            <h2 className="home-v61-final-title">
              Start your journey with InternovaTech
            </h2>
            <p className="home-v61-final-text">
              Whether you want to explore internship programs, continue your
              dashboard, verify certificates, or build job-ready skills,
              InternovaTech is designed to give you a polished, futuristic,
              and growth-focused learning experience.
            </p>

            <div className="home-v61-link-row">
              <Link to="/internships" className="home-v61-link-chip">
                Internship Programs
              </Link>
              <Link to="/verify" className="home-v61-link-chip">
                Certificate Verification
              </Link>
              <Link to="/privacy-policy" className="home-v61-link-chip">
                Privacy Policy
              </Link>
              <Link to="/terms-and-conditions" className="home-v61-link-chip">
                Terms & Conditions
              </Link>
              <Link to="/refund-policy" className="home-v61-link-chip">
                Refund Policy
              </Link>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

export default AboutUs;