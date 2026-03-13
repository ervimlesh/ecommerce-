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

      <div className="container-fluid py-4" style={{ backgroundColor: "#f1f3f6", minHeight: "80vh" }}>
        <div className="container" style={{ maxWidth: "1200px" }}>
          <h3 className="text-center mb-4" style={{ fontWeight: "500", color: "#212121" }}>Shipping & Payment</h3>
          <div className="row g-4 d-flex flex-column-reverse flex-md-row">
            <div className="col-md-8">
              {/* Shipping Details Card */}
              <div className="card border-0 mb-4" style={{ borderRadius: "2px", boxShadow: "0 1px 2px 0 rgba(0,0,0,0.1)" }}>
                <div className="card-header bg-white text-center fw-bold py-3" style={{ borderBottom: "1px solid #f0f0f0", fontSize: "16px", color: "#212121" }}>
                  Shipping Details
                </div>
                <div className="card-body p-4 bg-white" style={{ borderRadius: "0 0 2px 2px" }}>
                  <form className="row g-4">
                    <div className="col-md-6 col-12">
                      <label className="form-label" style={{ fontSize: "14px", color: "#212121" }}>First Name *</label>
                      <input
                        type="text"
                        className="form-control border-0 shadow-none px-3"
                        style={{ backgroundColor: "#f1f3f6", borderRadius: "4px", padding: "12px 16px", outline: "none", height: "48px" }}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="col-md-6 col-12">
                      <label className="form-label" style={{ fontSize: "14px", color: "#212121" }}>Last Name *</label>
                      <input
                        type="text"
                        className="form-control border-0 shadow-none px-3"
                        style={{ backgroundColor: "#f1f3f6", borderRadius: "4px", padding: "12px 16px", outline: "none", height: "48px" }}
                        value={lname}
                        onChange={(e) => setLname(e.target.value)}
                        required
                      />
                    </div>
                    <div className="col-md-6 col-12">
                      <label className="form-label" style={{ fontSize: "14px", color: "#212121" }}>Email *</label>
                      <input
                        type="email"
                        className="form-control border-0 shadow-none px-3"
                        style={{ backgroundColor: "#f1f3f6", borderRadius: "4px", padding: "12px 16px", outline: "none", height: "48px" }}
                        value={userEmail}
                        onChange={(e) => setUserMail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="col-md-6 col-12">
                      <label className="form-label" style={{ fontSize: "14px", color: "#212121" }}>Country *</label>
                      <input
                        type="text"
                        className="form-control border-0 shadow-none px-3"
                        style={{ backgroundColor: "#f1f3f6", borderRadius: "4px", padding: "12px 16px", outline: "none", height: "48px" }}
                        value={country}
                        onChange={(e) => setCountery(e.target.value)}
                        required
                      />
                    </div>
                    <div className="col-md-6 col-12">
                      <label className="form-label" style={{ fontSize: "14px", color: "#212121" }}>State/Province *</label>
                      <input
                        type="text"
                        className="form-control border-0 shadow-none px-3"
                        style={{ backgroundColor: "#f1f3f6", borderRadius: "4px", padding: "12px 16px", outline: "none", height: "48px" }}
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        required
                      />
                    </div>
                    <div className="col-md-6 col-12">
                      <label className="form-label" style={{ fontSize: "14px", color: "#212121" }}>City *</label>
                      <input
                        type="text"
                        className="form-control border-0 shadow-none px-3"
                        style={{ backgroundColor: "#f1f3f6", borderRadius: "4px", padding: "12px 16px", outline: "none", height: "48px" }}
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        required
                      />
                    </div>
                    <div className="col-md-6 col-12">
                      <label className="form-label" style={{ fontSize: "14px", color: "#212121" }}>Postal Code *</label>
                      <input
                        type="text"
                        className="form-control border-0 shadow-none px-3"
                        style={{ backgroundColor: "#f1f3f6", borderRadius: "4px", padding: "12px 16px", outline: "none", height: "48px" }}
                        value={pinCode}
                        onChange={(e) => setPinCode(e.target.value)}
                        required
                      />
                    </div>
                    <div className="col-md-6 col-12">
                      <label className="form-label" style={{ fontSize: "14px", color: "#212121" }}>Phone Number *</label>
                      <input
                        type="text"
                        className="form-control border-0 shadow-none px-3"
                        style={{ backgroundColor: "#f1f3f6", borderRadius: "4px", padding: "12px 16px", outline: "none", height: "48px" }}
                        value={number}
                        onChange={(e) => setNumber(e.target.value)}
                        required
                      />
                    </div>
                  </form>
                </div>
              </div>

              {/* Payment Card */}
              <div className="card border-0" style={{ borderRadius: "2px", boxShadow: "0 1px 2px 0 rgba(0,0,0,0.1)" }}>
                <div className="card-header bg-white text-center fw-bold py-3" style={{ borderBottom: "1px solid #f0f0f0", fontSize: "16px", color: "#212121" }}>
                  Payment
                </div>
                <div className="card-body p-4 text-center bg-white" style={{ borderRadius: "0 0 2px 2px" }}>
                  {!auth?.token || !cart?.length ? (
                    <p className="text-muted mb-0" style={{ fontSize: "14px" }}>
                      Login and add products to cart to proceed.
                    </p>
                  ) : (
                    <button
                      className="btn w-100 fw-bold py-3 border-0 shadow-none"
                      style={{ backgroundColor: "#fb641b", color: "#fff", borderRadius: "2px", fontSize: "16px", textTransform: "uppercase", boxShadow: "0 1px 2px 0 rgba(0,0,0,0.2)" }}
                      onClick={handleRazorpayPayment}
                      disabled={loading}
                    >
                      {loading ? "Processing..." : `Pay ₹${totalPrice}`}
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="col-md-4">
              {/* Order Summary Card */}
              <div className="card border-0 sticky-md-top" style={{ borderRadius: "2px", boxShadow: "0 1px 2px 0 rgba(0,0,0,0.1)", top: "20px" }}>
                <div className="card-header bg-white text-center fw-bold py-3" style={{ borderBottom: "1px solid #f0f0f0", fontSize: "16px", color: "#212121" }}>
                  Order Summary
                </div>
                <div className="card-body p-4 bg-white" style={{ borderRadius: "0 0 2px 2px" }}>
                  <div className="d-flex justify-content-between mb-3" style={{ fontSize: "14px", color: "#212121" }}>
                    <span>Total Items:</span> <span>{totalQuantity}</span>
                  </div>
                  <div className="d-flex justify-content-between fw-bold pt-3" style={{ fontSize: "16px", color: "#212121", borderTop: "1px dashed #e0e0e0" }}>
                    <span>Total Price:</span> <span>₹{totalPrice}</span>
                  </div>
                  <div className="mt-4 text-center">
                     <img src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/payment-method_69e7ec.svg" alt="Payment Methods" className="img-fluid opacity-75" style={{ maxWidth: "200px" }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout></div>
    
  );
};

export default Shipping;
