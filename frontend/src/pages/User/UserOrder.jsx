import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout.jsx";
import { useAuth } from "../../context/Auth";
import axios from "axios";
import UserMenu from "../../components/extraComponent/UserMenu.jsx";
import moment from "moment";

const UserOrder = () => {
  const [orders, setOrders] = useState([]);
  const [auth, setAuth] = useAuth();
  const getOrders = async () => {
    try {
      const { data } = await axios.get("/api/v1/auth/orders");
      console.log(data);
      setOrders(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (auth?.token) getOrders();
  }, [auth?.token]);
  return (
    <>
      <Layout title={"Your Orders"}>
        <div className="user-wrapper">
          <div className="container">
            <div className=" text-success mt-3  f-right">
              {" "}
              {auth?.user?.name}{" "}
            </div>
            {/* <strong style={{ color: "#ff6200" }}>Profile</strong> */}
          </div>
        </div>

        <div className="container mt-4 p-3 m-3 dashboard">
          <div className="row ">
            <div className="col-md-3 mt-4 ">
              <UserMenu />
            </div>
            <div className="col-md-9">
              <h2 className="text-center">Orders</h2>
              {orders && orders.length > 0 ? (
                orders?.map((o, i) => {
                  return (
                    <>
                      <div className="border shadow">
                        <table className="table">
                          <thead>
                            <tr>
                              <th scope="col">#</th>
                              <th scope="col">Status</th>
                              <th scope="col">Buyer</th>
                              <th scope="col"> date</th>

                              <th scope="col">Quantity</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>{i + 1}</td>
                              <td>{o?.status}</td>
                              <td>{o?.buyer?.name}</td>
                              <td>{moment(o.createdAt).fromNow()}</td>

                              <td>{o?.products?.length}</td>
                            </tr>
                          </tbody>
                        </table>
                        <div className="container ">
                          <div className="d-flex g-5">
                            {o?.products?.map((product) => (
                              <div
                                key={product._id}
                                className="mb-3 p-2 border rounded bg-light align-items-center"
                              >
                                {product?.mainImages?.map(
                                  (picture, imgIndex) => (
                                    <img
                                      key={imgIndex}
                                      src={`${
                                        import.meta.env.VITE_REACT_APP_MAIN_URL
                                      }${picture.img}`}
                                      alt="product"
                                      className="img-fluid mb-2 rounded "
                                      style={{ width: "250px" }}
                                    />
                                  )
                                )}

                                <h5>{product.name}</h5>
                                <p className="mb-1 text-muted">
                                  {product.description}
                                </p>
                                <p className="fw-semibold">
                                  Price: ₹{product.price}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </>
                  );
                })
              ) : (
                <span className="fw-bold"> You've not order yet ! </span>
              )}
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default UserOrder;
