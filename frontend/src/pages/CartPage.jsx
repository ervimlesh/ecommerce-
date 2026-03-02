import React, { useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  removeItem,
  decreaseItemQuantity,
  increaseItemQuantity,
  getCartTotal,
} from "../features/cartSlice";
import { GoPlus } from "react-icons/go";
import { HiMinusSmall } from "react-icons/hi2";
import { FaRegTrashAlt, FaStar } from "react-icons/fa";
import Layout from "../components/Layout/Layout";

const CartPage = () => {
  const { cart, totalQuantity, totalPrice } = useSelector(
    (state) => state.allCart
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getCartTotal());
  }, [cart, dispatch]);

  // Dummy products to satisfy the "product card...rating...add to cart" Flipkart UI requirement on this page
  const recommendedProducts = [
    {
      _id: "rec1",
      name: "Apple iPhone 15 (Blue, 128 GB)",
      price: 65999,
      originalPrice: 79900,
      image: "https://rukminim2.flixcart.com/image/312/312/xif0q/mobile/k/l/l/-original-imagtc5fz9spysyn.jpeg?q=70",
      rating: 4.6,
      reviews: "1,245",
    },
    {
      _id: "rec2",
      name: "SAMSUNG Galaxy S24 Ultra 5G (Titanium Gray, 256 GB)",
      price: 129999,
      originalPrice: 134999,
      image: "https://rukminim2.flixcart.com/image/312/312/xif0q/mobile/5/q/5/-original-imagxhd5zhf9tuzx.jpeg?q=70",
      rating: 4.8,
      reviews: "3,822",
    },
    {
      _id: "rec3",
      name: "SONY WH-1000XM5 Bluetooth Headset",
      price: 29990,
      originalPrice: 34990,
      image: "https://rukminim2.flixcart.com/image/612/612/xif0q/headphone/j/t/c/-original-imagg5vygqgmxj4e.jpeg?q=70",
      rating: 4.5,
      reviews: "890",
    },
    {
      _id: "rec4",
      name: "Fastrack Revoltt FS1 Pro Smartwatch",
      price: 1499,
      originalPrice: 3995,
      image: "https://rukminim2.flixcart.com/image/612/612/xif0q/smartwatch/c/s/m/-original-imagxp8umxhnmbz4.jpeg?q=70",
      rating: 4.2,
      reviews: "12,450",
    },
  ];

  const discount = Math.round(totalPrice * 0.15); // Simulated 15% discount for Flipkart UI mapping
  const originalTotalPrice = totalPrice + discount;

  return (
    <Layout>
      <div className="bg-light pt-4 pb-5" style={{ minHeight: "100vh" }}>
        <div className="container" style={{ maxWidth: "1200px" }}>
          <div className="row g-4">

            {/* Left Column: Cart Items */}
            <div className="col-lg-8">
              {/* Deliver To Section */}
              <div className="card shadow-sm border-0 mb-3 rounded-0 px-4 py-3 d-flex flex-row justify-content-between align-items-center">
                <div>
                  <span className="fw-semibold" style={{ fontSize: "16px" }}>Deliver to: </span>
                  <span className="fw-bold fs-6">Delhi - 110001</span>
                </div>
                <button className="btn btn-outline-primary btn-sm px-4 fw-bold shadow-none rounded-0">Change</button>
              </div>

              {/* Cart Items List */}
              <div className="card shadow-sm border-0 rounded-0">
                <div className="card-header bg-white py-3 border-bottom d-flex align-items-center">
                  <h4 className="mb-0 fs-5 fw-bold">Flipkart ( {totalQuantity} )</h4>
                </div>
                <div className="card-body p-0">
                  {cart.length === 0 ? (
                    <div className="text-center py-5">
                      <img src="https://rukminim2.flixcart.com/www/800/800/promos/16/05/2019/d438a32e-765a-4d8b-b4a6-520b560971e8.png?q=90" alt="Empty Cart" style={{ width: "200px" }} />
                      <h5 className="mt-4 fw-bold">Your cart is empty!</h5>
                      <p className="text-muted">Add items to it now.</p>
                      <NavLink to="/" className="btn btn-primary px-5 py-2 shadow-none rounded-0" style={{ backgroundColor: "#2874f0" }}>Shop Now</NavLink>
                    </div>
                  ) : (
                    cart.map((item) => {
                      const itemOriginalPrice = Math.round(item.price * 1.2);
                      const discountPercentage = Math.round(((itemOriginalPrice - item.price) / itemOriginalPrice) * 100);

                      return (
                        <div className="p-4 border-bottom" key={item._id}>
                          <div className="row">
                            <div className="col-4 col-md-2 text-center">
                              {/* Product Image */}
                              {item?.mainImages?.[0] ? (
                                <div style={{ height: "100px", display: "flex", justifyContent: "center", alignItems: "center" }}>
                                  <img
                                    src={`${import.meta.env.VITE_REACT_APP_MAIN_URL}${item.mainImages[0].img}`}
                                    className="img-fluid"
                                    alt={item.name}
                                    style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain" }}
                                  />
                                </div>
                              ) : (
                                <div style={{ height: "100px", backgroundColor: "#f0f0f0" }} className="w-100 d-flex align-items-center justify-content-center text-muted small">No Image</div>
                              )}

                              {/* Quantity Controls Mobile */}
                              <div className="d-flex align-items-center justify-content-center gap-2 mt-3 d-md-none">
                                <button className="btn btn-light btn-sm border rounded-circle shadow-none p-1 d-flex align-items-center justify-content-center" style={{ width: "28px", height: "28px" }} onClick={item.quantity <= 1 ? undefined : () => dispatch(decreaseItemQuantity(item._id))} disabled={item.quantity <= 1}>
                                  <HiMinusSmall size={16} />
                                </button>
                                <div className="border bg-white text-center" style={{ width: "40px", height: "28px", lineHeight: "26px", fontSize: "14px", fontWeight: "500" }}>{item.quantity}</div>
                                <button className="btn btn-light btn-sm border rounded-circle shadow-none p-1 d-flex align-items-center justify-content-center" style={{ width: "28px", height: "28px" }} onClick={() => dispatch(increaseItemQuantity(item._id))}>
                                  <GoPlus size={16} />
                                </button>
                              </div>
                            </div>

                            <div className="col-8 col-md-10">
                              <h6 className="card-title text-truncate fw-normal fs-6 mb-1">{item.name}</h6>
                              <p className="text-secondary small mb-2 d-flex align-items-center">Seller: RetailNet <img src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/fa_62673a.png" alt="FA" className="ms-2" style={{ height: "15px" }} /></p>

                              <div className="d-flex align-items-baseline gap-2 mb-3">
                                <span className="text-muted text-decoration-line-through small">₹{itemOriginalPrice.toLocaleString('en-IN')}</span>
                                <span className="fw-bold fs-5">₹{item.price.toLocaleString('en-IN')}</span>
                                <span className="text-success fw-bold small">{discountPercentage}% Off</span>
                              </div>

                              {/* Desktop Actions */}
                              <div className="d-none d-md-flex align-items-center gap-4 mt-4">
                                {/* Desktop Quantity */}
                                <div className="d-flex align-items-center gap-2 me-4">
                                  <button className="btn btn-light btn-sm border rounded-circle shadow-none p-0 d-flex align-items-center justify-content-center" style={{ width: "28px", height: "28px", backgroundColor: "#fff" }} onClick={item.quantity <= 1 ? undefined : () => dispatch(decreaseItemQuantity(item._id))} disabled={item.quantity <= 1}>
                                    <HiMinusSmall size={16} />
                                  </button>
                                  <div className="border bg-white px-3 text-center" style={{ height: "28px", lineHeight: "26px", fontSize: "14px", fontWeight: "500" }}>{item.quantity}</div>
                                  <button className="btn btn-light btn-sm border rounded-circle shadow-none p-0 d-flex align-items-center justify-content-center" style={{ width: "28px", height: "28px", backgroundColor: "#fff" }} onClick={() => dispatch(increaseItemQuantity(item._id))}>
                                    <GoPlus size={16} />
                                  </button>
                                </div>
                                <span className="text-uppercase fw-semibold" style={{ cursor: "pointer", fontSize: "15px" }}>Save for later</span>
                                <span className="text-uppercase fw-semibold" style={{ cursor: "pointer", fontSize: "15px" }} onClick={() => dispatch(removeItem(item._id))}>Remove</span>
                              </div>
                            </div>
                          </div>

                          {/* Mobile Actions */}
                          <div className="row mt-3 border-top pt-3 d-md-none text-center">
                            <div className="col-6 border-end">
                              <span className="text-secondary fw-semibold" style={{ fontSize: "14px", cursor: "pointer" }}>Save for later</span>
                            </div>
                            <div className="col-6">
                              <span className="text-secondary fw-semibold" style={{ fontSize: "14px", cursor: "pointer" }} onClick={() => dispatch(removeItem(item._id))}>Remove</span>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                  {cart.length > 0 && (
                    <div className="p-3 bg-white d-flex justify-content-end align-items-center card-footer border-0" style={{ position: "sticky", bottom: 0, zIndex: 10, boxShadow: "0 -2px 10px rgba(0,0,0,0.1)" }}>
                      <NavLink to="/shipping" className="btn btn-warning px-5 py-3 fw-bold shadow-none rounded-1" style={{ backgroundColor: "#fb641b", color: "#fff", border: "none", fontSize: "16px" }}>
                        PLACE ORDER
                      </NavLink>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Price Details */}
            {cart.length > 0 && (
              <div className="col-lg-4">
                <div className="card shadow-sm border-0 rounded-0" style={{ position: "sticky", top: "20px" }}>
                  <div className="card-header bg-white py-3 border-bottom-0">
                    <h5 className="fs-6 fw-bold text-secondary text-uppercase mb-0">Price Details</h5>
                  </div>
                  <div className="card-body pt-0">
                    <ul className="list-group list-group-flush mb-3">
                      <li className="list-group-item d-flex justify-content-between align-items-center px-0 border-0 fs-6">
                        Price ({totalQuantity} items)
                        <span>₹{originalTotalPrice.toLocaleString('en-IN')}</span>
                      </li>
                      <li className="list-group-item d-flex justify-content-between align-items-center px-0 border-0 fs-6">
                        Discount
                        <span className="text-success">- ₹{discount.toLocaleString('en-IN')}</span>
                      </li>
                      <li className="list-group-item d-flex justify-content-between align-items-center px-0 border-0 fs-6">
                        Delivery Charges
                        <span className="text-success">
                          <span className="text-decoration-line-through text-muted me-2">₹40</span>
                          Free
                        </span>
                      </li>
                      <li className="list-group-item d-flex justify-content-between align-items-center px-0 fw-bold fs-5 mt-3 py-3" style={{ borderTop: "1px dashed #e0e0e0", borderBottom: "1px dashed #e0e0e0", borderLeft: "none", borderRight: "none" }}>
                        Total Amount
                        <span>₹{totalPrice.toLocaleString('en-IN')}</span>
                      </li>
                    </ul>
                    <p className="text-success fw-semibold mb-0 py-2 fs-6">
                      You will save ₹{(discount + 40).toLocaleString('en-IN')} on this order
                    </p>
                  </div>
                </div>

                {/* Security Tag */}
                <div className="mt-4 px-3 d-flex align-items-center text-secondary">
                  <svg width="29" height="36" viewBox="0 0 29 36" xmlns="http://www.w3.org/2000/svg" className="me-3">
                    <path fill="#878787" d="M14.5 0C6.492 0 0 6.492 0 14.5c0 8.008 6.492 14.5 14.5 14.5 8.008 0 14.5-6.492 14.5-14.5C29 6.492 22.508 0 14.5 0zm6.983 10.748L11.755 20.476c-.237.237-.623.237-.86 0l-4.364-4.363c-.238-.238-.238-.624 0-.862l1.643-1.642c.238-.238.623-.238.86 0l2.292 2.29 8.214-8.213c.237-.237.623-.237.86 0l1.643 1.64c.237.238.237.624 0 .862z" />
                  </svg>
                  <span style={{ fontSize: "13px", fontWeight: "500", color: "#878787" }}>
                    Safe and Secure Payments.Easy returns.100% Authentic products.
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Flipkart-Style Product Highlights / Recommend Section */}
          <div className="card shadow-sm border-0 rounded-0 mt-4 p-4 text-start">
            <h4 className="fw-bold fs-5 mb-4">You May Also Like</h4>
            <div className="row g-3">
              {recommendedProducts.map((product) => (
                <div className="col-6 col-md-4 col-lg-3" key={product._id}>
                  <div className="card border h-100 product-card-hover rounded-0" style={{ transition: "box-shadow 0.3s ease", cursor: "pointer" }}>
                    <div className="position-relative p-4 d-flex justify-content-center" style={{ height: "180px" }}>
                      <img src={product.image} className="img-fluid" alt={product.name} style={{ maxHeight: "100%", objectFit: "contain" }} />
                      <div className="position-absolute text-danger p-1 border rounded-circle bg-white shadow-sm d-flex align-items-center justify-content-center" style={{ top: "10px", right: "10px", width: "30px", height: "30px", fontSize: "12px", cursor: "pointer" }}>
                        🤍
                      </div>
                    </div>
                    <div className="card-body pt-0 d-flex flex-column">
                      <h6 className="card-title fw-normal fs-6 mb-1" style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", textOverflow: "ellipsis" }} title={product.name}>{product.name}</h6>
                      <div className="d-flex align-items-center gap-2 mb-2">
                        <span className="badge bg-success d-flex align-items-center gap-1" style={{ fontSize: "12px", padding: "3px 6px" }}>
                          {product.rating} <FaStar size={10} />
                        </span>
                        <span className="text-secondary small">({product.reviews})</span>
                        <img src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/fa_62673a.png" alt="FA" style={{ height: "15px", marginLeft: "auto" }} />
                      </div>
                      <div className="d-flex align-items-baseline gap-2 mt-auto">
                        <span className="fw-bold fs-5">₹{product.price.toLocaleString('en-IN')}</span>
                        <span className="text-muted text-decoration-line-through small d-none d-sm-inline">₹{product.originalPrice.toLocaleString('en-IN')}</span>
                        <span className="text-success fw-bold small">{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% off</span>
                      </div>
                      <button className="btn btn-warning w-100 mt-3 shadow-none fw-bold" style={{ backgroundColor: "#ff9f00", borderColor: "#ff9f00", color: "#fff", borderRadius: "2px" }}>
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <style>{`
        .product-card-hover:hover {
          box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
        }
      `}</style>
    </Layout>
  );
};

export default CartPage;

