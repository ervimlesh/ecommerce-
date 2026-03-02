import React, { useEffect, useState } from "react";
import { useAuth } from "../../../context/Auth.jsx";
import axios from "axios";
import AdminSidebar from "../../../components/AdminSidebar.jsx";
import { useNavigate } from "react-router-dom";

const AdminOrder = () => {
  const [auth, setAuth] = useAuth();
  const [statusOptions, setStatusOptions] = useState([
    "Not Process",
    "Processing",
    "Shipped",
    "Delivered",
    "Cancel",
  ]);
  const [orders, setOrders] = useState([]);

  const navigate = useNavigate();

  const getOrders = async () => {
    try {
      const { data } = await axios.get("/api/v1/auth/all-orders");
      console.log("order is ", data);
      setOrders(data);
    } catch (error) {
      console.log(error);
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  useEffect(() => {
    if (auth?.token) getOrders();
  }, [auth?.token]);

  const handleChange = async (orderId, value) => {
    try {
      await axios.put(`/api/v1/auth/order-status/${orderId}`, {
        status: value,
      });
      getOrders();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="d-flex">
      <div className="col-md-3">
        <AdminSidebar />
      </div>

      <div className="col-md-9 p-4">
        <h2 className="text-center mb-4">All Orders</h2>

        {orders?.map((order, i) => (
          <div
            className="border rounded mb-4 p-3 shadow-sm bg-white"
            key={order._id}
          >
            <table className="table table-bordered">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>Status</th>
                  <th>Buyer</th>
                  <th>Date</th>

                  <th>Quantity</th>
                  <th> View Invoice</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{i + 1}</td>
                  <td>
                    <select
                      className="form-select"
                      value={order.status}
                      onChange={(e) => handleChange(order._id, e.target.value)}
                    >
                      {statusOptions.map((status, index) => (
                        <option key={index} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>{order?.buyer?.name}</td>
                  <td>{formatDate(order.createdAt)}</td>

                  <td>{order?.products?.length}</td>
                  <td>
                    <button
                      className="btn btn-primary"
                      onClick={() =>
                        navigate(`/dashboard/admin/invoice/${order._id}`)
                      }
                    >
                      View Invoice
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>

            <div className="container ">
              <div className="d-flex g-5">
                {order?.products?.map((product) => (
                  <div
                    key={product._id}
                    className="mb-3 p-2 border rounded bg-light align-items-center"
                  >
                    {product?.mainImages?.map((picture, imgIndex) => (
                      <img
                        key={imgIndex}
                        src={`${import.meta.env.VITE_REACT_APP_MAIN_URL}${
                          picture.img
                        }`}
                        alt="product"
                        className="img-fluid mb-2 rounded "
                        style={{ width: "250px" }}
                      />
                    ))}

                    <h5>{product.name}</h5>
                    <p className="mb-1 text-muted">{product.description}</p>
                    <p className="fw-semibold">Price: ₹{product.price}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminOrder;
