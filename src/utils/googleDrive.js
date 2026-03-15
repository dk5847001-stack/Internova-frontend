export function extractGoogleDriveFileId(url = "") {
  if (!url || typeof url !== "string") return "";

  const trimmedUrl = url.trim();
  if (!trimmedUrl) return "";

  // /file/d/FILE_ID/view or /preview
  let match = trimmedUrl.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (match?.[1]) return match[1];

  // open?id=FILE_ID or uc?id=FILE_ID
  match = trimmedUrl.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (match?.[1]) return match[1];

  // Raw Google Drive file ID
  if (/^[a-zA-Z0-9_-]{20,}$/.test(trimmedUrl)) {
    return trimmedUrl;
  }

  return "";
}

export function buildGoogleDrivePreviewUrl(fileId = "") {
  const trimmedFileId = typeof fileId === "string" ? fileId.trim() : "";
  if (!trimmedFileId) return "";
  return `https://drive.google.com/file/d/${trimmedFileId}/preview`;
}

export function convertGoogleDriveToPreviewUrl(input = "") {
  const trimmedInput = typeof input === "string" ? input.trim() : "";
  if (!trimmedInput) return "";

  const fileId = extractGoogleDriveFileId(trimmedInput);
  if (!fileId) return trimmedInput;

  return buildGoogleDrivePreviewUrl(fileId);
}

export function isGoogleDriveLink(input = "") {
  if (!input || typeof input !== "string") return false;

  const trimmedInput = input.trim();

  return (
    trimmedInput.includes("drive.google.com") ||
    /^[a-zA-Z0-9_-]{20,}$/.test(trimmedInput)
  );
}