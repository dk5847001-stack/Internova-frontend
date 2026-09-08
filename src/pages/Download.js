
const Download = () => {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = "/downloads/InternovaTech.apk";
    link.download = "InternovaTech.apk";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top left, rgba(13,110,253,0.12), transparent 35%), radial-gradient(circle at bottom right, rgba(111,66,193,0.12), transparent 35%), #f8fafc",
        color: "#172033",
      }}
    >
      {/* Hero Section */}
      <section
        className="container"
        style={{
          paddingTop: "80px",
          paddingBottom: "55px",
        }}
      >
        <div
          className="text-center mx-auto"
          style={{ maxWidth: "850px" }}
        >
          {/* Badge */}
          <div
            className="d-inline-flex align-items-center gap-2 px-3 py-2 rounded-pill mb-4"
            style={{
              background: "rgba(13,110,253,0.08)",
              border: "1px solid rgba(13,110,253,0.15)",
              color: "#0d6efd",
              fontSize: "14px",
              fontWeight: 600,
            }}
          >
            <span
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: "#198754",
                display: "inline-block",
              }}
            />
            Official InternovaTech Android App
          </div>

          <h1
            style={{
              fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
              fontWeight: 800,
              lineHeight: 1.08,
              letterSpacing: "-2px",
              marginBottom: "22px",
            }}
          >
            InternovaTech
            <br />
            <span style={{ color: "#0d6efd" }}>In Your Pocket.</span>
          </h1>

          <p
            className="mx-auto"
            style={{
              maxWidth: "680px",
              fontSize: "18px",
              lineHeight: 1.7,
              color: "#667085",
              marginBottom: "32px",
            }}
          >
            Access internships, career opportunities, learning resources,
            applications, purchases and your professional journey directly
            from your Android device.
          </p>

          {/* Download CTA */}
          <div className="d-flex flex-column align-items-center gap-3">
            <button
              type="button"
              onClick={handleDownload}
              className="btn btn-primary d-inline-flex align-items-center justify-content-center gap-3 px-4 py-3"
              style={{
                borderRadius: "14px",
                fontSize: "17px",
                fontWeight: 700,
                minWidth: "270px",
                boxShadow: "0 12px 30px rgba(13,110,253,0.25)",
              }}
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 3v12" />
                <path d="m7 10 5 5 5-5" />
                <path d="M5 21h14" />
              </svg>
              Download Android App
            </button>

            <small style={{ color: "#98a2b3" }}>
              Free • Official APK • Android
            </small>
          </div>
        </div>
      </section>

      {/* App Preview / Info */}
      <section className="container pb-5">
        <div className="row g-4 justify-content-center">
          <div className="col-12 col-md-4">
            <div
              className="h-100 p-4 bg-white"
              style={{
                borderRadius: "20px",
                border: "1px solid #eaecf0",
                boxShadow: "0 8px 30px rgba(16,24,40,0.05)",
              }}
            >
              <div
                className="d-flex align-items-center justify-content-center mb-4"
                style={{
                  width: "52px",
                  height: "52px",
                  borderRadius: "15px",
                  background: "#eef4ff",
                  color: "#0d6efd",
                }}
              >
                <svg
                  width="25"
                  height="25"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="5" y="2" width="14" height="20" rx="2" />
                  <path d="M9 18h6" />
                </svg>
              </div>

              <h5 className="fw-bold">Mobile Experience</h5>

              <p
                className="mb-0"
                style={{ color: "#667085", lineHeight: 1.7 }}
              >
                A dedicated Android experience designed for convenient
                access to InternovaTech services on the go.
              </p>
            </div>
          </div>

          <div className="col-12 col-md-4">
            <div
              className="h-100 p-4 bg-white"
              style={{
                borderRadius: "20px",
                border: "1px solid #eaecf0",
                boxShadow: "0 8px 30px rgba(16,24,40,0.05)",
              }}
            >
              <div
                className="d-flex align-items-center justify-content-center mb-4"
                style={{
                  width: "52px",
                  height: "52px",
                  borderRadius: "15px",
                  background: "#ecfdf3",
                  color: "#198754",
                }}
              >
                <svg
                  width="25"
                  height="25"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 3l7 4v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V7l7-4z" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
              </div>

              <h5 className="fw-bold">Secure & Reliable</h5>

              <p
                className="mb-0"
                style={{ color: "#667085", lineHeight: 1.7 }}
              >
                The app connects with the same secure InternovaTech
                platform and backend services used by the website.
              </p>
            </div>
          </div>

          <div className="col-12 col-md-4">
            <div
              className="h-100 p-4 bg-white"
              style={{
                borderRadius: "20px",
                border: "1px solid #eaecf0",
                boxShadow: "0 8px 30px rgba(16,24,40,0.05)",
              }}
            >
              <div
                className="d-flex align-items-center justify-content-center mb-4"
                style={{
                  width: "52px",
                  height: "52px",
                  borderRadius: "15px",
                  background: "#f4f3ff",
                  color: "#6f42c1",
                }}
              >
                <svg
                  width="25"
                  height="25"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M4 12h16" />
                  <path d="M12 4v16" />
                </svg>
              </div>

              <h5 className="fw-bold">Always Connected</h5>

              <p
                className="mb-0"
                style={{ color: "#667085", lineHeight: 1.7 }}
              >
                Stay connected with internships, applications, courses,
                certificates and your account from anywhere.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container py-5">
        <div className="text-center mb-5">
          <span
            style={{
              color: "#0d6efd",
              fontWeight: 700,
              fontSize: "14px",
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            Everything you need
          </span>

          <h2
            className="fw-bold mt-2"
            style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}
          >
            Your Career, Simplified
          </h2>

          <p
            className="mx-auto"
            style={{
              maxWidth: "620px",
              color: "#667085",
              lineHeight: 1.7,
            }}
          >
            Get a smoother mobile experience with the core features of
            the InternovaTech platform.
          </p>
        </div>

        <div className="row g-3">
          {[
            "Browse internships",
            "Apply for opportunities",
            "Manage your applications",
            "Access purchased courses",
            "Track learning progress",
            "Take online quizzes",
            "Generate certificates",
            "Verify certificates",
            "Manage your profile",
          ].map((feature) => (
            <div className="col-12 col-sm-6 col-lg-4" key={feature}>
              <div
                className="d-flex align-items-center gap-3 p-3 bg-white"
                style={{
                  borderRadius: "14px",
                  border: "1px solid #eaecf0",
                }}
              >
                <div
                  style={{
                    width: "28px",
                    height: "28px",
                    minWidth: "28px",
                    borderRadius: "50%",
                    background: "#ecfdf3",
                    color: "#198754",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                  }}
                >
                  ✓
                </div>

                <span className="fw-semibold">{feature}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Installation */}
      <section className="container py-5">
        <div
          className="p-4 p-md-5 bg-white"
          style={{
            borderRadius: "24px",
            border: "1px solid #eaecf0",
            boxShadow: "0 10px 40px rgba(16,24,40,0.06)",
          }}
        >
          <div className="text-center mb-5">
            <h2 className="fw-bold">Install in 3 Simple Steps</h2>
            <p style={{ color: "#667085" }}>
              Getting started takes less than a minute.
            </p>
          </div>

          <div className="row g-4">
            {[
              {
                number: "01",
                title: "Download",
                text: "Tap the Download Android App button above.",
              },
              {
                number: "02",
                title: "Allow Installation",
                text: "If Android asks for permission, allow installation from this source.",
              },
              {
                number: "03",
                title: "Start Learning",
                text: "Open InternovaTech and login to your account.",
              },
            ].map((step) => (
              <div className="col-12 col-md-4" key={step.number}>
                <div className="text-center">
                  <div
                    className="mx-auto mb-3 d-flex align-items-center justify-content-center"
                    style={{
                      width: "58px",
                      height: "58px",
                      borderRadius: "18px",
                      background: "#0d6efd",
                      color: "#fff",
                      fontWeight: 800,
                      fontSize: "16px",
                    }}
                  >
                    {step.number}
                  </div>

                  <h5 className="fw-bold">{step.title}</h5>

                  <p
                    className="mb-0"
                    style={{
                      color: "#667085",
                      lineHeight: 1.7,
                    }}
                  >
                    {step.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="container py-5">
        <div
          className="text-center text-white p-5"
          style={{
            borderRadius: "28px",
            background:
              "linear-gradient(135deg, #0d6efd 0%, #6f42c1 100%)",
            boxShadow: "0 20px 50px rgba(13,110,253,0.22)",
          }}
        >
          <h2
            className="fw-bold"
            style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}
          >
            Ready to take InternovaTech with you?
          </h2>

          <p
            className="mx-auto"
            style={{
              maxWidth: "620px",
              opacity: 0.9,
              lineHeight: 1.7,
            }}
          >
            Download the official Android application and manage your
            internship and learning journey from anywhere.
          </p>

          <button
            type="button"
            onClick={handleDownload}
            className="btn btn-light px-4 py-3 mt-2"
            style={{
              borderRadius: "13px",
              fontWeight: 700,
              color: "#0d6efd",
            }}
          >
            Download InternovaTech App
          </button>
        </div>
      </section>

      {/* App Information */}
      <section className="container pb-5">
        <div
          className="d-flex flex-wrap justify-content-center gap-4 text-center"
          style={{ color: "#667085", fontSize: "14px" }}
        >
          <span>
            <strong>Platform:</strong> Android
          </span>

          <span>
            <strong>Format:</strong> APK
          </span>

          <span>
            <strong>Size:</strong> ~8 MB
          </span>

          <span>
            <strong>Type:</strong> Official InternovaTech App
          </span>
        </div>
      </section>
    </div>
  );
};

export default Download;