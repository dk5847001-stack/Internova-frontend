import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyEmailOtp from "./pages/VerifyEmailOtp";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import Internships from "./pages/Internships";
import InternshipDetails from "./pages/InternshipDetails";
import MyPurchases from "./pages/MyPurchases";
import CourseProgress from "./pages/CourseProgress";
import QuizPage from "./pages/QuizPage";
import CertificatePage from "./pages/CertificatePage";
import VerifyCertificate from "./pages/VerifyCertificate";
import AdminInternships from "./pages/AdminInternships";

import AboutUs from "./pages/AboutUs";
import ContactUs from "./pages/ContactUs";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsAndConditions from "./pages/TermsAndConditions";
import RefundPolicy from "./pages/RefundPolicy";

import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import "bootstrap/dist/css/bootstrap.min.css";
import AdminDashboard from "./pages/AdminDashboard";

const HIDE_LAYOUT_ROUTES = new Set([
  "/login",
  "/register",
  "/verify-email-otp",
  "/forgot-password",
]);

function AppLayout() {
  const location = useLocation();

  const shouldHideLayout =
    HIDE_LAYOUT_ROUTES.has(location.pathname) ||
    location.pathname.startsWith("/reset-password/");

  return (
    <>
      {!shouldHideLayout && <Navbar />}

      <Routes>
        {/* Public SEO-friendly main homepage */}
        <Route path="/" element={<AboutUs />} />

        {/* Auth routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email-otp" element={<VerifyEmailOtp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* Protected user routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route path="/internships" element={<Internships />} />

       <Route path="/internships/:id" element={<InternshipDetails />} />

        <Route
          path="/my-purchases"
          element={
            <ProtectedRoute>
              <MyPurchases />
            </ProtectedRoute>
          }
        />

        <Route
          path="/course/:internshipId"
          element={
            <ProtectedRoute>
              <CourseProgress />
            </ProtectedRoute>
          }
        />

        <Route
          path="/quiz/:internshipId"
          element={
            <ProtectedRoute>
              <QuizPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/certificate/:internshipId"
          element={
            <ProtectedRoute>
              <CertificatePage />
            </ProtectedRoute>
          }
        />

        {/* Public certificate verification */}
        <Route path="/verify" element={<VerifyCertificate />} />
        <Route path="/verify/:certificateId" element={<VerifyCertificate />} />

        {/* Admin routes */}
        <Route
          path="/admin/dashboard"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/internships"
          element={
            <AdminRoute>
              <AdminInternships />
            </AdminRoute>
          }
        />

        {/* Public info pages */}
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
        <Route path="/refund-policy" element={<RefundPolicy />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {!shouldHideLayout && <Footer />}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AppLayout />
    </BrowserRouter>
  );
}

export default App;
