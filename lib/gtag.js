// lib/gtag.js
export const GA_TRACKING_ID = "G-DXLYE91G0P";

// Standard pageview tracking
export const pageview = (url) => {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("config", GA_TRACKING_ID, {
      page_path: url,
    });
  }
};
