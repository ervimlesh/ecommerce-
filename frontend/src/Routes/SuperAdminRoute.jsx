import { useEffect, useState } from "react";
import Spinner from "./Spinner.jsx";
import { Outlet, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/Auth.jsx";
import toast from "react-hot-toast";

export default function SuperAdminRoute() {
  const [ok, setOk] = useState(false);
  const [auth, setAuth] = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const authCheck = async () => {
      try {
        const res = await axios.get("/api/v1/auth/super-admin-auth");
        console.log("superamdin route is hitting ", res);
        if (res.data.ok) {
          setOk(true);
        } else {
          toast.error("Access denied: You are not a super admin");
          navigate("/login"); // or navigate("/") if you prefer
        }
      } catch (error) {
        console.log(error);
        toast.error("Something went wrong while verifying super admin");
        navigate("/login");
      }
    };

    if (auth?.token) authCheck();
  }, [auth?.token, navigate]);

  return ok ? <Outlet /> : <Spinner />;
}
