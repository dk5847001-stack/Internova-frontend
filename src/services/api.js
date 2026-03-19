import axios from "axios";

console.log("API BASE URL:", process.env.REACT_APP_API_BASE_URL);

const API = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || "/api",
});

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export const downloadProtectedPdf = async (url, fallbackFileName = "document.pdf") => {
  const response = await API.get(url, {
    responseType: "blob",
  });

  const blob = new Blob([response.data], { type: "application/pdf" });
  const blobUrl = window.URL.createObjectURL(blob);

  let fileName = fallbackFileName;
  const disposition = response.headers["content-disposition"];

  if (disposition) {
    const fileNameMatch = disposition.match(/filename="([^"]+)"/i);
    if (fileNameMatch?.[1]) {
      fileName = fileNameMatch[1];
    }
  }

  const a = document.createElement("a");
  a.href = blobUrl;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();

  window.URL.revokeObjectURL(blobUrl);

  return true;
};

export default API;