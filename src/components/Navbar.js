import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import API from "../services/api";
import {
  FaThLarge,
  FaLayerGroup,
  FaClipboardCheck,
  FaShieldAlt,
  FaSearch,
  FaUserCircle,
  FaSignOutAlt,
  FaSignInAlt,
  FaUserPlus,
  FaInfoCircle,
  FaEnvelope,
  FaHome,
  FaBell,
  FaTimes,
  FaUserCog,
  FaCheckCircle,
  FaReply,
  FaInfo,
} from "react-icons/fa";
import { HiMiniBars3BottomRight } from "react-icons/hi2";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const notificationRef = useRef(null);
  const menuRef = useRef(null);

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const token = localStorage.getItem("token");
  const isAdmin = user?.role === "admin";

  const closeMobileMenu = () => {
    setMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("pendingVerificationEmail");
    closeMobileMenu();
    setNotificationsOpen(false);
    navigate("/login");
  };

  const handleSearch = (e) => {
    e.preventDefault();

    if (!search.trim()) return;

    closeMobileMenu();
    navigate(`/internships?search=${encodeURIComponent(search.trim())}`);
    setSearch("");
  };

  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    if (path === "/dashboard") return location.pathname === "/dashboard";
    if (path === "/internships")
      return location.pathname.startsWith("/internships");
    if (path === "/my-purchases")
      return location.pathname.startsWith("/my-purchases");
    if (path === "/verify") return location.pathname.startsWith("/verify");
    if (path === "/about") return location.pathname === "/about";
    if (path === "/contact") return location.pathname === "/contact";
    if (path === "/admin/dashboard")
      return location.pathname.startsWith("/admin/dashboard");
    return false;
  };

  const formatDateTime = (value) => {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getNotificationIcon = (type) => {
    if (type === "contact_reply" || type === "admin_reply") {
      return <FaReply />;
    }

    if (type === "system") {
      return <FaCheckCircle />;
    }

    return <FaInfo />;
  };

  const getNotificationCardClass = (type, read) => {
    const unreadClass = read ? "" : " unread";

    if (type === "contact_reply" || type === "admin_reply") {
      return `internovatech-notification-item contact-reply${unreadClass}`;
    }

    if (type === "system") {
      return `internovatech-notification-item system${unreadClass}`;
    }

    return `internovatech-notification-item general${unreadClass}`;
  };

  const getNotificationActionLink = (item) => {
    if (
      item?.type === "contact_reply" ||
      item?.type === "admin_reply" ||
      item?.metadata?.contactMessageId
    ) {
      return "/contact";
    }

    return null;
  };

  const fetchNotifications = async () => {
    if (!token) return;

    try {
      setNotificationsLoading(true);
      const { data } = await API.get("/auth/notifications");
      const items = Array.isArray(data?.notifications) ? data.notifications : [];
      setNotifications(items);
      setUnreadCount(items.filter((item) => !item.read).length);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setNotificationsLoading(false);
    }
  };

  const markNotificationsAsRead = async () => {
    try {
      await API.patch("/auth/notifications/read-all");
      setNotifications((prev) =>
        prev.map((item) => ({
          ...item,
          read: true,
        }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error("Failed to mark notifications as read:", error);
    }
  };

  const handleToggleNotifications = async () => {
    const nextState = !notificationsOpen;
    setNotificationsOpen(nextState);

    if (nextState) {
      await fetchNotifications();
      if (unreadCount > 0) {
        await markNotificationsAsRead();
      }
    }
  };

  const handleNotificationClick = (item) => {
    const targetPath = getNotificationActionLink(item);
    setNotificationsOpen(false);
    closeMobileMenu();

    if (targetPath) {
      navigate(targetPath);
    }
  };

  useEffect(() => {
    setMenuOpen(false);
    setNotificationsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (token) {
      fetchNotifications();
    } else {
      setNotifications([]);
      setUnreadCount(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setNotificationsOpen(false);
      }

      if (
        window.innerWidth <= 991 &&
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        const clickedToggler = event.target.closest(".internovatech-toggler");
        if (!clickedToggler) {
          setMenuOpen(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const notificationPreview = useMemo(() => {
    return notifications.slice(0, 8);
  }, [notifications]);

  return (
    <>
      <style>{`
        .internovatech-navbar {
          background: rgba(255, 255, 255, 0.88);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          border-bottom: 1px solid rgba(226, 232, 240, 0.92);
          box-shadow: 0 10px 35px rgba(15, 23, 42, 0.06);
          -webkit-box-shadow: 0 10px 35px rgba(15, 23, 42, 0.06);
          padding-top: 10px;
          padding-bottom: 10px;
          z-index: 1100;
        }

        .internovatech-navbar .container {
          max-width: 1440px;
        }

        .internovatech-navbar-shell {
          width: 100%;
        }

        .internovatech-navbar-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          width: 100%;
        }

        .internovatech-brand {
          text-decoration: none;
          min-width: 0;
          flex-shrink: 1;
          transition: all 0.3s ease;
          -webkit-transition: all 0.3s ease;
        }

        .internovatech-brand:hover {
          transform: translateY(-1px);
          -webkit-transform: translateY(-1px);
        }

        .internovatech-brand-wrap {
          display: flex;
          align-items: center;
          gap: 10px;
          min-width: 0;
        }

        .internovatech-logo-circle {
          width: 46px;
          height: 46px;
          border-radius: 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #0b1736 0%, #142850 45%, #1d4ed8 100%);
          color: #fff;
          font-weight: 800;
          font-size: 1.05rem;
          box-shadow:
            0 14px 28px rgba(29, 78, 216, 0.22),
            0 6px 14px rgba(11, 23, 54, 0.18);
          -webkit-box-shadow:
            0 14px 28px rgba(29, 78, 216, 0.22),
            0 6px 14px rgba(11, 23, 54, 0.18);
          flex-shrink: 0;
        }

        .internovatech-brand-text {
          min-width: 0;
          line-height: 1;
        }

        .brand-main {
          display: block;
          font-size: 1.05rem;
          font-weight: 800;
          color: #0f172a;
          line-height: 1.03;
          letter-spacing: -0.02em;
          white-space: nowrap;
        }

        .brand-sub {
          font-size: 0.72rem;
          color: #64748b;
          line-height: 1.2;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          white-space: nowrap;
        }

        .internovatech-top-actions {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-shrink: 0;
        }

        .internovatech-notification-wrap {
          position: relative;
        }

        .internovatech-notification-btn,
        .internovatech-toggler {
          border: 1px solid #dbe3f0;
          border-radius: 14px;
          width: 46px;
          height: 46px;
          box-shadow: none !important;
          background: rgba(255,255,255,0.96);
          transition: all 0.25s ease;
          -webkit-transition: all 0.25s ease;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: #0f172a;
          position: relative;
          flex-shrink: 0;
        }

        .internovatech-notification-btn:hover,
        .internovatech-toggler:hover {
          background: #f8fafc;
          transform: translateY(-1px);
          -webkit-transform: translateY(-1px);
        }

        .internovatech-toggler:focus,
        .internovatech-notification-btn:focus {
          box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.12) !important;
        }

        .internovatech-notification-badge {
          position: absolute;
          top: -4px;
          right: -4px;
          min-width: 20px;
          height: 20px;
          border-radius: 999px;
          background: #ef4444;
          color: #fff;
          font-size: 0.72rem;
          font-weight: 800;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0 5px;
          border: 2px solid #fff;
        }

        .internovatech-notification-dropdown {
          position: absolute;
          top: calc(100% + 12px);
          right: 0;
          width: 380px;
          max-width: calc(100vw - 24px);
          background: rgba(255,255,255,0.98);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          border: 1px solid rgba(226, 232, 240, 0.92);
          border-radius: 22px;
          box-shadow: 0 24px 60px rgba(15, 23, 42, 0.14);
          -webkit-box-shadow: 0 24px 60px rgba(15, 23, 42, 0.14);
          padding: 14px;
          z-index: 1200;
        }

        .internovatech-notification-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 12px;
        }

        .internovatech-notification-title {
          font-size: 0.98rem;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 0;
        }

        .internovatech-notification-count {
          font-size: 0.76rem;
          font-weight: 800;
          color: #2563eb;
          background: #eff6ff;
          border: 1px solid #dbeafe;
          padding: 6px 10px;
          border-radius: 999px;
          flex-shrink: 0;
        }

        .internovatech-notification-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
          max-height: 400px;
          overflow-y: auto;
          padding-right: 2px;
        }

        .internovatech-notification-item {
          border-radius: 16px;
          border: 1px solid #e2e8f0;
          background: #f8fafc;
          padding: 12px;
          display: flex;
          gap: 12px;
          align-items: flex-start;
          transition: all 0.25s ease;
          -webkit-transition: all 0.25s ease;
        }

        .internovatech-notification-item.clickable {
          cursor: pointer;
        }

        .internovatech-notification-item.clickable:hover {
          transform: translateY(-1px);
          -webkit-transform: translateY(-1px);
          box-shadow: 0 10px 22px rgba(15, 23, 42, 0.06);
          -webkit-box-shadow: 0 10px 22px rgba(15, 23, 42, 0.06);
        }

        .internovatech-notification-item.unread {
          background: #eff6ff;
          border-color: #bfdbfe;
        }

        .internovatech-notification-item.contact-reply {
          background: linear-gradient(135deg, #eff6ff 0%, #f8fbff 100%);
          border-color: #bfdbfe;
        }

        .internovatech-notification-item.system {
          background: linear-gradient(135deg, #ecfdf5 0%, #f7fff9 100%);
          border-color: #bbf7d0;
        }

        .internovatech-notification-item.general {
          background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
        }

        .internovatech-notification-icon {
          width: 38px;
          height: 38px;
          border-radius: 12px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          font-size: 0.95rem;
        }

        .internovatech-notification-item.contact-reply .internovatech-notification-icon {
          background: #dbeafe;
          color: #1d4ed8;
        }

        .internovatech-notification-item.system .internovatech-notification-icon {
          background: #dcfce7;
          color: #16a34a;
        }

        .internovatech-notification-item.general .internovatech-notification-icon {
          background: #e2e8f0;
          color: #475569;
        }

        .internovatech-notification-body {
          min-width: 0;
          flex: 1;
        }

        .internovatech-notification-item-title {
          font-size: 0.9rem;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 4px;
        }

        .internovatech-notification-item-text {
          font-size: 0.84rem;
          line-height: 1.6;
          color: #64748b;
          margin-bottom: 6px;
          word-break: break-word;
          white-space: pre-wrap;
        }

        .internovatech-notification-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          flex-wrap: wrap;
        }

        .internovatech-notification-time {
          font-size: 0.76rem;
          color: #94a3b8;
        }

        .internovatech-notification-link {
          border: none;
          background: transparent;
          padding: 0;
          color: #2563eb;
          font-size: 0.78rem;
          font-weight: 800;
          cursor: pointer;
        }

        .internovatech-notification-link:hover {
          color: #1d4ed8;
          text-decoration: underline;
        }

        .internovatech-navbar-collapse {
          width: 100%;
          margin-top: 12px;
        }

        .internovatech-navbar-content {
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          align-items: center;
          gap: 14px;
          width: 100%;
          min-width: 0;
        }

        .internovatech-left-zone {
          display: flex;
          align-items: center;
          gap: 10px;
          min-width: 0;
          overflow: hidden;
        }

        .internovatech-nav-list {
          display: flex;
          align-items: center;
          gap: 4px;
          min-width: 0;
          flex-wrap: nowrap;
          overflow: hidden;
          flex: 1 1 auto;
          margin: 0;
          padding: 0;
          list-style: none;
        }

        .internovatech-link {
          position: relative;
          color: #475569 !important;
          font-weight: 700;
          padding: 9px 10px !important;
          border-radius: 14px;
          transition: all 0.28s ease;
          -webkit-transition: all 0.28s ease;
          white-space: nowrap;
          display: inline-flex !important;
          align-items: center;
          gap: 8px;
          font-size: 0.94rem;
          flex-shrink: 0;
          text-decoration: none !important;
        }

        .internovatech-link:hover {
          color: #0f172a !important;
          background: #f8fafc;
          transform: translateY(-1px);
          -webkit-transform: translateY(-1px);
        }

        .internovatech-link.active {
          color: #0f172a !important;
          background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
          box-shadow: inset 0 0 0 1px #dbeafe;
          -webkit-box-shadow: inset 0 0 0 1px #dbeafe;
        }

        .internovatech-nav-icon {
          font-size: 0.9rem;
          color: #2563eb;
          flex-shrink: 0;
          transition: all 0.28s ease;
          -webkit-transition: all 0.28s ease;
        }

        .internovatech-link:hover .internovatech-nav-icon,
        .internovatech-link.active .internovatech-nav-icon {
          color: #0f172a;
          transform: scale(1.06);
          -webkit-transform: scale(1.06);
        }

        .internovatech-public-links {
          display: flex;
          align-items: center;
          gap: 4px;
          flex-shrink: 0;
        }

        .internovatech-right-zone {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 10px;
          min-width: 0;
          flex-shrink: 0;
        }

        .internovatech-search-wrap {
          display: flex;
          align-items: center;
          background: #f8fafc;
          border: 1px solid #dbe3f0;
          border-radius: 18px;
          padding: 4px;
          min-height: 52px;
          width: 248px;
          max-width: 248px;
          min-width: 0;
          transition: all 0.3s ease;
          -webkit-transition: all 0.3s ease;
          flex-shrink: 1;
        }

        .internovatech-search-wrap:focus-within {
          background: #ffffff;
          border-color: #60a5fa;
          box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.12);
          -webkit-box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.12);
        }

        .internovatech-search {
          border: none;
          outline: none;
          background: transparent;
          padding: 0 12px;
          flex: 1;
          color: #0f172a;
          font-weight: 600;
          min-width: 0;
        }

        .internovatech-search::placeholder {
          color: #94a3b8;
          font-weight: 500;
        }

        .internovatech-search-btn {
          border: none;
          min-height: 42px;
          padding: 0 14px;
          border-radius: 14px;
          font-weight: 800;
          color: #fff;
          background: linear-gradient(135deg, #0b1736 0%, #142850 40%, #1d4ed8 100%);
          box-shadow:
            0 12px 25px rgba(29, 78, 216, 0.18),
            0 6px 14px rgba(11, 23, 54, 0.14);
          -webkit-box-shadow:
            0 12px 25px rgba(29, 78, 216, 0.18),
            0 6px 14px rgba(11, 23, 54, 0.14);
          transition: all 0.28s ease;
          -webkit-transition: all 0.28s ease;
          white-space: nowrap;
          flex-shrink: 0;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .internovatech-search-btn:hover {
          transform: translateY(-1px);
          -webkit-transform: translateY(-1px);
        }

        .internovatech-search-btn-icon {
          font-size: 0.9rem;
        }

        .internovatech-user-actions {
          display: flex;
          align-items: center;
          gap: 10px;
          min-width: 0;
          flex-shrink: 0;
        }

        .internovatech-user-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          min-height: 42px;
          max-width: 130px;
          min-width: 0;
          padding: 0 14px;
          border-radius: 999px;
          background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
          color: #0f172a;
          font-weight: 800;
          border: 1px solid #dbeafe;
          overflow: hidden;
          transition: all 0.3s ease;
          -webkit-transition: all 0.3s ease;
          flex-shrink: 0;
        }

        .internovatech-user-pill:hover {
          transform: translateY(-1px);
          -webkit-transform: translateY(-1px);
          box-shadow: 0 10px 22px rgba(37, 99, 235, 0.10);
          -webkit-box-shadow: 0 10px 22px rgba(37, 99, 235, 0.10);
        }

        .internovatech-user-icon {
          font-size: 0.98rem;
          color: #2563eb;
          flex-shrink: 0;
        }

        .internovatech-user-name {
          display: block;
          max-width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .internovatech-logout-btn,
        .internovatech-auth-btn,
        .internovatech-auth-outline-btn,
        .internovatech-admin-btn {
          min-height: 44px;
          padding: 0 16px;
          border-radius: 16px;
          font-weight: 800;
          transition: all 0.3s ease;
          -webkit-transition: all 0.3s ease;
          white-space: nowrap;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          flex-shrink: 0;
          text-decoration: none !important;
        }

        .internovatech-logout-btn,
        .internovatech-auth-btn,
        .internovatech-admin-btn {
          border: none;
          color: #fff;
          background: linear-gradient(135deg, #0b1736 0%, #142850 40%, #1d4ed8 100%);
          box-shadow:
            0 12px 25px rgba(29, 78, 216, 0.18),
            0 6px 14px rgba(11, 23, 54, 0.14);
          -webkit-box-shadow:
            0 12px 25px rgba(29, 78, 216, 0.18),
            0 6px 14px rgba(11, 23, 54, 0.14);
        }

        .internovatech-auth-outline-btn {
          border: 1px solid #dbe3f0;
          background: rgba(255,255,255,0.7);
          color: #0f172a;
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
        }

        .internovatech-logout-btn:hover,
        .internovatech-auth-btn:hover,
        .internovatech-auth-outline-btn:hover,
        .internovatech-admin-btn:hover {
          transform: translateY(-2px);
          -webkit-transform: translateY(-2px);
        }

        .internovatech-btn-icon {
          font-size: 0.9rem;
          flex-shrink: 0;
        }

        .internovatech-mobile-auth {
          display: flex;
          gap: 10px;
          align-items: center;
        }

        @media (min-width: 992px) {
          .internovatech-toggler {
            display: none !important;
          }

          .internovatech-navbar-collapse {
            display: block !important;
          }

          .internovatech-mobile-admin-link {
            display: none !important;
          }
        }

        @media (max-width: 1499px) {
          .internovatech-search-wrap {
            width: 225px;
            max-width: 225px;
          }
        }

        @media (max-width: 1399px) {
          .internovatech-search-wrap {
            width: 205px;
            max-width: 205px;
          }

          .internovatech-user-pill {
            max-width: 108px;
          }

          .internovatech-link {
            padding: 9px 8px !important;
            font-size: 0.9rem;
            gap: 6px;
          }
        }

        @media (max-width: 1279px) {
          .internovatech-search-wrap {
            width: 184px;
            max-width: 184px;
          }

          .internovatech-search-btn span {
            display: none;
          }

          .internovatech-search-btn {
            padding: 0 13px;
          }

          .internovatech-link {
            font-size: 0.87rem;
          }

          .internovatech-user-pill {
            max-width: 96px;
          }

          .brand-main {
            font-size: 1rem;
          }

          .brand-sub {
            font-size: 0.66rem;
          }
        }

        @media (max-width: 1180px) {
          .internovatech-public-links {
            display: none;
          }
        }

        @media (max-width: 991px) {
          .internovatech-navbar-collapse {
            display: none;
            margin-top: 14px;
            padding-top: 14px;
            border-top: 1px solid #e2e8f0;
            width: 100%;
          }

          .internovatech-navbar-collapse.mobile-open {
            display: block;
          }

          .internovatech-navbar-content,
          .internovatech-left-zone,
          .internovatech-public-links,
          .internovatech-right-zone {
            display: flex;
            flex-direction: column;
            align-items: stretch;
            gap: 14px;
            width: 100%;
          }

          .internovatech-left-zone {
            overflow: visible;
          }

          .internovatech-nav-list {
            width: 100%;
            flex-direction: column;
            align-items: stretch !important;
            gap: 8px;
            overflow: visible;
          }

          .internovatech-link {
            width: 100%;
            justify-content: flex-start;
            padding: 12px 14px !important;
            font-size: 0.96rem;
          }

          .internovatech-public-links {
            display: flex;
          }

          .internovatech-search-wrap {
            width: 100%;
            max-width: 100%;
          }

          .internovatech-search-btn span {
            display: inline;
          }

          .internovatech-user-actions,
          .internovatech-mobile-auth {
            width: 100%;
            flex-direction: column;
            align-items: stretch;
            gap: 12px;
          }

          .internovatech-user-pill,
          .internovatech-logout-btn,
          .internovatech-auth-btn,
          .internovatech-auth-outline-btn,
          .internovatech-admin-btn {
            width: 100%;
            max-width: 100%;
            justify-content: center;
          }

          .internovatech-notification-dropdown {
            right: 0;
            left: auto;
            width: min(360px, calc(100vw - 24px));
          }

          .internovatech-desktop-admin-link {
            display: none !important;
          }
        }

        @media (max-width: 767px) {
          .brand-main {
            font-size: 0.98rem;
          }

          .brand-sub {
            font-size: 0.66rem;
          }

          .internovatech-logo-circle {
            width: 42px;
            height: 42px;
            border-radius: 14px;
          }

          .internovatech-brand-wrap {
            gap: 9px;
          }

          .internovatech-notification-dropdown {
            width: min(330px, calc(100vw - 20px));
          }
        }

        @media (max-width: 575px) {
          .brand-main {
            font-size: 0.92rem;
          }

          .brand-sub {
            font-size: 0.60rem;
          }

          .internovatech-brand-wrap {
            gap: 8px;
          }

          .internovatech-logo-circle {
            width: 40px;
            height: 40px;
            border-radius: 13px;
          }

          .internovatech-top-actions {
            gap: 8px;
          }

          .internovatech-notification-btn,
          .internovatech-toggler {
            width: 42px;
            height: 42px;
            border-radius: 13px;
          }

          .internovatech-notification-dropdown {
            width: min(320px, calc(100vw - 16px));
          }
        }
      `}</style>

      <nav className="navbar internovatech-navbar sticky-top">
        <div className="container">
          <div className="internovatech-navbar-shell w-100" ref={menuRef}>
            <div className="internovatech-navbar-top">
              <Link className="navbar-brand internovatech-brand" to="/">
                <div className="internovatech-brand-wrap">
                  <div className="internovatech-logo-circle">I</div>
                  <div className="internovatech-brand-text">
                    <span className="brand-main">InternovaTech</span>
                    <span className="brand-sub d-block">
                      Online Internship Platform
                    </span>
                  </div>
                </div>
              </Link>

              <div className="internovatech-top-actions">
                {token && (
                  <div
                    className="internovatech-notification-wrap"
                    ref={notificationRef}
                  >
                    <button
                      type="button"
                      className="internovatech-notification-btn"
                      onClick={handleToggleNotifications}
                      aria-label="Notifications"
                    >
                      <FaBell />
                      {unreadCount > 0 && (
                        <span className="internovatech-notification-badge">
                          {unreadCount > 9 ? "9+" : unreadCount}
                        </span>
                      )}
                    </button>

                    {notificationsOpen && (
                      <div className="internovatech-notification-dropdown">
                        <div className="internovatech-notification-header">
                          <div className="internovatech-notification-title">
                            Notifications
                          </div>
                          <div className="internovatech-notification-count">
                            {notifications.length} Total
                          </div>
                        </div>

                        <div className="internovatech-notification-list">
                          {notificationsLoading ? (
                            <div className="internovatech-notification-item general">
                              <div className="internovatech-notification-icon">
                                <FaBell />
                              </div>
                              <div className="internovatech-notification-body">
                                <div className="internovatech-notification-item-text">
                                  Loading notifications...
                                </div>
                              </div>
                            </div>
                          ) : notificationPreview.length > 0 ? (
                            notificationPreview.map((item) => {
                              const targetPath = getNotificationActionLink(item);

                              return (
                                <div
                                  key={item._id}
                                  className={`${getNotificationCardClass(
                                    item.type,
                                    item.read
                                  )}${targetPath ? " clickable" : ""}`}
                                  onClick={() => targetPath && handleNotificationClick(item)}
                                  role={targetPath ? "button" : undefined}
                                  tabIndex={targetPath ? 0 : undefined}
                                  onKeyDown={(e) => {
                                    if (
                                      targetPath &&
                                      (e.key === "Enter" || e.key === " ")
                                    ) {
                                      e.preventDefault();
                                      handleNotificationClick(item);
                                    }
                                  }}
                                >
                                  <div className="internovatech-notification-icon">
                                    {getNotificationIcon(item.type)}
                                  </div>

                                  <div className="internovatech-notification-body">
                                    <div className="internovatech-notification-item-title">
                                      {item.title || "Notification"}
                                    </div>

                                    <div className="internovatech-notification-item-text">
                                      {item.message || "No message"}
                                    </div>

                                    <div className="internovatech-notification-footer">
                                      <div className="internovatech-notification-time">
                                        {formatDateTime(item.createdAt)}
                                      </div>

                                      {targetPath ? (
                                        <button
                                          type="button"
                                          className="internovatech-notification-link"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleNotificationClick(item);
                                          }}
                                        >
                                          Open
                                        </button>
                                      ) : null}
                                    </div>
                                  </div>
                                </div>
                              );
                            })
                          ) : (
                            <div className="internovatech-notification-item general">
                              <div className="internovatech-notification-icon">
                                <FaBell />
                              </div>
                              <div className="internovatech-notification-body">
                                <div className="internovatech-notification-item-text">
                                  No notifications yet.
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <button
                  className="internovatech-toggler"
                  type="button"
                  onClick={() => setMenuOpen((prev) => !prev)}
                  aria-label="Toggle navigation"
                  aria-expanded={menuOpen}
                >
                  {menuOpen ? <FaTimes /> : <HiMiniBars3BottomRight />}
                </button>
              </div>
            </div>

            <div
              className={`internovatech-navbar-collapse ${
                menuOpen ? "mobile-open" : ""
              }`}
            >
              <div className="internovatech-navbar-content">
                <div className="internovatech-left-zone">
                  <ul className="internovatech-nav-list">
                    <li className="nav-item">
                      <Link
                        className={`internovatech-link ${
                          isActive("/") ? "active" : ""
                        }`}
                        to="/"
                        onClick={closeMobileMenu}
                      >
                        <FaHome className="internovatech-nav-icon" />
                        <span>Home</span>
                      </Link>
                    </li>

                    {token && (
                      <li className="nav-item">
                        <Link
                          className={`internovatech-link ${
                            isActive("/dashboard") ? "active" : ""
                          }`}
                          to="/dashboard"
                          onClick={closeMobileMenu}
                        >
                          <FaThLarge className="internovatech-nav-icon" />
                          <span>Dashboard</span>
                        </Link>
                      </li>
                    )}

                    <li className="nav-item">
                      <Link
                        className={`internovatech-link ${
                          isActive("/internships") ? "active" : ""
                        }`}
                        to="/internships"
                        onClick={closeMobileMenu}
                      >
                        <FaLayerGroup className="internovatech-nav-icon" />
                        <span>Trainings</span>
                      </Link>
                    </li>

                    {token && (
                      <li className="nav-item">
                        <Link
                          className={`internovatech-link ${
                            isActive("/my-purchases") ? "active" : ""
                          }`}
                          to="/my-purchases"
                          onClick={closeMobileMenu}
                        >
                          <FaClipboardCheck className="internovatech-nav-icon" />
                          <span>My Enrollments</span>
                        </Link>
                      </li>
                    )}

                    <li className="nav-item">
                      <Link
                        className={`internovatech-link ${
                          isActive("/verify") ? "active" : ""
                        }`}
                        to="/verify"
                        onClick={closeMobileMenu}
                      >
                        <FaShieldAlt className="internovatech-nav-icon" />
                        <span>Verify</span>
                      </Link>
                    </li>
                  </ul>

                  <div className="internovatech-public-links">
                    <Link
                      className={`internovatech-link ${
                        isActive("/about") ? "active" : ""
                      }`}
                      to="/about"
                      onClick={closeMobileMenu}
                    >
                      <FaInfoCircle className="internovatech-nav-icon" />
                      <span>About</span>
                    </Link>

                    <Link
                      className={`internovatech-link ${
                        isActive("/contact") ? "active" : ""
                      }`}
                      to="/contact"
                      onClick={closeMobileMenu}
                    >
                      <FaEnvelope className="internovatech-nav-icon" />
                      <span>Contact</span>
                    </Link>

                    {isAdmin && (
                      <Link
                        className={`internovatech-link internovatech-mobile-admin-link ${
                          isActive("/admin/dashboard") ? "active" : ""
                        }`}
                        to="/admin/dashboard"
                        onClick={closeMobileMenu}
                      >
                        <FaUserCog className="internovatech-nav-icon" />
                        <span>Admin</span>
                      </Link>
                    )}
                  </div>
                </div>

                <div className="internovatech-right-zone">
                  <form
                    className="internovatech-search-wrap"
                    onSubmit={handleSearch}
                  >
                    <input
                      type="text"
                      className="internovatech-search"
                      placeholder="Search programs..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                    <button type="submit" className="internovatech-search-btn">
                      <FaSearch className="internovatech-search-btn-icon" />
                      <span>Search</span>
                    </button>
                  </form>

                  {token ? (
                    <div className="internovatech-user-actions">
                      {isAdmin && (
                        <Link
                          to="/admin/dashboard"
                          className="internovatech-admin-btn internovatech-desktop-admin-link"
                          onClick={closeMobileMenu}
                        >
                          <FaUserCog className="internovatech-btn-icon" />
                          <span>Admin</span>
                        </Link>
                      )}

                      <span
                        className="internovatech-user-pill"
                        title={user?.name || "User"}
                      >
                        <FaUserCircle className="internovatech-user-icon" />
                        <span className="internovatech-user-name">
                          {user?.name || "User"}
                        </span>
                      </span>

                      <button
                        className="btn internovatech-logout-btn"
                        onClick={handleLogout}
                        type="button"
                      >
                        <FaSignOutAlt className="internovatech-btn-icon" />
                        <span>Logout</span>
                      </button>
                    </div>
                  ) : (
                    <div className="internovatech-mobile-auth">
                      <Link
                        to="/login"
                        className="internovatech-auth-btn"
                        onClick={closeMobileMenu}
                      >
                        <FaSignInAlt className="internovatech-btn-icon" />
                        <span>Login</span>
                      </Link>

                      <Link
                        to="/register"
                        className="internovatech-auth-outline-btn"
                        onClick={closeMobileMenu}
                      >
                        <FaUserPlus className="internovatech-btn-icon" />
                        <span>Register</span>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;