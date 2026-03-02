import { useEffect, useState } from "react";
import Spinner from "./Spinner.jsx";
import { Outlet, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/Auth.jsx";
import toast from "react-hot-toast";

export default function AdminRoute() {
  const [ok, setOk] = useState(false);
  const [auth] = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const authCheck = async () => {
      try {
        const res = await axios.get("/api/v1/auth/admin-auth");
        if (res.data.ok) {
          setOk(true);
        } else {
          toast.error("Access denied: You are not an admin");
          navigate("/login"); // or redirect to home page or dashboard
        }
      } catch (err) {
        console.error("Error verifying admin:", err);
    
        navigate("/login");
      }
    };
    if (auth?.token) authCheck();
  }, [auth?.token, navigate]);

  return ok ? <Outlet /> : <Spinner />;
}
