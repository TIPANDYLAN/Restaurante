import { Outlet, Navigate } from "react-router-dom";

const PrivateRoutes = ({ allowedRoles }) => {
  const isAuthenticated = localStorage.getItem("auth") === "yes";
  const role = localStorage.getItem("Cargo");

  if (isAuthenticated && allowedRoles.includes(role)) {
    return <Outlet />;
  } else {
    return <Navigate to="/" />;
  }
};

export default PrivateRoutes;
