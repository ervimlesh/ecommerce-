import React, { useEffect, useState } from "react";

import toast from "react-hot-toast";
import axios from "axios";
import Layout from "../../components/Layout/Layout.jsx";
import UserMenu from "../../components/extraComponent/UserMenu.jsx";
import { useAuth } from "../../context/Auth.jsx";
const UserProfile = () => {
  //context
  const [auth, setAuth] = useAuth();
  //state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  //get user data
  useEffect(() => {
    const { name, email } = auth?.user;
    setName(name);
    setEmail(email);
  }, [auth?.user]);

  //form function
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put("/api/v1/auth/profile", {
        name,
        email,
        password,
      });
      if (data?.error) {
        toast.error(data?.error);
      } else {
        setAuth({ ...auth, user: data?.updatedUser });
        let ls = localStorage.getItem("auth");
        ls = JSON.parse(ls);
        ls.user = data.updatedUser;
        localStorage.setItem("auth", JSON.stringify(ls));
        toast.success("Profile updated successfully");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <>
      <Layout title={"Your Profile"}>
      <div className="user-wrapper">
          <div className="container">
            <h5 className="text-center">{auth?.user?.name} </h5>
            <strong style={{ color: "#ff6200" }}>Profile</strong>
          </div>
        </div>

        <div className="container mt-5 m-3 p-3 dashboard">
          <div className="row mt-5">
            <div className="col-md-3">
              <UserMenu/>
            </div>
            <div className="col-md-8">
              <div className="form-container">
                <form onSubmit={handleSubmit}>
                  <h3 className="title text-center">USER PROFILE</h3>
                  <div className="mb-3">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="form-control"
                      id="exampleInputEmail1"
                      placeholder="Enter Your Name"
                      autoFocus
                    />
                  </div>
                  <div className="mb-3">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="form-control"
                      id="exampleInputEmail1"
                      placeholder="Enter Your Email "
                      disabled
                    />
                  </div>
                  <div className="mb-3">
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="form-control"
                      id="exampleInputPassword1"
                      placeholder="Enter Your Password"
                    />
                  </div>

                  <button type="submit" className="btn btn-primary">
                    UPDATE
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default UserProfile;
