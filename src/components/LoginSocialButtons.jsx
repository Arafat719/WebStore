import React, { useRef, useEffect, useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import "../css/LoginSocialButtons.css";

function LoginSocialButtons() {
  const navigate = useNavigate();
  const wrapRef = useRef(null);
  const [btnWidth, setBtnWidth] = useState(0);

  useEffect(() => {
    if (!wrapRef.current) return;
    const measure = () => {
      if (wrapRef.current) {
        setBtnWidth(Math.min(Math.floor(wrapRef.current.offsetWidth), 400));
      }
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(wrapRef.current);
    return () => ro.disconnect();
  }, []);

  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const token = credentialResponse.credential;
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      if (!res.ok) throw new Error("Server responded with an error");
      const data = await res.json();
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify({ name: data.name, type: data.type || "user", profilePic: data.profilePic || "" }));
      localStorage.setItem("id", JSON.stringify({ id: data.id }));
      navigate("/");
    } catch {
      // silently handle login failure
    }
  };

  return (
    <div ref={wrapRef} className="wmx-social-btn-wrap">
      {btnWidth > 0 && (
        <GoogleLogin
          onSuccess={handleGoogleLogin}
          onError={() => {}}
          auto_select={false}
          width={btnWidth}
          theme="outline"
          size="large"
          shape="rectangular"
          text="continue_with"
        />
      )}
    </div>
  );
}

export default LoginSocialButtons;
