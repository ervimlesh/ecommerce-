import React, { useState } from "react";
import Footer from "../../components/Footer.jsx";
import Header from "../../components/Header.jsx";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    answer: "",
  });

  const navigate = useNavigate();

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
      const res = await axios.post("/api/v1/auth/register", formData);
     console.log("res", res)
      if (res && res.data.success) {
        toast.success(res.data && res.data.message);
        navigate("/login");
      } else {
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
            <form onSubmit={handleSubmit} className="border p-4 shadow rounded bg-light">
              <h3 className="mb-4 text-center">Create account</h3>

              <div className="mb-3">
                <label htmlFor="name" className="form-label">Your Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  id="name"
                  placeholder="First and last name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email address</label>
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
                <label htmlFor="password" className="form-label">Password</label>
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

              <div className="mb-3">
                <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                <input
                  type="password"
                  className="form-control"
                  name="confirmPassword"
                  id="confirmPassword"
                  placeholder="Confirm password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="answer" className="form-label">Answer (What is your favorite sport?)</label>
                <input
                  type="text"
                  className="form-control"
                  name="answer"
                  id="answer"
                  placeholder="Your favorite sport"
                  value={formData.answer}
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

              <p className="text-center">
                Already have an account? <a href="/login">Sign in</a>
              </p>
            </form>
          </div>
        </div>
      </div>

   
    </>
  );
};

export default Register;
