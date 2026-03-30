import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

jest.mock("./pages/Login", () => () => <div>Login Page</div>);
jest.mock("./pages/Register", () => () => <div>Register Page</div>);
jest.mock("./pages/VerifyEmailOtp", () => () => <div>Verify OTP Page</div>);
jest.mock("./pages/ForgotPassword", () => () => <div>Forgot Password Page</div>);
jest.mock("./pages/ResetPassword", () => () => <div>Reset Password Page</div>);
jest.mock("./pages/Dashboard", () => () => <div>Dashboard Page</div>);
jest.mock("./pages/Internships", () => () => <div>Internships Page</div>);
jest.mock("./pages/InternshipDetails", () => () => <div>Internship Details Page</div>);
jest.mock("./pages/MyPurchases", () => () => <div>My Purchases Page</div>);
jest.mock("./pages/CourseProgress", () => () => <div>Course Progress Page</div>);
jest.mock("./pages/QuizPage", () => () => <div>Quiz Page</div>);
jest.mock("./pages/CertificatePage", () => () => <div>Certificate Page</div>);
jest.mock("./pages/VerifyCertificate", () => () => <div>Verify Certificate Page</div>);
jest.mock("./pages/AdminInternships", () => () => <div>Admin Internships Page</div>);
jest.mock("./pages/AboutUs", () => () => <div>About Us Page</div>);
jest.mock("./pages/ContactUs", () => () => <div>Contact Us Page</div>);
jest.mock("./pages/PrivacyPolicy", () => () => <div>Privacy Policy Page</div>);
jest.mock("./pages/TermsAndConditions", () => () => (
  <div>Terms And Conditions Page</div>
));
jest.mock("./pages/RefundPolicy", () => () => <div>Refund Policy Page</div>);
jest.mock("./pages/AdminDashboard", () => () => <div>Admin Dashboard Page</div>);

jest.mock("./components/ProtectedRoute", () => ({ children }) => <>{children}</>);
jest.mock("./components/AdminRoute", () => ({ children }) => <>{children}</>);
jest.mock("./components/Navbar", () => () => <nav>Navbar</nav>);
jest.mock("./components/Footer", () => () => <footer>Footer</footer>);
jest.mock("./components/ScrollToTop", () => () => null);

test("renders homepage layout", () => {
  render(<App />);

  expect(screen.getByText("Navbar")).toBeInTheDocument();
  expect(screen.getByText("About Us Page")).toBeInTheDocument();
  expect(screen.getByText("Footer")).toBeInTheDocument();
});
