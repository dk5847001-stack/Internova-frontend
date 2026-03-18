import React, { useEffect, useMemo, useRef, useState } from "react";
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
    totalSubscribers: 0,
    totalUnreadContactMessages: 0,
  });

  const [recentInternships, setRecentInternships] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentPurchases, setRecentPurchases] = useState([]);
  const [recentMessages, setRecentMessages] = useState([]);

  const [subscribers, setSubscribers] = useState([]);
  const [subscribersLoading, setSubscribersLoading] = useState(false);
  const [subscriberSearch, setSubscriberSearch] = useState("");
  const [subscribersPage, setSubscribersPage] = useState(1);
  const subscribersLimit = 10;
  const [subscribersTotalPages, setSubscribersTotalPages] = useState(1);
  const [subscribersTotal, setSubscribersTotal] = useState(0);

  const [contactMessages, setContactMessages] = useState([]);
  const [contactMessagesLoading, setContactMessagesLoading] = useState(false);
  const [contactSearch, setContactSearch] = useState("");
  const [contactStatusFilter, setContactStatusFilter] = useState("All");
  const [contactDateFrom, setContactDateFrom] = useState("");
  const [contactDateTo, setContactDateTo] = useState("");
  const [contactPage, setContactPage] = useState(1);
  const contactLimit = 10;
  const [contactTotalPages, setContactTotalPages] = useState(1);
  const [contactTotal, setContactTotal] = useState(0);

  const [replyingMessageId, setReplyingMessageId] = useState("");
  const [replyMessage, setReplyMessage] = useState("");

  const [loading, setLoading] = useState(true);
  const [usersLoading, setUsersLoading] = useState(false);
  const [purchasesLoading, setPurchasesLoading] = useState(false);
  const [sendingReply, setSendingReply] = useState(false);

  const [userSearch, setUserSearch] = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState("All");
  const [userDateFrom, setUserDateFrom] = useState("");
  const [userDateTo, setUserDateTo] = useState("");
  const [usersPage, setUsersPage] = useState(1);
  const usersLimit = 10;
  const [usersTotalPages, setUsersTotalPages] = useState(1);
  const [usersTotal, setUsersTotal] = useState(0);

  const [purchaseSearch, setPurchaseSearch] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("All");
  const [certificateFilter, setCertificateFilter] = useState("All");
  const [purchaseDateFrom, setPurchaseDateFrom] = useState("");
  const [purchaseDateTo, setPurchaseDateTo] = useState("");
  const [purchasesPage, setPurchasesPage] = useState(1);
  const purchasesLimit = 10;
  const [purchasesTotalPages, setPurchasesTotalPages] = useState(1);
  const [purchasesTotal, setPurchasesTotal] = useState(0);

  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedPurchase, setSelectedPurchase] = useState(null);
  const [selectedContactMessage, setSelectedContactMessage] = useState(null);

  const [toast, setToast] = useState({
    show: false,
    type: "success",
    message: "",
  });

  const PIE_COLORS = ["#2563eb", "#16a34a", "#f59e0b", "#ef4444", "#7c3aed"];

  const usersSectionRef = useRef(null);
  const purchasesSectionRef = useRef(null);
  const messagesSectionRef = useRef(null);
  const subscribersSectionRef = useRef(null);

  useEffect(() => {
    document.title = "Admin Dashboard | InternovaTech";
  }, []);

  const scrollToSection = (ref) => {
    if (ref?.current) {
      ref.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const showToast = (type, message) => {
    setToast({ show: true, type, message });

    setTimeout(() => {
      setToast({ show: false, type: "success", message: "" });
    }, 3000);
  };

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
        "Unread Notifications",
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
        user.unreadNotifications || 0,
      ]),
    ];

    downloadCsv(rows, "internovatech_users_export.csv");
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

    downloadCsv(rows, "internovatech_purchases_export.csv");
  };

  const exportMessagesCsv = () => {
    const rows = [
      [
        "Name",
        "Email",
        "Subject",
        "Status",
        "Created At",
        "Updated At",
        "Message",
        "Admin Reply",
      ],
      ...contactMessages.map((item) => [
        item.name || "",
        item.email || "",
        item.subject || "",
        item.status || "",
        formatDateTime(item.createdAt),
        formatDateTime(item.updatedAt),
        item.message || "",
        item.adminReply?.message || "",
      ]),
    ];

    downloadCsv(rows, "internovatech_contact_messages_export.csv");
  };

  const exportSubscribersCsv = () => {
    const rows = [
      ["Email", "Source", "Status", "Subscribed At"],
      ...subscribers.map((item) => [
        item.email || "",
        item.source || "",
        item.isActive ? "Active" : "Inactive",
        formatDateTime(item.createdAt),
      ]),
    ];

    downloadCsv(rows, "internovatech_subscribers_export.csv");
  };

  const fetchOverview = async () => {
    const { data } = await API.get("/admin/overview");
    setStats(data?.stats || {});
    setRecentInternships(data?.recentInternships || []);
    setRecentMessages(data?.recentMessages || []);
  };

  const fetchUsers = async ({
    page = usersPage,
    search = userSearch,
    role = userRoleFilter,
    from = userDateFrom,
    to = userDateTo,
  } = {}) => {
    setUsersLoading(true);

    try {
      const { data } = await API.get("/admin/users", {
        params: {
          page,
          limit: usersLimit,
          search,
          role,
          from,
          to,
        },
      });

      setRecentUsers(data?.items || []);
      setUsersTotalPages(data?.totalPages || 1);
      setUsersTotal(data?.total || 0);
    } finally {
      setUsersLoading(false);
    }
  };

  const fetchPurchases = async ({
    page = purchasesPage,
    search = purchaseSearch,
    paymentStatus = paymentFilter,
    certificateStatus = certificateFilter,
    from = purchaseDateFrom,
    to = purchaseDateTo,
  } = {}) => {
    setPurchasesLoading(true);

    try {
      const { data } = await API.get("/admin/purchases", {
        params: {
          page,
          limit: purchasesLimit,
          search,
          paymentStatus,
          certificateStatus,
          from,
          to,
        },
      });

      setRecentPurchases(data?.items || []);
      setPurchasesTotalPages(data?.totalPages || 1);
      setPurchasesTotal(data?.total || 0);
    } finally {
      setPurchasesLoading(false);
    }
  };

  const fetchContactMessages = async ({
    page = contactPage,
    search = contactSearch,
    status = contactStatusFilter,
    from = contactDateFrom,
    to = contactDateTo,
  } = {}) => {
    setContactMessagesLoading(true);

    try {
      const { data } = await API.get("/admin/contact-messages", {
        params: {
          page,
          limit: contactLimit,
          search,
          status,
          from,
          to,
        },
      });

      setContactMessages(data?.items || []);
      setContactTotalPages(data?.totalPages || 1);
      setContactTotal(data?.total || 0);
    } finally {
      setContactMessagesLoading(false);
    }
  };

  const fetchSubscribers = async ({
    page = subscribersPage,
    search = subscriberSearch,
  } = {}) => {
    setSubscribersLoading(true);

    try {
      const { data } = await API.get("/admin/subscribers", {
        params: {
          page,
          limit: subscribersLimit,
          search,
        },
      });

      setSubscribers(data?.items || []);
      setSubscribersTotalPages(data?.totalPages || 1);
      setSubscribersTotal(data?.total || 0);
    } finally {
      setSubscribersLoading(false);
    }
  };

  const fetchAll = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchOverview(),
        fetchUsers({ page: 1 }),
        fetchPurchases({ page: 1 }),
        fetchContactMessages({ page: 1 }),
        fetchSubscribers({ page: 1 }),
      ]);
    } catch (error) {
      console.error("Failed to fetch admin dashboard data:", error);
      showToast("error", "Failed to fetch admin dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchUsers({ page: usersPage }).catch((error) => {
      console.error("Users fetch failed:", error);
      showToast("error", "Failed to fetch users");
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usersPage]);

  useEffect(() => {
    fetchPurchases({ page: purchasesPage }).catch((error) => {
      console.error("Purchases fetch failed:", error);
      showToast("error", "Failed to fetch purchases");
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [purchasesPage]);

  useEffect(() => {
    fetchContactMessages({ page: contactPage }).catch((error) => {
      console.error("Contact messages fetch failed:", error);
      showToast("error", "Failed to fetch contact messages");
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contactPage]);

  useEffect(() => {
    fetchSubscribers({ page: subscribersPage }).catch((error) => {
      console.error("Subscribers fetch failed:", error);
      showToast("error", "Failed to fetch subscribers");
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subscribersPage]);

  const handleUserSearch = async () => {
    try {
      setUsersPage(1);
      await fetchUsers({
        page: 1,
        search: userSearch,
        role: userRoleFilter,
        from: userDateFrom,
        to: userDateTo,
      });
    } catch (error) {
      console.error("User search failed:", error);
      showToast("error", "Failed to search users");
    }
  };

  const handlePurchaseSearch = async () => {
    try {
      setPurchasesPage(1);
      await fetchPurchases({
        page: 1,
        search: purchaseSearch,
        paymentStatus: paymentFilter,
        certificateStatus: certificateFilter,
        from: purchaseDateFrom,
        to: purchaseDateTo,
      });
    } catch (error) {
      console.error("Purchase search failed:", error);
      showToast("error", "Failed to search purchases");
    }
  };

  const handleContactSearch = async () => {
    try {
      setContactPage(1);
      await fetchContactMessages({
        page: 1,
        search: contactSearch,
        status: contactStatusFilter,
        from: contactDateFrom,
        to: contactDateTo,
      });
    } catch (error) {
      console.error("Contact search failed:", error);
      showToast("error", "Failed to search contact messages");
    }
  };

  const handleSubscriberSearch = async () => {
    try {
      setSubscribersPage(1);
      await fetchSubscribers({
        page: 1,
        search: subscriberSearch,
      });
    } catch (error) {
      console.error("Subscriber search failed:", error);
      showToast("error", "Failed to search subscribers");
    }
  };

  const resetUsersFilters = async () => {
    try {
      setUserSearch("");
      setUserRoleFilter("All");
      setUserDateFrom("");
      setUserDateTo("");
      setUsersPage(1);

      await fetchUsers({
        page: 1,
        search: "",
        role: "All",
        from: "",
        to: "",
      });
    } catch (error) {
      console.error("Users reset failed:", error);
      showToast("error", "Failed to reset users");
    }
  };

  const resetPurchasesFilters = async () => {
    try {
      setPurchaseSearch("");
      setPaymentFilter("All");
      setCertificateFilter("All");
      setPurchaseDateFrom("");
      setPurchaseDateTo("");
      setPurchasesPage(1);

      await fetchPurchases({
        page: 1,
        search: "",
        paymentStatus: "All",
        certificateStatus: "All",
        from: "",
        to: "",
      });
    } catch (error) {
      console.error("Purchases reset failed:", error);
      showToast("error", "Failed to reset purchases");
    }
  };

  const resetContactFilters = async () => {
    try {
      setContactSearch("");
      setContactStatusFilter("All");
      setContactDateFrom("");
      setContactDateTo("");
      setContactPage(1);

      await fetchContactMessages({
        page: 1,
        search: "",
        status: "All",
        from: "",
        to: "",
      });
    } catch (error) {
      console.error("Contact reset failed:", error);
      showToast("error", "Failed to reset contact filters");
    }
  };

  const resetSubscriberFilters = async () => {
    try {
      setSubscriberSearch("");
      setSubscribersPage(1);

      await fetchSubscribers({
        page: 1,
        search: "",
      });
    } catch (error) {
      console.error("Subscriber reset failed:", error);
      showToast("error", "Failed to reset subscribers");
    }
  };

  const handleToggleUserStatus = async (user) => {
    try {
      const nextStatus = !user.isActive;

      const { data } = await API.patch(`/admin/users/${user._id}/status`, {
        isActive: nextStatus,
      });

      setRecentUsers((prev) =>
        prev.map((item) =>
          item._id === user._id ? { ...item, isActive: nextStatus } : item
        )
      );

      if (selectedUser?._id === user._id) {
        setSelectedUser((prev) =>
          prev ? { ...prev, isActive: nextStatus } : prev
        );
      }

      showToast(
        "success",
        data?.message || `User ${nextStatus ? "activated" : "deactivated"}`
      );
    } catch (error) {
      console.error("Toggle user status failed:", error);
      showToast(
        "error",
        error?.response?.data?.message || "Failed to update user status"
      );
    }
  };

  const handleUpdatePurchaseStatus = async (purchaseId, paymentStatus) => {
    try {
      const { data } = await API.patch(`/admin/purchases/${purchaseId}/status`, {
        paymentStatus,
      });

      setRecentPurchases((prev) =>
        prev.map((item) =>
          item._id === purchaseId ? { ...item, paymentStatus } : item
        )
      );

      if (selectedPurchase?._id === purchaseId) {
        setSelectedPurchase((prev) =>
          prev ? { ...prev, paymentStatus } : prev
        );
      }

      showToast(
        "success",
        data?.message || `Purchase marked as ${paymentStatus}`
      );
    } catch (error) {
      console.error("Update purchase status failed:", error);
      showToast(
        "error",
        error?.response?.data?.message || "Failed to update purchase status"
      );
    }
  };

  const handleResendCertificate = async (purchase) => {
    try {
      const { data } = await API.post(
        `/admin/certificates/${purchase._id}/resend`,
        {}
      );

      if (data?.certificate?.certificateId) {
        showToast(
          "success",
          `Certificate found: ${data.certificate.certificateId}`
        );
      } else {
        showToast("success", data?.message || "Certificate data loaded");
      }
    } catch (error) {
      console.error("Certificate action failed:", error);
      showToast(
        "error",
        error?.response?.data?.message || "Failed to fetch certificate"
      );
    }
  };

  const handleReplyToMessage = async (messageId) => {
    try {
      const cleanReply = replyMessage.trim();

      if (!cleanReply) {
        showToast("error", "Please enter a reply message");
        return;
      }

      setSendingReply(true);

      const { data } = await API.post(
        `/admin/contact-messages/${messageId}/reply`,
        {
          replyMessage: cleanReply,
        }
      );

      const updatedItem = data?.item || null;

      if (updatedItem) {
        setSelectedContactMessage(updatedItem);
        setContactMessages((prev) =>
          prev.map((item) => (item._id === updatedItem._id ? updatedItem : item))
        );
        setRecentMessages((prev) =>
          prev.map((item) => (item._id === updatedItem._id ? updatedItem : item))
        );
      }

      showToast("success", data?.message || "Reply sent successfully");
      setReplyingMessageId(messageId);
      setReplyMessage(updatedItem?.adminReply?.message || cleanReply);

      await fetchOverview();
    } catch (error) {
      console.error("Reply to message failed:", error);
      showToast(
        "error",
        error?.response?.data?.message || "Failed to send reply"
      );
    } finally {
      setSendingReply(false);
    }
  };

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

  const getContactStatusBadge = (status) => {
    if (status === "new") {
      return (
        <span className="badge bg-danger-subtle text-danger border rounded-pill px-3 py-2">
          New
        </span>
      );
    }

    if (status === "replied") {
      return (
        <span className="badge bg-success-subtle text-success border rounded-pill px-3 py-2">
          Replied
        </span>
      );
    }

    if (status === "user_replied") {
      return (
        <span className="badge bg-warning-subtle text-warning-emphasis border rounded-pill px-3 py-2">
          User Replied
        </span>
      );
    }

    return (
      <span className="badge bg-secondary-subtle text-dark border rounded-pill px-3 py-2">
        {status || "Closed"}
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
          -webkit-backdrop-filter: blur(10px);
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
          -webkit-backdrop-filter: blur(14px);
          box-shadow:
            0 22px 65px rgba(15, 23, 42, 0.10),
            0 8px 20px rgba(59,130,246,0.05);
          -webkit-box-shadow:
            0 22px 65px rgba(15, 23, 42, 0.10),
            0 8px 20px rgba(59,130,246,0.05);
          padding: 24px;
          height: 100%;
          transition: all 0.35s ease;
          -webkit-transition: all 0.35s ease;
        }
        .admin-stat-card:hover,
        .admin-chart-card:hover {
          transform: translateY(-4px);
          -webkit-transform: translateY(-4px);
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
          -webkit-backdrop-filter: blur(16px);
          box-shadow:
            0 24px 70px rgba(15, 23, 42, 0.14),
            0 8px 24px rgba(59,130,246,0.08);
          -webkit-box-shadow:
            0 24px 70px rgba(15, 23, 42, 0.14),
            0 8px 24px rgba(59,130,246,0.08);
          border-radius: 28px;
          scroll-margin-top: 100px;
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
          min-width: 1180px;
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
          word-break: break-word;
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
        .admin-filter-grid-contact {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1fr;
          gap: 14px;
          margin-bottom: 22px;
        }
        .admin-filter-grid-subscriber {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr;
          gap: 14px;
          margin-bottom: 22px;
        }
        .admin-input,
        .admin-select,
        .admin-textarea {
          min-height: 52px;
          border-radius: 16px;
          border: 1px solid #dbe3f0;
          background: #f8fafc;
        }
        .admin-textarea {
          min-height: 120px;
          padding-top: 12px;
          resize: vertical;
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
          -webkit-backdrop-filter: blur(6px);
          z-index: 99998;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 18px;
        }
        .admin-modal-card {
          width: min(900px, 100%);
          max-height: 90vh;
          overflow-y: auto;
          background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
          border: 1px solid #dbeafe;
          border-radius: 28px;
          box-shadow: 0 30px 80px rgba(15, 23, 42, 0.28);
          -webkit-box-shadow: 0 30px 80px rgba(15, 23, 42, 0.28);
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
        .admin-hero-links {
          display: grid;
          grid-template-columns: 1fr;
          gap: 12px;
        }
        @keyframes adminDashboardFloat {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-18px) translateX(10px); }
        }
        @-webkit-keyframes adminDashboardFloat {
          0%, 100% { -webkit-transform: translateY(0px) translateX(0px); }
          50% { -webkit-transform: translateY(-18px) translateX(10px); }
        }
        @media (max-width: 991px) {
          .admin-dashboard-title { font-size: 1.95rem; }
          .admin-filter-grid,
          .admin-filter-grid-contact,
          .admin-filter-grid-subscriber { grid-template-columns: 1fr; }
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
                  <div className="admin-dashboard-chip">InternovaTech Admin Overview</div>
                  <h1 className="admin-dashboard-title">Admin Intelligence Dashboard</h1>
                  <p className="admin-dashboard-text">
                    Monitor programs, users, enrollments, quiz completions,
                    certificates, subscribers, contact messages, and recent
                    purchase activity from one premium admin command center.
                  </p>
                </div>

                <div className="col-lg-4">
                  <div className="admin-hero-links">
                    <Link to="/admin/internships" className="btn btn-light admin-action-btn">
                      Manage Internships
                    </Link>

                    <button
                      type="button"
                      className="btn btn-outline-light admin-action-btn"
                      onClick={() => scrollToSection(usersSectionRef)}
                    >
                      View Users
                    </button>

                    <button
                      type="button"
                      className="btn btn-outline-light admin-action-btn"
                      onClick={() => scrollToSection(purchasesSectionRef)}
                    >
                      View Purchases
                    </button>

                    <button
                      type="button"
                      className="btn btn-outline-light admin-action-btn"
                      onClick={() => scrollToSection(messagesSectionRef)}
                    >
                      View User Messages
                    </button>

                    <button
                      type="button"
                      className="btn btn-outline-light admin-action-btn"
                      onClick={() => scrollToSection(subscribersSectionRef)}
                    >
                      View Subscribers
                    </button>

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
              ["Subscribers", stats.totalSubscribers],
              ["Unread Messages", stats.totalUnreadContactMessages],
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
              {recentInternships.length > 0 ? (
                recentInternships.map((item) => (
                  <div className="col-md-6 col-xl-4" key={item._id}>
                    <div className="admin-recent-card">
                      <div className="d-flex justify-content-between align-items-start gap-3 flex-wrap mb-2">
                        <h5 className="admin-recent-title mb-0">{item.title}</h5>
                        <div>{getProgramStatusBadge(item.isActive)}</div>
                      </div>

                      <p className="admin-mini-text mb-1">
                        <strong>Branch:</strong> {item.branch || "N/A"}
                      </p>
                      <p className="admin-mini-text mb-1">
                        <strong>Category:</strong> {item.category || "N/A"}
                      </p>
                      <p className="admin-mini-text mb-1">
                        <strong>Modules:</strong> {item.modulesCount || 0}
                      </p>
                      <p className="admin-mini-text mb-1">
                        <strong>Videos:</strong> {item.videosCount || 0}
                      </p>
                      <p className="admin-mini-text mb-3">
                        <strong>Quiz:</strong> {item.quizCount || 0}
                      </p>

                      <Link
                        to="/admin/internships"
                        className="btn btn-outline-dark admin-action-btn w-100"
                      >
                        Open Manager
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-12">
                  <div className="admin-recent-card text-center text-secondary">
                    No recent internships found.
                  </div>
                </div>
              )}
            </div>
          </div>

          <div
            ref={usersSectionRef}
            className="admin-section-card p-4 p-md-5 mb-4"
          >
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
                onChange={(e) => setUserRoleFilter(e.target.value)}
              >
                <option value="All">All Roles</option>
                <option value="Admin">Admin</option>
                <option value="User">User</option>
              </select>

              <input
                type="date"
                className="form-control admin-input"
                value={userDateFrom}
                onChange={(e) => setUserDateFrom(e.target.value)}
              />

              <input
                type="date"
                className="form-control admin-input"
                value={userDateTo}
                onChange={(e) => setUserDateTo(e.target.value)}
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
                onClick={resetUsersFilters}
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
                    <th>Notifications</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {usersLoading ? (
                    <tr>
                      <td colSpan="9" className="text-center py-4 text-secondary">
                        Loading users...
                      </td>
                    </tr>
                  ) : recentUsers.length > 0 ? (
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
                        <td>{user.unreadNotifications || 0}</td>
                        <td>
                          <div className="d-flex gap-2 flex-wrap">
                            <button
                              className="btn btn-outline-primary admin-view-btn"
                              type="button"
                              onClick={() => setSelectedUser(user)}
                            >
                              View
                            </button>

                            <button
                              className={`btn admin-view-btn ${
                                user.isActive ? "btn-outline-danger" : "btn-outline-success"
                              }`}
                              type="button"
                              onClick={() => handleToggleUserStatus(user)}
                            >
                              {user.isActive ? "Deactivate" : "Activate"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="9" className="text-center py-4 text-secondary">
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

          <div
            ref={purchasesSectionRef}
            className="admin-section-card p-4 p-md-5 mb-4"
          >
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
                onChange={(e) => setPaymentFilter(e.target.value)}
              >
                <option value="All">All Payments</option>
                <option value="Paid">Paid</option>
                <option value="Failed">Failed</option>
                <option value="Created">Created</option>
              </select>

              <select
                className="form-select admin-select"
                value={certificateFilter}
                onChange={(e) => setCertificateFilter(e.target.value)}
              >
                <option value="All">All Certificates</option>
                <option value="Issued">Issued</option>
                <option value="Not Issued">Not Issued</option>
              </select>

              <input
                type="date"
                className="form-control admin-input"
                value={purchaseDateFrom}
                onChange={(e) => setPurchaseDateFrom(e.target.value)}
              />

              <input
                type="date"
                className="form-control admin-input"
                value={purchaseDateTo}
                onChange={(e) => setPurchaseDateTo(e.target.value)}
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
                onClick={resetPurchasesFilters}
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
                  {purchasesLoading ? (
                    <tr>
                      <td colSpan="11" className="text-center py-4 text-secondary">
                        Loading purchases...
                      </td>
                    </tr>
                  ) : recentPurchases.length > 0 ? (
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
                            item.quiz?.percentage
                              ? `Passed (${item.quiz.percentage}%)`
                              : "Passed",
                            "Pending"
                          )}
                        </td>
                        <td>
                          {getYesNoBadge(
                            item.progress?.certificateEligible,
                            "Eligible",
                            "Locked"
                          )}
                        </td>
                        <td>
                          {item.certificate?.certificateId ? (
                            <div>
                              <div className="admin-user-name">
                                {item.certificate.certificateId}
                              </div>
                              <div className="admin-user-email">
                                {formatDate(item.certificate.issuedAt)}
                              </div>
                            </div>
                          ) : (
                            <span className="badge bg-secondary-subtle text-dark border rounded-pill px-3 py-2">
                              Not Issued
                            </span>
                          )}
                        </td>
                        <td>
                          <div className="d-flex gap-2 flex-wrap">
                            <button
                              className="btn btn-outline-primary admin-view-btn"
                              type="button"
                              onClick={() => setSelectedPurchase(item)}
                            >
                              View
                            </button>

                            <button
                              className="btn btn-outline-success admin-view-btn"
                              type="button"
                              onClick={() =>
                                handleUpdatePurchaseStatus(item._id, "paid")
                              }
                            >
                              Mark Paid
                            </button>

                            <button
                              className="btn btn-outline-danger admin-view-btn"
                              type="button"
                              onClick={() =>
                                handleUpdatePurchaseStatus(item._id, "failed")
                              }
                            >
                              Mark Failed
                            </button>

                            <button
                              className="btn btn-outline-warning admin-view-btn"
                              type="button"
                              onClick={() => handleResendCertificate(item)}
                            >
                              Certificate
                            </button>
                          </div>
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

          <div
            ref={messagesSectionRef}
            className="admin-section-card p-4 p-md-5 mb-4"
          >
            <div className="d-flex justify-content-between align-items-start gap-3 flex-wrap">
              <div>
                <h3 className="admin-section-title">Contact Messages Inbox</h3>
                <p className="admin-section-subtitle">
                  View support messages, reply to users, and manage conversation flow.
                </p>
              </div>

              <button
                className="btn btn-outline-primary admin-action-btn"
                type="button"
                onClick={exportMessagesCsv}
              >
                Export Current Page CSV
              </button>
            </div>

            <div className="admin-filter-grid-contact">
              <input
                type="text"
                className="form-control admin-input"
                placeholder="Search by name, email, subject, message..."
                value={contactSearch}
                onChange={(e) => setContactSearch(e.target.value)}
              />

              <select
                className="form-select admin-select"
                value={contactStatusFilter}
                onChange={(e) => setContactStatusFilter(e.target.value)}
              >
                <option value="All">All Status</option>
                <option value="new">New</option>
                <option value="replied">Replied</option>
                <option value="user_replied">User Replied</option>
                <option value="closed">Closed</option>
              </select>

              <input
                type="date"
                className="form-control admin-input"
                value={contactDateFrom}
                onChange={(e) => setContactDateFrom(e.target.value)}
              />

              <input
                type="date"
                className="form-control admin-input"
                value={contactDateTo}
                onChange={(e) => setContactDateTo(e.target.value)}
              />

              <button
                className="btn btn-outline-primary admin-action-btn"
                type="button"
                onClick={handleContactSearch}
              >
                Search
              </button>

              <button
                className="btn btn-outline-dark admin-action-btn"
                type="button"
                onClick={resetContactFilters}
              >
                Reset
              </button>
            </div>

            <div className="mb-2 text-secondary small">
              Total Messages Found: {contactTotal}
            </div>

            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Subject</th>
                    <th>Status</th>
                    <th>Created</th>
                    <th>Updated</th>
                    <th>Reply</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {contactMessagesLoading ? (
                    <tr>
                      <td colSpan="7" className="text-center py-4 text-secondary">
                        Loading contact messages...
                      </td>
                    </tr>
                  ) : contactMessages.length > 0 ? (
                    contactMessages.map((item) => (
                      <tr key={item._id}>
                        <td>
                          <div className="admin-user-name">{item.name || "Unknown User"}</div>
                          <div className="admin-user-email">{item.email || "N/A"}</div>
                        </td>
                        <td>
                          <div className="admin-user-name">{item.subject || "No Subject"}</div>
                          <div className="admin-user-email">
                            {(item.message || "").slice(0, 80)}
                            {(item.message || "").length > 80 ? "..." : ""}
                          </div>
                        </td>
                        <td>{getContactStatusBadge(item.status)}</td>
                        <td>{formatDateTime(item.createdAt)}</td>
                        <td>{formatDateTime(item.updatedAt)}</td>
                        <td>
                          {item.adminReply?.message ? (
                            <span className="badge bg-success-subtle text-success border rounded-pill px-3 py-2">
                              Replied
                            </span>
                          ) : (
                            <span className="badge bg-secondary-subtle text-dark border rounded-pill px-3 py-2">
                              Pending
                            </span>
                          )}
                        </td>
                        <td>
                          <div className="d-flex gap-2 flex-wrap">
                            <button
                              className="btn btn-outline-primary admin-view-btn"
                              type="button"
                              onClick={() => {
                                setSelectedContactMessage(item);
                                setReplyingMessageId(item._id);
                                setReplyMessage(item.adminReply?.message || "");
                              }}
                            >
                              View
                            </button>

                            <button
                              className="btn btn-outline-success admin-view-btn"
                              type="button"
                              onClick={() => {
                                setReplyingMessageId(item._id);
                                setSelectedContactMessage(item);
                                setReplyMessage(item.adminReply?.message || "");
                              }}
                            >
                              Reply
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center py-4 text-secondary">
                        No contact messages found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="admin-pagination">
              <button
                className="btn btn-outline-dark"
                disabled={contactPage <= 1}
                onClick={() => setContactPage((prev) => prev - 1)}
              >
                Prev
              </button>

              <span className="fw-semibold">
                Page {contactPage} / {contactTotalPages}
              </span>

              <button
                className="btn btn-outline-dark"
                disabled={contactPage >= contactTotalPages}
                onClick={() => setContactPage((prev) => prev + 1)}
              >
                Next
              </button>
            </div>
          </div>

          <div
            ref={subscribersSectionRef}
            className="admin-section-card p-4 p-md-5 mb-4"
          >
            <div className="d-flex justify-content-between align-items-start gap-3 flex-wrap">
              <div>
                <h3 className="admin-section-title">Subscriber List</h3>
                <p className="admin-section-subtitle">
                  View all newsletter subscribers collected from the footer form.
                </p>
              </div>

              <button
                className="btn btn-outline-primary admin-action-btn"
                type="button"
                onClick={exportSubscribersCsv}
              >
                Export Current Page CSV
              </button>
            </div>

            <div className="admin-filter-grid-subscriber">
              <input
                type="text"
                className="form-control admin-input"
                placeholder="Search by subscriber email..."
                value={subscriberSearch}
                onChange={(e) => setSubscriberSearch(e.target.value)}
              />

              <button
                className="btn btn-outline-primary admin-action-btn"
                type="button"
                onClick={handleSubscriberSearch}
              >
                Search
              </button>

              <button
                className="btn btn-outline-dark admin-action-btn"
                type="button"
                onClick={resetSubscriberFilters}
              >
                Reset
              </button>
            </div>

            <div className="mb-2 text-secondary small">
              Total Subscribers Found: {subscribersTotal}
            </div>

            <div className="admin-table-wrap">
              <table className="admin-table" style={{ minWidth: "820px" }}>
                <thead>
                  <tr>
                    <th>Email</th>
                    <th>Source</th>
                    <th>Status</th>
                    <th>Subscribed At</th>
                  </tr>
                </thead>
                <tbody>
                  {subscribersLoading ? (
                    <tr>
                      <td colSpan="4" className="text-center py-4 text-secondary">
                        Loading subscribers...
                      </td>
                    </tr>
                  ) : subscribers.length > 0 ? (
                    subscribers.map((item) => (
                      <tr key={item._id}>
                        <td>
                          <div className="admin-user-name">{item.email || "N/A"}</div>
                        </td>
                        <td>{item.source || "footer"}</td>
                        <td>
                          {getYesNoBadge(item.isActive, "Active", "Inactive")}
                        </td>
                        <td>{formatDateTime(item.createdAt)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center py-4 text-secondary">
                        No subscribers found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="admin-pagination">
              <button
                className="btn btn-outline-dark"
                disabled={subscribersPage <= 1}
                onClick={() => setSubscribersPage((prev) => prev - 1)}
              >
                Prev
              </button>

              <span className="fw-semibold">
                Page {subscribersPage} / {subscribersTotalPages}
              </span>

              <button
                className="btn btn-outline-dark"
                disabled={subscribersPage >= subscribersTotalPages}
                onClick={() => setSubscribersPage((prev) => prev + 1)}
              >
                Next
              </button>
            </div>
          </div>

          <div className="admin-section-card p-4 p-md-5">
            <h3 className="admin-section-title">Recent Contact Activity</h3>
            <p className="admin-section-subtitle">
              Quick snapshot of latest support conversations.
            </p>

            <div className="row g-4">
              {recentMessages.length > 0 ? (
                recentMessages.map((item) => (
                  <div className="col-md-6 col-xl-4" key={item._id}>
                    <div className="admin-recent-card">
                      <div className="d-flex justify-content-between align-items-start gap-2 flex-wrap mb-2">
                        <h5 className="admin-recent-title mb-0">
                          {item.subject || "No Subject"}
                        </h5>
                        {getContactStatusBadge(item.status)}
                      </div>
                      <p className="admin-mini-text mb-1">
                        <strong>Name:</strong> {item.name || "Unknown"}
                      </p>
                      <p className="admin-mini-text mb-1">
                        <strong>Email:</strong> {item.email || "N/A"}
                      </p>
                      <p className="admin-mini-text mb-1">
                        <strong>Message:</strong>{" "}
                        {(item.message || "").slice(0, 120)}
                        {(item.message || "").length > 120 ? "..." : ""}
                      </p>
                      {item.adminReply?.message ? (
                        <p className="admin-mini-text mb-1">
                          <strong>Reply:</strong>{" "}
                          {(item.adminReply.message || "").slice(0, 100)}
                          {(item.adminReply.message || "").length > 100 ? "..." : ""}
                        </p>
                      ) : null}
                      <p className="admin-mini-text mb-0">
                        <strong>Updated:</strong> {formatDateTime(item.updatedAt)}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-12">
                  <div className="admin-recent-card text-center text-secondary">
                    No recent contact activity.
                  </div>
                </div>
              )}
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

              <div className="d-flex gap-2 flex-wrap">
                <button
                  className={`btn admin-action-btn ${
                    selectedUser?.isActive ? "btn-outline-danger" : "btn-outline-success"
                  }`}
                  onClick={() => handleToggleUserStatus(selectedUser)}
                >
                  {selectedUser?.isActive ? "Deactivate User" : "Activate User"}
                </button>

                <button
                  className="btn btn-outline-dark admin-action-btn"
                  onClick={() => setSelectedUser(null)}
                >
                  Close
                </button>
              </div>
            </div>

            <div className="row g-4">
              <div className="col-md-6">
                <div className="admin-info-box">
                  <h5 className="fw-bold mb-3">Profile Details</h5>
                  <p className="mb-2">
                    <strong>Email:</strong> {selectedUser.email || "N/A"}
                  </p>
                  <p className="mb-2">
                    <strong>Joined:</strong> {formatDate(selectedUser.createdAt)}
                  </p>
                  <p className="mb-2">
                    <strong>Last Login:</strong> {formatDateTime(selectedUser.lastLoginAt)}
                  </p>
                  <p className="mb-0">
                    <strong>Unread Notifications:</strong> {selectedUser.unreadNotifications || 0}
                  </p>
                </div>
              </div>

              <div className="col-md-6">
                <div className="admin-info-box">
                  <h5 className="fw-bold mb-3">Performance Summary</h5>
                  <p className="mb-2">
                    <strong>Total Purchases:</strong> {selectedUser.purchasesCount || 0}
                  </p>
                  <p className="mb-0">
                    <strong>Total Certificates:</strong> {selectedUser.certificatesCount || 0}
                  </p>
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

              <div className="d-flex gap-2 flex-wrap">
                <button
                  className="btn btn-outline-success admin-action-btn"
                  onClick={() =>
                    handleUpdatePurchaseStatus(selectedPurchase._id, "paid")
                  }
                >
                  Mark Paid
                </button>

                <button
                  className="btn btn-outline-danger admin-action-btn"
                  onClick={() =>
                    handleUpdatePurchaseStatus(selectedPurchase._id, "failed")
                  }
                >
                  Mark Failed
                </button>

                <button
                  className="btn btn-outline-warning admin-action-btn"
                  onClick={() => handleResendCertificate(selectedPurchase)}
                >
                  Certificate
                </button>

                <button
                  className="btn btn-outline-dark admin-action-btn"
                  onClick={() => setSelectedPurchase(null)}
                >
                  Close
                </button>
              </div>
            </div>

            <div className="row g-4 mb-4">
              <div className="col-md-6">
                <div className="admin-info-box">
                  <h5 className="fw-bold mb-3">User Info</h5>
                  <p className="mb-2">
                    <strong>Name:</strong> {selectedPurchase.user?.name || "Unknown User"}
                  </p>
                  <p className="mb-2">
                    <strong>Email:</strong> {selectedPurchase.user?.email || "N/A"}
                  </p>
                  <p className="mb-0">
                    <strong>Last Login:</strong> {formatDateTime(selectedPurchase.user?.lastLoginAt)}
                  </p>
                </div>
              </div>

              <div className="col-md-6">
                <div className="admin-info-box">
                  <h5 className="fw-bold mb-3">Internship Info</h5>
                  <p className="mb-2">
                    <strong>Branch:</strong> {selectedPurchase.internship?.branch || "N/A"}
                  </p>
                  <p className="mb-2">
                    <strong>Category:</strong> {selectedPurchase.internship?.category || "N/A"}
                  </p>
                  <p className="mb-0">
                    <strong>Duration:</strong> {selectedPurchase.durationLabel || "N/A"}
                  </p>
                </div>
              </div>
            </div>

            <div className="row g-4">
              <div className="col-md-4">
                <div className="admin-info-box">
                  <h5 className="fw-bold mb-3">Payment</h5>
                  <p className="mb-2">
                    <strong>Amount:</strong> ₹{selectedPurchase.amount || 0}
                  </p>
                  <p className="mb-2">
                    <strong>Status:</strong> {selectedPurchase.paymentStatus || "N/A"}
                  </p>
                  <p className="mb-0">
                    <strong>Date:</strong> {formatDate(selectedPurchase.createdAt)}
                  </p>
                </div>
              </div>

              <div className="col-md-4">
                <div className="admin-info-box">
                  <h5 className="fw-bold mb-3">Learning</h5>
                  <p className="mb-2">
                    <strong>Progress:</strong> {selectedPurchase.progress?.overallProgress || 0}%
                  </p>
                  <p className="mb-2">
                    <strong>Quiz:</strong> {selectedPurchase.quiz?.passed ? "Passed" : "Pending"}
                  </p>
                  <p className="mb-0">
                    <strong>Duration Rule:</strong>{" "}
                    {selectedPurchase.progress?.durationCompleted ? "Completed" : "Pending"}
                  </p>
                </div>
              </div>

              <div className="col-md-4">
                <div className="admin-info-box">
                  <h5 className="fw-bold mb-3">Certificate</h5>
                  <p className="mb-2">
                    <strong>Eligible:</strong>{" "}
                    {selectedPurchase.progress?.certificateEligible ? "Yes" : "No"}
                  </p>
                  <p className="mb-2">
                    <strong>Issued:</strong>{" "}
                    {selectedPurchase.certificate?.certificateId ? "Yes" : "No"}
                  </p>
                  <p className="mb-0">
                    <strong>ID:</strong> {selectedPurchase.certificate?.certificateId || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedContactMessage && (
        <div
          className="admin-modal-backdrop"
          onClick={() => {
            setSelectedContactMessage(null);
            setReplyingMessageId("");
            setReplyMessage("");
          }}
        >
          <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="d-flex justify-content-between align-items-start gap-3 flex-wrap mb-4">
              <div>
                <h3 className="fw-bold mb-2">
                  {selectedContactMessage.subject || "Contact Message"}
                </h3>
                <div className="d-flex gap-2 flex-wrap">
                  {getContactStatusBadge(selectedContactMessage.status)}
                </div>
              </div>

              <button
                className="btn btn-outline-dark admin-action-btn"
                onClick={() => {
                  setSelectedContactMessage(null);
                  setReplyingMessageId("");
                  setReplyMessage("");
                }}
              >
                Close
              </button>
            </div>

            <div className="row g-4 mb-4">
              <div className="col-md-6">
                <div className="admin-info-box">
                  <h5 className="fw-bold mb-3">Sender Details</h5>
                  <p className="mb-2">
                    <strong>Name:</strong> {selectedContactMessage.name || "Unknown"}
                  </p>
                  <p className="mb-2">
                    <strong>Email:</strong> {selectedContactMessage.email || "N/A"}
                  </p>
                  <p className="mb-2">
                    <strong>Created:</strong> {formatDateTime(selectedContactMessage.createdAt)}
                  </p>
                  <p className="mb-0">
                    <strong>Updated:</strong> {formatDateTime(selectedContactMessage.updatedAt)}
                  </p>
                </div>
              </div>

              <div className="col-md-6">
                <div className="admin-info-box">
                  <h5 className="fw-bold mb-3">Original Message</h5>
                  <p className="mb-0" style={{ whiteSpace: "pre-wrap", lineHeight: "1.8" }}>
                    {selectedContactMessage.message || "No message"}
                  </p>
                </div>
              </div>
            </div>

            {selectedContactMessage.adminReply?.message && (
              <div className="admin-info-box mb-4">
                <h5 className="fw-bold mb-3">Existing Admin Reply</h5>
                <p className="mb-2" style={{ whiteSpace: "pre-wrap", lineHeight: "1.8" }}>
                  {selectedContactMessage.adminReply.message}
                </p>
                <p className="mb-0 text-secondary small">
                  Replied at: {formatDateTime(selectedContactMessage.adminReply.repliedAt)}
                </p>
              </div>
            )}

            <div className="admin-info-box">
              <h5 className="fw-bold mb-3">Send Admin Reply</h5>
              <textarea
                className="form-control admin-textarea mb-3"
                placeholder="Write your reply here..."
                value={replyingMessageId === selectedContactMessage._id ? replyMessage : ""}
                onChange={(e) => {
                  setReplyingMessageId(selectedContactMessage._id);
                  setReplyMessage(e.target.value);
                }}
              />

              <div className="d-flex gap-2 flex-wrap">
                <button
                  className="btn btn-success admin-action-btn"
                  onClick={() => handleReplyToMessage(selectedContactMessage._id)}
                  disabled={sendingReply}
                >
                  {sendingReply ? "Sending..." : "Send Reply"}
                </button>

                <button
                  className="btn btn-outline-dark admin-action-btn"
                  onClick={() => {
                    setReplyingMessageId("");
                    setReplyMessage("");
                  }}
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AdminDashboard;