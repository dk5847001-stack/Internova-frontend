import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";

function AboutUs() {
  const [pointer, setPointer] = useState({ x: 50, y: 22 });
  const [particles, setParticles] = useState([
    { x: 18, y: 22, size: 10 },
    { x: 78, y: 18, size: 8 },
    { x: 66, y: 72, size: 12 },
    { x: 26, y: 78, size: 9 },
  ]);
  const [activeDomain, setActiveDomain] = useState("web");
  const [openFaq, setOpenFaq] = useState(0);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [activeHighlight, setActiveHighlight] = useState(0);
  const [statsStarted, setStatsStarted] = useState(false);
  const [pageReady, setPageReady] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [stats, setStats] = useState({
    learners: 0,
    tracks: 0,
    certificates: 0,
    progress: 0,
  });

  const revealRef = useRef([]);
  const statsSectionRef = useRef(null);

  const rotatingHighlights = useMemo(
    () => [
      "premium Internship Programs workflows",
      "guided learning experience",
      "verified digital certificates",
      "career-focused progress tracking",
    ],
    []
  );

  const domainData = useMemo(
    () => ({
      web: {
        title: "Web Development",
        subtitle:
          "Frontend, backend, responsive interfaces, deployment, and modern development workflow.",
        points: [
          "Build practical project-based implementation skills",
          "Understand structured frontend and backend learning flow",
          "Strengthen portfolio-ready development experience",
        ],
      },
      data: {
        title: "Data Science",
        subtitle:
          "Analytics, structured datasets, data interpretation, and insight-driven workflows.",
        points: [
          "Learn practical analysis direction with guided structure",
          "Improve confidence with trackable learning progression",
          "Build stronger problem-solving exposure using data flow",
        ],
      },
      ai: {
        title: "Artificial Intelligence",
        subtitle:
          "AI concepts, practical understanding, smart workflows, and future-ready learning direction.",
        points: [
          "Gain exposure to modern AI-oriented Internship Programs structure",
          "Move from theory to guided application understanding",
          "Learn inside a premium and organized digital experience",
        ],
      },
      finance: {
        title: "Finance",
        subtitle:
          "Professional finance learning, business context, and structured growth-oriented exposure.",
        points: [
          "Understand practical finance learning pathways",
          "Experience a cleaner and more professional Internship Programs flow",
          "Track progress toward structured completion outcomes",
        ],
      },
    }),
    []
  );

  const faqs = useMemo(
    () => [
      {
        q: "What does InternovaTech offer to learners?",
        a: "InternovaTech offers structured online Internship Programs-style learning experiences with guided modules, dashboard access, assessments, progress tracking, and verified certificates across multiple in-demand domains.",
      },
      {
        q: "How is InternovaTech different from normal learning platforms?",
        a: "InternovaTech focuses on premium presentation, practical flow, trackable learning progress, and certificate validation support so learners get a more professional and career-focused experience.",
      },
      {
        q: "Can users verify certificates publicly?",
        a: "Yes, the platform supports certificate verification flow so completion-based achievements can be validated through a trusted digital process.",
      },
      {
        q: "Is the platform suitable for students and freshers?",
        a: "Yes, InternovaTech is designed for students, freshers, and learners who want guided learning, Internship Programs exposure, and a stronger digital profile through structured outcomes.",
      },
    ],
    []
  );

  const testimonials = useMemo(
    () => [
      {
        name: "Aman Kumar",
        role: "Student Learner",
        text: "InternovaTech felt much more premium than a normal course platform. The dashboard flow, module progression, and certificate support made the whole experience feel more professional.",
      },
      {
        name: "Priya Sharma",
        role: "Career-Focused Fresher",
        text: "I liked how structured everything was. It did not feel confusing. I could clearly understand what to do next, how much progress I had made, and when I was ready for assessment.",
      },
      {
        name: "Rohit Verma",
        role: "Internship Programs User",
        text: "The verification support and premium UI gave a lot more trust to the experience. It felt like a proper digital Internship Programs workspace instead of just another random learning page.",
      },
      {
        name: "Akash Kumar",
        role: "Internship Programs User",
        text: "I used this website, the platform support and premium UI gave a lot more trust to the experience. It felt like a proper digital Internship Programs workspace instead of just another random learning page.",
      },
    ],
    []
  );

  useEffect(() => {
    document.title =
      "InternovaTech - Online Internship Programs, Verified Certificates and Tech Training";

    const metaDescription = document.querySelector('meta[name="description"]');
    const previousDescription = metaDescription?.getAttribute("content") || "";

    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        "InternovaTech offers premium online Internship Programs with practical learning, guided modules, assessments, progress tracking and verified certificates across Web Development, Data Science, Artificial Intelligence, Finance and more."
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
        "InternovaTech - Online Internship Programs, Certificates and Tech Training";

      if (metaDescription) {
        metaDescription.setAttribute("content", previousDescription);
      }

      if (!canonicalAlreadyExists && canonicalTag) {
        canonicalTag.remove();
      }
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPageReady(true);
    }, 700);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      setScrollY(window.scrollY || 0);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("home-v67-reveal-show");
          }
        });
      },
      { threshold: 0.14 }
    );

    const items = revealRef.current.filter(Boolean);
    items.forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const statsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setStatsStarted(true);
          }
        });
      },
      { threshold: 0.3 }
    );

    if (statsSectionRef.current) {
      statsObserver.observe(statsSectionRef.current);
    }

    return () => statsObserver.disconnect();
  }, []);

  useEffect(() => {
    if (!statsStarted) return;

    const targets = {
      learners: 2500,
      tracks: 12,
      certificates: 1800,
      progress: 94,
    };

    let frame;
    let start;
    const duration = 1400;

    const animate = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);

      setStats({
        learners: Math.floor(targets.learners * progress),
        tracks: Math.floor(targets.tracks * progress),
        certificates: Math.floor(targets.certificates * progress),
        progress: Math.floor(targets.progress * progress),
      });

      if (progress < 1) frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [statsStarted]);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4200);

    return () => clearInterval(interval);
  }, [testimonials.length]);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveHighlight((prev) => (prev + 1) % rotatingHighlights.length);
    }, 2600);

    return () => clearInterval(interval);
  }, [rotatingHighlights.length]);

  const setRevealRef = (el, index) => {
    revealRef.current[index] = el;
  };

  const handleHeroPointerMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setPointer({ x, y });

    const moveX = ((e.clientX - rect.left) / rect.width) * 16 - 8;
    const moveY = ((e.clientY - rect.top) / rect.height) * 16 - 8;

    setParticles([
      { x: 18 + moveX * 0.25, y: 22 + moveY * 0.25, size: 10 },
      { x: 78 - moveX * 0.18, y: 18 + moveY * 0.18, size: 8 },
      { x: 66 + moveX * 0.12, y: 72 - moveY * 0.12, size: 12 },
      { x: 26 - moveX * 0.2, y: 78 - moveY * 0.16, size: 9 },
    ]);
  };

  const handleHeroPointerLeave = () => {
    setPointer({ x: 50, y: 22 });
    setParticles([
      { x: 18, y: 22, size: 10 },
      { x: 78, y: 18, size: 8 },
      { x: 66, y: 72, size: 12 },
      { x: 26, y: 78, size: 9 },
    ]);
  };

  const handleSpotlightMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    e.currentTarget.style.setProperty("--spot-x", `${x}%`);
    e.currentTarget.style.setProperty("--spot-y", `${y}%`);
  };

  return (
    <>
      <style>{`
        .home-v67-page {
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

        .home-v67-page::before {
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

        .home-v67-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(16px);
          opacity: 0.52;
          pointer-events: none;
          animation: homeV67Float 10s ease-in-out infinite;
        }

        .home-v67-orb-1 {
          width: 280px;
          height: 280px;
          top: 90px;
          left: -80px;
          background: linear-gradient(135deg, rgba(29,78,216,0.24), rgba(14,165,233,0.18));
        }

        .home-v67-orb-2 {
          width: 340px;
          height: 340px;
          right: -90px;
          top: 130px;
          background: linear-gradient(135deg, rgba(99,102,241,0.20), rgba(59,130,246,0.18));
          animation-delay: 1.4s;
        }

        .home-v67-orb-3 {
          width: 240px;
          height: 240px;
          right: 10%;
          bottom: 4%;
          background: linear-gradient(135deg, rgba(16,185,129,0.14), rgba(37,99,235,0.12));
          animation-delay: 2s;
        }

        .home-v67-shell {
          position: relative;
          z-index: 2;
        }

        .home-v67-page-loading .home-v67-content {
          opacity: 0;
          transform: translateY(18px);
          pointer-events: none;
        }

        .home-v67-content {
          opacity: 1;
          transform: translateY(0);
          transition: opacity 0.5s ease, transform 0.5s ease;
        }

        .home-v67-skeleton-wrap {
          display: grid;
          gap: 22px;
        }

        .home-v67-skeleton-card {
          border-radius: 30px;
          background: rgba(255,255,255,0.72);
          border: 1px solid rgba(255,255,255,0.76);
          box-shadow:
            0 24px 60px rgba(15,23,42,0.06),
            0 8px 20px rgba(59,130,246,0.04);
          overflow: hidden;
          position: relative;
        }

        .home-v67-skeleton-card::after {
          content: "";
          position: absolute;
          inset: 0;
          transform: translateX(-100%);
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255,255,255,0.66),
            transparent
          );
          animation: homeV67Shimmer 1.25s infinite;
        }

        .home-v67-skeleton-hero {
          min-height: 380px;
        }

        .home-v67-skeleton-grid {
          min-height: 140px;
        }

        .home-v67-skeleton-inner {
          padding: 24px;
          display: grid;
          gap: 14px;
        }

        .home-v67-sk-line,
        .home-v67-sk-pill,
        .home-v67-sk-box {
          background: linear-gradient(135deg, #e2e8f0 0%, #f1f5f9 100%);
          border-radius: 14px;
        }

        .home-v67-sk-pill {
          height: 38px;
          width: 180px;
          border-radius: 999px;
        }

        .home-v67-sk-line-1 {
          height: 26px;
          width: 70%;
        }

        .home-v67-sk-line-2 {
          height: 26px;
          width: 56%;
        }

        .home-v67-sk-line-3 {
          height: 16px;
          width: 100%;
        }

        .home-v67-sk-line-4 {
          height: 16px;
          width: 92%;
        }

        .home-v67-sk-line-5 {
          height: 16px;
          width: 76%;
        }

        .home-v67-sk-box-row {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 14px;
        }

        .home-v67-sk-box {
          height: 112px;
          border-radius: 24px;
        }

        .home-v67-reveal {
          opacity: 0;
          transform: translateY(28px);
          transition: opacity 0.7s ease, transform 0.7s ease;
        }

        .home-v67-reveal-show {
          opacity: 1;
          transform: translateY(0);
        }

        .home-v67-spotlight {
          --spot-x: 50%;
          --spot-y: 50%;
          position: relative;
          overflow: hidden;
        }

        .home-v67-spotlight::before {
          content: "";
          position: absolute;
          inset: 0;
          background: radial-gradient(
            circle at var(--spot-x) var(--spot-y),
            rgba(96,165,250,0.16),
            transparent 30%
          );
          opacity: 0;
          transition: opacity 0.28s ease;
          pointer-events: none;
        }

        .home-v67-spotlight:hover::before {
          opacity: 1;
        }

        .home-v67-parallax-slow {
          transform: translateY(${scrollY * 0.06}px);
        }

        .home-v67-parallax-medium {
          transform: translateY(${scrollY * 0.035}px);
        }

        .home-v67-parallax-light {
          transform: translateY(${scrollY * 0.02}px);
        }

        .home-v67-hero-wrap,
        .home-v67-glass-card,
        .home-v67-final-card,
        .home-v67-process-band,
        .home-v67-faq-wrap,
        .home-v67-domain-wrap,
        .home-v67-stat-card,
        .home-v67-testimonial-wrap {
          border: 1px solid rgba(255,255,255,0.72);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          box-shadow:
            0 24px 60px rgba(15,23,42,0.08),
            0 8px 22px rgba(59,130,246,0.05);
          transition: transform 0.3s ease;
        }

        .home-v67-hero-wrap {
          position: relative;
          overflow: hidden;
          border-radius: 38px;
          padding: 34px;
          background: linear-gradient(135deg, rgba(255,255,255,0.82) 0%, rgba(255,255,255,0.70) 100%);
        }

        .home-v67-hero-wrap::after {
          content: "";
          position: absolute;
          inset: 0;
          background:
            radial-gradient(circle at var(--pointer-x, 50%) var(--pointer-y, 22%), rgba(96,165,250,0.18), transparent 22%),
            radial-gradient(circle at 18% 18%, rgba(255,255,255,0.38), transparent 18%),
            radial-gradient(circle at 86% 72%, rgba(255,255,255,0.24), transparent 20%);
          pointer-events: none;
          transition: background 0.18s ease;
        }

        .home-v67-particles {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 1;
        }

        .home-v67-particle {
          position: absolute;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(37,99,235,0.28), rgba(96,165,250,0.08));
          box-shadow: 0 0 18px rgba(59,130,246,0.18);
          transition: left 0.25s ease, top 0.25s ease;
        }

        .home-v67-badge,
        .home-v67-title,
        .home-v67-rotating-line,
        .home-v67-subtitle,
        .home-v67-cta-row,
        .home-v67-mini-strip {
          position: relative;
          z-index: 2;
        }

        .home-v67-badge {
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
        }

        .home-v67-title {
          font-size: 4rem;
          line-height: 1.02;
          font-weight: 900;
          letter-spacing: -0.055em;
          color: #0f172a;
          margin-bottom: 18px;
        }

        .home-v67-title-accent {
          background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 42%, #0f172a 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          -webkit-text-fill-color: transparent;
        }

        .home-v67-rotating-line {
          margin-bottom: 18px;
          min-height: 32px;
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 10px;
        }

        .home-v67-rotating-label {
          font-size: 0.9rem;
          font-weight: 800;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .home-v67-rotating-pill {
          display: inline-flex;
          align-items: center;
          padding: 8px 14px;
          border-radius: 999px;
          background: linear-gradient(135deg, #dbeafe 0%, #eff6ff 100%);
          color: #1d4ed8;
          font-weight: 800;
          box-shadow: 0 10px 22px rgba(37,99,235,0.08);
          animation: homeV67FadeSlide 0.45s ease;
        }

        .home-v67-subtitle {
          font-size: 1.1rem;
          line-height: 1.95;
          color: #475569;
          margin-bottom: 0;
          max-width: 760px;
        }

        .home-v67-cta-row {
          display: flex;
          flex-wrap: wrap;
          gap: 14px;
          margin-top: 28px;
        }

        .home-v67-btn-primary,
        .home-v67-btn-success,
        .home-v67-btn-outline {
          min-height: 56px;
          padding: 0 24px;
          border-radius: 18px;
          font-weight: 800;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: all 0.32s ease;
        }

        .home-v67-btn-primary {
          color: #fff;
          border: none;
          background: linear-gradient(135deg, #081226 0%, #102247 45%, #1d4ed8 100%);
          box-shadow:
            0 20px 38px rgba(29,78,216,0.18),
            0 8px 18px rgba(8,18,38,0.14);
        }

        .home-v67-btn-success {
          color: #fff;
          border: none;
          background: linear-gradient(135deg, #059669 0%, #10b981 100%);
          box-shadow: 0 18px 36px rgba(16,185,129,0.18);
        }

        .home-v67-btn-outline {
          color: #0f172a;
          border: 1px solid #dbeafe;
          background: rgba(255,255,255,0.78);
        }

        .home-v67-btn-primary:hover,
        .home-v67-btn-success:hover,
        .home-v67-btn-outline:hover {
          transform: translateY(-2px);
        }

        .home-v67-mini-strip {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 26px;
        }

        .home-v67-mini-chip {
          padding: 10px 14px;
          border-radius: 999px;
          background: rgba(255,255,255,0.70);
          border: 1px solid rgba(148,163,184,0.16);
          color: #334155;
          font-size: 0.84rem;
          font-weight: 700;
          box-shadow: 0 10px 24px rgba(15,23,42,0.04);
        }

        .home-v67-showcase {
          position: relative;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2;
        }

        .home-v67-dashboard {
          position: relative;
          width: 100%;
          max-width: 520px;
          border-radius: 30px;
          overflow: hidden;
          background: linear-gradient(135deg, #081226 0%, #102247 44%, #1d4ed8 100%);
          color: #fff;
          padding: 24px;
          box-shadow:
            0 30px 80px rgba(15,23,42,0.18),
            0 10px 26px rgba(29,78,216,0.10);
          animation: homeV67CardFloat 6.2s ease-in-out infinite;
          z-index: 2;
        }

        .home-v67-window-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 18px;
        }

        .home-v67-window-dots {
          display: flex;
          gap: 8px;
        }

        .home-v67-window-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: rgba(255,255,255,0.75);
        }

        .home-v67-window-title {
          font-size: 0.86rem;
          font-weight: 800;
          color: rgba(255,255,255,0.82);
          letter-spacing: 0.06em;
          text-transform: uppercase;
          text-align: right;
        }

        .home-v67-metric-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 14px;
          margin-bottom: 16px;
        }

        .home-v67-metric-card {
          border-radius: 22px;
          background: rgba(255,255,255,0.10);
          border: 1px solid rgba(255,255,255,0.14);
          padding: 18px;
        }

        .home-v67-metric-label {
          font-size: 0.78rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: rgba(255,255,255,0.68);
          font-weight: 800;
          margin-bottom: 8px;
        }

        .home-v67-metric-value {
          font-size: 1.45rem;
          font-weight: 900;
          color: #fff;
          margin-bottom: 6px;
          word-break: break-word;
        }

        .home-v67-metric-text {
          color: rgba(255,255,255,0.74);
          font-size: 0.9rem;
          line-height: 1.65;
          margin-bottom: 0;
        }

        .home-v67-panel {
          border-radius: 24px;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.12);
          padding: 20px;
          margin-top: 14px;
        }

        .home-v67-panel-title {
          font-size: 1rem;
          font-weight: 900;
          color: #fff;
          margin-bottom: 12px;
        }

        .home-v67-progress-list {
          display: grid;
          gap: 12px;
        }

        .home-v67-progress-item {
          display: grid;
          gap: 8px;
        }

        .home-v67-progress-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          color: rgba(255,255,255,0.82);
          font-weight: 700;
          font-size: 0.92rem;
        }

        .home-v67-progress-bar {
          width: 100%;
          height: 10px;
          border-radius: 999px;
          background: rgba(255,255,255,0.12);
          overflow: hidden;
        }

        .home-v67-progress-fill {
          height: 100%;
          border-radius: 999px;
          background: linear-gradient(135deg, #34d399 0%, #60a5fa 100%);
          transform-origin: left center;
          animation: homeV67BarPulse 2.2s ease-in-out infinite;
        }

        .home-v67-fill-1 { width: 82%; animation-delay: 0s; }
        .home-v67-fill-2 { width: 74%; animation-delay: 0.35s; }
        .home-v67-fill-3 { width: 90%; animation-delay: 0.7s; }

        .home-v67-floating-card {
          position: absolute;
          border-radius: 22px;
          background: rgba(255,255,255,0.90);
          border: 1px solid rgba(255,255,255,0.88);
          backdrop-filter: blur(14px);
          box-shadow: 0 20px 46px rgba(15,23,42,0.10);
          padding: 18px;
          transition: all 0.34s ease;
        }

        .home-v67-floating-card:hover {
          transform: translateY(-5px);
        }

        .home-v67-floating-left {
          left: -20px;
          bottom: 42px;
          width: 210px;
          animation: homeV67FloatMini 5.8s ease-in-out infinite;
        }

        .home-v67-floating-right {
          right: -16px;
          top: 74px;
          width: 220px;
          animation: homeV67FloatMini 6.4s ease-in-out infinite;
          animation-delay: 1.1s;
        }

        .home-v67-floating-title {
          font-size: 0.92rem;
          font-weight: 900;
          color: #0f172a;
          margin-bottom: 6px;
        }

        .home-v67-floating-text {
          font-size: 0.88rem;
          color: #475569;
          line-height: 1.7;
          margin-bottom: 0;
        }

        .home-v67-section {
          margin-top: 34px;
        }

        .home-v67-glass-card {
          height: 100%;
          border-radius: 30px;
          background: rgba(255,255,255,0.80);
          padding: 28px;
          transition: all 0.35s ease;
        }

        .home-v67-glass-card:hover {
          transform: translateY(-6px);
        }

        .home-v67-card-icon {
          width: 62px;
          height: 62px;
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
          color: #1d4ed8;
          margin-bottom: 18px;
          border: 1px solid #dbeafe;
          box-shadow: 0 10px 24px rgba(37,99,235,0.08);
        }

        .home-v67-card-icon svg {
          width: 28px;
          height: 28px;
        }

        .home-v67-card-title {
          font-size: 1.22rem;
          font-weight: 900;
          color: #0f172a;
          margin-bottom: 12px;
          letter-spacing: -0.02em;
        }

        .home-v67-card-text {
          color: #475569;
          line-height: 1.9;
          margin-bottom: 0;
        }

        .home-v67-stats-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 14px;
        }

        .home-v67-stat-card {
          border-radius: 24px;
          background: rgba(255,255,255,0.82);
          padding: 24px;
          text-align: center;
        }

        .home-v67-stat-value {
          font-size: 2rem;
          font-weight: 900;
          color: #0f172a;
          margin-bottom: 6px;
          letter-spacing: -0.04em;
        }

        .home-v67-stat-label {
          font-size: 0.86rem;
          font-weight: 800;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .home-v67-domain-wrap {
          border-radius: 32px;
          background: linear-gradient(135deg, rgba(255,255,255,0.84), rgba(255,255,255,0.74));
          padding: 28px;
        }

        .home-v67-section-title {
          font-size: 2rem;
          font-weight: 900;
          color: #0f172a;
          letter-spacing: -0.04em;
          margin-bottom: 10px;
        }

        .home-v67-section-text {
          color: #475569;
          line-height: 1.9;
          margin-bottom: 0;
        }

        .home-v67-domain-tabs {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 22px;
          margin-bottom: 20px;
        }

        .home-v67-domain-tab {
          border: none;
          padding: 12px 18px;
          border-radius: 999px;
          font-weight: 800;
          background: #eff6ff;
          color: #1d4ed8;
          transition: all 0.28s ease;
          box-shadow: 0 10px 22px rgba(37,99,235,0.06);
        }

        .home-v67-domain-tab.active {
          background: linear-gradient(135deg, #081226 0%, #1d4ed8 100%);
          color: #fff;
        }

        .home-v67-domain-panel {
          border-radius: 26px;
          padding: 24px;
          background: linear-gradient(135deg, #081226 0%, #102247 42%, #1d4ed8 100%);
          color: #fff;
          box-shadow: 0 24px 58px rgba(15,23,42,0.14);
        }

        .home-v67-domain-title {
          font-size: 1.5rem;
          font-weight: 900;
          margin-bottom: 10px;
        }

        .home-v67-domain-subtitle {
          color: rgba(255,255,255,0.82);
          line-height: 1.8;
          margin-bottom: 18px;
        }

        .home-v67-domain-points {
          display: grid;
          gap: 12px;
        }

        .home-v67-domain-point {
          display: flex;
          gap: 12px;
          align-items: flex-start;
          border-radius: 18px;
          padding: 14px 16px;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.12);
        }

        .home-v67-domain-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          margin-top: 7px;
          background: #93c5fd;
          box-shadow: 0 0 0 5px rgba(147,197,253,0.15);
          flex-shrink: 0;
        }

        .home-v67-process-band {
          margin-top: 34px;
          border-radius: 34px;
          overflow: hidden;
          position: relative;
          background: linear-gradient(135deg, #081226 0%, #102247 42%, #1d4ed8 100%);
          color: #fff;
        }

        .home-v67-process-inner {
          position: relative;
          z-index: 2;
          padding: 34px;
        }

        .home-v67-process-title {
          font-size: 2.15rem;
          font-weight: 900;
          letter-spacing: -0.04em;
          margin-bottom: 14px;
        }

        .home-v67-process-text {
          color: rgba(255,255,255,0.82);
          line-height: 1.9;
          margin-bottom: 0;
        }

        .home-v67-timeline {
          position: relative;
          margin-top: 28px;
        }

        .home-v67-timeline::before {
          content: "";
          position: absolute;
          top: 24px;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(
            90deg,
            rgba(255,255,255,0.18),
            rgba(147,197,253,0.85),
            rgba(255,255,255,0.18)
          );
        }

        .home-v67-step-grid {
          position: relative;
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 14px;
        }

        .home-v67-step-card {
          position: relative;
          border-radius: 22px;
          background: rgba(255,255,255,0.10);
          border: 1px solid rgba(255,255,255,0.14);
          padding: 18px;
          backdrop-filter: blur(10px);
        }

        .home-v67-step-number {
          width: 46px;
          height: 46px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255,255,255,0.16);
          border: 1px solid rgba(255,255,255,0.20);
          color: #fff;
          font-weight: 900;
          margin-bottom: 14px;
          position: relative;
          z-index: 2;
        }

        .home-v67-step-title {
          font-size: 1rem;
          font-weight: 900;
          color: #fff;
          margin-bottom: 8px;
        }

        .home-v67-step-text {
          color: rgba(255,255,255,0.76);
          line-height: 1.75;
          margin-bottom: 0;
          font-size: 0.92rem;
        }

        .home-v67-testimonial-wrap {
          margin-top: 34px;
          border-radius: 30px;
          background: rgba(255,255,255,0.84);
          padding: 30px;
        }

        .home-v67-testimonial-card {
          border-radius: 28px;
          background: linear-gradient(135deg, #081226 0%, #102247 42%, #1d4ed8 100%);
          color: #fff;
          padding: 28px;
          box-shadow: 0 24px 58px rgba(15,23,42,0.14);
          min-height: 250px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .home-v67-quote-mark {
          font-size: 3rem;
          line-height: 1;
          color: rgba(255,255,255,0.24);
          font-weight: 900;
          margin-bottom: 10px;
        }

        .home-v67-testimonial-text {
          color: rgba(255,255,255,0.88);
          line-height: 1.9;
          margin-bottom: 18px;
        }

        .home-v67-testimonial-name {
          font-size: 1rem;
          font-weight: 900;
          margin-bottom: 4px;
        }

        .home-v67-testimonial-role {
          font-size: 0.88rem;
          color: rgba(255,255,255,0.72);
          margin-bottom: 0;
        }

        .home-v67-testimonial-dots {
          display: flex;
          justify-content: center;
          gap: 10px;
          margin-top: 18px;
        }

        .home-v67-testimonial-dot {
          width: 11px;
          height: 11px;
          border-radius: 50%;
          border: none;
          background: #cbd5e1;
          transition: all 0.25s ease;
        }

        .home-v67-testimonial-dot.active {
          background: #2563eb;
          transform: scale(1.18);
        }

        .home-v67-faq-wrap {
          margin-top: 34px;
          border-radius: 30px;
          background: rgba(255,255,255,0.84);
          padding: 30px;
        }

        .home-v67-faq-list {
          display: grid;
          gap: 14px;
          margin-top: 18px;
        }

        .home-v67-faq-item {
          border-radius: 22px;
          background: rgba(248,250,252,0.92);
          border: 1px solid #e2e8f0;
          overflow: hidden;
        }

        .home-v67-faq-btn {
          width: 100%;
          border: none;
          background: transparent;
          padding: 18px 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          text-align: left;
          font-weight: 800;
          color: #0f172a;
        }

        .home-v67-faq-icon {
          width: 32px;
          height: 32px;
          min-width: 32px;
          border-radius: 10px;
          background: #eff6ff;
          color: #1d4ed8;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 900;
        }

        .home-v67-faq-answer {
          padding: 0 20px 18px;
          color: #475569;
          line-height: 1.85;
        }

        .home-v67-final-card {
          margin-top: 34px;
          border-radius: 30px;
          background: rgba(255,255,255,0.84);
          padding: 30px;
        }

        .home-v67-final-title {
          font-size: 1.6rem;
          font-weight: 900;
          color: #0f172a;
          margin-bottom: 12px;
          letter-spacing: -0.02em;
        }

        .home-v67-final-text {
          color: #475569;
          line-height: 1.9;
          margin-bottom: 0;
        }

        .home-v67-link-row {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 20px;
        }

        .home-v67-link-chip {
          padding: 11px 16px;
          border-radius: 999px;
          background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
          border: 1px solid #dbeafe;
          color: #0f172a;
          font-weight: 800;
          text-decoration: none;
          transition: all 0.28s ease;
        }

        .home-v67-link-chip:hover {
          color: #0f172a;
          transform: translateY(-2px);
          box-shadow: 0 12px 24px rgba(37,99,235,0.08);
        }

        @keyframes homeV67Float {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-20px) translateX(10px); }
        }

        @keyframes homeV67CardFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }

        @keyframes homeV67FloatMini {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-7px); }
        }

        @keyframes homeV67BarPulse {
          0%, 100% { transform: scaleX(1); filter: brightness(1); }
          50% { transform: scaleX(0.96); filter: brightness(1.12); }
        }

        @keyframes homeV67FadeSlide {
          0% { opacity: 0; transform: translateY(8px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        @keyframes homeV67Shimmer {
          100% { transform: translateX(100%); }
        }

        @media (max-width: 1399px) {
          .home-v67-title { font-size: 3.55rem; }
        }

        @media (max-width: 1199px) {
          .home-v67-title { font-size: 3rem; }
          .home-v67-step-grid,
          .home-v67-stats-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
          .home-v67-timeline::before { display: none; }
          .home-v67-floating-left { left: -8px; bottom: 24px; }
          .home-v67-floating-right { right: -8px; }
          .home-v67-sk-box-row {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 991px) {
          .home-v67-page { padding: 28px 0 64px; }
          .home-v67-title {
            font-size: 2.5rem;
            line-height: 1.08;
          }
          .home-v67-process-title,
          .home-v67-section-title {
            font-size: 1.8rem;
          }
          .home-v67-hero-wrap,
          .home-v67-glass-card,
          .home-v67-domain-wrap,
          .home-v67-process-inner,
          .home-v67-faq-wrap,
          .home-v67-final-card,
          .home-v67-testimonial-wrap {
            padding: 24px;
          }
          .home-v67-showcase {
            display: block;
            margin-top: 26px;
          }
          .home-v67-dashboard {
            max-width: 100%;
            width: 100%;
            margin: 0;
          }
          .home-v67-floating-left,
          .home-v67-floating-right {
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
          .home-v67-page { padding: 22px 0 54px; }
          .home-v67-title { font-size: 2.02rem; }
          .home-v67-badge {
            width: 100%;
            justify-content: center;
            text-align: center;
            font-size: 0.74rem;
            padding: 10px 14px;
          }
          .home-v67-rotating-line {
            min-height: 54px;
            align-items: flex-start;
          }
          .home-v67-subtitle,
          .home-v67-card-text,
          .home-v67-process-text,
          .home-v67-step-text,
          .home-v67-final-text,
          .home-v67-metric-text,
          .home-v67-section-text,
          .home-v67-faq-answer,
          .home-v67-testimonial-text {
            line-height: 1.8;
          }
          .home-v67-hero-wrap,
          .home-v67-glass-card,
          .home-v67-dashboard,
          .home-v67-domain-wrap,
          .home-v67-process-inner,
          .home-v67-faq-wrap,
          .home-v67-final-card,
          .home-v67-step-card,
          .home-v67-stat-card,
          .home-v67-testimonial-wrap,
          .home-v67-testimonial-card {
            padding: 22px;
            border-radius: 22px;
          }
          .home-v67-btn-primary,
          .home-v67-btn-success,
          .home-v67-btn-outline,
          .home-v67-link-chip,
          .home-v67-mini-chip {
            width: 100%;
            text-align: center;
          }
          .home-v67-window-top {
            flex-direction: column;
            align-items: flex-start;
          }
          .home-v67-window-title {
            text-align: left;
            font-size: 0.78rem;
          }
          .home-v67-mini-strip,
          .home-v67-cta-row,
          .home-v67-link-row {
            gap: 10px;
          }
          .home-v67-step-grid,
          .home-v67-stats-grid,
          .home-v67-metric-grid,
          .home-v67-sk-box-row {
            grid-template-columns: 1fr;
          }
          .home-v67-domain-tabs { gap: 10px; }
          .home-v67-domain-tab { width: 100%; }
          .home-v67-timeline::before { display: none; }
          .home-v67-testimonial-card { min-height: auto; }
          .home-v67-particles { display: none; }
        }

        @media (max-width: 575px) {
          .home-v67-page .container {
            padding-left: 12px;
            padding-right: 12px;
          }
          .home-v67-title {
            font-size: 1.8rem;
            line-height: 1.15;
          }
          .home-v67-subtitle { font-size: 0.98rem; }
          .home-v67-btn-primary,
          .home-v67-btn-success,
          .home-v67-btn-outline {
            min-height: 52px;
            padding: 0 18px;
            border-radius: 16px;
            font-size: 0.95rem;
          }
          .home-v67-window-dot {
            width: 8px;
            height: 8px;
          }
          .home-v67-metric-value,
          .home-v67-stat-value {
            font-size: 1.45rem;
          }
          .home-v67-card-title,
          .home-v67-final-title,
          .home-v67-domain-title {
            font-size: 1.28rem;
          }
          .home-v67-process-title,
          .home-v67-section-title {
            font-size: 1.42rem;
          }
        }
      `}</style>

      <div className={`home-v67-page ${!pageReady ? "home-v67-page-loading" : ""}`}>
        <div
          className="home-v67-orb home-v67-orb-1"
          style={{ transform: `translateY(${scrollY * 0.08}px)` }}
        ></div>
        <div
          className="home-v67-orb home-v67-orb-2"
          style={{ transform: `translateY(${scrollY * -0.05}px)` }}
        ></div>
        <div
          className="home-v67-orb home-v67-orb-3"
          style={{ transform: `translateY(${scrollY * 0.04}px)` }}
        ></div>

        {!pageReady && (
          <div className="container home-v67-shell">
            <div className="home-v67-skeleton-wrap">
              <div className="home-v67-skeleton-card home-v67-skeleton-hero">
                <div className="home-v67-skeleton-inner">
                  <div className="home-v67-sk-pill"></div>
                  <div className="home-v67-sk-line home-v67-sk-line-1"></div>
                  <div className="home-v67-sk-line home-v67-sk-line-2"></div>
                  <div className="home-v67-sk-line home-v67-sk-line-3"></div>
                  <div className="home-v67-sk-line home-v67-sk-line-4"></div>
                  <div className="home-v67-sk-line home-v67-sk-line-5"></div>
                </div>
              </div>

              <div className="home-v67-skeleton-card home-v67-skeleton-grid">
                <div className="home-v67-skeleton-inner">
                  <div className="home-v67-sk-box-row">
                    <div className="home-v67-sk-box"></div>
                    <div className="home-v67-sk-box"></div>
                    <div className="home-v67-sk-box"></div>
                    <div className="home-v67-sk-box"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="home-v67-content">
          <div className="container home-v67-shell">
            <section
              ref={(el) => setRevealRef(el, 0)}
              className="home-v67-hero-wrap home-v67-reveal home-v67-parallax-light"
              style={{
                "--pointer-x": `${pointer.x}%`,
                "--pointer-y": `${pointer.y}%`,
              }}
              onMouseMove={handleHeroPointerMove}
              onMouseLeave={handleHeroPointerLeave}
            >
              <div className="home-v67-particles">
                {particles.map((particle, index) => (
                  <span
                    key={index}
                    className="home-v67-particle"
                    style={{
                      left: `${particle.x}%`,
                      top: `${particle.y}%`,
                      width: `${particle.size}px`,
                      height: `${particle.size}px`,
                    }}
                  ></span>
                ))}
              </div>

              <div className="row g-4 align-items-center">
                <div className="col-lg-7">
                  <div className="home-v67-badge">
                    InternovaTech SaaS Learning Experience
                  </div>

                  <h1 className="home-v67-title">
                    <span className="home-v67-title-accent">InternovaTech</span> is
                    your premium platform for online Internship Programs, practical
                    learning, and verified digital achievement.
                  </h1>

                  <div className="home-v67-rotating-line">
                    <span className="home-v67-rotating-label">Built for</span>
                    <span className="home-v67-rotating-pill">
                      {rotatingHighlights[activeHighlight]}
                    </span>
                  </div>

                  <p className="home-v67-subtitle">
                    InternovaTech helps students, freshers, and learners build
                    real career-focused skills through structured Internship Programs
                    programs, guided modules, assessments, progress tracking, and
                    certificate verification support. Our platform is designed to
                    deliver a futuristic, premium, and outcome-driven learning
                    experience across Web Development, Data Science, Artificial
                    Intelligence, Finance, and other in-demand fields.
                  </p>

                  <div className="home-v67-cta-row">
                    <Link to="/internships" className="home-v67-btn-primary">
                      Explore Internship Programs
                    </Link>
                    <Link to="/verify" className="home-v67-btn-success">
                      Verify Certificate
                    </Link>
                    <Link to="/login" className="home-v67-btn-outline">
                      Login to Dashboard
                    </Link>
                    <Link to="/contact" className="home-v67-btn-outline">
                      Contact Us
                    </Link>
                  </div>

                  <div className="home-v67-mini-strip">
                    <span className="home-v67-mini-chip">Practical Learning Flow</span>
                    <span className="home-v67-mini-chip">Verified Certificates</span>
                    <span className="home-v67-mini-chip">Premium Dashboard UX</span>
                    <span className="home-v67-mini-chip">
                      Career-Focused Internship Programs Paths
                    </span>
                  </div>
                </div>

                <div className="col-lg-5">
                  <div className="home-v67-showcase">
                    <div className="home-v67-dashboard">
                      <div className="home-v67-window-top">
                        <div className="home-v67-window-dots">
                          <span className="home-v67-window-dot"></span>
                          <span className="home-v67-window-dot"></span>
                          <span className="home-v67-window-dot"></span>
                        </div>
                        <div className="home-v67-window-title">
                          InternovaTech Workspace
                        </div>
                      </div>

                      <div className="home-v67-metric-grid">
                        <div className="home-v67-metric-card">
                          <div className="home-v67-metric-label">Programs</div>
                          <div className="home-v67-metric-value">Multi-Domain</div>
                          <p className="home-v67-metric-text">
                            Explore role-focused Internship Programs paths with premium structure.
                          </p>
                        </div>

                        <div className="home-v67-metric-card">
                          <div className="home-v67-metric-label">Certificates</div>
                          <div className="home-v67-metric-value">Verified</div>
                          <p className="home-v67-metric-text">
                            Public verification makes learning outcomes more trusted.
                          </p>
                        </div>
                      </div>

                      <div className="home-v67-panel">
                        <h3 className="home-v67-panel-title">
                          Learning Progress Preview
                        </h3>
                        <div className="home-v67-progress-list">
                          <div className="home-v67-progress-item">
                            <div className="home-v67-progress-meta">
                              <span>Program Completion</span>
                              <span>82%</span>
                            </div>
                            <div className="home-v67-progress-bar">
                              <div className="home-v67-progress-fill home-v67-fill-1"></div>
                            </div>
                          </div>

                          <div className="home-v67-progress-item">
                            <div className="home-v67-progress-meta">
                              <span>Assessment Readiness</span>
                              <span>74%</span>
                            </div>
                            <div className="home-v67-progress-bar">
                              <div className="home-v67-progress-fill home-v67-fill-2"></div>
                            </div>
                          </div>

                          <div className="home-v67-progress-item">
                            <div className="home-v67-progress-meta">
                              <span>Certificate Eligibility</span>
                              <span>90%</span>
                            </div>
                            <div className="home-v67-progress-bar">
                              <div className="home-v67-progress-fill home-v67-fill-3"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="home-v67-floating-card home-v67-floating-left">
                      <h4 className="home-v67-floating-title">Trusted Validation</h4>
                      <p className="home-v67-floating-text">
                        Certificate verification and completion-based proof add more credibility.
                      </p>
                    </div>

                    <div className="home-v67-floating-card home-v67-floating-right">
                      <h4 className="home-v67-floating-title">Premium UX</h4>
                      <p className="home-v67-floating-text">
                        Smooth access, clean structure, and dashboard-level experience in one place.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section
              ref={(el) => {
                setRevealRef(el, 1);
                statsSectionRef.current = el;
              }}
              className="home-v67-section home-v67-reveal home-v67-parallax-light"
            >
              <div className="home-v67-stats-grid">
                <div className="home-v67-stat-card home-v67-spotlight" onMouseMove={handleSpotlightMove}>
                  <div className="home-v67-stat-value">{stats.learners}+</div>
                  <div className="home-v67-stat-label">Learner Experiences</div>
                </div>
                <div className="home-v67-stat-card home-v67-spotlight" onMouseMove={handleSpotlightMove}>
                  <div className="home-v67-stat-value">{stats.tracks}+</div>
                  <div className="home-v67-stat-label">Career Tracks</div>
                </div>
                <div className="home-v67-stat-card home-v67-spotlight" onMouseMove={handleSpotlightMove}>
                  <div className="home-v67-stat-value">{stats.certificates}+</div>
                  <div className="home-v67-stat-label">Certificates Enabled</div>
                </div>
                <div className="home-v67-stat-card home-v67-spotlight" onMouseMove={handleSpotlightMove}>
                  <div className="home-v67-stat-value">{stats.progress}%</div>
                  <div className="home-v67-stat-label">Structured Flow Focus</div>
                </div>
              </div>
            </section>

            <section
              ref={(el) => setRevealRef(el, 2)}
              className="home-v67-section home-v67-reveal home-v67-parallax-medium"
            >
              <div className="home-v67-domain-wrap">
                <div className="row g-4 align-items-center">
                  <div className="col-lg-5">
                    <h2 className="home-v67-section-title">
                      Explore our learning directions
                    </h2>
                    <p className="home-v67-section-text">
                      InternovaTech is designed to feel guided, interactive, and
                      role-aware. Tap a domain below to preview the kind of
                      structured experience learners can expect.
                    </p>

                    <div className="home-v67-domain-tabs">
                      <button
                        type="button"
                        className={`home-v67-domain-tab ${activeDomain === "web" ? "active" : ""}`}
                        onClick={() => setActiveDomain("web")}
                      >
                        Web Development
                      </button>
                      <button
                        type="button"
                        className={`home-v67-domain-tab ${activeDomain === "data" ? "active" : ""}`}
                        onClick={() => setActiveDomain("data")}
                      >
                        Data Science
                      </button>
                      <button
                        type="button"
                        className={`home-v67-domain-tab ${activeDomain === "ai" ? "active" : ""}`}
                        onClick={() => setActiveDomain("ai")}
                      >
                        Artificial Intelligence
                      </button>
                      <button
                        type="button"
                        className={`home-v67-domain-tab ${activeDomain === "finance" ? "active" : ""}`}
                        onClick={() => setActiveDomain("finance")}
                      >
                        Finance
                      </button>
                    </div>
                  </div>

                  <div className="col-lg-7">
                    <div className="home-v67-domain-panel">
                      <h3 className="home-v67-domain-title">
                        {domainData[activeDomain].title}
                      </h3>
                      <p className="home-v67-domain-subtitle">
                        {domainData[activeDomain].subtitle}
                      </p>

                      <div className="home-v67-domain-points">
                        {domainData[activeDomain].points.map((point, index) => (
                          <div className="home-v67-domain-point" key={index}>
                            <span className="home-v67-domain-dot"></span>
                            <span>{point}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section
              ref={(el) => setRevealRef(el, 3)}
              className="home-v67-section home-v67-reveal home-v67-parallax-light"
            >
              <div className="row g-4">
                <div className="col-lg-4 col-md-6">
                  <div className="home-v67-glass-card home-v67-spotlight" onMouseMove={handleSpotlightMove}>
                    <div className="home-v67-card-icon">
                      <svg viewBox="0 0 24 24" fill="none">
                        <path d="M5 19h14M7 16V8m5 8V5m5 11v-6" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round"/>
                      </svg>
                    </div>
                    <h2 className="home-v67-card-title">Structured Learning Experience</h2>
                    <p className="home-v67-card-text">
                      InternovaTech provides organized access to guided programs,
                      premium visual flow, and learner-first experiences so users
                      can focus on actual improvement instead of complexity.
                    </p>
                  </div>
                </div>

                <div className="col-lg-4 col-md-6">
                  <div className="home-v67-glass-card home-v67-spotlight" onMouseMove={handleSpotlightMove}>
                    <div className="home-v67-card-icon">
                      <svg viewBox="0 0 24 24" fill="none">
                        <path d="M4 12h4l2-5 4 10 2-5h4" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <h2 className="home-v67-card-title">
                      Assessments and Progress Tracking
                    </h2>
                    <p className="home-v67-card-text">
                      Dashboard-driven tracking, mini tests, and structured
                      module progression help learners understand their journey
                      clearly and move forward with confidence.
                    </p>
                  </div>
                </div>

                <div className="col-lg-4 col-md-12">
                  <div className="home-v67-glass-card home-v67-spotlight" onMouseMove={handleSpotlightMove}>
                    <div className="home-v67-card-icon">
                      <svg viewBox="0 0 24 24" fill="none">
                        <path d="M12 3l7 3v5c0 4.2-2.5 7.7-7 10-4.5-2.3-7-5.8-7-10V6l7-3Z" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round"/>
                        <path d="m9.5 12 1.7 1.7 3.8-4" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <h2 className="home-v67-card-title">
                      Certificate Verification Support
                    </h2>
                    <p className="home-v67-card-text">
                      Completion-based certificate support with public validation,
                      digital verification, and trusted document credibility helps
                      learners present stronger outcomes.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section
              ref={(el) => setRevealRef(el, 4)}
              className="home-v67-section home-v67-reveal home-v67-parallax-light"
            >
              <div className="row g-4">
                <div className="col-md-6">
                  <div className="home-v67-glass-card home-v67-spotlight" onMouseMove={handleSpotlightMove}>
                    <div className="home-v67-card-icon">
                      <svg viewBox="0 0 24 24" fill="none">
                        <path d="M12 21s7-4.4 7-11V5l-7-2-7 2v5c0 6.6 7 11 7 11Z" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <h2 className="home-v67-card-title">Our Mission</h2>
                    <p className="home-v67-card-text">
                      Our mission is to make online Internship Programs and digital
                      learning more accessible, skill-oriented, premium, and
                      professional by combining learner support, structured
                      training, assessments, and verified achievement in one place.
                    </p>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="home-v67-glass-card home-v67-spotlight" onMouseMove={handleSpotlightMove}>
                    <div className="home-v67-card-icon">
                      <svg viewBox="0 0 24 24" fill="none">
                        <path d="M4 18h16M6 15l4-4 3 3 5-6" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <h2 className="home-v67-card-title">What We Focus On</h2>
                    <p className="home-v67-card-text">
                      InternovaTech focuses on practical skill development,
                      Internship Programs participation, progress visibility, assessment
                      readiness, certificate eligibility, and smoother learning
                      journeys from start to completion.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section
              ref={(el) => setRevealRef(el, 5)}
              className="home-v67-process-band home-v67-reveal home-v67-parallax-medium"
            >
              <div className="home-v67-process-inner">
                <h2 className="home-v67-process-title">How InternovaTech works</h2>
                <p className="home-v67-process-text">
                  InternovaTech combines premium SaaS design with structured
                  learning flow, helping students and freshers go from exploration
                  to completion inside one trusted Internship Programs ecosystem.
                </p>

                <div className="home-v67-timeline">
                  <div className="home-v67-step-grid">
                    <div className="home-v67-step-card">
                      <div className="home-v67-step-number">01</div>
                      <h3 className="home-v67-step-title">Explore</h3>
                      <p className="home-v67-step-text">
                        Discover role-focused Internship Programs across modern domains.
                      </p>
                    </div>

                    <div className="home-v67-step-card">
                      <div className="home-v67-step-number">02</div>
                      <h3 className="home-v67-step-title">Enroll</h3>
                      <p className="home-v67-step-text">
                        Select a plan and unlock guided learning access with structure.
                      </p>
                    </div>

                    <div className="home-v67-step-card">
                      <div className="home-v67-step-number">03</div>
                      <h3 className="home-v67-step-title">Progress</h3>
                      <p className="home-v67-step-text">
                        Continue modules, track milestones, and complete mini tests.
                      </p>
                    </div>

                    <div className="home-v67-step-card">
                      <div className="home-v67-step-number">04</div>
                      <h3 className="home-v67-step-title">Validate</h3>
                      <p className="home-v67-step-text">
                        Generate and verify certificates through a trusted digital system.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section
              ref={(el) => setRevealRef(el, 6)}
              className="home-v67-testimonial-wrap home-v67-reveal home-v67-parallax-light"
            >
              <h2 className="home-v67-section-title">What users feel about the experience</h2>
              <p className="home-v67-section-text">
                A premium learning platform should feel smooth, trusted, and easy to follow.
              </p>

              <div className="home-v67-testimonial-card">
                <div>
                  <div className="home-v67-quote-mark">“</div>
                  <p className="home-v67-testimonial-text">
                    {testimonials[activeTestimonial].text}
                  </p>
                </div>

                <div>
                  <div className="home-v67-testimonial-name">
                    {testimonials[activeTestimonial].name}
                  </div>
                  <p className="home-v67-testimonial-role">
                    {testimonials[activeTestimonial].role}
                  </p>
                </div>
              </div>

              <div className="home-v67-testimonial-dots">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    className={`home-v67-testimonial-dot ${
                      activeTestimonial === index ? "active" : ""
                    }`}
                    onClick={() => setActiveTestimonial(index)}
                  ></button>
                ))}
              </div>
            </section>

            <section
              ref={(el) => setRevealRef(el, 7)}
              className="home-v67-faq-wrap home-v67-reveal home-v67-parallax-light"
            >
              <h2 className="home-v67-section-title">Frequently asked questions</h2>
              <p className="home-v67-section-text">
                Quick answers to help users understand the InternovaTech experience
                more clearly.
              </p>

              <div className="home-v67-faq-list">
                {faqs.map((faq, index) => (
                  <div className="home-v67-faq-item" key={index}>
                    <button
                      type="button"
                      className="home-v67-faq-btn"
                      onClick={() => setOpenFaq(openFaq === index ? -1 : index)}
                    >
                      <span>{faq.q}</span>
                      <span className="home-v67-faq-icon">
                        {openFaq === index ? "−" : "+"}
                      </span>
                    </button>

                    {openFaq === index && (
                      <div className="home-v67-faq-answer">{faq.a}</div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            <section
              ref={(el) => setRevealRef(el, 8)}
              className="home-v67-final-card home-v67-reveal home-v67-parallax-light"
            >
              <h2 className="home-v67-final-title">
                Start your journey with InternovaTech
              </h2>
              <p className="home-v67-final-text">
                Whether you want to explore Internship Programs, continue your
                dashboard, verify certificates, or build job-ready skills,
                InternovaTech is designed to give you a polished, futuristic,
                and growth-focused learning experience.
              </p>

              <div className="home-v67-link-row">
                <Link to="/internships" className="home-v67-link-chip">
                  Internship Programs
                </Link>
                <Link to="/verify" className="home-v67-link-chip">
                  Certificate Verification
                </Link>
                <Link to="/privacy-policy" className="home-v67-link-chip">
                  Privacy Policy
                </Link>
                <Link to="/terms-and-conditions" className="home-v67-link-chip">
                  Terms & Conditions
                </Link>
                <Link to="/refund-policy" className="home-v67-link-chip">
                  Refund Policy
                </Link>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}

export default AboutUs;