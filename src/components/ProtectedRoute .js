import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loginWithRedirect, isLoading } = useAuth0();

  if (isLoading) {
    return <div></div>;
  }

  if (!isAuthenticated) {
    loginWithRedirect();
    return null;
  }

  return children;
};

export default ProtectedRoute;
