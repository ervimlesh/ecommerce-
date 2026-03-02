import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import Layout from "../components/Layout/Layout.jsx";
import { useAuth } from "../context/Auth.jsx";
import { getCartTotal } from "../features/cartSlice.jsx";

const Shipping = () => {
  const [auth] = useAuth();
  const [name, setName] = useState("");
  const [lname, setLname] = useState("");
  const [userEmail, setUserMail] = useState("");
  const [country, setCountery] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [pinCode, setPinCode] = useState("");
  const [number, setNumber] = useState("");
  const [loading, setLoading] = useState(false);

  const { cart, totalQuantity, totalPrice } = useSelector(
    (state) => state.allCart
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getCartTotal());
  }, [cart]);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleRazorpayPayment = async () => {
    if (
      !name ||
      !lname ||
      !userEmail ||
      !country ||
      !state ||
      !city ||
     
      !pinCode ||
      !number
    ) {
      toast.error("Please fill all shipping fields.");
      return;
    }

    const res = await loadRazorpayScript();
    if (!res) {
      toast.error("Razorpay SDK failed to load.");
      return;
    }

    setLoading(true);

    try {
      const { data } = await axios.post("/api/v1/product/razorpay/order", {
        amount: totalPrice,
      });

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.order.amount,
        currency: "INR",
        name: `${name} ${lname}`,
        description: "Order Payment",
        order_id: data.order.id,
        handler: async function (response) {
          toast.success("Payment successful!");

          try {
            await axios.post("/api/v1/product/razorpay/save-order", {
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              razorpaySignature: response.razorpay_signature,
              cart,
              buyer: auth?.user?._id,
              shippingInfo: {
                name,
                lname,
                userEmail,
                country,
                state,
                city,
                address,
                pinCode,
                number,
              },
            });

            navigate("/");
          } catch (error) {
            console.error("Error saving order:", error);
            toast.error("Payment succeeded but order not saved.");
          }
        },
        prefill: {
          name: `${name} ${lname}`,
          email: userEmail,
          contact: number,
        },
        notes: {
          address: `${address}, ${city}, ${state}, ${country}, ${pinCode}`,
        },
        theme: {
          color: "#3399cc",
        },
      };

      const razorpayObject = new window.Razorpay(options);
      razorpayObject.open();
    } catch (error) {
      console.log(error);
      toast.error("Payment failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dp"><Layout title="Shipping & Payment">
      <nav className="bg-light py-2">
        <div className="container">
          <ol className="breadcrumb mb-0">
            <li className="breadcrumb-item">
             <h6><NavLink to="/">Home</NavLink></h6> 
            </li>
            <li className="breadcrumb-item">Product</li>
            <li className="breadcrumb-item active">Shipping</li>
          </ol>
        </div>
      </nav>

      <div className="container my-5">
        <h3 className="text-center mb-4">Shipping & Payment</h3>
        <div className="row g-4">
          <div className="col-md-8">
            <div className="card shadow-sm">
              <div className="card-header fw-bold">Shipping Details</div>
              <div className="card-body">
                <form className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">First Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Last Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={lname}
                      onChange={(e) => setLname(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label">Email *</label>
                    <input
                      type="email"
                      className="form-control"
                      value={userEmail}
                      onChange={(e) => setUserMail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Country *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={country}
                      onChange={(e) => setCountery(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">State/Province *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">City *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Postal Code *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={pinCode}
                      onChange={(e) => setPinCode(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label">Phone Number *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={number}
                      onChange={(e) => setNumber(e.target.value)}
                      required
                    />
                  </div>
                </form>
              </div>
            </div>

            <div className="card shadow-sm mt-4 crd">
              <div className="card-header fw-bold">Payment</div>
              <div className="card-body">
                {!auth?.token || !cart?.length ? (
                  <p className="text-dark">
                    Login and add products to cart to proceed.
                  </p>
                ) : (
                  <div className="single">    <button

                    className="btn btn-success
                     w-100 mt-2"
                    onClick={handleRazorpayPayment}
                    disabled={loading}
                  >
                    {loading ? "Processing..." : `Pay ₹${totalPrice}`}
                  </button></div>
              
                )}
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card shadow-sm">
              <div className="card-header fw-bold">Order Summary</div>
              <div className="card-body">
                <p className="d-flex justify-content-between">
                  <span>Total Items:</span> <span>{totalQuantity}</span>
                </p>
                <p className="d-flex justify-content-between fw-bold">
                  <span>Total Price:</span> <span>₹{totalPrice}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout></div>
    
  );
};

export default Shipping;
