import React, { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/Auth.jsx";

const Login = () => {
  const [auth, setAuth] = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });


  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("/api/v1/auth/login", formData);
      console.log(res)

      if (res && res.data.success) {
        toast.success(res.data && res.data.message);
        setAuth({
          ...auth,
          user: res.data.user,
          token: res.data.token,
        });
        localStorage.setItem("auth", JSON.stringify(res.data));
        /// navigate(location.state || "/");
        navigate("/");
      } else {
        console.log("error code is working")
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
  return (
    <>
      <div className="container my-5  border ">
        {/* Image Section */}
        <div className=" text-center mb-4">
          <img src="sec.svg" alt="Secure" className="img-fluid" />
        </div>
        <div className="row justify-content-center">
          {/* Form Section */}
          <div className="col-md-6">
            <form
              onSubmit={handleSubmit}
              className="border p-4 shadow rounded bg-light"
            >
              <h3 className="mb-4 text-center">Login account</h3>

              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email address
                </label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  id="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <input
                  type="password"
                  className="form-control"
                  name="password"
                  id="password"
                  placeholder="At least 6 characters"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="d-grid mb-3">
                <button type="submit" className="btn btn-warning">
                  Create your Amazon account
                </button>
              </div>

              <p className="small text-muted text-center">
                By creating an account or logging in, you agree to Amazon’s{" "}
                <a href="#">Conditions of Use</a> and{" "}
                <a href="#">Privacy Policy</a>.
              </p>

              <hr />

              <div className="d-grid mb-3">
                <button
                  type="button"
                  onClick={() => navigate("/forgot-password")} className="btn btn-outline-secondary"

                >
                  Forgot Password?
                </button>
              </div>

              <p className="text-center">
                Don't have an account? <a href="/register">Sign in</a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
