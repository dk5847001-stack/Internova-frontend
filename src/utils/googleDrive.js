export function extractGoogleDriveFileId(url = "") {
  if (!url || typeof url !== "string") return "";

  const trimmedUrl = url.trim();
  if (!trimmedUrl) return "";

  let match = trimmedUrl.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (match?.[1]) return match[1];

  match = trimmedUrl.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (match?.[1]) return match[1];

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

export function extractYouTubeVideoId(url = "") {
  if (!url || typeof url !== "string") return "";

  const trimmedUrl = url.trim();
  if (!trimmedUrl) return "";

  let match = trimmedUrl.match(/youtu\.be\/([a-zA-Z0-9_-]{6,})/);
  if (match?.[1]) return match[1];

  match = trimmedUrl.match(/[?&]v=([a-zA-Z0-9_-]{6,})/);
  if (match?.[1]) return match[1];

  match = trimmedUrl.match(/\/embed\/([a-zA-Z0-9_-]{6,})/);
  if (match?.[1]) return match[1];

  match = trimmedUrl.match(/\/live\/([a-zA-Z0-9_-]{6,})/);
  if (match?.[1]) return match[1];

  match = trimmedUrl.match(/\/shorts\/([a-zA-Z0-9_-]{6,})/);
  if (match?.[1]) return match[1];

  return "";
}

export function buildYouTubeEmbedUrl(videoId = "") {
  const trimmedVideoId = typeof videoId === "string" ? videoId.trim() : "";
  if (!trimmedVideoId) return "";

  return `https://www.youtube-nocookie.com/embed/${trimmedVideoId}?rel=0&modestbranding=1&controls=1`;
}

export function isYouTubeLink(input = "") {
  if (!input || typeof input !== "string") return false;

  const trimmedInput = input.trim().toLowerCase();

  return (
    trimmedInput.includes("youtube.com") ||
    trimmedInput.includes("youtu.be") ||
    trimmedInput.includes("youtube-nocookie.com")
  );
}

export function isGoogleDriveLink(input = "") {
  if (!input || typeof input !== "string") return false;

  const trimmedInput = input.trim();

  return (
    trimmedInput.includes("drive.google.com") ||
    /^[a-zA-Z0-9_-]{20,}$/.test(trimmedInput)
  );
}

export function convertVideoUrlToEmbedUrl(input = "") {
  const trimmedInput = typeof input === "string" ? input.trim() : "";
  if (!trimmedInput) return "";

  if (isGoogleDriveLink(trimmedInput)) {
    const fileId = extractGoogleDriveFileId(trimmedInput);
    return fileId ? buildGoogleDrivePreviewUrl(fileId) : trimmedInput;
  }

  if (isYouTubeLink(trimmedInput)) {
    const videoId = extractYouTubeVideoId(trimmedInput);
    return videoId ? buildYouTubeEmbedUrl(videoId) : trimmedInput;
  }

  return trimmedInput;
}

export function getVideoSourceType(input = "") {
  const trimmedInput = typeof input === "string" ? input.trim() : "";
  if (!trimmedInput) return "unknown";

  if (isGoogleDriveLink(trimmedInput)) return "google-drive";
  if (isYouTubeLink(trimmedInput)) return "youtube";

  return "direct";
}

export function isEmbeddableVideoLink(input = "") {
  return getVideoSourceType(input) !== "unknown";
}

export function convertGoogleDriveToPreviewUrl(input = "") {
  return convertVideoUrlToEmbedUrl(input);
}
