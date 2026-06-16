import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";

function LoginSocialButtons() {
  const navigate = useNavigate()
  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const token = credentialResponse.credential;

      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/google`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      if (!res.ok) {
        throw new Error("Server responded with an error");
      }

      const data = await res.json();
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify({ name: data.name, type: data.type || "user" }));
      localStorage.setItem("id", JSON.stringify({ id: data.id }));
      navigate("/")
    } catch {
      // silently handle login failure
    }
  };

  return (
    <div className="flex flex-col" style={{ display: "flex", justifyContent: "center", width: "100%" }}>
      <GoogleLogin
        onSuccess={handleGoogleLogin}
        onError={() => {}}
        auto_select={false}
        className="my-1"
      />
      {/* Facebook / GitHub buttons can be added here */}
    </div>
  );
}

export default LoginSocialButtons;
