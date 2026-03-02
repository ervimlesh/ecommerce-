import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { useParams, NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import Rating from "../components/extraComponent/Rating.jsx";
import ReviewCard from "../components/extraComponent/ReviewCard.jsx";
import toast from "react-hot-toast";
import Layout from "../components/Layout/Layout.jsx";
import { IoIosShareAlt } from "react-icons/io";
import { GrCheckbox } from "react-icons/gr";
import Slider from "react-slick";
import { addToCart } from "../features/cartSlice.jsx";

const ProductDetails = () => {
  const dispatch = useDispatch();
  const [singleProduct, setSingleProduct] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [mainImg, setMainImg] = useState();
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [id, setId] = useState("");
  const params = useParams();
  const navigate = useNavigate();

  const handleMouseEnter = () => setIsZoomed(true);
  const handleMouseLeave = () => setIsZoomed(false);

  const handleMouseMove = useCallback((e) => {
    const { left, top, width, height } = e.target.getBoundingClientRect();
    const x = ((e.pageX - left - window.scrollX) / width) * 100;
    const y = ((e.pageY - top - window.scrollY) / height) * 100;
    setZoomPos({ x, y });
  }, []);

  useEffect(() => {
    if (params?.slug) getProduct();
  }, [params?.slug]);

  const getProduct = async () => {
    try {
      const { data } = await axios.get(
        `/api/v1/product/get-product/${params.slug}`
      );
      setSingleProduct(data?.product);
      setId(data?.product._id);
      getSimilarProduct(data?.product._id, data?.product.category._id);
    } catch (error) {
      console.log(error);
    }
  };

  const getSimilarProduct = async (pid, cid) => {
    try {
      const { data } = await axios.get(
        `/api/v1/product/related-product/${pid}/${cid}`
      );
      setRelatedProducts(data?.products);
    } catch (error) {
      console.log(error);
    }
  };

  const handleRating = (rate) => setRating(rate);

  const reviewSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put("/api/v1/product/review", {
        rating,
        comment,
        id,
      });
      if (data.success) {
        toast.success("Review submitted successfully");
        setRating(0);
        setComment("");
        getProduct(); // Refresh reviews
      } else {
        toast.error(data?.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const product = Array.isArray(singleProduct)
    ? singleProduct[0]
    : singleProduct;

  var settings = {
    // dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <>
      <Layout>
        <div className="container-fluid mt-4 mb-5" style={{ maxWidth: "1400px" }}>
          <div className="row g-4">
            {/* Left Image Section */}
            <div className="col-12 col-md-6 col-lg-5">
              <div className="d-flex position-sticky top-0 pt-3" style={{ zIndex: 1 }}>
                {/* Thumbnails */}
                <div className="d-flex flex-column gap-2 me-3" style={{ width: "60px", maxHeight: "500px", overflowY: "auto", scrollbarWidth: "none" }}>
                  {product?.mainImages?.map((pic, i) => (
                    <img
                      key={`main-${i}`}
                      src={`${import.meta.env.VITE_REACT_APP_MAIN_URL}${pic.img}`}
                      className={`border rounded p-1 ${mainImg === pic.img ? 'border-primary' : ''}`}
                      style={{ cursor: 'pointer', objectFit: 'contain', width: '100%', height: '60px' }}
                      onClick={() => setMainImg(pic.img)}
                      alt="thumb"
                    />
                  ))}
                  {product?.productPictures?.map((pic, i) => (
                    <img
                      key={`pic-${i}`}
                      src={`${import.meta.env.VITE_REACT_APP_MAIN_URL}${pic.img}`}
                      className={`border rounded p-1 ${mainImg === pic.img ? 'border-primary' : ''}`}
                      style={{ cursor: 'pointer', objectFit: 'contain', width: '100%', height: '60px' }}
                      onClick={() => setMainImg(pic.img)}
                      alt="thumb"
                    />
                  ))}
                </div>
                {/* Main Image */}
                <div
                  className="border rounded d-flex justify-content-center align-items-center flex-grow-1 position-relative bg-white"
                  style={{ height: "500px" }}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  onMouseMove={handleMouseMove}
                >
                  <img
                    src={`${import.meta.env.VITE_REACT_APP_MAIN_URL}${mainImg || product?.mainImages?.[0]?.img}`}
                    alt="Main"
                    style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", padding: "10px" }}
                  />

                  {/* Zoom Preview */}
                  {isZoomed && (
                    <div
                      className="position-absolute bg-white shadow-lg border"
                      style={{
                        width: "150%",
                        height: "150%",
                        left: "102%",
                        top: 0,
                        zIndex: 1000,
                        backgroundImage: `url(${import.meta.env.VITE_REACT_APP_MAIN_URL}${mainImg || product?.mainImages?.[0]?.img})`,
                        backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "200%"
                      }}
                    />
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="d-flex gap-3 mt-4">
                <button
                  className="btn btn-warning py-3 w-50 fw-bold shadow-sm text-dark d-flex align-items-center justify-content-center gap-2"
                  style={{ borderRadius: "30px", backgroundColor: "#ffc200", border: 'none' }}
                  onClick={() => dispatch(addToCart(product)) && navigate("/cart")}
                >
                  <i className="fas fa-shopping-cart fa-lg"></i> Add to Cart
                </button>
                <button
                  className="btn btn-primary py-3 w-50 fw-bold shadow-sm text-white d-flex align-items-center justify-content-center gap-2"
                  style={{ borderRadius: "30px", backgroundColor: "#fb641b", border: "none" }}
                  onClick={() => {
                    dispatch(addToCart(product));
                    navigate("/cart");
                  }}
                >
                  <i className="fas fa-bolt fa-lg"></i> Buy Now
                </button>
              </div>
            </div>

            {/* Right Details Section */}
            <div className="col-12 col-md-6 col-lg-7">
              <div className="ps-lg-3">
                {/* Breadcrumb */}
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb small mb-2">
                    <li className="breadcrumb-item"><NavLink to="/" className="text-decoration-none text-muted">Home</NavLink></li>
                    <li className="breadcrumb-item"><span className="text-muted">{product?.category?.name || "Category"}</span></li>
                    <li className="breadcrumb-item active text-truncate" style={{ maxWidth: "200px" }} aria-current="page">{product?.name}</li>
                  </ol>
                </nav>

                {/* Title */}
                <h4 className="fw-normal mb-2" style={{ lineHeight: 1.4, color: "#0F1111" }}>
                  {product?.name || "REDMI Note 14 SE 5G (Crimson Art, 128 GB) (6 GB RAM)"}
                </h4>

                {/* Ratings */}
                <div className="d-flex align-items-center gap-2 mb-3">
                  <span className="badge bg-success d-flex align-items-center gap-1 px-2 py-1">
                    4.1 <i className="fas fa-star" style={{ fontSize: "10px" }}></i>
                  </span>
                  <span className="text-muted small fw-medium">
                    375 Ratings & 8 Reviews
                  </span>
                </div>

                <div className="p-2 border rounded bg-light d-inline-block mb-3">
                  <div className="d-flex flex-column">
                    <span className="fw-bold m-0" style={{ color: "#333" }}>₹2,500/month</span>
                    <span className="small text-muted mb-0">No Cost EMI Plan <a href="#" className="text-decoration-none ms-1">Details</a></span>
                  </div>
                </div>

                <hr className="my-2" />

                {/* Price */}
                <div className="d-flex align-items-end gap-3 mb-1 mt-3">
                  <h2 className="mb-0 fw-medium" style={{ color: '#B12704' }}>₹{product?.price}</h2>
                  <span className="text-muted text-decoration-line-through mt-1 pb-1">₹19,999</span>
                  <span className="text-success fw-bold pb-1">25% off</span>
                </div>

                <p className="small mb-4">
                  <span className={product?.stock < 1 ? "text-danger fw-bold fs-6" : "text-success fw-bold fs-6"}>
                    {product?.stock < 1 ? "Out of Stock" : "In Stock"}
                  </span>
                </p>

                {/* Offers */}
                <div className="mb-4">
                  <h6 className="fw-bold mb-3">Available Offers</h6>
                  <ul className="list-unstyled small d-flex flex-column gap-3 mb-0">
                    <li className="d-flex align-items-start gap-2">
                      <img src="/mobail/short-emage.webp" alt="tag" width="18" height="18" />
                      <span><span className="fw-bold">Bank Offer</span> 5% Cashback on Flipkart Axis Bank Card <a href="#" className="text-decoration-none fw-medium">T&C</a></span>
                    </li>
                    <li className="d-flex align-items-start gap-2">
                      <img src="/mobail/short-emage.webp" alt="tag" width="18" height="18" />
                      <span><span className="fw-bold">Bank Offer</span> 10% Instant Discount on SBI Credit Card EMI Trxns, up to ₹1000 <a href="#" className="text-decoration-none fw-medium">T&C</a></span>
                    </li>
                    <li className="d-flex align-items-start gap-2">
                      <img src="/mobail/short-emage.webp" alt="tag" width="18" height="18" />
                      <span><span className="fw-bold">Special Price</span> Get extra ₹2000 off (price inclusive of cashback/coupon) <a href="#" className="text-decoration-none fw-medium">T&C</a></span>
                    </li>
                  </ul>
                </div>

                {/* Delivery Box */}
                <div className="border rounded p-3 mb-4 d-flex justify-content-between align-items-center bg-light">
                  <div className="d-flex align-items-start gap-3">
                    <i className="fas fa-map-marker-alt text-muted mt-1"></i>
                    <div>
                      <div className="text-muted small fw-bold">Deliver to <span className="text-dark">New Delhi 110001</span></div>
                      <div className="fw-bold mt-1 text-success">Free Delivery by 9 Aug, Saturday</div>
                      <div className="text-muted small">Order within 2 hrs 30 mins</div>
                    </div>
                  </div>
                  <div>
                    <a href="#" className="text-decoration-none fw-bold small">Change</a>
                  </div>
                </div>

                {/* Highlights & Services */}
                <div className="row mb-4 small mt-4">
                  <div className="col-12 col-xl-6 mb-3 mb-xl-0 border-end pe-xl-4">
                    <h6 className="text-muted fw-bold mb-3">Highlights</h6>
                    <ul className="mb-0 text-muted ps-3" style={{ lineHeight: '1.8' }}>
                      <li>6 GB RAM | 128 GB ROM</li>
                      <li>16.94 cm (6.67 inch) Full HD+ Display</li>
                      <li>50MP + 8MP + 2MP | 20MP Front Camera</li>
                      <li>5110 mAh Battery</li>
                      <li>Dimensity 7025 Ultra Processor</li>
                    </ul>
                  </div>
                  <div className="col-12 col-xl-6 ps-xl-4">
                    <h6 className="text-muted fw-bold mb-3">Services</h6>
                    <ul className="list-unstyled mb-0 d-flex flex-column gap-3 text-muted">
                      <li className="d-flex align-items-center gap-2"><i className="fas fa-shield-alt text-primary fa-lg"></i> 1 Year Warranty on Handset</li>
                      <li className="d-flex align-items-center gap-2"><i className="fas fa-undo text-primary fa-lg"></i> 7 Days Replacement Policy</li>
                      <li className="d-flex align-items-center gap-2"><i className="fas fa-money-bill-wave text-primary fa-lg"></i> Cash on Delivery available</li>
                    </ul>
                  </div>
                </div>

                {/* Seller Info */}
                <div className="d-flex align-items-center gap-2 mb-4">
                  <span className="text-muted fw-bold small">Sold by: </span>
                  <a href="#" className="text-primary text-decoration-none fw-bold">MYTHANGLORYRetail</a>
                  <span className="badge bg-primary rounded-pill">4.3</span>
                </div>

                {/* Description Section */}
                <div className="border border-start-0 border-end-0 py-4 mb-4">
                  <h4 className="fw-bold mb-4">Product Description</h4>
                  <div className="row gx-4 align-items-center mb-4 pb-3 border-bottom">
                    <div className="col-12 col-md-4 text-center">
                      <img src="../public/mobail/mobail.webp" alt="desc" className="img-fluid rounded" style={{ maxHeight: '200px' }} />
                    </div>
                    <div className="col-12 col-md-8 d-flex flex-column justify-content-center mt-3 mt-md-0">
                      <h5 className="fw-bold mb-2">Bold Hue Crimson Red</h5>
                      <p className="text-muted mb-0" style={{ lineHeight: '1.6' }}>
                        A colour that doesn’t just catch the eye, it holds it, a striking new shade of the Redmi Note 14 SE 5G, designed to stand out.
                      </p>
                    </div>
                  </div>
                  <div className="row gx-4 align-items-center flex-row-reverse">
                    <div className="col-12 col-md-4 text-center">
                      <img src="../public/mobail/mobail.webp" alt="desc2" className="img-fluid rounded" style={{ maxHeight: '200px' }} />
                    </div>
                    <div className="col-12 col-md-8 d-flex flex-column justify-content-center mt-3 mt-md-0">
                      <h5 className="fw-bold mb-2">3 Distinct Shades</h5>
                      <p className="text-muted mb-0" style={{ lineHeight: '1.6' }}>
                        Introducing three stunning new colors that enhance its impressive design. These distinct shades offer killer looks that will significantly appeal to users.
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Carousel sliders */}
          <div className="col-12 mt-5 border p-3 py-4 rounded bg-white shadow-sm">
            <div className="d-flex justify-content-between align-items-center mb-3 px-3">
              <h4 className="fw-bold m-0">Frequently Bought Together</h4>
            </div>
            <div className="px-3" style={{ overflow: "hidden" }}>
              <Slider {...settings}>
                <div className="px-2">
                  <img src="../public/mobail/mobails2.webp" alt="" className="img-fluid rounded border w-100" style={{ height: "200px", objectFit: "contain" }} />
                </div>
                <div className="px-2">
                  <img src="../public/mobail/mobails1.webp" alt="" className="img-fluid rounded border w-100" style={{ height: "200px", objectFit: "contain" }} />
                </div>
                <div className="px-2">
                  <img src="../public/mobail/mobails3.webp" alt="" className="img-fluid rounded border w-100" style={{ height: "200px", objectFit: "contain" }} />
                </div>
                <div className="px-2">
                  <img src="../public/mobail/mobails4.webp" alt="" className="img-fluid rounded border w-100" style={{ height: "200px", objectFit: "contain" }} />
                </div>
                <div className="px-2">
                  <img src="../public/mobail/mobails5.webp" alt="" className="img-fluid rounded border w-100" style={{ height: "200px", objectFit: "contain" }} />
                </div>
                <div className="px-2">
                  <img src="../public/slider/slid1.webp" alt="" className="img-fluid rounded border w-100" style={{ height: "200px", objectFit: "contain" }} />
                </div>
                <div className="px-2">
                  <img src="../public/slider/slid3.webp" alt="" className="img-fluid rounded border w-100" style={{ height: "200px", objectFit: "contain" }} />
                </div>
              </Slider>
            </div>
          </div>

          {/* Related Products Section */}
          <div className="mt-5">
            <h4 className="border-bottom pb-3 fw-bold mb-4">Related Products</h4>
            <div className={`row g-3 ${relatedProducts?.length === 0 ? 'd-none' : ''}`}>
              {relatedProducts?.map((p) => (
                <div className="col-6 col-md-4 col-lg-3 col-xl-2" key={p._id}>
                  <div className="card h-100 shadow-sm border p-2 bg-white rounded-3 transition-hover">
                    <img
                      src={`${import.meta.env.VITE_REACT_APP_MAIN_URL}${p?.mainImages?.[0]?.img}`}
                      className="card-img-top mx-auto p-2"
                      alt={p.name}
                      style={{ height: "150px", objectFit: "contain", cursor: "pointer" }}
                      onClick={() => navigate(`/product/${p.slug}`)}
                    />
                    <div className="card-body d-flex flex-column p-2 pt-3">
                      <h6 className="card-title fs-6 lh-sm mb-2" style={{ cursor: "pointer", display: "-webkit-box", WebkitLineClamp: "2", WebkitBoxOrient: "vertical", overflow: "hidden" }} onClick={() => navigate(`/product/${p.slug}`)}>
                        {p.name}
                      </h6>
                      <div className="mt-auto">
                        <p className="card-text fw-bold fs-5 mb-0" style={{ color: "#B12704" }}>₹{p.price}</p>
                        <p className="text-success small fw-bold mb-2">Free Delivery</p>
                        <button
                          className="btn btn-warning btn-sm w-100 rounded-pill fw-medium text-dark"
                          onClick={() => dispatch(addToCart(p))}
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {relatedProducts?.length === 0 && (
              <p className="text-muted mt-2">No related products found at the moment.</p>
            )}
          </div>

          {/* Reviews Section */}
          <div className="mt-5 border p-4 p-md-5 rounded bg-white shadow-sm">
            <div className="row">
              <div className="col-12 col-md-4 border-end pe-md-4 mb-4 mb-md-0">
                <h4 className="fw-bold mb-4">Customer Reviews</h4>
                <div className="d-flex align-items-center gap-2 mb-3">
                  <h1 className="display-4 fw-bold m-0">4.1</h1>
                  <span className="text-warning fs-3">★★★★☆</span>
                </div>
                <p className="text-muted">Based on 375 ratings and 8 reviews</p>
                <hr className="my-4" />
                <h6 className="fw-bold mb-3">Review this product</h6>
                <p className="text-muted small mb-3">Share your thoughts with other customers</p>
                <button
                  type="button"
                  className="btn btn-outline-dark w-100 rounded-pill py-2"
                  data-bs-toggle="modal"
                  data-bs-target="#reviewModal"
                >
                  Write a product review
                </button>
              </div>

              <div className="col-12 col-md-8 ps-md-5">
                <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2">
                  <h6 className="fw-bold m-0 text-muted">Most Recent Reviews</h6>
                </div>
                {product?.reviews?.length ? (
                  <div className="row g-4">
                    {product.reviews.map((review) => (
                      <div className="col-12" key={review._id}>
                        <ReviewCard review={review} />
                        <hr className="mt-4 border-light" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-muted p-5 bg-light rounded border-dashed">
                    <i className="far fa-comment-dots fa-3x mb-3 text-secondary opacity-50"></i>
                    <p className="mb-0">No Reviews Yet. Be the first to review this product!</p>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>

        {/* Modal */}
        <div
          className="modal fade"
          id="reviewModal"
          tabIndex="-1"
          aria-labelledby="reviewModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered">
            <form onSubmit={reviewSubmitHandler} className="modal-content border-0 shadow-lg">
              <div className="modal-header bg-light border-bottom-0">
                <h5 className="modal-title fw-bold" id="reviewModalLabel">
                  Submit Your Review
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                />
              </div>
              <div className="modal-body p-4">
                <div className="mb-4">
                  <label className="form-label fw-bold">Overall Rating</label>
                  <div className="fs-4">
                    <Rating
                      totalStars={5}
                      initialRating={rating}
                      onRate={handleRating}
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-bold">Add a written review</label>
                  <textarea
                    className="form-control bg-light border-0"
                    rows="4"
                    value={comment}
                    placeholder="What did you like or dislike? What did you use this product for?"
                    onChange={(e) => setComment(e.target.value)}
                    required
                    style={{ resize: "none" }}
                  />
                </div>
              </div>
              <div className="modal-footer border-top-0 d-flex gap-2 p-4 pt-0">
                <button
                  type="button"
                  className="btn btn-light rounded-pill px-4"
                  data-bs-dismiss="modal"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-warning rounded-pill px-4 fw-medium"
                  data-bs-dismiss="modal"
                >
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default ProductDetails;
