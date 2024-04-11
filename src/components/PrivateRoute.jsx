import { Outlet, Navigate } from "react-router-dom";
import { useAuthStatus } from "../hooks/useAuthStatus";
import Spinner from "./Spinner";

export default function PrivateRoute() {
  const { loggedIn, checkingStatus } = useAuthStatus();
  if (checkingStatus) {
    return <Spinner />;
  }
  // If user is logged in, render child routes using Outlet
  // If user is not logged in, redirect to sign-in page using Navigate component
  return loggedIn ? <Outlet /> : <Navigate to="/sign-in" />;
}
