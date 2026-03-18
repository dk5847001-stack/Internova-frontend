import React, { useEffect, useMemo, useState } from "react";
import API from "../services/api";

function ContactUs() {
  const storedUser = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch (error) {
      return null;
    }
  }, []);

  const [formData, setFormData] = useState({
    name: storedUser?.name || "",
    email: storedUser?.email || "",
    subject: "",
    message: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    type: "success",
    message: "",
  });

  useEffect(() => {
    document.title =
      "Contact InternovaTech - Support, Internship Help and Certificate Queries";

    const metaDescription = document.querySelector('meta[name="description"]');
    const previousDescription = metaDescription?.getAttribute("content") || "";

    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        "Contact InternovaTech for internship support, certificate verification help, account assistance, payment queries and learner guidance."
      );
    }

    let canonicalTag = document.querySelector('link[rel="canonical"]');
    const canonicalAlreadyExists = !!canonicalTag;

    if (!canonicalTag) {
      canonicalTag = document.createElement("link");
      canonicalTag.setAttribute("rel", "canonical");
      document.head.appendChild(canonicalTag);
    }

    canonicalTag.setAttribute("href", "https://www.internovatech.in/contact");

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

  const showToast = (type, message) => {
    setToast({
      show: true,
      type,
      message,
    });

    setTimeout(() => {
      setToast({
        show: false,
        type: "success",
        message: "",
      });
    }, 3000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      subject: formData.subject.trim(),
      message: formData.message.trim(),
    };

    if (!payload.name || !payload.email || !payload.subject || !payload.message) {
      showToast("error", "Please fill all required fields.");
      return;
    }

    if (!isValidEmail(payload.email)) {
      showToast("error", "Please enter a valid email address.");
      return;
    }

    if (payload.name.length < 2) {
      showToast("error", "Name should be at least 2 characters.");
      return;
    }

    if (payload.subject.length < 3) {
      showToast("error", "Subject should be at least 3 characters.");
      return;
    }

    if (payload.message.length < 10) {
      showToast("error", "Message should be at least 10 characters.");
      return;
    }

    try {
      setSubmitting(true);

      const { data } = await API.post("/contact", payload);

      showToast(
        "success",
        data?.message || "Your message has been sent successfully."
      );

      setFormData({
        name: storedUser?.name || "",
        email: storedUser?.email || "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.error("Contact message submit failed:", error);

      showToast(
        "error",
        error?.response?.data?.message || "Failed to send your message."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <style>{`
        .contact-v61-page {
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

        .contact-v61-page::before {
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

        .contact-v61-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(14px);
          opacity: 0.54;
          pointer-events: none;
          animation: contactV61Float 10s ease-in-out infinite;
          -webkit-animation: contactV61Float 10s ease-in-out infinite;
        }

        .contact-v61-orb-1 {
          width: 240px;
          height: 240px;
          top: 90px;
          left: -70px;
          background: linear-gradient(135deg, rgba(29,78,216,0.22), rgba(14,165,233,0.16));
        }

        .contact-v61-orb-2 {
          width: 310px;
          height: 310px;
          right: -80px;
          top: 140px;
          background: linear-gradient(135deg, rgba(99,102,241,0.18), rgba(59,130,246,0.18));
          animation-delay: 1.5s;
          -webkit-animation-delay: 1.5s;
        }

        .contact-v61-orb-3 {
          width: 210px;
          height: 210px;
          right: 14%;
          bottom: 5%;
          background: linear-gradient(135deg, rgba(16,185,129,0.12), rgba(37,99,235,0.10));
          animation-delay: 2.2s;
          -webkit-animation-delay: 2.2s;
        }

        .contact-v61-shell {
          position: relative;
          z-index: 2;
        }

        .contact-v61-toast {
          position: fixed;
          top: 96px;
          right: 24px;
          z-index: 9999;
          min-width: 280px;
          max-width: 390px;
        }

        .contact-v61-hero {
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
          margin-bottom: 28px;
        }

        .contact-v61-badge {
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

        .contact-v61-title {
          font-size: 3rem;
          line-height: 1.05;
          font-weight: 900;
          letter-spacing: -0.05em;
          color: #0f172a;
          margin-bottom: 14px;
        }

        .contact-v61-title-accent {
          background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 42%, #0f172a 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          -webkit-text-fill-color: transparent;
        }

        .contact-v61-text {
          color: #475569;
          line-height: 1.9;
          font-size: 1.05rem;
          margin-bottom: 0;
          max-width: 820px;
        }

        .contact-v61-card {
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
          padding: 28px;
          transition: all 0.35s ease;
          -webkit-transition: all 0.35s ease;
        }

        .contact-v61-card:hover {
          transform: translateY(-6px);
          -webkit-transform: translateY(-6px);
        }

        .contact-v61-card-title {
          font-size: 1.3rem;
          font-weight: 900;
          color: #0f172a;
          margin-bottom: 10px;
          letter-spacing: -0.02em;
        }

        .contact-v61-card-text {
          color: #64748b;
          line-height: 1.85;
          margin-bottom: 0;
        }

        .contact-v61-info-box {
          border-radius: 22px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          padding: 18px;
          margin-bottom: 14px;
          transition: all 0.3s ease;
          -webkit-transition: all 0.3s ease;
        }

        .contact-v61-info-box:hover {
          transform: translateY(-3px);
          -webkit-transform: translateY(-3px);
          box-shadow: 0 12px 30px rgba(15,23,42,0.06);
          -webkit-box-shadow: 0 12px 30px rgba(15,23,42,0.06);
        }

        .contact-v61-info-title {
          font-size: 0.84rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #64748b;
          font-weight: 800;
          margin-bottom: 8px;
        }

        .contact-v61-info-value {
          font-size: 1rem;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 0;
          line-height: 1.7;
          word-break: break-word;
        }

        .contact-v61-input,
        .contact-v61-textarea {
          min-height: 56px;
          border-radius: 18px;
          border: 1px solid #dbe3f0;
          background: rgba(248,250,252,0.96);
          transition: all 0.3s ease;
          -webkit-transition: all 0.3s ease;
          box-shadow: none;
          -webkit-box-shadow: none;
        }

        .contact-v61-textarea {
          min-height: 150px;
          resize: vertical;
          padding-top: 14px;
        }

        .contact-v61-input:focus,
        .contact-v61-textarea:focus {
          border-color: #60a5fa;
          background: #ffffff;
          box-shadow: 0 0 0 4px rgba(37,99,235,0.12);
          -webkit-box-shadow: 0 0 0 4px rgba(37,99,235,0.12);
        }

        .contact-v61-input:disabled,
        .contact-v61-textarea:disabled {
          opacity: 0.75;
          cursor: not-allowed;
        }

        .contact-v61-submit {
          min-height: 56px;
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
        }

        .contact-v61-submit:hover {
          transform: translateY(-2px);
          -webkit-transform: translateY(-2px);
          color: #fff;
        }

        .contact-v61-submit:disabled {
          opacity: 0.75;
          cursor: not-allowed;
          transform: none !important;
          -webkit-transform: none !important;
        }

        .contact-v61-band {
          margin-top: 28px;
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

        .contact-v61-band::before {
          content: "";
          position: absolute;
          inset: 0;
          background:
            radial-gradient(circle at 14% 18%, rgba(255,255,255,0.14), transparent 18%),
            radial-gradient(circle at 86% 74%, rgba(255,255,255,0.08), transparent 20%);
          pointer-events: none;
        }

        .contact-v61-band-inner {
          position: relative;
          z-index: 2;
          padding: 28px;
        }

        .contact-v61-band-title {
          font-size: 1.8rem;
          font-weight: 900;
          letter-spacing: -0.04em;
          margin-bottom: 10px;
        }

        .contact-v61-band-text {
          color: rgba(255,255,255,0.82);
          line-height: 1.9;
          margin-bottom: 0;
        }

        @keyframes contactV61Float {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
          }
          50% {
            transform: translateY(-18px) translateX(10px);
          }
        }

        @-webkit-keyframes contactV61Float {
          0%, 100% {
            -webkit-transform: translateY(0px) translateX(0px);
          }
          50% {
            -webkit-transform: translateY(-18px) translateX(10px);
          }
        }

        @media (max-width: 991px) {
          .contact-v61-title {
            font-size: 2.3rem;
          }

          .contact-v61-hero,
          .contact-v61-card,
          .contact-v61-band-inner {
            padding: 24px;
          }
        }

        @media (max-width: 767px) {
          .contact-v61-title {
            font-size: 1.95rem;
            line-height: 1.12;
          }

          .contact-v61-text,
          .contact-v61-card-text,
          .contact-v61-band-text {
            line-height: 1.8;
          }

          .contact-v61-hero,
          .contact-v61-card,
          .contact-v61-band-inner {
            padding: 22px;
            border-radius: 22px;
          }
        }
      `}</style>

      <div className="contact-v61-page">
        <div className="contact-v61-orb contact-v61-orb-1"></div>
        <div className="contact-v61-orb contact-v61-orb-2"></div>
        <div className="contact-v61-orb contact-v61-orb-3"></div>

        <div className="container contact-v61-shell">
          {toast.show && (
            <div className="contact-v61-toast">
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

          <section className="contact-v61-hero">
            <div className="contact-v61-badge">Contact InternovaTech</div>
            <h1 className="contact-v61-title">
              Let’s connect with{" "}
              <span className="contact-v61-title-accent">InternovaTech</span>{" "}
              for support, guidance, and learner help
            </h1>
            <p className="contact-v61-text">
              Reach out for internship access, certificate verification help,
              account support, payment issues, and general learning queries.
              InternovaTech is built to give learners a cleaner and more trusted
              support experience.
            </p>
          </section>

          <div className="row g-4">
            <div className="col-lg-5">
              <div className="contact-v61-card">
                <h2 className="contact-v61-card-title">Support Information</h2>
                <p className="contact-v61-card-text mb-4">
                  Use the details below for platform support and internship-related help.
                </p>

                <div className="contact-v61-info-box">
                  <div className="contact-v61-info-title">Support Email</div>
                  <p className="contact-v61-info-value">
                    internova.support@gmail.com
                  </p>
                </div>

                <div className="contact-v61-info-box">
                  <div className="contact-v61-info-title">Support Scope</div>
                  <p className="contact-v61-info-value">
                    Internship access, account support, certificate queries,
                    learner guidance, and payment-related issues.
                  </p>
                </div>

                <div className="contact-v61-info-box mb-0">
                  <div className="contact-v61-info-title">Support Hours</div>
                  <p className="contact-v61-info-value">
                    Monday to Saturday • 9:00 AM to 6:00 PM
                  </p>
                </div>
              </div>
            </div>

            <div className="col-lg-7">
              <div className="contact-v61-card">
                <h2 className="contact-v61-card-title">Send a Message</h2>
                <p className="contact-v61-card-text mb-4">
                  Fill the form below to connect with InternovaTech support.
                </p>

                <form onSubmit={handleSubmit}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label fw-bold">Full Name</label>
                      <input
                        type="text"
                        name="name"
                        className="form-control contact-v61-input"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                        disabled={submitting}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-bold">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        className="form-control contact-v61-input"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email address"
                        disabled={submitting}
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label fw-bold">Subject</label>
                      <input
                        type="text"
                        name="subject"
                        className="form-control contact-v61-input"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="Enter message subject"
                        disabled={submitting}
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label fw-bold">Message</label>
                      <textarea
                        name="message"
                        className="form-control contact-v61-textarea"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Write your message here..."
                        disabled={submitting}
                      />
                    </div>

                    <div className="col-12">
                      <button
                        type="submit"
                        className="btn contact-v61-submit w-100"
                        disabled={submitting}
                      >
                        {submitting ? "Sending Message..." : "Send Message"}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <section className="contact-v61-band">
            <div className="contact-v61-band-inner">
              <h2 className="contact-v61-band-title">
                Need quick help with certificates or programs?
              </h2>
              <p className="contact-v61-band-text">
                InternovaTech is designed to support structured learning,
                verified completion, and smoother communication for learners
                at every stage of their internship journey.
              </p>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

export default ContactUs;