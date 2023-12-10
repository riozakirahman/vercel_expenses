import React, { useEffect, useState, useContext } from "react";
import { Outlet, Navigate, useNavigate } from "react-router-dom";

import { LoggedContext } from "../contexts/LoggedContext";

const ProtectedRoutes = () => {
  const { auth, setAuth } = useContext(LoggedContext);
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();
  const token = localStorage.getItem("token");

  const handleStorageChange = (event) => {
    if (event.key === "token" && !event.newValue) {
      // Token is removed in another tab/window
      setAuth({ token: null });
      setLoading(false);
      nav("/login");
    }
  };

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/main", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          setLoading(false);
          setAuth({ token: true });
        } else {
          setLoading(false);
          console.log("Wrong token");
          setAuth({ token: null });
        }
      } catch (error) {
        console.error("Error fetching token:", error);
        setLoading(false);
        setAuth({ token: null });
      }
    };

    if (token) {
      setLoading(true);
      fetchToken();
    } else {
      setLoading(false);
      setAuth({ token: null });
    }
  }, [token, setAuth]);

  // useEffect(() => {
  //   const handleStorage = () => {
  //     console.log("changes");
  //   };

  //   window.addEventListener("storage", handleStorage());
  //   return () => window.removeEventListener("storage", handleStorage());
  // }, [token]);

  if (loading) {
    return <p>Loading...</p>;
  }

  return auth.token === true ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoutes;