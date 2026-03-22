import React from "react";
import { GoogleLogin } from '@react-oauth/google';

export default function LoginSocialButtons() {
  return (
    <div className="flex flex-col gap-2">
      <GoogleLogin
        onSuccess={credentialResponse => {
          console.log(credentialResponse); // user info / token
          // send token to backend
        }}
        onError={() => {
          console.log('Login Failed');
        }}
      />
      {/* পরবর্তীতে Facebook / GitHub button add করতে পারো */}
    </div>
  );
}