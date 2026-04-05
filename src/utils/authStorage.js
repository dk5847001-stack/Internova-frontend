const TOKEN_KEY = "token";
const USER_KEY = "user";
const PENDING_VERIFICATION_EMAIL_KEY = "pendingVerificationEmail";

const getStorage = () => {
  try {
    return window.localStorage;
  } catch (error) {
    return null;
  }
};

const safeGetItem = (key) => {
  const storage = getStorage();
  if (!storage) return "";

  try {
    return storage.getItem(key) || "";
  } catch (error) {
    return "";
  }
};

const safeSetItem = (key, value) => {
  const storage = getStorage();
  if (!storage) return;

  try {
    storage.setItem(key, value);
  } catch (error) {
    // Ignore storage write failures so auth flows can still continue in memory.
  }
};

const safeRemoveItem = (key) => {
  const storage = getStorage();
  if (!storage) return;

  try {
    storage.removeItem(key);
  } catch (error) {
    // Ignore storage cleanup failures triggered by browser privacy restrictions.
  }
};

export const getStoredToken = () => safeGetItem(TOKEN_KEY);

export const getStoredUser = () => {
  const rawValue = safeGetItem(USER_KEY);

  if (!rawValue) return null;

  try {
    return JSON.parse(rawValue);
  } catch (error) {
    safeRemoveItem(USER_KEY);
    return null;
  }
};

export const saveAuthSession = ({ token, user }) => {
  if (token) {
    safeSetItem(TOKEN_KEY, token);
  } else {
    safeRemoveItem(TOKEN_KEY);
  }

  if (user) {
    safeSetItem(USER_KEY, JSON.stringify(user));
  } else {
    safeRemoveItem(USER_KEY);
  }
};

export const clearAuthSession = () => {
  safeRemoveItem(TOKEN_KEY);
  safeRemoveItem(USER_KEY);
};

export const getPendingVerificationEmail = () =>
  safeGetItem(PENDING_VERIFICATION_EMAIL_KEY);

export const setPendingVerificationEmail = (email = "") => {
  const trimmedEmail = String(email || "").trim();

  if (!trimmedEmail) {
    safeRemoveItem(PENDING_VERIFICATION_EMAIL_KEY);
    return;
  }

  safeSetItem(PENDING_VERIFICATION_EMAIL_KEY, trimmedEmail);
};

export const clearPendingVerificationEmail = () => {
  safeRemoveItem(PENDING_VERIFICATION_EMAIL_KEY);
};
