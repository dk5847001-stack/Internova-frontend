import axios from "axios";
import { clearAuthSession, getStoredToken } from "../utils/authStorage";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "/api";

const API = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false,
});

API.interceptors.request.use(
  (config) => {
    const token = getStoredToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

API.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;

    if (status === 401) {
      console.error("Unauthorized request. Please login again.");
      clearAuthSession();
    }

    if (status === 403) {
      console.error("Forbidden request.");
    }

    return Promise.reject(error);
  }
);

const extractFileNameFromDisposition = (disposition, fallbackFileName) => {
  if (!disposition) return fallbackFileName;

  const utf8Match = disposition.match(/filename\*=UTF-8''([^;]+)/i);
  if (utf8Match?.[1]) {
    try {
      return decodeURIComponent(utf8Match[1]);
    } catch (error) {
      console.error("Failed to decode UTF-8 filename:", error);
    }
  }

  const quotedMatch = disposition.match(/filename="([^"]+)"/i);
  if (quotedMatch?.[1]) {
    return quotedMatch[1];
  }

  const plainMatch = disposition.match(/filename=([^;]+)/i);
  if (plainMatch?.[1]) {
    return plainMatch[1].trim();
  }

  return fallbackFileName;
};

export const downloadProtectedPdf = async (
  url,
  fallbackFileName = "document.pdf"
) => {
  const response = await API.get(url, {
    responseType: "blob",
  });

  const contentType =
    response?.headers?.["content-type"] || "application/pdf";

  const blob = new Blob([response.data], { type: contentType });
  const blobUrl = window.URL.createObjectURL(blob);

  const disposition = response?.headers?.["content-disposition"];
  const fileName = extractFileNameFromDisposition(
    disposition,
    fallbackFileName
  );

  const a = document.createElement("a");
  a.href = blobUrl;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  setTimeout(() => {
    window.URL.revokeObjectURL(blobUrl);
  }, 1000);

  return true;
};

export default API;
