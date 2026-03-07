import React, { useEffect, useState } from "react";
import API from "../services/api";
import { useParams, useNavigate } from "react-router-dom";

function InternshipDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [internship, setInternship] = useState(null);
  const [selectedDuration, setSelectedDuration] = useState("");
  const [loading, setLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  const fetchInternship = async () => {
    try {
      const { data } = await API.get(`/internships/${id}`);
      setInternship(data.internship);
      if (data.internship?.durations?.length > 0) {
        setSelectedDuration(data.internship.durations[0].label);
      }
    } catch (error) {
      console.error("Failed to fetch internship details:", error);
    }
  };

  useEffect(() => {
    fetchInternship();
  }, [id]);

  const handleBuyNow = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const { data } = await API.post(
        "/payments/create-order",
        {
          internshipId: id,
          durationLabel: selectedDuration,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const options = {
        key: data.key,
        amount: data.order.amount,
        currency: data.order.currency,
        name: "Internova",
        description: `${data.internship.title} - ${data.duration.label}`,
        order_id: data.order.id,
        handler: async function (response) {
          try {
            const verifyRes = await API.post(
              "/payments/verify",
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            if (verifyRes.data.success) {
              alert("Payment successful!");
              navigate("/my-purchases");
            } else {
              alert("Payment verification failed");
            }
          } catch (error) {
            console.error("Verification error:", error);
            alert("Payment verification failed");
          }
        },
        prefill: {
          name: user?.name || "",
          email: user?.email || "",
        },
        theme: {
          color: "#111111",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment start error:", error);
      alert(error.response?.data?.message || "Failed to initiate payment");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateCertificate = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const { data } = await API.post(
        `/certificates/generate/${id}`,
        {
          duration: selectedDuration,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        alert(data.message || "Certificate generated successfully");

        if (data.certificate?.certificateId) {
          window.open(
            `http://localhost:5000/api/certificates/${data.certificate.certificateId}/download`,
            "_blank"
          );
        }
      } else {
        alert("Certificate generation failed");
      }
    } catch (error) {
      console.error("Certificate generate error:", error);
      alert(error.response?.data?.message || "Failed to generate certificate");
    } finally {
      setLoading(false);
    }
  };

  if (!internship) {
    return <div className="container py-5">Loading details...</div>;
  }

  const selectedPlan = internship.durations.find(
    (item) => item.label === selectedDuration
  );

  return (
    <div className="container py-5">
      <button className="btn btn-outline-dark mb-4" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className="row g-4">
        <div className="col-md-6">
          <img
            src={internship.thumbnail || "https://via.placeholder.com/600x350"}
            alt={internship.title}
            className="img-fluid rounded shadow"
          />
        </div>

        <div className="col-md-6">
          <h2>{internship.title}</h2>
          <p><strong>Branch:</strong> {internship.branch}</p>
          <p><strong>Category:</strong> {internship.category}</p>
          <p>{internship.description}</p>

          <div className="mb-3">
            <label className="form-label"><strong>Select Duration</strong></label>
            <select
              className="form-select"
              value={selectedDuration}
              onChange={(e) => setSelectedDuration(e.target.value)}
            >
              {internship.durations.map((item, index) => (
                <option key={index} value={item.label}>
                  {item.label} - ₹{item.price}
                </option>
              ))}
            </select>
          </div>

          <h4 className="mb-3">
            Price: ₹{selectedPlan ? selectedPlan.price : 0}
          </h4>

          <button
            className="btn btn-success w-100"
            onClick={handleBuyNow}
            disabled={loading}
          >
            {loading ? "Processing..." : "Buy Now"}
          </button>

          <button
            className="btn btn-dark w-100 mt-3"
            onClick={handleGenerateCertificate}
            disabled={loading}
          >
            {loading ? "Processing..." : "Generate Certificate"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default InternshipDetails;