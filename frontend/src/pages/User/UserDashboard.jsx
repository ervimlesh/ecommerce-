import React from "react";
import { useAuth } from "../../context/Auth";
import Layout from "../../components/Layout/Layout";
import UserMenu from "../../components/extraComponent/UserMenu"; // fixed typo

const UserDashboard = () => {
  const [auth] = useAuth();

  return (
    <Layout>
      <div className="container-fluid py-4">
        <div className="row">
          {/* Sidebar */}
          <div className="col-md-3 mb-3">
            <UserMenu />
          </div>

          {/* Main content */}
          <div className="col-md-9">
            <div className="card shadow-sm border-0">
              <div className="card-body">
                <h2 className="card-title text-center mb-4">
                  Welcome to Your Profile
                </h2>
                <hr />
                <div className="row justify-content-center">
                  <div className="col-md-8">
                    <div className="list-group">
                      <div className="list-group-item d-flex justify-content-between">
                        <strong>Name:</strong>
                        <span>{auth?.user?.name}</span>
                      </div>
                      <div className="list-group-item d-flex justify-content-between">
                        <strong>Email:</strong>
                        <span>{auth?.user?.email}</span>
                      </div>
                      {/* Uncomment if you want to show address */}
                      {/* <div className="list-group-item d-flex justify-content-between">
                        <strong>Address:</strong>
                        <span>{auth?.user?.address}</span>
                      </div> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UserDashboard;
