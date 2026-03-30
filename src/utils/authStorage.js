const TOKEN_KEY = "token";
const USER_KEY = "user";
const PENDING_VERIFICATION_EMAIL_KEY = "pendingVerificationEmail";

export const getStoredToken = () => localStorage.getItem(TOKEN_KEY) || "";

export const getStoredUser = () => {
  const rawValue = localStorage.getItem(USER_KEY);

  if (!rawValue) return null;

  try {
    return JSON.parse(rawValue);
  } catch (error) {
    localStorage.removeItem(USER_KEY);
    return null;
  }
};

export const saveAuthSession = ({ token, user }) => {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }

  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(USER_KEY);
  }
};

export const clearAuthSession = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

export const getPendingVerificationEmail = () =>
  localStorage.getItem(PENDING_VERIFICATION_EMAIL_KEY) || "";

export const setPendingVerificationEmail = (email = "") => {
  const trimmedEmail = String(email || "").trim();

  if (!trimmedEmail) {
    localStorage.removeItem(PENDING_VERIFICATION_EMAIL_KEY);
    return;
  }

  localStorage.setItem(PENDING_VERIFICATION_EMAIL_KEY, trimmedEmail);
};

export const clearPendingVerificationEmail = () => {
  localStorage.removeItem(PENDING_VERIFICATION_EMAIL_KEY);
};
