import React, { useEffect, useMemo, useState } from "react";
import API from "../services/api";
import { Link } from "react-router-dom";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalPrograms: 0,
    activePrograms: 0,
    inactivePrograms: 0,
    totalModules: 0,
    totalVideos: 0,
    totalQuizQuestions: 0,
    totalUsers: 0,
    totalAdmins: 0,
    totalNormalUsers: 0,
    activeUsers: 0,
    recentlyLoggedInUsers: 0,
    totalPurchases: 0,
    paidPurchases: 0,
    failedPurchases: 0,
    totalCertificatesIssued: 0,
    totalQuizPassed: 0,
  });

  const [recentInternships, setRecentInternships] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentPurchases, setRecentPurchases] = useState([]);
  const [loading, setLoading] = useState(true);

  const [userSearch, setUserSearch] = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState("All");
  const [userDateFrom, setUserDateFrom] = useState("");
  const [userDateTo, setUserDateTo] = useState("");
  const [usersPage, setUsersPage] = useState(1);
  const [usersLimit] = useState(10);
  const [usersTotalPages, setUsersTotalPages] = useState(1);
  const [usersTotal, setUsersTotal] = useState(0);

  const [purchaseSearch, setPurchaseSearch] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("All");
  const [certificateFilter, setCertificateFilter] = useState("All");
  const [purchaseDateFrom, setPurchaseDateFrom] = useState("");
  const [purchaseDateTo, setPurchaseDateTo] = useState("");
  const [purchasesPage, setPurchasesPage] = useState(1);
  const [purchasesLimit] = useState(10);
  const [purchasesTotalPages, setPurchasesTotalPages] = useState(1);
  const [purchasesTotal, setPurchasesTotal] = useState(0);

  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedPurchase, setSelectedPurchase] = useState(null);

  const [toast, setToast] = useState({
    show: false,
    type: "success",
    message: "",
  });

  const PIE_COLORS = ["#2563eb", "#16a34a", "#f59e0b", "#ef4444", "#7c3aed"];

  const showToast = (type, message) => {
    setToast({ show: true, type, message });
    setTimeout(() => {
      setToast({ show: false, type: "success", message: "" });
    }, 3000);
  };

  const fetchOverview = async () => {
    const { data } = await API.get("/admin/overview");
    setStats(data.stats || {});
    setRecentInternships(data.recentInternships || []);
  };

  const fetchUsers = async () => {
    const { data } = await API.get("/admin/users", {
      params: {
        page: usersPage,
        limit: usersLimit,
        search: userSearch,
        role: userRoleFilter,
        from: userDateFrom,
        to: userDateTo,
      },
    });

    setRecentUsers(data.items || []);
    setUsersTotalPages(data.totalPages || 1);
    setUsersTotal(data.total || 0);
  };

  const fetchPurchases = async () => {
    const { data } = await API.get("/admin/purchases", {
      params: {
        page: purchasesPage,
        limit: purchasesLimit,
        search: purchaseSearch,
        paymentStatus: paymentFilter,
        certificateStatus: certificateFilter,
        from: purchaseDateFrom,
        to: purchaseDateTo,
      },
    });

    setRecentPurchases(data.items || []);
    setPurchasesTotalPages(data.totalPages || 1);
    setPurchasesTotal(data.total || 0);
  };

  const fetchAll = async () => {
    try {
      setLoading(true);
      await Promise.all([fetchOverview(), fetchUsers(), fetchPurchases()]);
    } catch (error) {
      console.error("Failed to fetch admin dashboard data:", error);
      showToast("error", "Failed to fetch admin dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  useEffect(() => {
    fetchUsers().catch((error) => {
      console.error("Users fetch failed:", error);
      showToast("error", "Failed to fetch users");
    });
  }, [usersPage, userRoleFilter, userDateFrom, userDateTo]);

  useEffect(() => {
    fetchPurchases().catch((error) => {
      console.error("Purchases fetch failed:", error);
      showToast("error", "Failed to fetch purchases");
    });
  }, [
    purchasesPage,
    paymentFilter,
    certificateFilter,
    purchaseDateFrom,
    purchaseDateTo,
  ]);

  const chartPrograms = useMemo(
    () => [
      { name: "Active", value: stats.activePrograms || 0 },
      { name: "Inactive", value: stats.inactivePrograms || 0 },
    ],
    [stats.activePrograms, stats.inactivePrograms]
  );

  const chartUsers = useMemo(
    () => [
      { name: "Admins", value: stats.totalAdmins || 0 },
      { name: "Users", value: stats.totalNormalUsers || 0 },
      { name: "Recent Logins", value: stats.recentlyLoggedInUsers || 0 },
    ],
    [stats.totalAdmins, stats.totalNormalUsers, stats.recentlyLoggedInUsers]
  );

  const chartPurchases = useMemo(
    () => [
      { name: "Paid", value: stats.paidPurchases || 0 },
      { name: "Failed", value: stats.failedPurchases || 0 },
      {
        name: "Created",
        value: Math.max(
          0,
          (stats.totalPurchases || 0) -
            (stats.paidPurchases || 0) -
            (stats.failedPurchases || 0)
        ),
      },
    ],
    [stats.totalPurchases, stats.paidPurchases, stats.failedPurchases]
  );

  const chartLearning = useMemo(
    () => [
      { name: "Quiz Passed", value: stats.totalQuizPassed || 0 },
      { name: "Certificates", value: stats.totalCertificatesIssued || 0 },
      { name: "Modules", value: stats.totalModules || 0 },
      { name: "Videos", value: stats.totalVideos || 0 },
    ],
    [
      stats.totalQuizPassed,
      stats.totalCertificatesIssued,
      stats.totalModules,
      stats.totalVideos,
    ]
  );

  const formatDate = (value) => {
    if (!value) return "N/A";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "N/A";
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatDateTime = (value) => {
    if (!value) return "Never";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "Never";
    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const csvEscape = (value) => {
    const text = value === null || value === undefined ? "" : String(value);
    return `"${text.replace(/"/g, '""')}"`;
  };

  const downloadCsv = (rows, fileName) => {
    if (!rows.length) {
      showToast("error", "No data available to export");
      return;
    }

    const csvContent = rows.map((row) => row.map(csvEscape).join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(blobUrl);
    showToast("success", `${fileName} exported successfully`);
  };

  const exportUsersCsv = () => {
    const rows = [
      [
        "Name",
        "Email",
        "Role",
        "Status",
        "Joined Date",
        "Last Login",
        "Purchases Count",
        "Certificates Count",
      ],
      ...recentUsers.map((user) => [
        user.name || "",
        user.email || "",
        user.role || "",
        user.isActive ? "Active" : "Inactive",
        formatDate(user.createdAt),
        formatDateTime(user.lastLoginAt),
        user.purchasesCount || 0,
        user.certificatesCount || 0,
      ]),
    ];

    downloadCsv(rows, "internova_users_export.csv");
  };

  const exportPurchasesCsv = () => {
    const rows = [
      [
        "User Name",
        "User Email",
        "Internship Title",
        "Branch",
        "Category",
        "Duration",
        "Amount",
        "Payment Status",
        "Purchase Date",
        "Progress %",
        "Quiz Passed",
        "Quiz Percentage",
        "Certificate Eligible",
        "Certificate Issued",
        "Certificate ID",
      ],
      ...recentPurchases.map((item) => [
        item.user?.name || "",
        item.user?.email || "",
        item.internship?.title || "",
        item.internship?.branch || "",
        item.internship?.category || "",
        item.durationLabel || "",
        item.amount || 0,
        item.paymentStatus || "",
        formatDate(item.createdAt),
        item.progress?.overallProgress || 0,
        item.quiz?.passed ? "Yes" : "No",
        item.quiz?.percentage || 0,
        item.progress?.certificateEligible ? "Yes" : "No",
        item.certificate?.certificateId ? "Yes" : "No",
        item.certificate?.certificateId || "",
      ]),
    ];

    downloadCsv(rows, "internova_purchases_export.csv");
  };

  const handleUserSearch = async () => {
    try {
      setUsersPage(1);
      const { data } = await API.get("/admin/users", {
        params: {
          page: 1,
          limit: usersLimit,
          search: userSearch,
          role: userRoleFilter,
          from: userDateFrom,
          to: userDateTo,
        },
      });

      setRecentUsers(data.items || []);
      setUsersTotalPages(data.totalPages || 1);
      setUsersTotal(data.total || 0);
    } catch (error) {
      console.error("User search failed:", error);
      showToast("error", "Failed to search users");
    }
  };

  const handlePurchaseSearch = async () => {
    try {
      setPurchasesPage(1);
      const { data } = await API.get("/admin/purchases", {
        params: {
          page: 1,
          limit: purchasesLimit,
          search: purchaseSearch,
          paymentStatus: paymentFilter,
          certificateStatus: certificateFilter,
          from: purchaseDateFrom,
          to: purchaseDateTo,
        },
      });

      setRecentPurchases(data.items || []);
      setPurchasesTotalPages(data.totalPages || 1);
      setPurchasesTotal(data.total || 0);
    } catch (error) {
      console.error("Purchase search failed:", error);
      showToast("error", "Failed to search purchases");
    }
  };

  const getProgramStatusBadge = (isActive) =>
    isActive ? (
      <span className="badge bg-success-subtle text-success border rounded-pill px-3 py-2">
        Active
      </span>
    ) : (
      <span className="badge bg-secondary-subtle text-dark border rounded-pill px-3 py-2">
        Inactive
      </span>
    );

  const getUserRoleBadge = (role) =>
    role === "admin" ? (
      <span className="badge bg-warning-subtle text-warning-emphasis border rounded-pill px-3 py-2">
        Admin
      </span>
    ) : (
      <span className="badge bg-primary-subtle text-primary border rounded-pill px-3 py-2">
        User
      </span>
    );

  const getUserActiveBadge = (isActive) =>
    isActive ? (
      <span className="badge bg-success-subtle text-success border rounded-pill px-3 py-2">
        Active
      </span>
    ) : (
      <span className="badge bg-danger-subtle text-danger border rounded-pill px-3 py-2">
        Inactive
      </span>
    );

  const getPaymentBadge = (paymentStatus) => {
    if (paymentStatus === "paid") {
      return (
        <span className="badge bg-success-subtle text-success border rounded-pill px-3 py-2">
          Paid
        </span>
      );
    }
    if (paymentStatus === "failed") {
      return (
        <span className="badge bg-danger-subtle text-danger border rounded-pill px-3 py-2">
          Failed
        </span>
      );
    }
    return (
      <span className="badge bg-secondary-subtle text-dark border rounded-pill px-3 py-2">
        Created
      </span>
    );
  };

  const getYesNoBadge = (value, yesLabel = "Yes", noLabel = "No") =>
    value ? (
      <span className="badge bg-success-subtle text-success border rounded-pill px-3 py-2">
        {yesLabel}
      </span>
    ) : (
      <span className="badge bg-secondary-subtle text-dark border rounded-pill px-3 py-2">
        {noLabel}
      </span>
    );

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
          <div className="fw-semibold text-dark">Loading admin dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        .admin-dashboard-page {
          min-height: 100vh;
          background:
            radial-gradient(circle at top left, rgba(59,130,246,0.18), transparent 28%),
            radial-gradient(circle at bottom right, rgba(99,102,241,0.16), transparent 32%),
            linear-gradient(135deg, #f8fafc 0%, #eef2ff 48%, #f8fafc 100%);
          position: relative;
          overflow: hidden;
        }
        .admin-dashboard-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(10px);
          opacity: 0.55;
          animation: adminDashboardFloat 9s ease-in-out infinite;
          pointer-events: none;
        }
        .admin-dashboard-orb-1 {
          width: 220px;
          height: 220px;
          top: 70px;
          left: -60px;
          background: linear-gradient(135deg, rgba(37,99,235,0.25), rgba(14,165,233,0.18));
        }
        .admin-dashboard-orb-2 {
          width: 280px;
          height: 280px;
          right: -80px;
          bottom: 70px;
          background: linear-gradient(135deg, rgba(99,102,241,0.18), rgba(59,130,246,0.22));
          animation-delay: 1.2s;
        }
        .admin-dashboard-shell {
          position: relative;
          z-index: 2;
        }
        .admin-dashboard-hero {
          border: 1px solid rgba(255,255,255,0.42);
          background:
            linear-gradient(135deg, #081226 0%, #0b1736 35%, #142850 70%, #1d4ed8 100%);
          color: #fff;
          position: relative;
          overflow: hidden;
          box-shadow:
            0 24px 70px rgba(15, 23, 42, 0.16),
            0 8px 24px rgba(59,130,246,0.08);
        }
        .admin-dashboard-hero::before {
          content: "";
          position: absolute;
          inset: 0;
          background:
            radial-gradient(circle at 18% 22%, rgba(255,255,255,0.12), transparent 22%),
            radial-gradient(circle at 82% 74%, rgba(255,255,255,0.08), transparent 18%);
          pointer-events: none;
        }
        .admin-dashboard-chip {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          border-radius: 999px;
          background: rgba(255,255,255,0.12);
          border: 1px solid rgba(255,255,255,0.18);
          backdrop-filter: blur(10px);
          font-size: 0.8rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 18px;
        }
        .admin-dashboard-title {
          font-size: 2.2rem;
          font-weight: 800;
          letter-spacing: -0.03em;
          margin-bottom: 10px;
        }
        .admin-dashboard-text {
          color: rgba(255,255,255,0.82);
          line-height: 1.8;
          margin-bottom: 0;
          max-width: 760px;
        }
        .admin-stat-card,
        .admin-chart-card {
          border-radius: 28px;
          border: 1px solid rgba(255,255,255,0.45);
          background: rgba(255,255,255,0.78);
          backdrop-filter: blur(14px);
          box-shadow:
            0 22px 65px rgba(15, 23, 42, 0.10),
            0 8px 20px rgba(59,130,246,0.05);
          padding: 24px;
          height: 100%;
          transition: all 0.35s ease;
        }
        .admin-stat-card:hover,
        .admin-chart-card:hover {
          transform: translateY(-4px);
        }
        .admin-stat-label {
          font-size: 0.9rem;
          color: #64748b;
          margin-bottom: 8px;
          font-weight: 600;
        }
        .admin-stat-value {
          font-size: 2rem;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 0;
        }
        .admin-chart-title {
          font-size: 1.1rem;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 12px;
        }
        .admin-section-card {
          border: 1px solid rgba(255,255,255,0.42);
          background: rgba(255,255,255,0.72);
          backdrop-filter: blur(16px);
          box-shadow:
            0 24px 70px rgba(15, 23, 42, 0.14),
            0 8px 24px rgba(59,130,246,0.08);
          border-radius: 28px;
        }
        .admin-section-title {
          font-size: 1.35rem;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 10px;
        }
        .admin-section-subtitle {
          color: #64748b;
          line-height: 1.8;
          margin-bottom: 22px;
        }
        .admin-recent-card {
          border-radius: 22px;
          border: 1px solid #e2e8f0;
          background: #ffffff;
          padding: 18px;
          height: 100%;
        }
        .admin-recent-title {
          font-size: 1.08rem;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 8px;
        }
        .admin-mini-text {
          color: #64748b;
          line-height: 1.7;
          font-size: 0.95rem;
        }
        .admin-action-btn {
          min-height: 48px;
          border-radius: 16px;
          font-weight: 800;
        }
        .admin-table-wrap {
          overflow-x: auto;
          border-radius: 20px;
          border: 1px solid #e2e8f0;
          background: rgba(255,255,255,0.92);
        }
        .admin-table {
          width: 100%;
          min-width: 980px;
          border-collapse: separate;
          border-spacing: 0;
        }
        .admin-table thead th {
          background: #eff6ff;
          color: #1e3a8a;
          font-size: 0.86rem;
          font-weight: 800;
          padding: 16px 14px;
          border-bottom: 1px solid #dbeafe;
          white-space: nowrap;
        }
        .admin-table tbody td {
          padding: 16px 14px;
          border-bottom: 1px solid #eef2f7;
          vertical-align: top;
          color: #0f172a;
          font-size: 0.95rem;
        }
        .admin-table tbody tr:hover {
          background: rgba(239,246,255,0.55);
        }
        .admin-user-name {
          font-weight: 800;
          color: #0f172a;
        }
        .admin-user-email {
          color: #64748b;
          font-size: 0.9rem;
          margin-top: 2px;
        }
        .admin-progress-pill {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 70px;
          padding: 8px 12px;
          border-radius: 999px;
          background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
          color: #1d4ed8;
          font-weight: 800;
          border: 1px solid #93c5fd;
        }
        .admin-filter-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1fr;
          gap: 14px;
          margin-bottom: 22px;
        }
        .admin-input,
        .admin-select {
          min-height: 52px;
          border-radius: 16px;
          border: 1px solid #dbe3f0;
          background: #f8fafc;
        }
        .admin-view-btn {
          min-height: 40px;
          border-radius: 12px;
          font-weight: 700;
        }
        .admin-modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.55);
          backdrop-filter: blur(6px);
          z-index: 99998;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 18px;
        }
        .admin-modal-card {
          width: min(860px, 100%);
          max-height: 90vh;
          overflow-y: auto;
          background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
          border: 1px solid #dbeafe;
          border-radius: 28px;
          box-shadow: 0 30px 80px rgba(15, 23, 42, 0.28);
          padding: 24px;
        }
        .admin-info-box {
          border: 1px solid #e2e8f0;
          border-radius: 18px;
          background: #fff;
          padding: 18px;
          height: 100%;
        }
        .admin-pagination {
          display: flex;
          gap: 10px;
          align-items: center;
          justify-content: flex-end;
          flex-wrap: wrap;
          margin-top: 18px;
        }
        @keyframes adminDashboardFloat {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-18px) translateX(10px); }
        }
        @media (max-width: 991px) {
          .admin-dashboard-title { font-size: 1.95rem; }
          .admin-filter-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 767px) {
          .admin-dashboard-page { padding: 22px 0; }
          .admin-dashboard-title { font-size: 1.7rem; }
        }
      `}</style>

      <div className="admin-dashboard-page py-4 py-lg-5">
        <div className="admin-dashboard-orb admin-dashboard-orb-1"></div>
        <div className="admin-dashboard-orb admin-dashboard-orb-2"></div>

        <div className="container admin-dashboard-shell">
          {toast.show && (
            <div
              style={{
                position: "fixed",
                top: "96px",
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

          <div className="card admin-dashboard-hero border-0 rounded-5 mb-4">
            <div className="card-body p-4 p-md-5">
              <div className="row g-4 align-items-center">
                <div className="col-lg-8">
                  <div className="admin-dashboard-chip">Internova Admin Overview</div>
                  <h1 className="admin-dashboard-title">Admin Intelligence Dashboard</h1>
                  <p className="admin-dashboard-text">
                    Monitor programs, users, enrollments, quiz completions,
                    certificates, and recent purchase activity from one premium
                    admin command center.
                  </p>
                </div>

                <div className="col-lg-4">
                  <div className="d-grid gap-3">
                    <Link to="/admin/internships" className="btn btn-light admin-action-btn">
                      Manage Internships
                    </Link>
                    <Link to="/dashboard" className="btn btn-outline-light admin-action-btn">
                      Back to User Dashboard
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row g-4 mb-4">
            {[
              ["Total Programs", stats.totalPrograms],
              ["Active Programs", stats.activePrograms],
              ["Inactive Programs", stats.inactivePrograms],
              ["Total Users", stats.totalUsers],
              ["Admins", stats.totalAdmins],
              ["Normal Users", stats.totalNormalUsers],
              ["Active Users", stats.activeUsers],
              ["Recent Logins", stats.recentlyLoggedInUsers],
              ["Total Purchases", stats.totalPurchases],
              ["Paid Purchases", stats.paidPurchases],
              ["Certificates Issued", stats.totalCertificatesIssued],
              ["Quiz Passed", stats.totalQuizPassed],
            ].map(([label, value], idx) => (
              <div className="col-md-6 col-xl-3" key={idx}>
                <div className="admin-stat-card">
                  <div className="admin-stat-label">{label}</div>
                  <h3 className="admin-stat-value">{value || 0}</h3>
                </div>
              </div>
            ))}
          </div>

          <div className="row g-4 mb-4">
            <div className="col-lg-6">
              <div className="admin-chart-card">
                <h4 className="admin-chart-title">Programs Status</h4>
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie data={chartPrograms} dataKey="value" nameKey="name" outerRadius={95} label>
                      {chartPrograms.map((_, index) => (
                        <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="admin-chart-card">
                <h4 className="admin-chart-title">Users Distribution</h4>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={chartUsers}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#2563eb" name="Count" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="admin-chart-card">
                <h4 className="admin-chart-title">Purchase Status</h4>
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie data={chartPurchases} dataKey="value" nameKey="name" outerRadius={95} label>
                      {chartPurchases.map((_, index) => (
                        <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="admin-chart-card">
                <h4 className="admin-chart-title">Learning Outcomes</h4>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={chartLearning}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#16a34a" name="Count" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="admin-section-card p-4 p-md-5 mb-4">
            <h3 className="admin-section-title">Recent Internships</h3>
            <p className="admin-section-subtitle">
              Quickly review your latest created or updated internship programs.
            </p>

            <div className="row g-4">
              {recentInternships.map((item) => (
                <div className="col-md-6 col-xl-4" key={item._id}>
                  <div className="admin-recent-card">
                    <div className="d-flex justify-content-between align-items-start gap-3 flex-wrap mb-2">
                      <h5 className="admin-recent-title mb-0">{item.title}</h5>
                      <div>{getProgramStatusBadge(item.isActive)}</div>
                    </div>

                    <p className="admin-mini-text mb-1"><strong>Branch:</strong> {item.branch || "N/A"}</p>
                    <p className="admin-mini-text mb-1"><strong>Category:</strong> {item.category || "N/A"}</p>
                    <p className="admin-mini-text mb-1"><strong>Modules:</strong> {item.modulesCount || 0}</p>
                    <p className="admin-mini-text mb-1"><strong>Videos:</strong> {item.videosCount || 0}</p>
                    <p className="admin-mini-text mb-3"><strong>Quiz:</strong> {item.quizCount || 0}</p>

                    <Link to="/admin/internships" className="btn btn-outline-dark admin-action-btn w-100">
                      Open Manager
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="admin-section-card p-4 p-md-5 mb-4">
            <div className="d-flex justify-content-between align-items-start gap-3 flex-wrap">
              <div>
                <h3 className="admin-section-title">Users Management</h3>
                <p className="admin-section-subtitle">
                  Server-side filtered and paginated users list.
                </p>
              </div>
              <button
                className="btn btn-outline-primary admin-action-btn"
                type="button"
                onClick={exportUsersCsv}
              >
                Export Current Page CSV
              </button>
            </div>

            <div className="admin-filter-grid">
              <input
                type="text"
                className="form-control admin-input"
                placeholder="Search by user name or email..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
              />
              <select
                className="form-select admin-select"
                value={userRoleFilter}
                onChange={(e) => {
                  setUsersPage(1);
                  setUserRoleFilter(e.target.value);
                }}
              >
                <option value="All">All Roles</option>
                <option value="Admin">Admin</option>
                <option value="User">User</option>
              </select>
              <input
                type="date"
                className="form-control admin-input"
                value={userDateFrom}
                onChange={(e) => {
                  setUsersPage(1);
                  setUserDateFrom(e.target.value);
                }}
              />
              <input
                type="date"
                className="form-control admin-input"
                value={userDateTo}
                onChange={(e) => {
                  setUsersPage(1);
                  setUserDateTo(e.target.value);
                }}
              />
              <button
                className="btn btn-outline-primary admin-action-btn"
                type="button"
                onClick={handleUserSearch}
              >
                Search
              </button>
              <button
                className="btn btn-outline-dark admin-action-btn"
                type="button"
                onClick={() => {
                  setUserSearch("");
                  setUserRoleFilter("All");
                  setUserDateFrom("");
                  setUserDateTo("");
                  setUsersPage(1);
                  fetchUsers();
                }}
              >
                Reset
              </button>
            </div>

            <div className="mb-2 text-secondary small">
              Total Users Found: {usersTotal}
            </div>

            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Joined</th>
                    <th>Last Login</th>
                    <th>Purchases</th>
                    <th>Certificates</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {recentUsers.length > 0 ? (
                    recentUsers.map((user) => (
                      <tr key={user._id}>
                        <td>
                          <div className="admin-user-name">{user.name || "Unknown User"}</div>
                          <div className="admin-user-email">{user.email || "N/A"}</div>
                        </td>
                        <td>{getUserRoleBadge(user.role)}</td>
                        <td>{getUserActiveBadge(user.isActive)}</td>
                        <td>{formatDate(user.createdAt)}</td>
                        <td>{formatDateTime(user.lastLoginAt)}</td>
                        <td>{user.purchasesCount || 0}</td>
                        <td>{user.certificatesCount || 0}</td>
                        <td>
                          <button
                            className="btn btn-outline-primary admin-view-btn"
                            type="button"
                            onClick={() => setSelectedUser(user)}
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="text-center py-4 text-secondary">
                        No user data available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="admin-pagination">
              <button
                className="btn btn-outline-dark"
                disabled={usersPage <= 1}
                onClick={() => setUsersPage((prev) => prev - 1)}
              >
                Prev
              </button>
              <span className="fw-semibold">
                Page {usersPage} / {usersTotalPages}
              </span>
              <button
                className="btn btn-outline-dark"
                disabled={usersPage >= usersTotalPages}
                onClick={() => setUsersPage((prev) => prev + 1)}
              >
                Next
              </button>
            </div>
          </div>

          <div className="admin-section-card p-4 p-md-5">
            <div className="d-flex justify-content-between align-items-start gap-3 flex-wrap">
              <div>
                <h3 className="admin-section-title">Purchases Management</h3>
                <p className="admin-section-subtitle">
                  Server-side filtered and paginated purchases list.
                </p>
              </div>
              <button
                className="btn btn-outline-primary admin-action-btn"
                type="button"
                onClick={exportPurchasesCsv}
              >
                Export Current Page CSV
              </button>
            </div>

            <div className="admin-filter-grid">
              <input
                type="text"
                className="form-control admin-input"
                placeholder="Search by user, email, internship, branch, category..."
                value={purchaseSearch}
                onChange={(e) => setPurchaseSearch(e.target.value)}
              />
              <select
                className="form-select admin-select"
                value={paymentFilter}
                onChange={(e) => {
                  setPurchasesPage(1);
                  setPaymentFilter(e.target.value);
                }}
              >
                <option value="All">All Payments</option>
                <option value="Paid">Paid</option>
                <option value="Failed">Failed</option>
                <option value="Created">Created</option>
              </select>
              <select
                className="form-select admin-select"
                value={certificateFilter}
                onChange={(e) => {
                  setPurchasesPage(1);
                  setCertificateFilter(e.target.value);
                }}
              >
                <option value="All">All Certificates</option>
                <option value="Issued">Issued</option>
                <option value="Not Issued">Not Issued</option>
              </select>
              <input
                type="date"
                className="form-control admin-input"
                value={purchaseDateFrom}
                onChange={(e) => {
                  setPurchasesPage(1);
                  setPurchaseDateFrom(e.target.value);
                }}
              />
              <input
                type="date"
                className="form-control admin-input"
                value={purchaseDateTo}
                onChange={(e) => {
                  setPurchasesPage(1);
                  setPurchaseDateTo(e.target.value);
                }}
              />
              <button
                className="btn btn-outline-primary admin-action-btn"
                type="button"
                onClick={handlePurchaseSearch}
              >
                Search
              </button>
            </div>

            <div className="mb-3">
              <button
                className="btn btn-outline-dark admin-action-btn"
                type="button"
                onClick={() => {
                  setPurchaseSearch("");
                  setPaymentFilter("All");
                  setCertificateFilter("All");
                  setPurchaseDateFrom("");
                  setPurchaseDateTo("");
                  setPurchasesPage(1);
                  fetchPurchases();
                }}
              >
                Reset Purchase Filters
              </button>
            </div>

            <div className="mb-2 text-secondary small">
              Total Purchases Found: {purchasesTotal}
            </div>

            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Internship</th>
                    <th>Duration</th>
                    <th>Amount</th>
                    <th>Payment</th>
                    <th>Purchased On</th>
                    <th>Progress</th>
                    <th>Quiz</th>
                    <th>Eligible</th>
                    <th>Certificate</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {recentPurchases.length > 0 ? (
                    recentPurchases.map((item) => (
                      <tr key={item._id}>
                        <td>
                          <div className="admin-user-name">
                            {item.user?.name || "Unknown User"}
                          </div>
                          <div className="admin-user-email">
                            {item.user?.email || "N/A"}
                          </div>
                        </td>

                        <td>
                          <div className="admin-user-name">
                            {item.internship?.title || "Unknown Internship"}
                          </div>
                          <div className="admin-user-email">
                            {item.internship?.branch || "N/A"} • {item.internship?.category || "N/A"}
                          </div>
                        </td>

                        <td>{item.durationLabel || "N/A"}</td>
                        <td>₹{item.amount || 0}</td>
                        <td>{getPaymentBadge(item.paymentStatus)}</td>
                        <td>{formatDate(item.createdAt)}</td>
                        <td>
                          <div className="admin-progress-pill">
                            {item.progress?.overallProgress || 0}%
                          </div>
                        </td>
                        <td>
                          {getYesNoBadge(
                            item.quiz?.passed,
                            item.quiz?.percentage ? `Passed (${item.quiz.percentage}%)` : "Passed",
                            "Pending"
                          )}
                        </td>
                        <td>
                          {getYesNoBadge(item.progress?.certificateEligible, "Eligible", "Locked")}
                        </td>
                        <td>
                          {item.certificate?.certificateId ? (
                            <div>
                              <div className="admin-user-name">{item.certificate.certificateId}</div>
                              <div className="admin-user-email">{formatDate(item.certificate.issuedAt)}</div>
                            </div>
                          ) : (
                            <span className="badge bg-secondary-subtle text-dark border rounded-pill px-3 py-2">
                              Not Issued
                            </span>
                          )}
                        </td>
                        <td>
                          <button
                            className="btn btn-outline-primary admin-view-btn"
                            type="button"
                            onClick={() => setSelectedPurchase(item)}
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="11" className="text-center py-4 text-secondary">
                        No purchase data available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="admin-pagination">
              <button
                className="btn btn-outline-dark"
                disabled={purchasesPage <= 1}
                onClick={() => setPurchasesPage((prev) => prev - 1)}
              >
                Prev
              </button>
              <span className="fw-semibold">
                Page {purchasesPage} / {purchasesTotalPages}
              </span>
              <button
                className="btn btn-outline-dark"
                disabled={purchasesPage >= purchasesTotalPages}
                onClick={() => setPurchasesPage((prev) => prev + 1)}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {selectedUser && (
        <div className="admin-modal-backdrop" onClick={() => setSelectedUser(null)}>
          <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="d-flex justify-content-between align-items-start gap-3 flex-wrap mb-4">
              <div>
                <h3 className="fw-bold mb-2">{selectedUser.name || "Unknown User"}</h3>
                <div className="d-flex gap-2 flex-wrap">
                  {getUserRoleBadge(selectedUser.role)}
                  {getUserActiveBadge(selectedUser.isActive)}
                </div>
              </div>

              <button
                className="btn btn-outline-dark admin-action-btn"
                onClick={() => setSelectedUser(null)}
              >
                Close
              </button>
            </div>

            <div className="row g-4">
              <div className="col-md-6">
                <div className="admin-info-box">
                  <h5 className="fw-bold mb-3">Profile Details</h5>
                  <p className="mb-2"><strong>Email:</strong> {selectedUser.email || "N/A"}</p>
                  <p className="mb-2"><strong>Joined:</strong> {formatDate(selectedUser.createdAt)}</p>
                  <p className="mb-0"><strong>Last Login:</strong> {formatDateTime(selectedUser.lastLoginAt)}</p>
                </div>
              </div>

              <div className="col-md-6">
                <div className="admin-info-box">
                  <h5 className="fw-bold mb-3">Performance Summary</h5>
                  <p className="mb-2"><strong>Total Purchases:</strong> {selectedUser.purchasesCount || 0}</p>
                  <p className="mb-0"><strong>Total Certificates:</strong> {selectedUser.certificatesCount || 0}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedPurchase && (
        <div className="admin-modal-backdrop" onClick={() => setSelectedPurchase(null)}>
          <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="d-flex justify-content-between align-items-start gap-3 flex-wrap mb-4">
              <div>
                <h3 className="fw-bold mb-2">
                  {selectedPurchase.internship?.title || "Purchase Details"}
                </h3>
                <div className="d-flex gap-2 flex-wrap">
                  {getPaymentBadge(selectedPurchase.paymentStatus)}
                  {getYesNoBadge(
                    selectedPurchase.progress?.certificateEligible,
                    "Eligible",
                    "Locked"
                  )}
                </div>
              </div>

              <button
                className="btn btn-outline-dark admin-action-btn"
                onClick={() => setSelectedPurchase(null)}
              >
                Close
              </button>
            </div>

            <div className="row g-4 mb-4">
              <div className="col-md-6">
                <div className="admin-info-box">
                  <h5 className="fw-bold mb-3">User Info</h5>
                  <p className="mb-2"><strong>Name:</strong> {selectedPurchase.user?.name || "Unknown User"}</p>
                  <p className="mb-2"><strong>Email:</strong> {selectedPurchase.user?.email || "N/A"}</p>
                  <p className="mb-0"><strong>Last Login:</strong> {formatDateTime(selectedPurchase.user?.lastLoginAt)}</p>
                </div>
              </div>

              <div className="col-md-6">
                <div className="admin-info-box">
                  <h5 className="fw-bold mb-3">Internship Info</h5>
                  <p className="mb-2"><strong>Branch:</strong> {selectedPurchase.internship?.branch || "N/A"}</p>
                  <p className="mb-2"><strong>Category:</strong> {selectedPurchase.internship?.category || "N/A"}</p>
                  <p className="mb-0"><strong>Duration:</strong> {selectedPurchase.durationLabel || "N/A"}</p>
                </div>
              </div>
            </div>

            <div className="row g-4">
              <div className="col-md-4">
                <div className="admin-info-box">
                  <h5 className="fw-bold mb-3">Payment</h5>
                  <p className="mb-2"><strong>Amount:</strong> ₹{selectedPurchase.amount || 0}</p>
                  <p className="mb-2"><strong>Status:</strong> {selectedPurchase.paymentStatus || "N/A"}</p>
                  <p className="mb-0"><strong>Date:</strong> {formatDate(selectedPurchase.createdAt)}</p>
                </div>
              </div>

              <div className="col-md-4">
                <div className="admin-info-box">
                  <h5 className="fw-bold mb-3">Learning</h5>
                  <p className="mb-2"><strong>Progress:</strong> {selectedPurchase.progress?.overallProgress || 0}%</p>
                  <p className="mb-2"><strong>Quiz:</strong> {selectedPurchase.quiz?.passed ? "Passed" : "Pending"}</p>
                  <p className="mb-0"><strong>Duration Rule:</strong> {selectedPurchase.progress?.durationCompleted ? "Completed" : "Pending"}</p>
                </div>
              </div>

              <div className="col-md-4">
                <div className="admin-info-box">
                  <h5 className="fw-bold mb-3">Certificate</h5>
                  <p className="mb-2"><strong>Eligible:</strong> {selectedPurchase.progress?.certificateEligible ? "Yes" : "No"}</p>
                  <p className="mb-2"><strong>Issued:</strong> {selectedPurchase.certificate?.certificateId ? "Yes" : "No"}</p>
                  <p className="mb-0"><strong>ID:</strong> {selectedPurchase.certificate?.certificateId || "N/A"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AdminDashboard;