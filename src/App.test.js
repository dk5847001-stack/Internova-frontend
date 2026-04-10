import React from "react";
import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import App from "./App";

vi.mock("./pages/Login", () => ({ default: () => <div>Login Page</div> }));
vi.mock("./pages/Register", () => ({ default: () => <div>Register Page</div> }));
vi.mock("./pages/VerifyEmailOtp", () => ({
  default: () => <div>Verify OTP Page</div>,
}));
vi.mock("./pages/ForgotPassword", () => ({
  default: () => <div>Forgot Password Page</div>,
}));
vi.mock("./pages/ResetPassword", () => ({
  default: () => <div>Reset Password Page</div>,
}));
vi.mock("./pages/Dashboard", () => ({ default: () => <div>Dashboard Page</div> }));
vi.mock("./pages/Internships", () => ({
  default: () => <div>Internships Page</div>,
}));
vi.mock("./pages/InternshipDetails", () => ({
  default: () => <div>Internship Details Page</div>,
}));
vi.mock("./pages/MyPurchases", () => ({
  default: () => <div>My Purchases Page</div>,
}));
vi.mock("./pages/CourseProgress", () => ({
  default: () => <div>Course Progress Page</div>,
}));
vi.mock("./pages/QuizPage", () => ({ default: () => <div>Quiz Page</div> }));
vi.mock("./pages/CertificatePage", () => ({
  default: () => <div>Certificate Page</div>,
}));
vi.mock("./pages/VerifyCertificate", () => ({
  default: () => <div>Verify Certificate Page</div>,
}));
vi.mock("./pages/AdminInternships", () => ({
  default: () => <div>Admin Internships Page</div>,
}));
vi.mock("./pages/AboutUs", () => ({ default: () => <div>About Us Page</div> }));
vi.mock("./pages/ContactUs", () => ({
  default: () => <div>Contact Us Page</div>,
}));
vi.mock("./pages/PrivacyPolicy", () => ({
  default: () => <div>Privacy Policy Page</div>,
}));
vi.mock("./pages/TermsAndConditions", () => ({
  default: () => (
  <div>Terms And Conditions Page</div>
  ),
}));
vi.mock("./pages/RefundPolicy", () => ({
  default: () => <div>Refund Policy Page</div>,
}));
vi.mock("./pages/AdminDashboard", () => ({
  default: () => <div>Admin Dashboard Page</div>,
}));

vi.mock("./components/ProtectedRoute", () => ({
  default: ({ children }) => <>{children}</>,
}));
vi.mock("./components/AdminRoute", () => ({
  default: ({ children }) => <>{children}</>,
}));
vi.mock("./components/Navbar", () => ({ default: () => <nav>Navbar</nav> }));
vi.mock("./components/Footer", () => ({ default: () => <footer>Footer</footer> }));
vi.mock("./components/ScrollToTop", () => ({ default: () => null }));

test("renders homepage layout", () => {
  render(<App />);

  expect(screen.getByText("Navbar")).toBeInTheDocument();
  expect(screen.getByText("About Us Page")).toBeInTheDocument();
  expect(screen.getByText("Footer")).toBeInTheDocument();
});
