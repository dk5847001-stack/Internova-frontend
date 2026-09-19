import { useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";

const ADSENSE_SCRIPT_ID = "internovatech-adsense-script";

function ensureAdSenseScript(clientId) {
  if (!clientId || typeof document === "undefined") return;
  if (document.getElementById(ADSENSE_SCRIPT_ID)) return;

  const script = document.createElement("script");
  script.id = ADSENSE_SCRIPT_ID;
  script.async = true;
  script.crossOrigin = "anonymous";
  script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`;
  document.head.appendChild(script);
}

function PublicAdSlot({ slot, className = "" }) {
  const location = useLocation();
  const clientId = import.meta.env.VITE_ADSENSE_CLIENT;
  const fallbackSlot = import.meta.env.VITE_ADSENSE_SLOT;

  const isAllowedRoute = useMemo(() => {
    const path = location.pathname;
    return (
      path === "/" ||
      path === "/about" ||
      path === "/internships" ||
      path.startsWith("/internships/")
    );
  }, [location.pathname]);

  const adSlot = slot || fallbackSlot;
  const shouldRenderAd = Boolean(clientId && adSlot && isAllowedRoute);

  useEffect(() => {
    if (!shouldRenderAd) return;

    ensureAdSenseScript(clientId);

    try {
      window.adsbygoogle = window.adsbygoogle || [];
      window.adsbygoogle.push({});
    } catch (error) {
      console.error("AdSense slot failed to load", error);
    }
  }, [clientId, shouldRenderAd]);

  if (!shouldRenderAd) {
    return null;
  }

  return (
    <section className={className} aria-label="Advertisement">
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={clientId}
        data-ad-slot={adSlot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </section>
  );
}

export default PublicAdSlot;
