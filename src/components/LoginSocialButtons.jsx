import React, { useEffect } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { faFacebook } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";

function LoginSocialButtons() {
  const navigate = useNavigate()
  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const token = credentialResponse.credential;
      console.log("Credentials token is:", token);

      // Backend এ পাঠানো
      const res = await fetch("http://localhost:5000/auth/google", {
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
      // Token localStorage-এ save করা
      localStorage.setItem("token", data.token || data);
      navigate("/")
      console.log("Server response:", data);
    } catch (err) {
      console.error("Login failed:", err.message);
    }
  };

  return (
    <div className="flex flex-col" style={{ display: "flex", justifyContent: "center", width: "100%" }}>
      <GoogleLogin
        onSuccess={handleGoogleLogin}
        onError={() => console.log("Login Failed")}
        auto_select={false}
        className="my-1"
      // useOneTap // Optional: One Tap login enable করতে
      />
      {/* পরবর্তীতে Facebook / GitHub button add করতে পারো */}
    </div>
  );
}

export default LoginSocialButtons;