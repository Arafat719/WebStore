import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

const VISITOR_ID_KEY = "wmx_visitor_id";
const PING_INTERVAL = 45 * 1000;

function getVisitorId() {
  let id = localStorage.getItem(VISITOR_ID_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(VISITOR_ID_KEY, id);
  }
  return id;
}

// Tracks every visit — logged in or not — so the admin panel can see who is
// actually on the site. Pings on mount, on every route change, and on an
// interval while a page stays open, so "online now" stays accurate.
export default function VisitorTracker() {
  const location = useLocation();
  const referrerSentRef = useRef(false);

  useEffect(() => {
    const API = import.meta.env.VITE_API_URL;
    const token = localStorage.getItem("token");

    const ping = () => {
      const body = { visitorId: getVisitorId(), path: window.location.pathname };
      if (!referrerSentRef.current) {
        body.referrer = document.referrer || "direct";
        referrerSentRef.current = true;
      }
      fetch(`${API}/visitors/ping`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { token } : {}),
        },
        body: JSON.stringify(body),
      }).catch(() => {});
    };

    ping();
    const interval = setInterval(ping, PING_INTERVAL);
    return () => clearInterval(interval);
  }, [location.pathname]);

  return null;
}
