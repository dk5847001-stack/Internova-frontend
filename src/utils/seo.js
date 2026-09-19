export const CANONICAL_ORIGIN = "https://www.internovatech.in";

export const DEFAULT_SEO = {
  title: "InternovaTech - Online Internships, Certificates and Tech Training",
  description:
    "InternovaTech offers online internships with practical learning, verified certificates and career-focused training.",
};

const ensureTag = (selector, tagName, attributes = {}) => {
  let element = document.querySelector(selector);
  const existed = Boolean(element);

  if (!element) {
    element = document.createElement(tagName);
    Object.entries(attributes).forEach(([key, value]) => {
      element.setAttribute(key, value);
    });
    document.head.appendChild(element);
  }

  return { element, existed };
};

export const setPageSeo = ({ title, description, canonicalPath, robots }) => {
  const previousTitle = document.title;

  const { element: metaDescription } = ensureTag('meta[name="description"]', "meta", {
    name: "description",
  });
  const previousDescription = metaDescription.getAttribute("content") || "";

  const {
    element: canonicalTag,
    existed: canonicalExisted,
  } = ensureTag('link[rel="canonical"]', "link", { rel: "canonical" });
  const previousCanonical = canonicalTag.getAttribute("href") || "";

  let robotsTag = null;
  let robotsExisted = false;
  let previousRobots = "";
  if (typeof robots === "string") {
    const robotsResult = ensureTag('meta[name="robots"]', "meta", { name: "robots" });
    robotsTag = robotsResult.element;
    robotsExisted = robotsResult.existed;
    previousRobots = robotsTag.getAttribute("content") || "";
    robotsTag.setAttribute("content", robots);
  }

  if (title) {
    document.title = title;
  }

  if (description) {
    metaDescription.setAttribute("content", description);
  }

  if (canonicalPath) {
    const normalizedPath = canonicalPath.startsWith("/") ? canonicalPath : `/${canonicalPath}`;
    canonicalTag.setAttribute("href", `${CANONICAL_ORIGIN}${normalizedPath}`);
  }

  return () => {
    document.title = previousTitle || DEFAULT_SEO.title;
    metaDescription.setAttribute("content", previousDescription || DEFAULT_SEO.description);

    if (canonicalExisted) {
      canonicalTag.setAttribute("href", previousCanonical || `${CANONICAL_ORIGIN}/`);
    } else {
      canonicalTag.remove();
    }

    if (robotsTag) {
      if (robotsExisted) {
        robotsTag.setAttribute("content", previousRobots || "index, follow");
      } else {
        robotsTag.remove();
      }
    }
  };
};
