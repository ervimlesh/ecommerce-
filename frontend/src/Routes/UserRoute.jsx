import { useEffect, useState } from "react";
import Spinner from "./Spinner.jsx";
import { Outlet, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/Auth.jsx";
import toast from "react-hot-toast";

export default function UserRoute() {
  const [ok, setOk] = useState(false);
  const [auth, setAuth] = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const authCheck = async () => {
      try {
        const res = await axios.get("/api/v1/auth/user-auth");
        if (res.data.ok) {
          setOk(true);
        } else {
          toast.error("Access denied: You are not authorized as a user");
          navigate("/login");
        }
      } catch (error) {
        console.error("User route check failed:", error);
        toast.error("Something went wrong while verifying user access");
        navigate("/login");
      }
    };

    if (auth?.token) authCheck();
  }, [auth?.token, navigate]);

  return ok ? <Outlet /> : <Spinner />;
}
