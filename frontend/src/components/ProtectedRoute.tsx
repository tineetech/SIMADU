/* eslint-disable */
import { Navigate } from "react-router-dom";
import checkIsLogin from "../services/checkIsLogin";
import { useEffect, useState } from "react";

const ProtectedRoute = ({ children }: any) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      const loggedIn: any = await checkIsLogin();
      setIsAuthenticated(loggedIn);
      setLoading(false);
    };
    verifyAuth();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Atau tampilkan spinner
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;