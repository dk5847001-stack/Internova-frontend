import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
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

function AppLayout() {
  const location = useLocation();

  const hideLayoutRoutes = ["/", "/register"];
  const shouldHideLayout = hideLayoutRoutes.includes(location.pathname);

  return (
    <>
      {!shouldHideLayout && <Navbar />}

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/internships"
          element={
            <ProtectedRoute>
              <Internships />
            </ProtectedRoute>
          }
        />

        <Route
          path="/internships/:id"
          element={
            <ProtectedRoute>
              <InternshipDetails />
            </ProtectedRoute>
          }
        />

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
  path="/admin/dashboard"
  element={
    <RequireAdmin>
      <AdminDashboard />
    </RequireAdmin>
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

        <Route path="/verify" element={<VerifyCertificate />} />
        <Route path="/verify/:certificateId" element={<VerifyCertificate />} />

        <Route
          path="/admin/internships"
          element={
            <AdminRoute>
              <AdminInternships />
            </AdminRoute>
          }
        />

        {/* Public Policy Pages */}
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
        <Route path="/refund-policy" element={<RefundPolicy />} />
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