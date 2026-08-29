import React, { useEffect, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";

function RegistrationSuccess() {
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const registration = location.state?.registration || null;

  const paymentId =
    registration?.paymentStatus === "paid" ? "Paid (verified)" : params.get("razorpay_payment_id") ||
    params.get("payment_id") ||
    "Registration Confirmed";

  const registrationId =
    registration?.registrationId || params.get("registration_id") ||
    params.get("registrationId") ||
    paymentId;

  /*
   * Generate the flower rain only once.
   * No external GIF/image is required.
   */
  const flowers = useMemo(() => {
    const flowerTypes = [
      "🌸",
      "🌺",
      "🌷",
      "🌼",
      "💮",
      "🌻",
      "🏵️",
    ];

    return Array.from({ length: 55 }, (_, index) => ({
      id: index,
      flower: flowerTypes[index % flowerTypes.length],
      left: `${(index * 37.7) % 101}%`,
      delay: `${-((index * 0.73) % 10)}s`,
      duration: `${6 + ((index * 1.17) % 7)}s`,
      size: `${0.85 + ((index * 0.21) % 0.9)}rem`,
      drift: `${-70 + ((index * 31) % 140)}px`,
      rotate: `${index % 2 === 0 ? "" : "-"}${180 + ((index * 43) % 360)}deg`,
    }));
  }, []);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    document.title = "Registration Successful | InternovaTech";
  }, []);

  return (
    <>
      <style>{`
        * {
          box-sizing: border-box;
        }

        /* =========================================
           PAGE
        ========================================= */

        .registration-success-page {
          min-height: 100vh;
          width: 100%;
          position: relative;
          overflow: hidden;

          display: flex;
          align-items: center;
          justify-content: center;

          padding: 28px;

          background:
            radial-gradient(
              circle at 10% 8%,
              rgba(37, 99, 235, 0.18),
              transparent 27%
            ),
            radial-gradient(
              circle at 92% 90%,
              rgba(124, 58, 237, 0.19),
              transparent 30%
            ),
            linear-gradient(
              135deg,
              #f8fafc 0%,
              #eef2ff 48%,
              #f8fafc 100%
            );
        }

        /* =========================================
           BACKGROUND GRID
        ========================================= */

        .success-background-grid {
          position: absolute;
          inset: 0;
          pointer-events: none;
          opacity: 0.42;

          background-image:
            linear-gradient(
              rgba(37, 99, 235, 0.035) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(37, 99, 235, 0.035) 1px,
              transparent 1px
            );

          background-size: 38px 38px;
        }

        /* =========================================
           BACKGROUND ORBS
        ========================================= */

        .success-orb {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          filter: blur(2px);

          animation:
            successFloat 8s ease-in-out infinite;
        }

        .success-orb-one {
          width: 340px;
          height: 340px;

          top: -150px;
          left: -120px;

          background:
            radial-gradient(
              circle,
              rgba(37, 99, 235, 0.18),
              transparent 70%
            );
        }

        .success-orb-two {
          width: 440px;
          height: 440px;

          right: -200px;
          bottom: -200px;

          background:
            radial-gradient(
              circle,
              rgba(124, 58, 237, 0.18),
              transparent 70%
            );

          animation-delay: 1.5s;
        }

        .success-orb-three {
          width: 190px;
          height: 190px;

          right: 13%;
          top: 8%;

          background:
            radial-gradient(
              circle,
              rgba(34, 197, 94, 0.11),
              transparent 70%
            );

          animation-delay: 2.5s;
        }

        /* =========================================
           FULL PAGE FLOWER RAIN
        ========================================= */

        .flower-rain {
          position: fixed;
          inset: 0;

          width: 100vw;
          height: 100vh;

          overflow: hidden;

          pointer-events: none;

          z-index: 20;
        }

        .falling-flower {
          position: absolute;

          top: -80px;

          display: block;

          line-height: 1;

          user-select: none;

          filter:
            drop-shadow(
              0 5px 8px rgba(15, 23, 42, 0.10)
            );

          opacity: 0;

          animation:
            flowerFall var(--flower-duration) linear
            var(--flower-delay) infinite;
        }

        /*
         * Slight blur on some flowers gives
         * realistic depth.
         */

        .falling-flower:nth-child(3n) {
          filter:
            blur(0.25px)
            drop-shadow(
              0 5px 8px rgba(15, 23, 42, 0.09)
            );
        }

        .falling-flower:nth-child(5n) {
          filter:
            blur(0.65px)
            drop-shadow(
              0 6px 10px rgba(15, 23, 42, 0.08)
            );
        }

        /* =========================================
           MAIN WRAPPER
        ========================================= */

        .success-wrapper {
          width: 100%;
          max-width: 1400px;

          position: relative;

          z-index: 30;
        }

        /* =========================================
           PREMIUM GLASS CARD
        ========================================= */

        .success-card {
          width: 100%;

          position: relative;

          overflow: hidden;

          border-radius: 36px;

          border:
            1px solid rgba(255, 255, 255, 0.84);

          background:
            rgba(255, 255, 255, 0.82);

          backdrop-filter: blur(25px);
          -webkit-backdrop-filter: blur(25px);

          box-shadow:
            0 40px 100px
              rgba(15, 23, 42, 0.14),

            0 15px 40px
              rgba(37, 99, 235, 0.08);

          animation:
            cardAppear 0.8s ease-out;
        }

        .success-card::before {
          content: "";

          position: absolute;

          inset: 0;

          pointer-events: none;

          background:
            linear-gradient(
              120deg,
              rgba(255,255,255,0.60),
              transparent 35%
            );
        }

        .success-card::after {
          content: "";

          position: absolute;

          top: 0;
          left: 0;
          right: 0;

          height: 4px;

          background:
            linear-gradient(
              90deg,
              #2563eb,
              #7c3aed,
              #ec4899,
              #06b6d4,
              #22c55e,
              #2563eb
            );

          background-size: 300% 100%;

          animation:
            gradientMove 5s linear infinite;
        }

        .success-card .card-body {
          width: 100%;

          max-width: 1180px;

          margin: 0 auto;

          padding: 62px 65px !important;
        }

        /* =========================================
           BRAND
        ========================================= */

        .success-brand {
          display: flex;

          align-items: center;
          justify-content: center;

          gap: 11px;

          margin-bottom: 31px;
        }

        .success-brand-mark {
          width: 48px;
          height: 48px;

          display: flex;

          align-items: center;
          justify-content: center;

          border-radius: 15px;

          color: #ffffff;

          font-size: 1.05rem;

          font-weight: 900;

          background:
            linear-gradient(
              135deg,
              #071126,
              #1d4ed8
            );

          box-shadow:
            0 12px 28px
              rgba(29, 78, 216, 0.25);
        }

        .success-brand-name {
          color: #0f172a;

          font-size: 1.14rem;

          font-weight: 850;

          letter-spacing: -0.025em;
        }

        /* =========================================
           PREMIUM SUCCESS ANIMATION
        ========================================= */

        .success-live-visual {
          width: 160px;
          height: 160px;

          margin: 0 auto 27px;

          position: relative;

          display: flex;

          align-items: center;
          justify-content: center;
        }

        .success-live-ring {
          position: absolute;

          inset: 0;

          border-radius: 50%;

          border:
            2px solid rgba(34, 197, 94, 0.23);

          animation:
            liveRing 2.4s ease-out infinite;
        }

        .success-live-ring:nth-child(2) {
          animation-delay: 0.8s;
        }

        .success-live-ring:nth-child(3) {
          animation-delay: 1.6s;
        }

        .success-live-icon {
          width: 118px;
          height: 118px;

          position: relative;

          display: flex;

          align-items: center;
          justify-content: center;

          border-radius: 34px;

          background:
            linear-gradient(
              145deg,
              #ffffff,
              #ecfdf5
            );

          border:
            1px solid rgba(34, 197, 94, 0.25);

          box-shadow:
            0 22px 55px
              rgba(34, 197, 94, 0.20);

          animation:
            successIconFloat 3s ease-in-out infinite;
        }

        .success-check {
          width: 72px;
          height: 72px;

          display: flex;

          align-items: center;
          justify-content: center;

          border-radius: 50%;

          color: #ffffff;

          font-size: 2.4rem;

          font-weight: 900;

          background:
            linear-gradient(
              135deg,
              #16a34a,
              #059669
            );

          box-shadow:
            0 12px 30px
              rgba(22, 163, 74, 0.30);

          animation:
            checkPulse 2s ease-in-out infinite;
        }

        /* =========================================
           SPARKLES
        ========================================= */

        .success-spark {
          position: absolute;

          color: #2563eb;

          font-size: 1.2rem;

          font-weight: 900;

          animation:
            sparkFloat 2s ease-in-out infinite;
        }

        .spark-one {
          top: 4px;
          left: 12px;
        }

        .spark-two {
          top: 10px;
          right: 8px;

          color: #7c3aed;

          animation-delay: 0.4s;
        }

        .spark-three {
          bottom: 8px;
          left: 8px;

          color: #06b6d4;

          animation-delay: 0.8s;
        }

        .spark-four {
          bottom: 3px;
          right: 14px;

          color: #f59e0b;

          animation-delay: 1.2s;
        }

        /* =========================================
           TEXT
        ========================================= */

        .success-eyebrow {
          display: inline-flex;

          align-items: center;
          justify-content: center;

          padding: 8px 15px;

          border-radius: 999px;

          margin-bottom: 15px;

          color: #047857;

          background:
            rgba(16, 185, 129, 0.09);

          border:
            1px solid rgba(16, 185, 129, 0.16);

          font-size: 0.76rem;

          font-weight: 850;

          letter-spacing: 0.08em;

          text-transform: uppercase;
        }

        .success-title {
          margin: 0;

          color: #0f172a;

          font-size:
            clamp(2.1rem, 5vw, 3.5rem);

          line-height: 1.04;

          letter-spacing: -0.052em;

          font-weight: 900;
        }

        .success-subtitle {
          max-width: 760px;

          margin: 18px auto 0;

          color: #64748b;

          line-height: 1.8;

          font-size: 1rem;
        }

        /* =========================================
           BATCH
        ========================================= */

        .batch-banner {
          position: relative;

          margin-top: 35px;

          padding: 25px;

          border-radius: 26px;

          overflow: hidden;

          color: #ffffff;

          text-align: left;

          background:
            linear-gradient(
              135deg,
              #071126 0%,
              #142850 48%,
              #1d4ed8 100%
            );

          box-shadow:
            0 22px 48px
              rgba(29, 78, 216, 0.17);
        }

        .batch-banner::before {
          content: "";

          position: absolute;

          width: 270px;
          height: 270px;

          right: -125px;
          top: -140px;

          border-radius: 50%;

          background:
            rgba(255,255,255,0.07);
        }

        .batch-banner::after {
          content: "";

          position: absolute;

          width: 140px;
          height: 140px;

          left: -80px;
          bottom: -85px;

          border-radius: 50%;

          background:
            rgba(96,165,250,0.12);
        }

        .batch-content {
          position: relative;

          z-index: 2;
        }

        .batch-label {
          color:
            rgba(255,255,255,0.66);

          font-size: 0.75rem;

          font-weight: 750;

          text-transform: uppercase;

          letter-spacing: 0.09em;

          margin-bottom: 7px;
        }

        .batch-name {
          margin: 0;

          font-size: 1.45rem;

          font-weight: 850;
        }

        .batch-status {
          display: inline-flex;

          align-items: center;

          gap: 8px;

          margin-top: 10px;

          color: #bbf7d0;

          font-size: 0.85rem;

          font-weight: 700;
        }

        .status-dot {
          width: 8px;
          height: 8px;

          border-radius: 50%;

          background: #22c55e;

          box-shadow:
            0 0 0 5px rgba(34,197,94,0.12),
            0 0 18px rgba(34,197,94,0.65);

          animation:
            statusPulse 1.8s ease-in-out infinite;
        }

        /* =========================================
           DETAILS
        ========================================= */

        .success-details {
          margin-top: 22px;

          display: grid;

          grid-template-columns:
            repeat(3, minmax(0, 1fr));

          gap: 14px;
        }

        .success-detail {
          text-align: left;

          padding: 19px;

          border-radius: 20px;

          border:
            1px solid #e2e8f0;

          background:
            rgba(248,250,252,0.78);

          transition:
            all 0.3s ease;
        }

        .success-detail:hover {
          transform:
            translateY(-3px);

          border-color:
            #cbd5e1;

          box-shadow:
            0 12px 28px
              rgba(15,23,42,0.06);
        }

        .detail-label {
          color: #64748b;

          font-size: 0.75rem;

          font-weight: 700;

          margin-bottom: 7px;

          text-transform: uppercase;

          letter-spacing: 0.05em;
        }

        .detail-value {
          color: #0f172a;

          font-size: 0.92rem;

          font-weight: 800;

          word-break: break-word;
        }

        .detail-success {
          color: #047857;
        }

        /* =========================================
           NEXT STEPS
        ========================================= */

        .next-steps {
          margin-top: 30px;

          padding: 25px;

          border-radius: 25px;

          background: #f8fafc;

          border:
            1px solid #e2e8f0;

          text-align: left;
        }

        .next-title {
          color: #0f172a;

          font-size: 1rem;

          font-weight: 850;

          margin-bottom: 18px;
        }

        .next-item {
          display: flex;

          align-items: flex-start;

          gap: 13px;

          margin-bottom: 15px;
        }

        .next-item:last-child {
          margin-bottom: 0;
        }

        .next-number {
          flex: 0 0 31px;

          width: 31px;
          height: 31px;

          border-radius: 10px;

          display: flex;

          align-items: center;
          justify-content: center;

          color: #1d4ed8;

          background: #dbeafe;

          font-size: 0.78rem;

          font-weight: 850;
        }

        .next-text {
          color: #475569;

          line-height: 1.65;

          font-size: 0.9rem;

          padding-top: 3px;
        }

        .next-text strong {
          color: #0f172a;
        }

        /* =========================================
           BUTTONS
        ========================================= */

        .success-actions {
          display: grid;

          grid-template-columns:
            1fr 1fr;

          gap: 13px;

          margin-top: 27px;
        }

        .success-btn {
          min-height: 55px;

          display: inline-flex;

          align-items: center;
          justify-content: center;

          gap: 9px;

          border-radius: 17px;

          padding: 12px 20px;

          text-decoration: none;

          font-weight: 800;

          transition:
            all 0.3s ease;
        }

        .success-btn-primary {
          color: #ffffff;

          background:
            linear-gradient(
              135deg,
              #0b1736,
              #1d4ed8
            );

          box-shadow:
            0 14px 30px
              rgba(29, 78, 216, 0.18);
        }

        .success-btn-primary:hover {
          color: #ffffff;

          transform:
            translateY(-3px);

          box-shadow:
            0 18px 35px
              rgba(29, 78, 216, 0.27);
        }

        .success-btn-secondary {
          color: #0f172a;

          background: #ffffff;

          border:
            1px solid #e2e8f0;
        }

        .success-btn-secondary:hover {
          color: #0f172a;

          transform:
            translateY(-3px);

          border-color:
            #cbd5e1;

          box-shadow:
            0 10px 25px
              rgba(15,23,42,0.08);
        }

        /* =========================================
           FOOTER
        ========================================= */

        .success-footer {
          margin-top: 26px;

          color: #94a3b8;

          font-size: 0.78rem;

          line-height: 1.6;
        }

        .success-footer strong {
          color: #64748b;
        }

        /* =========================================
           ANIMATIONS
        ========================================= */

        @keyframes flowerFall {
          0% {
            opacity: 0;

            transform:
              translate3d(0, -80px, 0)
              rotate(0deg);
          }

          8% {
            opacity: 0.95;
          }

          25% {
            transform:
              translate3d(
                calc(var(--flower-drift) * 0.35),
                25vh,
                0
              )
              rotate(120deg);
          }

          50% {
            transform:
              translate3d(
                calc(var(--flower-drift) * -0.25),
                50vh,
                0
              )
              rotate(240deg);
          }

          75% {
            transform:
              translate3d(
                calc(var(--flower-drift) * 0.55),
                75vh,
                0
              )
              rotate(360deg);
          }

          92% {
            opacity: 0.8;
          }

          100% {
            opacity: 0;

            transform:
              translate3d(
                var(--flower-drift),
                110vh,
                0
              )
              rotate(var(--flower-rotate));
          }
        }

        @keyframes cardAppear {
          from {
            opacity: 0;

            transform:
              translateY(30px)
              scale(0.985);
          }

          to {
            opacity: 1;

            transform:
              translateY(0)
              scale(1);
          }
        }

        @keyframes successFloat {
          0%,
          100% {
            transform:
              translateY(0);
          }

          50% {
            transform:
              translateY(-20px);
          }
        }

        @keyframes successIconFloat {
          0%,
          100% {
            transform:
              translateY(0)
              scale(1);
          }

          50% {
            transform:
              translateY(-7px)
              scale(1.025);
          }
        }

        @keyframes checkPulse {
          0%,
          100% {
            transform:
              scale(1);
          }

          50% {
            transform:
              scale(1.08);
          }
        }

        @keyframes sparkFloat {
          0%,
          100% {
            opacity: 0.45;

            transform:
              translateY(0)
              rotate(0deg);
          }

          50% {
            opacity: 1;

            transform:
              translateY(-6px)
              rotate(15deg);
          }
        }

        @keyframes liveRing {
          0% {
            opacity: 0.65;

            transform:
              scale(0.72);
          }

          100% {
            opacity: 0;

            transform:
              scale(1.10);
          }
        }

        @keyframes statusPulse {
          0%,
          100% {
            transform:
              scale(1);
          }

          50% {
            transform:
              scale(1.3);
          }
        }

        @keyframes gradientMove {
          0% {
            background-position:
              0% 50%;
          }

          100% {
            background-position:
              300% 50%;
          }
        }

        /* =========================================
           REDUCED MOTION
        ========================================= */

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration:
              0.01ms !important;

            animation-iteration-count:
              1 !important;

            scroll-behavior:
              auto !important;
          }
        }

        /* =========================================
           TABLET
        ========================================= */

        @media (max-width: 991px) {
          .success-card .card-body {
            max-width: 100%;

            padding:
              50px 40px !important;
          }

          .success-details {
            grid-template-columns:
              repeat(2, minmax(0, 1fr));
          }
        }

        /* =========================================
           MOBILE
        ========================================= */

        @media (max-width: 767px) {
          .registration-success-page {
            padding: 12px;
          }

          .success-wrapper {
            max-width: 100%;
          }

          .success-card {
            border-radius: 26px;
          }

          .success-card .card-body {
            padding:
              34px 18px !important;
          }

          .success-brand {
            margin-bottom: 26px;
          }

          .success-brand-mark {
            width: 43px;
            height: 43px;
          }

          .success-brand-name {
            font-size: 1rem;
          }

          .success-live-visual {
            width: 125px;
            height: 125px;
          }

          .success-live-icon {
            width: 95px;
            height: 95px;

            border-radius: 28px;
          }

          .success-check {
            width: 62px;
            height: 62px;

            font-size: 2rem;
          }

          .success-title {
            font-size: 2.15rem;
          }

          .success-subtitle {
            font-size: 0.91rem;

            line-height: 1.7;
          }

          .batch-banner {
            padding: 20px;
          }

          .batch-name {
            font-size: 1.2rem;
          }

          .success-details {
            grid-template-columns: 1fr;
          }

          .success-actions {
            grid-template-columns: 1fr;
          }

          .next-steps {
            padding: 21px;
          }

          .success-footer {
            font-size: 0.74rem;
          }

          /*
           * Slightly fewer visible flowers on
           * smaller screens for performance.
           */

          .falling-flower:nth-child(n + 38) {
            display: none;
          }
        }

        /* =========================================
           SMALL MOBILE
        ========================================= */

        @media (max-width: 380px) {
          .registration-success-page {
            padding: 8px;
          }

          .success-card .card-body {
            padding:
              30px 15px !important;
          }

          .success-title {
            font-size: 1.9rem;
          }

          .success-live-visual {
            width: 112px;
            height: 112px;
          }

          .success-live-icon {
            width: 87px;
            height: 87px;
          }

          .success-check {
            width: 58px;
            height: 58px;

            font-size: 1.8rem;
          }

          .batch-name {
            font-size: 1.1rem;
          }
        }
      `}</style>

      <main className="registration-success-page">

        {/* ======================================
            BACKGROUND
        ====================================== */}

        <div className="success-background-grid"></div>

        <div className="success-orb success-orb-one"></div>

        <div className="success-orb success-orb-two"></div>

        <div className="success-orb success-orb-three"></div>

        {/* ======================================
            FULL PAGE FLOWER RAIN
        ====================================== */}

        <div className="flower-rain">
          {flowers.map((item) => (
            <span
              key={item.id}
              className="falling-flower"
              style={{
                left: item.left,
                "--flower-delay": item.delay,
                "--flower-duration": item.duration,
                "--flower-drift": item.drift,
                "--flower-rotate": item.rotate,
                fontSize: item.size,
              }}
            >
              {item.flower}
            </span>
          ))}
        </div>

        {/* ======================================
            MAIN CARD
        ====================================== */}

        <div className="success-wrapper">

          <section className="success-card">

            <div className="card-body text-center">

              {/* ==================================
                  BRAND
              ================================== */}

              <div className="success-brand">

                <div className="success-brand-mark">
                  IT
                </div>

                <div className="success-brand-name">
                  InternovaTech
                </div>

              </div>

              {/* ==================================
                  SUCCESS ANIMATION
              ================================== */}

              <div className="success-live-visual">

                <span className="success-live-ring"></span>

                <span className="success-live-ring"></span>

                <span className="success-live-ring"></span>

                <div className="success-live-icon">

                  <div className="success-check">
                    ✓
                  </div>

                  <span className="success-spark spark-one">
                    ✦
                  </span>

                  <span className="success-spark spark-two">
                    ✦
                  </span>

                  <span className="success-spark spark-three">
                    ✦
                  </span>

                  <span className="success-spark spark-four">
                    ✦
                  </span>

                </div>

              </div>

              {/* ==================================
                  HEADING
              ================================== */}

              <div className="success-eyebrow">
                Registration Successful
              </div>

              <h1 className="success-title">
                You're officially registered! 🎉
              </h1>

              <p className="success-subtitle">
                Your internship registration has been successfully completed.
                Welcome to the InternovaTech learning community — we're excited
                to have you with us.
              </p>

              {/* ==================================
                  BATCH
              ================================== */}

              <div className="batch-banner">

                <div className="batch-content">

                  <div className="batch-label">
                    Registered Internship Batch
                  </div>

                  <h2 className="batch-name">
                    Your Internship Journey Starts Here
                  </h2>

                  <div className="batch-status">

                    <span className="status-dot"></span>

                    Registration Confirmed

                  </div>

                </div>

              </div>

              {/* ==================================
                  DETAILS
              ================================== */}

              <div className="success-details">

                <div className="success-detail">

                  <div className="detail-label">
                    Registration Status
                  </div>

                  <div className="detail-value detail-success">
                    ✓ Confirmed
                  </div>

                </div>

                <div className="success-detail">

                  <div className="detail-label">
                    Payment Status
                  </div>

                  <div className="detail-value detail-success">
                    ✓ Successful
                  </div>

                </div>

                <div className="success-detail">

                  <div className="detail-label">
                    Registration Reference
                  </div>

                  <div className="detail-value">
                    {registrationId}
                  </div>

                </div>

                <div className="success-detail">

                  <div className="detail-label">
                    Payment Reference
                  </div>

                  <div className="detail-value">
                    {paymentId}
                  </div>

                </div>

                <div className="success-detail">

                  <div className="detail-label">
                    Program
                  </div>

                  <div className="detail-value">
                    {registration?.primaryDomain || "Internship Registration"}
                  </div>

                </div>

                <div className="success-detail">

                  <div className="detail-label">
                    Account Status
                  </div>

                  <div className="detail-value detail-success">
                    ✓ Active
                  </div>

                </div>

              </div>

              {/* ==================================
                  NEXT STEPS
              ================================== */}

              <div className="next-steps">

                <div className="next-title">
                  What happens next?
                </div>

                <div className="next-item">

                  <div className="next-number">
                    01
                  </div>

                  <div className="next-text">
                    <strong>Check your email.</strong>{" "}
                    Your registration and onboarding information will be
                    shared with you through your registered email address.
                  </div>

                </div>

                <div className="next-item">

                  <div className="next-number">
                    02
                  </div>

                  <div className="next-text">
                    <strong>Watch for onboarding updates.</strong>{" "}
                    Keep an eye on your email for important internship
                    instructions and program updates.
                  </div>

                </div>

                <div className="next-item">

                  <div className="next-number">
                    03
                  </div>

                  <div className="next-text">
                    <strong>Get ready to learn and build.</strong>{" "}
                    Your internship journey with InternovaTech is about to
                    begin.
                  </div>

                </div>

              </div>

              {/* ==================================
                  ACTIONS
              ================================== */}

              <div className="success-actions">

                <Link
                  to="/dashboard"
                  className="success-btn success-btn-primary"
                >
                  Go to Dashboard
                  <span>→</span>
                </Link>

                <Link
                  to="/internships"
                  className="success-btn success-btn-secondary"
                >
                  View Programs
                </Link>

              </div>

              {/* ==================================
                  FOOTER
              ================================== */}

              <div className="success-footer">

                Need help with your registration?{" "}

                <strong>
                  Contact InternovaTech Support.
                </strong>

                <br />

                Please keep your registration reference for future
                communication.

              </div>

            </div>

          </section>

        </div>

      </main>
    </>
  );
}

export default RegistrationSuccess;
