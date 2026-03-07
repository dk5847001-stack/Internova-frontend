import React, { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function MyPurchases() {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const fetchPurchases = async () => {
    try {
      const { data } = await API.get("/purchases/my-purchases", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setPurchases(data.purchases || []);
    } catch (error) {
      console.error("Failed to fetch purchases:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchases();
  }, []);

  const handleDownload = async (purchaseId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/purchases/offer-letter/${purchaseId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to download offer letter");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "offer_letter.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      alert("Offer letter download failed");
    }
  };

  if (loading) {
    return <div className="container py-5">Loading purchases...</div>;
  }

  return (
    <div className="container py-5">
      <h2 className="mb-4 text-center">My Purchases</h2>

      {purchases.length === 0 ? (
        <div className="alert alert-info">No purchased internships found.</div>
      ) : (
        <div className="row">
          {purchases.map((item) => (
            <div className="col-md-6 mb-4" key={item._id}>
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <h4>{item.internshipId?.title}</h4>
                  <p className="mb-1">
                    <strong>Branch:</strong> {item.internshipId?.branch}
                  </p>
                  <p className="mb-1">
                    <strong>Category:</strong> {item.internshipId?.category}
                  </p>
                  <p className="mb-1">
                    <strong>Duration:</strong> {item.durationLabel}
                  </p>
                  <p className="mb-1">
                    <strong>Amount Paid:</strong> ₹{item.amount}
                  </p>
                  <p className="mb-3">
                    <strong>Status:</strong> {item.paymentStatus}
                  </p>

                  <div className="d-flex gap-2 flex-wrap">
                    <button
                      className="btn btn-primary"
                      onClick={() => navigate(`/course/${item.internshipId?._id}`)}
                    >
                      Open Course
                    </button>

                    <button
                      className="btn btn-dark"
                      onClick={() => handleDownload(item._id)}
                    >
                      Download Offer Letter
                    </button>

                    <button
                      className="btn btn-outline-dark"
                      onClick={() => navigate(`/quiz/${item.internshipId?._id}`)}
                    >
                      Mini Test
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyPurchases;