import React, { useRef, useEffect, useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import "../css/LoginSocialButtons.css";

function LoginSocialButtons({ onRequiresTwoFactor }) {
  const navigate = useNavigate();
  const wrapRef = useRef(null);
  const [btnWidth, setBtnWidth] = useState(0);
  const [error, setError] = useState("");

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
      setError("");
      const token = credentialResponse.credential;
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const data = await res.json();
      if (res.ok && data.requiresTwoFactor) {
        if (onRequiresTwoFactor) {
          onRequiresTwoFactor(data.tempToken);
          return;
        }
        throw new Error("This account has two-factor authentication enabled — please sign in from the Login page.");
      }
      if (!res.ok || !data.token) throw new Error(data.error || "Google sign-in failed");
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify({ name: data.name, type: data.type || "user", roles: data.roles ?? ["buyer"], profilePic: data.profilePic || "" }));
      localStorage.setItem("id", JSON.stringify({ id: data.id }));
      navigate("/");
    } catch (err) {
      setError(err.message || "Google sign-in failed. Please try again.");
    }
  };

  return (
    <div ref={wrapRef} className="wmx-social-btn-wrap">
      {btnWidth > 0 && (
        <GoogleLogin
          onSuccess={handleGoogleLogin}
          onError={() => setError("Google sign-in failed. Please try again.")}
          auto_select={false}
          width={btnWidth}
          theme="outline"
          size="large"
          shape="rectangular"
          text="continue_with"
        />
      )}
      {error && <span className="wmx-social-error">{error}</span>}
    </div>
  );
}

export default LoginSocialButtons;
