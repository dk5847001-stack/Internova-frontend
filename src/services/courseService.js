import API from "./api";

const getErrorMessage = (error, fallbackMessage) => {
  return error?.response?.data?.message || error?.message || fallbackMessage;
};

const validateInternshipId = (internshipId) => {
  if (!internshipId || typeof internshipId !== "string") {
    throw new Error("Valid internship ID is required");
  }

  const trimmedInternshipId = internshipId.trim();

  if (!trimmedInternshipId) {
    throw new Error("Valid internship ID is required");
  }

  return trimmedInternshipId;
};

export const getCourseProgress = async (internshipId) => {
  try {
    const safeInternshipId = validateInternshipId(internshipId);

    const { data } = await API.get(`/progress/course/${safeInternshipId}`);
    return data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to fetch course progress"));
  }
};

export const updateVideoProgress = async (internshipId, payload = {}) => {
  try {
    const safeInternshipId = validateInternshipId(internshipId);
    const watchedPercent = Number(payload?.watchedPercent || 0);

    const safePayload = {
      moduleId: payload?.moduleId || "",
      videoId: payload?.videoId || "",
      watchedPercent: Math.min(100, Math.max(0, watchedPercent)),
    };

    const { data } = await API.patch(
      `/progress/course/${safeInternshipId}/video`,
      safePayload
    );

    return data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to update video progress"));
  }
};

export const unlockAllModules = async (internshipId) => {
  try {
    const safeInternshipId = validateInternshipId(internshipId);

    const { data } = await API.patch(
      `/progress/course/${safeInternshipId}/unlock-all`
    );

    return data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to unlock all modules"));
  }
};

export const createUnlockAllOrder = async (internshipId) => {
  try {
    const safeInternshipId = validateInternshipId(internshipId);

    const { data } = await API.post("/payments/create-order", {
      internshipId: safeInternshipId,
      purchaseType: "unlock_all",
    });

    return data;
  } catch (error) {
    throw new Error(
      getErrorMessage(error, "Failed to create unlock-all payment order")
    );
  }
};

export const verifyUnlockAllPayment = async (payload = {}) => {
  try {
    const { data } = await API.post("/payments/verify", {
      razorpay_order_id: payload?.razorpay_order_id || "",
      razorpay_payment_id: payload?.razorpay_payment_id || "",
      razorpay_signature: payload?.razorpay_signature || "",
    });

    return data;
  } catch (error) {
    throw new Error(
      getErrorMessage(error, "Failed to verify unlock-all payment")
    );
  }
};

export const getEligibilityStatus = async (internshipId) => {
  try {
    const safeInternshipId = validateInternshipId(internshipId);

    const { data } = await API.get(
      `/progress/course/${safeInternshipId}/eligibility`
    );

    return data;
  } catch (error) {
    throw new Error(
      getErrorMessage(error, "Failed to fetch eligibility status")
    );
  }
};
