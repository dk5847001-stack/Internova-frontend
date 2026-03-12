import React, { useEffect, useMemo, useState } from "react";
import API from "../services/api";
import { Link, useSearchParams } from "react-router-dom";

function Internships() {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

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
      console.error("Failed to fetch programs:", error);
      showToast("error", "Failed to fetch programs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInternships();
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

    let filtered = internships.filter((item) => {
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
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === "price-low") {
      filtered.sort((a, b) => {
        const aMin = Math.min(...(a.durations?.map((d) => d.price) || [0]));
        const bMin = Math.min(...(b.durations?.map((d) => d.price) || [0]));
        return aMin - bMin;
      });
    } else if (sortBy === "price-high") {
      filtered.sort((a, b) => {
        const aMax = Math.max(...(a.durations?.map((d) => d.price) || [0]));
        const bMax = Math.max(...(b.durations?.map((d) => d.price) || [0]));
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

  if (loading) {
    return (
      <div
        className="min-vh-100 d-flex align-items-center justify-content-center"
        style={{
          background:
            "linear-gradient(135deg, #f8fafc 0%, #eef2ff 45%, #f8fafc 100%)",
        }}
      >
        <div className="text-center">
          <div className="spinner-border text-dark mb-3" role="status"></div>
          <div className="fw-semibold text-dark">Loading programs...</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        .internships-page {
          min-height: 100vh;
          background:
            radial-gradient(circle at top left, rgba(59,130,246,0.18), transparent 28%),
            radial-gradient(circle at bottom right, rgba(99,102,241,0.16), transparent 32%),
            linear-gradient(135deg, #f8fafc 0%, #eef2ff 48%, #f8fafc 100%);
          position: relative;
          overflow: hidden;
        }

        .internships-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(10px);
          opacity: 0.55;
          animation: internshipsFloat 9s ease-in-out infinite;
          -webkit-animation: internshipsFloat 9s ease-in-out infinite;
          pointer-events: none;
        }

        .internships-orb-1 {
          width: 220px;
          height: 220px;
          top: 70px;
          left: -60px;
          background: linear-gradient(135deg, rgba(37,99,235,0.25), rgba(14,165,233,0.18));
        }

        .internships-orb-2 {
          width: 280px;
          height: 280px;
          right: -80px;
          bottom: 70px;
          background: linear-gradient(135deg, rgba(99,102,241,0.18), rgba(59,130,246,0.22));
          animation-delay: 1.2s;
          -webkit-animation-delay: 1.2s;
        }

        .internships-shell {
          position: relative;
          z-index: 2;
        }

        .internships-hero {
          border: 1px solid rgba(255,255,255,0.42);
          background:
            linear-gradient(135deg, #081226 0%, #0b1736 35%, #142850 70%, #1d4ed8 100%);
          color: #fff;
          position: relative;
          overflow: hidden;
          box-shadow:
            0 24px 70px rgba(15, 23, 42, 0.16),
            0 8px 24px rgba(59,130,246,0.08);
          -webkit-box-shadow:
            0 24px 70px rgba(15, 23, 42, 0.16),
            0 8px 24px rgba(59,130,246,0.08);
        }

        .internships-hero::before {
          content: "";
          position: absolute;
          inset: 0;
          background:
            radial-gradient(circle at 18% 22%, rgba(255,255,255,0.12), transparent 22%),
            radial-gradient(circle at 82% 74%, rgba(255,255,255,0.08), transparent 18%);
          pointer-events: none;
        }

        .internships-chip {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          border-radius: 999px;
          background: rgba(255,255,255,0.12);
          border: 1px solid rgba(255,255,255,0.18);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          font-size: 0.8rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 18px;
        }

        .internships-hero-title {
          font-size: 2.2rem;
          font-weight: 800;
          letter-spacing: -0.03em;
          margin-bottom: 10px;
        }

        .internships-hero-text {
          color: rgba(255,255,255,0.82);
          line-height: 1.8;
          margin-bottom: 0;
          max-width: 760px;
        }

        .internships-stat-card {
          background: rgba(255,255,255,0.12);
          border: 1px solid rgba(255,255,255,0.16);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border-radius: 22px;
          padding: 18px;
          height: 100%;
          -webkit-transition: all 0.3s ease;
          transition: all 0.3s ease;
        }

        .internships-stat-card:hover {
          transform: translateY(-4px);
          -webkit-transform: translateY(-4px);
        }

        .internships-stat-label {
          font-size: 0.82rem;
          color: rgba(255,255,255,0.75);
          margin-bottom: 6px;
        }

        .internships-stat-value {
          font-size: 1.6rem;
          font-weight: 800;
          color: #fff;
          margin-bottom: 0;
        }

        .internships-glass-card {
          border: 1px solid rgba(255,255,255,0.42);
          background: rgba(255,255,255,0.72);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          box-shadow:
            0 24px 70px rgba(15, 23, 42, 0.14),
            0 8px 24px rgba(59,130,246,0.08);
          -webkit-box-shadow:
            0 24px 70px rgba(15, 23, 42, 0.14),
            0 8px 24px rgba(59,130,246,0.08);
        }

        .internships-filter-title {
          font-size: 1.25rem;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 8px;
        }

        .internships-filter-subtitle {
          color: #64748b;
          margin-bottom: 0;
          line-height: 1.7;
        }

        .internships-filter-input,
        .internships-filter-select {
          min-height: 56px;
          border-radius: 16px;
          border: 1px solid #dbe3f0;
          background: #f8fafc;
          -webkit-transition: all 0.3s ease;
          transition: all 0.3s ease;
        }

        .internships-filter-input:focus,
        .internships-filter-select:focus {
          border-color: #60a5fa;
          background: #fff;
          box-shadow: 0 0 0 4px rgba(37,99,235,0.12);
          -webkit-box-shadow: 0 0 0 4px rgba(37,99,235,0.12);
        }

        .internships-clear-btn {
          border-radius: 16px;
          font-weight: 700;
          min-height: 48px;
          -webkit-transition: all 0.3s ease;
          transition: all 0.3s ease;
        }

        .internships-clear-btn:hover {
          transform: translateY(-2px);
          -webkit-transform: translateY(-2px);
        }

        .internship-card {
          border-radius: 28px;
          border: 1px solid rgba(255,255,255,0.45);
          background: rgba(255,255,255,0.78);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          box-shadow:
            0 22px 65px rgba(15, 23, 42, 0.10),
            0 8px 20px rgba(59,130,246,0.05);
          -webkit-box-shadow:
            0 22px 65px rgba(15, 23, 42, 0.10),
            0 8px 20px rgba(59,130,246,0.05);
          overflow: hidden;
          height: 100%;
          -webkit-transition: all 0.35s ease;
          transition: all 0.35s ease;
        }

        .internship-card:hover {
          transform: translateY(-6px);
          -webkit-transform: translateY(-6px);
          box-shadow:
            0 28px 75px rgba(15, 23, 42, 0.14),
            0 10px 24px rgba(59,130,246,0.07);
          -webkit-box-shadow:
            0 28px 75px rgba(15, 23, 42, 0.14),
            0 10px 24px rgba(59,130,246,0.07);
        }

        .internship-card-image-wrap {
          height: 220px;
          overflow: hidden;
          position: relative;
        }

        .internship-card-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          -webkit-transition: transform 0.6s ease;
          transition: transform 0.6s ease;
        }

        .internship-card:hover .internship-card-image {
          transform: scale(1.05);
          -webkit-transform: scale(1.05);
        }

        .internship-card-body {
          padding: 24px;
        }

        .internship-card-title {
          font-size: 1.15rem;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 0;
          line-height: 1.5;
        }

        .internship-branch-badge,
        .internship-category-badge,
        .internship-duration-badge {
          border-radius: 999px;
          padding: 8px 12px;
          font-weight: 700;
          font-size: 0.78rem;
        }

        .internship-description {
          color: #64748b;
          line-height: 1.8;
          margin-bottom: 16px;
        }

        .internship-card-btn {
          min-height: 52px;
          border-radius: 16px;
          font-weight: 800;
          border: none;
          color: #fff;
          background: linear-gradient(135deg, #0b1736 0%, #142850 40%, #1d4ed8 100%);
          box-shadow:
            0 18px 35px rgba(29, 78, 216, 0.18),
            0 8px 20px rgba(11, 23, 54, 0.14);
          -webkit-box-shadow:
            0 18px 35px rgba(29, 78, 216, 0.18),
            0 8px 20px rgba(11, 23, 54, 0.14);
          -webkit-transition: all 0.32s ease;
          transition: all 0.32s ease;
        }

        .internship-card-btn:hover {
          color: #fff;
          transform: translateY(-2px);
          -webkit-transform: translateY(-2px);
        }

        .internships-empty-card {
          border-radius: 24px;
          padding: 22px;
          background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
          border: 1px solid #93c5fd;
          color: #1e3a8a;
        }

        @keyframes internshipsFloat {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
          }
          50% {
            transform: translateY(-18px) translateX(10px);
          }
        }

        @-webkit-keyframes internshipsFloat {
          0%, 100% {
            -webkit-transform: translateY(0px) translateX(0px);
          }
          50% {
            -webkit-transform: translateY(-18px) translateX(10px);
          }
        }

        @media (max-width: 991px) {
          .internships-hero-title {
            font-size: 1.95rem;
          }
        }

        @media (max-width: 767px) {
          .internships-page {
            padding: 22px 0;
          }

          .internships-hero-title {
            font-size: 1.7rem;
          }

          .internship-card-body {
            padding: 20px;
          }
        }
      `}</style>

      <div className="internships-page py-4 py-lg-5">
        <div className="internships-orb internships-orb-1"></div>
        <div className="internships-orb internships-orb-2"></div>

        <div className="container internships-shell">
          {toast.show && (
            <div
              style={{
                position: "fixed",
                top: "96px",
                zIndex: 99999,
                right: "24px",
                zIndex: 9999,
                minWidth: "280px",
                maxWidth: "380px",
              }}
            >
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
                  className={`fw-bold mb-1 ${toast.type === "success" ? "text-success" : "text-danger"
                    }`}
                >
                  {toast.type === "success" ? "Success" : "Error"}
                </div>
                <div className="text-dark small">{toast.message}</div>
              </div>
            </div>
          )}

          {/* HERO */}
          <div className="card internships-hero border-0 rounded-5 mb-4">
            <div className="card-body p-4 p-md-5">
              <div className="row g-4 align-items-center">
                <div className="col-lg-8">
                  <div className="internships-chip">Internova Training Explorer</div>
                  <h1 className="internships-hero-title">
                    Explore Training Programs
                  </h1>
                  <p className="internships-hero-text">
                    Discover structured industry-focused training programs with guided learning, assessments, and certificate support.
                  </p>
                </div>

                <div className="col-lg-4">
                  <div className="row g-3">
                    <div className="col-6">
                      <div className="internships-stat-card">
                        <div className="internships-stat-label">Programs</div>
                        <h4 className="internships-stat-value">
                          {internships.length}
                        </h4>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="internships-stat-card">
                        <div className="internships-stat-label">Results</div>
                        <h4 className="internships-stat-value">
                          {filteredInternships.length}
                        </h4>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="internships-stat-card">
                        <div className="internships-stat-label">Filters</div>
                        <h4 className="internships-stat-value">
                          {branchFilter !== "All" ||
                            categoryFilter !== "All" ||
                            sortBy !== "default" ||
                            localSearch
                            ? "Active"
                            : "Default"}
                        </h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* FILTER CARD */}
          <div className="card internships-glass-card border-0 rounded-5 mb-4">
            <div className="card-body p-4 p-md-5">
              {(localSearch ||
                branchFilter !== "All" ||
                categoryFilter !== "All" ||
                sortBy !== "default") && (
                  <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
                    <div>
                      <h4 className="internships-filter-title mb-1">
                        Filtered Results
                      </h4>
                      <p className="internships-filter-subtitle">
                        {localSearch ? (
                          <>
                            Search: <strong>{localSearch}</strong>
                          </>
                        ) : (
                          "Using selected filters"
                        )}
                      </p>
                    </div>

                    <button
                      className="btn btn-outline-dark internships-clear-btn"
                      onClick={clearAllFilters}
                    >
                      Clear All
                    </button>
                  </div>
                )}

              <div className="row g-3">
                <div className="col-md-12">
                  <label className="form-label fw-bold">Search Programs</label>
                  <input
                    type="text"
                    className="form-control internships-filter-input"
                    placeholder="Search by title, branch, category, or description..."
                    value={localSearch}
                    onChange={(e) => setLocalSearch(e.target.value)}
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label fw-bold">Filter by Branch</label>
                  <select
                    className="form-select internships-filter-select"
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
                    className="form-select internships-filter-select"
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
                    className="form-select internships-filter-select"
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
            </div>
          </div>

          {/* LISTING */}
          <div className="row g-4">
            {filteredInternships.map((item) => (
              <div className="col-md-6 col-xl-4" key={item._id}>
                <div className="internship-card">
                  <div className="internship-card-image-wrap">
                    <img
                      src={item.thumbnail || "https://via.placeholder.com/400x250"}
                      className="internship-card-image"
                      alt={item.title}
                    />
                  </div>

                  <div className="internship-card-body">
                    <div className="d-flex justify-content-between align-items-start mb-3 gap-2 flex-wrap">
                      <h5 className="internship-card-title">{item.title}</h5>
                      <span className="badge bg-secondary internship-branch-badge">
                        {item.branch}
                      </span>
                    </div>

                    <p className="mb-3">
                      <span className="badge bg-dark internship-category-badge">
                        {item.category}
                      </span>
                    </p>

                    <p className="internship-description">
                      {item.description?.length > 110
                        ? `${item.description.slice(0, 110)}...`
                        : item.description}
                    </p>

                    <div className="d-flex flex-wrap gap-2 mb-4">
                      {item.durations?.map((duration, index) => (
                        <span
                          key={index}
                          className="badge bg-light text-dark border internship-duration-badge"
                        >
                          {duration.label} • INR {duration.price}
                        </span>
                      ))}
                    </div>

                    <Link
                      to={`/internships/${item._id}`}
                      className="btn internship-card-btn w-100"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredInternships.length === 0 && (
            <div className="internships-empty-card mt-4">
              <h5 className="fw-bold mb-2">No Internships Found</h5>
              <p className="mb-0">
                No internships matched your current search or filters. Try
                changing the query or clearing all filters.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Internships;