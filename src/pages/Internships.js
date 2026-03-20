import React, { useEffect, useMemo, useState } from "react";
import API from "../services/api";
import { Link, useSearchParams } from "react-router-dom";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "https://api.internovatech.in/api";

const BRAND_LOGO_URL = `${API_BASE_URL.replace(/\/api\/?$/, "")}/uploads/branding/logo.png`;

function Internships() {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [logoFailed, setLogoFailed] = useState(false);

  const initialSearch = searchParams.get("search") || "";
  const [localSearch, setLocalSearch] = useState(initialSearch);

  const [branchFilter, setBranchFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [sortBy, setSortBy] = useState("default");

  const [toast, setToast] = useState({
    show: false,
    type: "success",
    message: "",
  });

  const showToast = (type, message) => {
    setToast({ show: true, type, message });

    setTimeout(() => {
      setToast({ show: false, type: "success", message: "" });
    }, 3000);
  };

  const fetchInternships = async () => {
    try {
      const { data } = await API.get("/internships");
      setInternships(data.internships || []);
    } catch (error) {
      console.error("Failed to fetch internship programs:", error);
      showToast("error", "Failed to fetch internship programs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title =
      "Online Internships | InternovaTech Programs and Training";

    const metaDescription = document.querySelector('meta[name="description"]');
    const previousDescription = metaDescription?.getAttribute("content") || "";

    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        "Explore InternovaTech online internships in Web Development, Data Science, Artificial Intelligence, Finance and more with structured learning, guided modules, assessments and verified certificates."
      );
    }

    let canonicalTag = document.querySelector('link[rel="canonical"]');
    const canonicalAlreadyExists = !!canonicalTag;

    if (!canonicalTag) {
      canonicalTag = document.createElement("link");
      canonicalTag.setAttribute("rel", "canonical");
      document.head.appendChild(canonicalTag);
    }

    canonicalTag.setAttribute(
      "href",
      "https://www.internovatech.in/internships"
    );

    fetchInternships();

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

  useEffect(() => {
    if (localSearch.trim()) {
      setSearchParams({ search: localSearch.trim() });
    } else {
      setSearchParams({});
    }
  }, [localSearch, setSearchParams]);

  const uniqueBranches = useMemo(() => {
    const branches = internships.map((item) => item.branch).filter(Boolean);
    return ["All", ...new Set(branches)];
  }, [internships]);

  const uniqueCategories = useMemo(() => {
    const categories = internships.map((item) => item.category).filter(Boolean);
    return ["All", ...new Set(categories)];
  }, [internships]);

  const filteredInternships = useMemo(() => {
    const query = localSearch.trim().toLowerCase();

    const filtered = internships.filter((item) => {
      const title = item.title?.toLowerCase() || "";
      const branch = item.branch?.toLowerCase() || "";
      const category = item.category?.toLowerCase() || "";
      const description = item.description?.toLowerCase() || "";

      const matchesSearch =
        !query ||
        title.includes(query) ||
        branch.includes(query) ||
        category.includes(query) ||
        description.includes(query);

      const matchesBranch =
        branchFilter === "All" || item.branch === branchFilter;

      const matchesCategory =
        categoryFilter === "All" || item.category === categoryFilter;

      return matchesSearch && matchesBranch && matchesCategory;
    });

    if (sortBy === "title-asc") {
      filtered.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
    } else if (sortBy === "price-low") {
      filtered.sort((a, b) => {
        const aMin = Math.min(
          ...(a.durations?.map((d) => Number(d.price) || 0) || [0])
        );
        const bMin = Math.min(
          ...(b.durations?.map((d) => Number(d.price) || 0) || [0])
        );
        return aMin - bMin;
      });
    } else if (sortBy === "price-high") {
      filtered.sort((a, b) => {
        const aMax = Math.max(
          ...(a.durations?.map((d) => Number(d.price) || 0) || [0])
        );
        const bMax = Math.max(
          ...(b.durations?.map((d) => Number(d.price) || 0) || [0])
        );
        return bMax - aMax;
      });
    }

    return filtered;
  }, [internships, localSearch, branchFilter, categoryFilter, sortBy]);

  const clearAllFilters = () => {
    setLocalSearch("");
    setBranchFilter("All");
    setCategoryFilter("All");
    setSortBy("default");
    setSearchParams({});
    showToast("success", "All filters cleared");
  };

  const activeFilterCount = [
    localSearch.trim(),
    branchFilter !== "All",
    categoryFilter !== "All",
    sortBy !== "default",
  ].filter(Boolean).length;

  if (loading) {
    return (
      <>
        <style>{`
          .internova-ultra-loader-page {
            min-height: 100vh;
            background:
              radial-gradient(circle at top left, rgba(59,130,246,0.16), transparent 28%),
              radial-gradient(circle at 82% 12%, rgba(99,102,241,0.14), transparent 24%),
              radial-gradient(circle at bottom right, rgba(16,185,129,0.10), transparent 24%),
              linear-gradient(135deg, #f8fbff 0%, #eef4ff 48%, #f8fbff 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 24px;
            position: relative;
            overflow: hidden;
          }

          .internova-ultra-loader-page::before {
            content: "";
            position: absolute;
            inset: 0;
            background:
              linear-gradient(rgba(255,255,255,0.22), rgba(255,255,255,0.16)),
              repeating-linear-gradient(
                90deg,
                rgba(255,255,255,0.04) 0px,
                rgba(255,255,255,0.04) 1px,
                transparent 1px,
                transparent 120px
              );
            pointer-events: none;
          }

          .internova-ultra-loader-orb {
            position: absolute;
            border-radius: 50%;
            filter: blur(18px);
            opacity: 0.52;
            pointer-events: none;
            animation: internovaUltraLoaderFloat 9s ease-in-out infinite;
          }

          .internova-ultra-loader-orb-1 {
            width: 260px;
            height: 260px;
            top: 8%;
            left: -70px;
            background: linear-gradient(135deg, rgba(29,78,216,0.22), rgba(14,165,233,0.14));
          }

          .internova-ultra-loader-orb-2 {
            width: 320px;
            height: 320px;
            right: -100px;
            top: 14%;
            background: linear-gradient(135deg, rgba(99,102,241,0.18), rgba(59,130,246,0.16));
            animation-delay: 1.4s;
          }

          .internova-ultra-loader-orb-3 {
            width: 240px;
            height: 240px;
            right: 12%;
            bottom: 5%;
            background: linear-gradient(135deg, rgba(16,185,129,0.12), rgba(37,99,235,0.10));
            animation-delay: 2.2s;
          }

          .internova-ultra-loader-orb-4 {
            width: 180px;
            height: 180px;
            left: 10%;
            bottom: 8%;
            background: linear-gradient(135deg, rgba(37,99,235,0.10), rgba(255,255,255,0.18));
            animation-delay: 2.8s;
          }

          .internova-ultra-loader-card {
            position: relative;
            z-index: 2;
            width: 100%;
            max-width: 520px;
            border-radius: 34px;
            background:
              linear-gradient(135deg, rgba(255,255,255,0.90) 0%, rgba(255,255,255,0.75) 100%);
            border: 1px solid rgba(255,255,255,0.86);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            box-shadow:
              0 32px 84px rgba(15,23,42,0.10),
              0 12px 32px rgba(59,130,246,0.08);
            overflow: hidden;
          }

          .internova-ultra-loader-card::before {
            content: "";
            position: absolute;
            inset: 0;
            background:
              radial-gradient(circle at 20% 18%, rgba(255,255,255,0.48), transparent 18%),
              radial-gradient(circle at 84% 74%, rgba(255,255,255,0.26), transparent 20%);
            pointer-events: none;
          }

          .internova-ultra-loader-topbar {
            position: relative;
            height: 8px;
            background: linear-gradient(135deg, #081226 0%, #102247 45%, #1d4ed8 100%);
          }

          .internova-ultra-loader-topbar::after {
            content: "";
            position: absolute;
            inset: 0;
            background: linear-gradient(
              90deg,
              transparent 0%,
              rgba(255,255,255,0.28) 35%,
              transparent 70%
            );
            animation: internovaUltraShine 2.2s linear infinite;
          }

          .internova-ultra-loader-body {
            position: relative;
            z-index: 2;
            padding: 36px 30px 30px;
            text-align: center;
          }

          .internova-ultra-loader-brand {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 16px;
            margin-bottom: 24px;
            flex-wrap: wrap;
          }

          .internova-ultra-loader-logo-shell {
            position: relative;
            width: 84px;
            height: 84px;
            border-radius: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #081226 0%, #102247 45%, #1d4ed8 100%);
            box-shadow:
              0 20px 35px rgba(29,78,216,0.24),
              0 8px 18px rgba(8,18,38,0.16);
            overflow: hidden;
            flex-shrink: 0;
          }

          .internova-ultra-loader-logo-shell::before {
            content: "";
            position: absolute;
            inset: 0;
            background: linear-gradient(135deg, rgba(255,255,255,0.20), transparent 58%);
            pointer-events: none;
          }

          .internova-ultra-loader-logo-shell::after {
            content: "";
            position: absolute;
            inset: -6px;
            border-radius: 28px;
            border: 1px solid rgba(37,99,235,0.18);
            filter: blur(4px);
            pointer-events: none;
          }

          .internova-ultra-loader-logo-img {
            width: 58px;
            height: 58px;
            object-fit: contain;
            filter: drop-shadow(0 4px 10px rgba(255,255,255,0.10));
            position: relative;
            z-index: 2;
          }

          .internova-ultra-loader-logo-fallback {
            position: relative;
            z-index: 2;
            color: #ffffff;
            font-size: 1.85rem;
            font-weight: 900;
            letter-spacing: -0.04em;
          }

          .internova-ultra-loader-brand-text {
            text-align: left;
          }

          .internova-ultra-loader-brand-title {
            font-size: 1.65rem;
            font-weight: 900;
            line-height: 1.02;
            color: #0f172a;
            margin-bottom: 4px;
            letter-spacing: -0.04em;
          }

          .internova-ultra-loader-brand-subtitle {
            color: #64748b;
            font-size: 0.84rem;
            font-weight: 800;
            letter-spacing: 0.10em;
            text-transform: uppercase;
            margin-bottom: 0;
          }

          .internova-ultra-loader-ring-zone {
            position: relative;
            width: 108px;
            height: 108px;
            margin: 0 auto 24px;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .internova-ultra-loader-ring-outer,
          .internova-ultra-loader-ring-inner {
            position: absolute;
            border-radius: 50%;
          }

          .internova-ultra-loader-ring-outer {
            width: 108px;
            height: 108px;
            border: 5px solid rgba(37,99,235,0.10);
            border-top-color: #2563eb;
            border-right-color: #1d4ed8;
            animation: internovaUltraSpin 1.05s linear infinite;
            box-shadow: 0 12px 28px rgba(37,99,235,0.10);
          }

          .internova-ultra-loader-ring-inner {
            width: 76px;
            height: 76px;
            border: 4px solid rgba(148,163,184,0.16);
            border-bottom-color: #081226;
            border-left-color: #1d4ed8;
            animation: internovaUltraReverseSpin 1.4s linear infinite;
          }

          .internova-ultra-loader-core {
            position: absolute;
            width: 48px;
            height: 48px;
            border-radius: 50%;
            background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            color: #1d4ed8;
            font-weight: 900;
            font-size: 0.95rem;
            box-shadow:
              inset 0 1px 0 rgba(255,255,255,0.72),
              0 10px 22px rgba(37,99,235,0.10);
          }

          .internova-ultra-loader-heading {
            font-size: 1.4rem;
            font-weight: 900;
            color: #0f172a;
            margin-bottom: 9px;
            letter-spacing: -0.03em;
          }

          .internova-ultra-loader-text {
            color: #64748b;
            line-height: 1.88;
            margin-bottom: 22px;
            font-size: 0.98rem;
            max-width: 410px;
            margin-left: auto;
            margin-right: auto;
          }

          .internova-ultra-loader-progress {
            width: 100%;
            max-width: 320px;
            height: 10px;
            border-radius: 999px;
            background: rgba(148,163,184,0.14);
            margin: 0 auto 16px;
            overflow: hidden;
            position: relative;
          }

          .internova-ultra-loader-progress::before {
            content: "";
            position: absolute;
            inset: 0;
            background: linear-gradient(
              90deg,
              rgba(255,255,255,0.0),
              rgba(255,255,255,0.28),
              rgba(255,255,255,0.0)
            );
            animation: internovaUltraShine 1.9s linear infinite;
          }

          .internova-ultra-loader-progress-bar {
            width: 44%;
            height: 100%;
            border-radius: 999px;
            background: linear-gradient(135deg, #081226 0%, #102247 45%, #1d4ed8 100%);
            animation: internovaUltraSlide 1.35s ease-in-out infinite;
            box-shadow: 0 8px 18px rgba(29,78,216,0.16);
          }

          .internova-ultra-loader-pills {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 10px;
            margin-top: 6px;
            margin-bottom: 18px;
          }

          .internova-ultra-loader-pill {
            padding: 9px 13px;
            border-radius: 999px;
            background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
            border: 1px solid #dbeafe;
            color: #0f172a;
            font-size: 0.79rem;
            font-weight: 800;
            line-height: 1;
          }

          .internova-ultra-loader-footnote {
            color: #94a3b8;
            font-size: 0.84rem;
            font-weight: 700;
            margin-bottom: 0;
            letter-spacing: 0.03em;
          }

          @keyframes internovaUltraSpin {
            to {
              transform: rotate(360deg);
            }
          }

          @keyframes internovaUltraReverseSpin {
            to {
              transform: rotate(-360deg);
            }
          }

          @keyframes internovaUltraSlide {
            0% {
              transform: translateX(-120%);
            }
            100% {
              transform: translateX(330%);
            }
          }

          @keyframes internovaUltraShine {
            0% {
              transform: translateX(-140%);
            }
            100% {
              transform: translateX(180%);
            }
          }

          @keyframes internovaUltraLoaderFloat {
            0%, 100% {
              transform: translateY(0px) translateX(0px);
            }
            50% {
              transform: translateY(-16px) translateX(8px);
            }
          }

          @media (max-width: 767px) {
            .internova-ultra-loader-card {
              border-radius: 24px;
              max-width: 100%;
            }

            .internova-ultra-loader-body {
              padding: 28px 20px 24px;
            }

            .internova-ultra-loader-brand {
              gap: 12px;
              margin-bottom: 20px;
            }

            .internova-ultra-loader-logo-shell {
              width: 72px;
              height: 72px;
              border-radius: 20px;
            }

            .internova-ultra-loader-logo-img {
              width: 50px;
              height: 50px;
            }

            .internova-ultra-loader-brand-title {
              font-size: 1.35rem;
            }

            .internova-ultra-loader-brand-subtitle {
              font-size: 0.76rem;
            }

            .internova-ultra-loader-heading {
              font-size: 1.16rem;
            }

            .internova-ultra-loader-text {
              font-size: 0.93rem;
            }

            .internova-ultra-loader-brand-text {
              text-align: center;
            }
          }
        `}</style>

        <div className="internova-ultra-loader-page">
          <div className="internova-ultra-loader-orb internova-ultra-loader-orb-1"></div>
          <div className="internova-ultra-loader-orb internova-ultra-loader-orb-2"></div>
          <div className="internova-ultra-loader-orb internova-ultra-loader-orb-3"></div>
          <div className="internova-ultra-loader-orb internova-ultra-loader-orb-4"></div>

          <div className="internova-ultra-loader-card">
            <div className="internova-ultra-loader-topbar"></div>

            <div className="internova-ultra-loader-body">
              <div className="internova-ultra-loader-brand">
                <div className="internova-ultra-loader-logo-shell">
                  {!logoFailed ? (
                    <img
                      src={BRAND_LOGO_URL}
                      alt="InternovaTech Logo"
                      className="internova-ultra-loader-logo-img"
                      onError={() => setLogoFailed(true)}
                    />
                  ) : (
                    <div className="internova-ultra-loader-logo-fallback">I</div>
                  )}
                </div>

                <div className="internova-ultra-loader-brand-text">
                  <div className="internova-ultra-loader-brand-title">
                    InternovaTech
                  </div>
                  <p className="internova-ultra-loader-brand-subtitle">
                    Online Internships Platform
                  </p>
                </div>
              </div>

              <div className="internova-ultra-loader-ring-zone">
                <div className="internova-ultra-loader-ring-outer"></div>
                <div className="internova-ultra-loader-ring-inner"></div>
                <div className="internova-ultra-loader-core">IT</div>
              </div>

              <h2 className="internova-ultra-loader-heading">
                Preparing premium internship programs
              </h2>

              <p className="internova-ultra-loader-text">
                We are loading InternovaTech programs, categories, and guided
                learning pathways to deliver a cleaner, faster, and more
                professional browsing experience.
              </p>

              <div className="internova-ultra-loader-progress">
                <div className="internova-ultra-loader-progress-bar"></div>
              </div>

              <div className="internova-ultra-loader-pills">
                <span className="internova-ultra-loader-pill">Guided Learning</span>
                <span className="internova-ultra-loader-pill">Progress Tracking</span>
                <span className="internova-ultra-loader-pill">Verified Certificates</span>
              </div>

              <p className="internova-ultra-loader-footnote">
                Please wait while we load the latest opportunities...
              </p>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{`
        .programs-v61-page {
          min-height: 100vh;
          background:
            radial-gradient(circle at top left, rgba(59,130,246,0.16), transparent 28%),
            radial-gradient(circle at 82% 12%, rgba(99,102,241,0.14), transparent 24%),
            radial-gradient(circle at bottom right, rgba(16,185,129,0.10), transparent 24%),
            linear-gradient(135deg, #f8fbff 0%, #eef4ff 48%, #f8fbff 100%);
          position: relative;
          overflow: hidden;
          padding: 34px 0 72px;
        }

        .programs-v61-page::before {
          content: "";
          position: absolute;
          inset: 0;
          background:
            linear-gradient(rgba(255,255,255,0.22), rgba(255,255,255,0.16)),
            repeating-linear-gradient(
              90deg,
              rgba(255,255,255,0.04) 0px,
              rgba(255,255,255,0.04) 1px,
              transparent 1px,
              transparent 120px
            );
          pointer-events: none;
        }

        .programs-v61-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(14px);
          opacity: 0.54;
          pointer-events: none;
          animation: programsV61Float 10s ease-in-out infinite;
          -webkit-animation: programsV61Float 10s ease-in-out infinite;
        }

        .programs-v61-orb-1 {
          width: 240px;
          height: 240px;
          top: 90px;
          left: -70px;
          background: linear-gradient(135deg, rgba(29,78,216,0.22), rgba(14,165,233,0.16));
        }

        .programs-v61-orb-2 {
          width: 310px;
          height: 310px;
          right: -80px;
          top: 140px;
          background: linear-gradient(135deg, rgba(99,102,241,0.18), rgba(59,130,246,0.18));
          animation-delay: 1.5s;
          -webkit-animation-delay: 1.5s;
        }

        .programs-v61-orb-3 {
          width: 210px;
          height: 210px;
          right: 14%;
          bottom: 5%;
          background: linear-gradient(135deg, rgba(16,185,129,0.12), rgba(37,99,235,0.10));
          animation-delay: 2.2s;
          -webkit-animation-delay: 2.2s;
        }

        .programs-v61-shell {
          position: relative;
          z-index: 2;
        }

        .programs-v61-toast {
          position: fixed;
          top: 96px;
          right: 24px;
          z-index: 9999;
          min-width: 280px;
          max-width: 390px;
        }

        .programs-v61-hero {
          position: relative;
          overflow: hidden;
          border-radius: 36px;
          padding: 32px;
          background:
            linear-gradient(135deg, rgba(255,255,255,0.82) 0%, rgba(255,255,255,0.70) 100%);
          border: 1px solid rgba(255,255,255,0.76);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          box-shadow:
            0 30px 80px rgba(15,23,42,0.10),
            0 12px 30px rgba(59,130,246,0.06);
          -webkit-box-shadow:
            0 30px 80px rgba(15,23,42,0.10),
            0 12px 30px rgba(59,130,246,0.06);
        }

        .programs-v61-hero::before {
          content: "";
          position: absolute;
          inset: 0;
          background:
            radial-gradient(circle at 18% 18%, rgba(255,255,255,0.38), transparent 18%),
            radial-gradient(circle at 86% 72%, rgba(255,255,255,0.24), transparent 20%);
          pointer-events: none;
        }

        .programs-v61-badge {
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
        }

        .programs-v61-title {
          position: relative;
          z-index: 2;
          font-size: 3.4rem;
          line-height: 1.04;
          font-weight: 900;
          letter-spacing: -0.05em;
          color: #0f172a;
          margin-bottom: 16px;
        }

        .programs-v61-title-accent {
          background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 42%, #0f172a 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          -webkit-text-fill-color: transparent;
        }

        .programs-v61-text {
          position: relative;
          z-index: 2;
          color: #475569;
          line-height: 1.95;
          font-size: 1.08rem;
          margin-bottom: 0;
          max-width: 780px;
        }

        .programs-v61-stat-grid {
          position: relative;
          z-index: 2;
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 14px;
        }

        .programs-v61-stat-card {
          border-radius: 24px;
          background: rgba(255,255,255,0.78);
          border: 1px solid rgba(148,163,184,0.16);
          padding: 20px;
          box-shadow: 0 16px 36px rgba(15,23,42,0.06);
          -webkit-box-shadow: 0 16px 36px rgba(15,23,42,0.06);
          transition: all 0.32s ease;
          -webkit-transition: all 0.32s ease;
          height: 100%;
        }

        .programs-v61-stat-card:hover {
          transform: translateY(-5px);
          -webkit-transform: translateY(-5px);
          box-shadow: 0 22px 44px rgba(15,23,42,0.09);
          -webkit-box-shadow: 0 22px 44px rgba(15,23,42,0.09);
        }

        .programs-v61-stat-label {
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #64748b;
          font-weight: 800;
          margin-bottom: 8px;
        }

        .programs-v61-stat-value {
          font-size: 1.55rem;
          font-weight: 900;
          color: #0f172a;
          letter-spacing: -0.03em;
          margin-bottom: 4px;
        }

        .programs-v61-stat-subtext {
          color: #64748b;
          margin-bottom: 0;
          font-size: 0.93rem;
          line-height: 1.75;
        }

        .programs-v61-filter-card {
          margin-top: 28px;
          border-radius: 32px;
          background: rgba(255,255,255,0.80);
          border: 1px solid rgba(255,255,255,0.76);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          box-shadow:
            0 26px 62px rgba(15,23,42,0.08),
            0 10px 24px rgba(59,130,246,0.05);
          -webkit-box-shadow:
            0 26px 62px rgba(15,23,42,0.08),
            0 10px 24px rgba(59,130,246,0.05);
          padding: 28px;
        }

        .programs-v61-filter-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
          margin-bottom: 20px;
        }

        .programs-v61-filter-title {
          font-size: 1.32rem;
          font-weight: 900;
          color: #0f172a;
          margin-bottom: 6px;
          letter-spacing: -0.02em;
        }

        .programs-v61-filter-subtitle {
          color: #64748b;
          line-height: 1.75;
          margin-bottom: 0;
        }

        .programs-v61-clear-btn {
          min-height: 48px;
          padding: 0 18px;
          border-radius: 16px;
          font-weight: 800;
          transition: all 0.3s ease;
          -webkit-transition: all 0.3s ease;
        }

        .programs-v61-clear-btn:hover {
          transform: translateY(-2px);
          -webkit-transform: translateY(-2px);
        }

        .programs-v61-input,
        .programs-v61-select {
          min-height: 58px;
          border-radius: 18px;
          border: 1px solid #dbe3f0;
          background: rgba(248,250,252,0.96);
          transition: all 0.3s ease;
          -webkit-transition: all 0.3s ease;
          box-shadow: none;
          -webkit-box-shadow: none;
        }

        .programs-v61-input:focus,
        .programs-v61-select:focus {
          border-color: #60a5fa;
          background: #ffffff;
          box-shadow: 0 0 0 4px rgba(37,99,235,0.12);
          -webkit-box-shadow: 0 0 0 4px rgba(37,99,235,0.12);
        }

        .programs-v61-meta-strip {
          margin-top: 18px;
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .programs-v61-chip {
          padding: 10px 14px;
          border-radius: 999px;
          background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
          border: 1px solid #dbeafe;
          color: #0f172a;
          font-size: 0.84rem;
          font-weight: 800;
        }

        .programs-v61-grid {
          margin-top: 30px;
        }

        .programs-v61-card {
          height: 100%;
          border-radius: 30px;
          background: rgba(255,255,255,0.80);
          border: 1px solid rgba(255,255,255,0.76);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          box-shadow:
            0 24px 60px rgba(15,23,42,0.08),
            0 8px 20px rgba(59,130,246,0.05);
          -webkit-box-shadow:
            0 24px 60px rgba(15,23,42,0.08),
            0 8px 20px rgba(59,130,246,0.05);
          overflow: hidden;
          transition: all 0.35s ease;
          -webkit-transition: all 0.35s ease;
          position: relative;
        }

        .programs-v61-card:hover {
          transform: translateY(-8px);
          -webkit-transform: translateY(-8px);
          box-shadow:
            0 30px 72px rgba(15,23,42,0.12),
            0 10px 24px rgba(59,130,246,0.07);
          -webkit-box-shadow:
            0 30px 72px rgba(15,23,42,0.12),
            0 10px 24px rgba(59,130,246,0.07);
        }

        .programs-v61-image-wrap {
          position: relative;
          height: 230px;
          overflow: hidden;
          background: linear-gradient(135deg, #dbeafe 0%, #eff6ff 100%);
        }

        .programs-v61-image-wrap::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to top,
            rgba(8,18,38,0.24) 0%,
            rgba(8,18,38,0.04) 46%,
            rgba(8,18,38,0) 100%
          );
          pointer-events: none;
        }

        .programs-v61-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.65s ease;
          -webkit-transition: -webkit-transform 0.65s ease;
        }

        .programs-v61-card:hover .programs-v61-image {
          transform: scale(1.06);
          -webkit-transform: scale(1.06);
        }

        .programs-v61-card-body {
          padding: 24px;
        }

        .programs-v61-card-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 12px;
          margin-bottom: 14px;
          flex-wrap: wrap;
        }

        .programs-v61-card-title {
          font-size: 1.2rem;
          font-weight: 900;
          color: #0f172a;
          line-height: 1.45;
          margin-bottom: 0;
          letter-spacing: -0.02em;
        }

        .programs-v61-badge-branch,
        .programs-v61-badge-category,
        .programs-v61-badge-duration {
          border-radius: 999px;
          padding: 8px 12px;
          font-weight: 800;
          font-size: 0.78rem;
          line-height: 1;
        }

        .programs-v61-badge-branch {
          background: linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%);
          color: #0f172a;
          border: 1px solid #cbd5e1;
        }

        .programs-v61-badge-category {
          background: linear-gradient(135deg, #081226 0%, #1d4ed8 100%);
          color: #fff;
          border: 1px solid rgba(29,78,216,0.18);
        }

        .programs-v61-description {
          color: #64748b;
          line-height: 1.85;
          margin-bottom: 18px;
        }

        .programs-v61-duration-wrap {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 20px;
        }

        .programs-v61-badge-duration {
          background: #f8fafc;
          color: #0f172a;
          border: 1px solid #e2e8f0;
        }

        .programs-v61-card-btn {
          min-height: 54px;
          border-radius: 18px;
          font-weight: 900;
          border: none;
          color: #fff;
          background: linear-gradient(135deg, #081226 0%, #102247 45%, #1d4ed8 100%);
          box-shadow:
            0 18px 35px rgba(29,78,216,0.18),
            0 8px 20px rgba(8,18,38,0.14);
          -webkit-box-shadow:
            0 18px 35px rgba(29,78,216,0.18),
            0 8px 20px rgba(8,18,38,0.14);
          transition: all 0.32s ease;
          -webkit-transition: all 0.32s ease;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
        }

        .programs-v61-card-btn:hover {
          color: #fff;
          transform: translateY(-2px);
          -webkit-transform: translateY(-2px);
        }

        .programs-v61-empty {
          margin-top: 26px;
          border-radius: 28px;
          padding: 24px;
          background: rgba(255,255,255,0.82);
          border: 1px solid rgba(148,163,184,0.16);
          box-shadow: 0 18px 42px rgba(15,23,42,0.06);
          -webkit-box-shadow: 0 18px 42px rgba(15,23,42,0.06);
        }

        .programs-v61-empty-title {
          font-size: 1.18rem;
          font-weight: 900;
          color: #0f172a;
          margin-bottom: 8px;
        }

        .programs-v61-empty-text {
          color: #64748b;
          line-height: 1.8;
          margin-bottom: 0;
        }

        .programs-v61-bottom-band {
          margin-top: 30px;
          border-radius: 30px;
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

        .programs-v61-bottom-band::before {
          content: "";
          position: absolute;
          inset: 0;
          background:
            radial-gradient(circle at 14% 18%, rgba(255,255,255,0.14), transparent 18%),
            radial-gradient(circle at 86% 74%, rgba(255,255,255,0.08), transparent 20%);
          pointer-events: none;
        }

        .programs-v61-bottom-inner {
          position: relative;
          z-index: 2;
          padding: 28px;
        }

        .programs-v61-bottom-title {
          font-size: 1.85rem;
          font-weight: 900;
          letter-spacing: -0.04em;
          margin-bottom: 10px;
        }

        .programs-v61-bottom-text {
          color: rgba(255,255,255,0.82);
          line-height: 1.9;
          margin-bottom: 0;
        }

        .programs-v61-bottom-actions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          justify-content: flex-end;
        }

        .programs-v61-btn-light,
        .programs-v61-btn-glass {
          min-height: 52px;
          padding: 0 20px;
          border-radius: 16px;
          font-weight: 900;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          -webkit-transition: all 0.3s ease;
        }

        .programs-v61-btn-light {
          color: #0f172a;
          background: linear-gradient(135deg, #ffffff 0%, #dbeafe 100%);
          box-shadow: 0 14px 30px rgba(255,255,255,0.14);
          -webkit-box-shadow: 0 14px 30px rgba(255,255,255,0.14);
        }

        .programs-v61-btn-light:hover {
          color: #0f172a;
          transform: translateY(-2px);
          -webkit-transform: translateY(-2px);
        }

        .programs-v61-btn-glass {
          color: #fff;
          border: 1px solid rgba(255,255,255,0.18);
          background: rgba(255,255,255,0.08);
        }

        .programs-v61-btn-glass:hover {
          color: #fff;
          background: rgba(255,255,255,0.12);
          transform: translateY(-2px);
          -webkit-transform: translateY(-2px);
        }

        @keyframes programsV61Float {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
          }
          50% {
            transform: translateY(-18px) translateX(10px);
          }
        }

        @media (max-width: 1199px) {
          .programs-v61-title {
            font-size: 2.8rem;
          }
        }

        @media (max-width: 991px) {
          .programs-v61-page {
            padding: 28px 0 62px;
          }

          .programs-v61-hero,
          .programs-v61-filter-card,
          .programs-v61-bottom-inner {
            padding: 24px;
          }

          .programs-v61-title {
            font-size: 2.35rem;
          }

          .programs-v61-stat-grid {
            grid-template-columns: 1fr;
          }

          .programs-v61-bottom-actions {
            justify-content: flex-start;
            margin-top: 12px;
          }
        }

        @media (max-width: 767px) {
          .programs-v61-title {
            font-size: 2rem;
            line-height: 1.12;
          }

          .programs-v61-text,
          .programs-v61-description,
          .programs-v61-empty-text,
          .programs-v61-bottom-text,
          .programs-v61-stat-subtext {
            line-height: 1.8;
          }

          .programs-v61-hero,
          .programs-v61-filter-card,
          .programs-v61-card,
          .programs-v61-empty,
          .programs-v61-bottom-inner,
          .programs-v61-stat-card {
            padding: 22px;
            border-radius: 22px;
          }

          .programs-v61-image-wrap {
            height: 210px;
          }

          .programs-v61-card-body {
            padding: 20px;
          }

          .programs-v61-bottom-actions {
            flex-direction: column;
            align-items: stretch;
          }

          .programs-v61-btn-light,
          .programs-v61-btn-glass {
            width: 100%;
          }
        }
      `}</style>

      <div className="programs-v61-page">
        <div className="programs-v61-orb programs-v61-orb-1"></div>
        <div className="programs-v61-orb programs-v61-orb-2"></div>
        <div className="programs-v61-orb programs-v61-orb-3"></div>

        <div className="container programs-v61-shell">
          {toast.show && (
            <div className="programs-v61-toast">
              <div
                className="shadow-lg rounded-4 px-4 py-3"
                style={{
                  background:
                    toast.type === "success"
                      ? "linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)"
                      : "linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)",
                  border:
                    toast.type === "success"
                      ? "1px solid #86efac"
                      : "1px solid #fca5a5",
                }}
              >
                <div
                  className={`fw-bold mb-1 ${
                    toast.type === "success" ? "text-success" : "text-danger"
                  }`}
                >
                  {toast.type === "success" ? "Success" : "Error"}
                </div>
                <div className="text-dark small">{toast.message}</div>
              </div>
            </div>
          )}

          <section className="programs-v61-hero">
            <div className="row g-4 align-items-center">
              <div className="col-lg-8">
                <div className="programs-v61-badge">
                  InternovaTech Program Explorer
                </div>

                <h1 className="programs-v61-title">
                  Explore{" "}
                  <span className="programs-v61-title-accent">
                    online internships
                  </span>{" "}
                  designed for practical learning and real career growth
                </h1>

                <p className="programs-v61-text">
                  Discover premium internship programs across modern domains with
                  guided learning, structured progression, assessments, and
                  verified certificate support. InternovaTech helps you move
                  from exploration to validated digital achievement in one clean
                  learning ecosystem.
                </p>
              </div>

              <div className="col-lg-4">
                <div className="programs-v61-stat-grid">
                  <div className="programs-v61-stat-card">
                    <div className="programs-v61-stat-label">Programs</div>
                    <div className="programs-v61-stat-value">
                      {internships.length}
                    </div>
                    <p className="programs-v61-stat-subtext">
                      Available internship options on the platform.
                    </p>
                  </div>

                  <div className="programs-v61-stat-card">
                    <div className="programs-v61-stat-label">Results</div>
                    <div className="programs-v61-stat-value">
                      {filteredInternships.length}
                    </div>
                    <p className="programs-v61-stat-subtext">
                      Matching results for your current filters.
                    </p>
                  </div>

                  <div className="programs-v61-stat-card">
                    <div className="programs-v61-stat-label">Filters</div>
                    <div className="programs-v61-stat-value">
                      {activeFilterCount > 0
                        ? `${activeFilterCount} Active`
                        : "Default"}
                    </div>
                    <p className="programs-v61-stat-subtext">
                      Search, branch, category, and sorting controls.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="programs-v61-filter-card">
            <div className="programs-v61-filter-head">
              <div>
                <h2 className="programs-v61-filter-title">
                  Discover the right internship path
                </h2>
                <p className="programs-v61-filter-subtitle">
                  Search programs by title, branch, category, or description and
                  refine results with clean filtering controls.
                </p>
              </div>

              {activeFilterCount > 0 && (
                <button
                  className="btn btn-outline-dark programs-v61-clear-btn"
                  onClick={clearAllFilters}
                >
                  Clear All Filters
                </button>
              )}
            </div>

            <div className="row g-3">
              <div className="col-md-12">
                <label className="form-label fw-bold">Search Programs</label>
                <input
                  type="text"
                  className="form-control programs-v61-input"
                  placeholder="Search by title, branch, category, or description..."
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                />
              </div>

              <div className="col-md-4">
                <label className="form-label fw-bold">Filter by Branch</label>
                <select
                  className="form-select programs-v61-select"
                  value={branchFilter}
                  onChange={(e) => setBranchFilter(e.target.value)}
                >
                  {uniqueBranches.map((branch, index) => (
                    <option key={index} value={branch}>
                      {branch}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-4">
                <label className="form-label fw-bold">Filter by Category</label>
                <select
                  className="form-select programs-v61-select"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  {uniqueCategories.map((category, index) => (
                    <option key={index} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-4">
                <label className="form-label fw-bold">Sort By</label>
                <select
                  className="form-select programs-v61-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="default">Default</option>
                  <option value="title-asc">Title A-Z</option>
                  <option value="price-low">Lowest Price</option>
                  <option value="price-high">Highest Price</option>
                </select>
              </div>
            </div>

            <div className="programs-v61-meta-strip">
              <span className="programs-v61-chip">Guided Learning</span>
              <span className="programs-v61-chip">Progress Tracking</span>
              <span className="programs-v61-chip">Mini Assessments</span>
              <span className="programs-v61-chip">Verified Certificates</span>
            </div>
          </section>

          <section className="programs-v61-grid">
            <div className="row g-4">
              {filteredInternships.map((item) => (
                <div className="col-md-6 col-xl-4" key={item._id}>
                  <div className="programs-v61-card">
                    <div className="programs-v61-image-wrap">
                      <img
                        src={
                          item.thumbnail ||
                          "https://via.placeholder.com/400x250"
                        }
                        alt={item.title || "InternovaTech internship program"}
                        className="programs-v61-image"
                      />
                    </div>

                    <div className="programs-v61-card-body">
                      <div className="programs-v61-card-top">
                        <h2 className="programs-v61-card-title">
                          {item.title}
                        </h2>

                        <span className="programs-v61-badge-branch">
                          {item.branch}
                        </span>
                      </div>

                      <p className="mb-3">
                        <span className="programs-v61-badge-category">
                          {item.category}
                        </span>
                      </p>

                      <p className="programs-v61-description">
                        {item.description?.length > 118
                          ? `${item.description.slice(0, 118)}...`
                          : item.description}
                      </p>

                      <div className="programs-v61-duration-wrap">
                        {item.durations?.map((duration, index) => (
                          <span
                            key={index}
                            className="programs-v61-badge-duration"
                          >
                            {duration.label} • INR {duration.price}
                          </span>
                        ))}
                      </div>

                      <Link
                        to={`/internships/${item._id}`}
                        className="programs-v61-card-btn w-100"
                      >
                        View Program Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredInternships.length === 0 && (
              <div className="programs-v61-empty">
                <h3 className="programs-v61-empty-title">No Programs Found</h3>
                <p className="programs-v61-empty-text">
                  No internship programs matched your current search or filters.
                  Try adjusting the query or clearing all filters to discover
                  more options.
                </p>
              </div>
            )}
          </section>

          <section className="programs-v61-bottom-band">
            <div className="row align-items-center g-4 programs-v61-bottom-inner">
              <div className="col-lg-8">
                <h2 className="programs-v61-bottom-title">
                  Ready to start learning with InternovaTech?
                </h2>
                <p className="programs-v61-bottom-text">
                  Explore your preferred internship domain, continue with
                  structured learning, and move toward verified completion
                  through a cleaner, more premium internship experience.
                </p>
              </div>

              <div className="col-lg-4">
                <div className="programs-v61-bottom-actions">
                  <Link to="/verify" className="programs-v61-btn-light">
                    Verify Certificate
                  </Link>
                  <Link to="/contact" className="programs-v61-btn-glass">
                    Contact Us
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

export default Internships;