import { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";

const ProtectedRoute = ({ children, role, showAlert }) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const navigate = useNavigate();

  const isLoggedIn = !!token;
  const accessDenied = role === "seller" && user?.type !== "seller";

  useEffect(() => {
    if (isLoggedIn && accessDenied) {
      showAlert?.("Access denied. Only sellers can add products.", "warning");
      navigate("/");
    }
  }, []);

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  if (accessDenied) {
    return null;
  }

  return children;
};

export default ProtectedRoute;
