import { useEffect } from "react";

const TawkToChat = () => {
  useEffect(() => {
    if (document.getElementById("tawk-script")) return;

    const s1 = document.createElement("script");
    s1.id = "tawk-script";
    s1.async = true;
    // Replace the values below with your real Tawk.to Property ID and Widget/Chat ID
    // from: https://dashboard.tawk.to → Administration → Property Settings → Chat Widget
    s1.src = "https://embed.tawk.to/6a3015464946e31d43a1f309/1jr5t672a";
    s1.charset = "UTF-8";
    s1.setAttribute("crossorigin", "*");
    document.body.appendChild(s1);
  }, []);

  return null;
};

export default TawkToChat;
