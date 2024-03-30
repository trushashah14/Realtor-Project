import { getAuth, onAuthStateChanged } from "firebase/auth";
import React from "react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const [pageState, setPageState] = useState("Sign In");
  const location = useLocation();
  const navigate = useNavigate();
  const auth = getAuth();
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setPageState("Profile");
      } else {
        setPageState("Sign In");
      }
    });
  }, [auth]);
  function pathMatchRoute(route) {
    // Check if the current location matches the specified route exactly
    return location.pathname === route;
  }
  return (
    <div className="bg-white border-b shadow-sm sticky top-0 z-50">
      <header className="flex justify-between items-center px-3 max-w-6xl mx-auto">
        <div>
          <img
            src="https://static.rdc.moveaws.com/images/logos/rdc-logo-default.svg"
            alt="logo"
            className="h-5 cursor-pointer"
            onClick={() => navigate("/")}
          />
        </div>
        <div>
          <ul className="flex space-x-10 ">
            <li
              className={`cursor-pointer py-3 text-sm font-semibold ${
                pathMatchRoute("/") ? "text-black" : "text-gray-400"
              } border-b-[3px] ${
                pathMatchRoute("/") ? "border-red-500" : "border-b-transparent"
              }`}
              onClick={() => navigate("/")}
            >
              Home
            </li>
            <li
              className={`cursor-pointer py-3 text-sm font-semibold ${
                pathMatchRoute("/offers") ? "text-black" : "text-gray-400"
              } border-b-[3px] ${
                pathMatchRoute("/offers")
                  ? "border-red-500"
                  : "border-b-transparent"
              }`}
              onClick={() => navigate("/offers")}
            >
              Offers
            </li>
            <li
              className={`cursor-pointer py-3 text-sm font-semibold ${
                pathMatchRoute("/sign-in") || pathMatchRoute("/profile")
                  ? "text-black"
                  : "text-gray-400"
              } border-b-[3px] ${
                pathMatchRoute("/sign-in") || pathMatchRoute("/profile")
                  ? "border-red-500"
                  : "border-b-transparent"
              }`}
              onClick={() => navigate("/profile")}
            >
              {pageState}
            </li>
          </ul>
        </div>
      </header>
    </div>
  );
}
