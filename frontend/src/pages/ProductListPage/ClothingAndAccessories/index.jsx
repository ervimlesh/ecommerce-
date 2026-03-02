import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../../../features/cartSlice";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import { useProduct } from "../../../context/ProductContext";

const ClothingAndAccessories = () => {
  const { products, getProductsByCategory } = useProduct();

  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [showBrand, setShowBrand] = useState(false);
  const [showSize, setShowSize] = useState(false);
  const [showColor, setShowColor] = useState(false);

  const [filteredProducts, setFilteredProducts] = useState([]);

  const [filters, setFilters] = useState({
    categories: [],
    brands: [],
    sizes: [],
    colors: [],
    price: { min: "", max: "" },
    sortBy: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const getQueryParams = () => {
    const params = new URLSearchParams(location.search);
    return {
      cid: params.get("cid"),
    };
  };

  useEffect(() => {
    const { cid } = getQueryParams();
    if (cid) getProductsByCategory(cid);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  useEffect(() => {
    applyFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, products]);

  const handleCheckboxChange = (e, type) => {
    const value = e.target.value;
    const isChecked = e.target.checked;

    setFilters((prev) => {
      const updatedList = isChecked
        ? [...prev[type], value]
        : prev[type].filter((item) => item !== value);
      return { ...prev, [type]: updatedList };
    });
  };

  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      price: { ...prev.price, [name]: value },
    }));
  };

  const handleSortChange = (e) => {
    setFilters((prev) => ({ ...prev, sortBy: e.target.value }));
  };

  const applyFilters = () => {
    let updated = [...products];

    if (filters.categories.length > 0) {
      updated = updated.filter((product) => {
        const categoryName =
          typeof product.category === "string"
            ? product.category.toLowerCase()
            : product.category?.name?.toLowerCase() || "";
        return filters.categories.includes(categoryName);
      });
    }

    if (filters.brands.length > 0) {
      updated = updated.filter((product) =>
        filters.brands.includes(product.brand)
      );
    }

    if (filters.sizes.length > 0) {
      updated = updated.filter((product) =>
        filters.sizes.includes(product.size)
      );
    }

    if (filters.colors.length > 0) {
      updated = updated.filter((product) => {
        const colorName =
          typeof product.color === "string"
            ? product.color.toLowerCase()
            : product.color?.name?.toLowerCase() || "";
        return filters.colors.includes(colorName);
      });
    }

    if (filters.price.min) {
      updated = updated.filter(
        (product) => Number(product.price) >= Number(filters.price.min)
      );
    }

    if (filters.price.max) {
      updated = updated.filter(
        (product) => Number(product.price) <= Number(filters.price.max)
      );
    }

    if (filters.sortBy === "lowest") {
      updated.sort((a, b) => a.price - b.price);
    } else if (filters.sortBy === "highest") {
      updated.sort((a, b) => b.price - a.price);
    }

    setFilteredProducts(updated);
  };

  const handleClearAllFilters = () => {
    setFilters({
      categories: [],
      brands: [],
      sizes: [],
      colors: [],
      price: { min: "", max: "" },
      sortBy: "",
    });

    const checkboxes = document.querySelectorAll(".form-check-input");
    checkboxes.forEach((checkbox) => (checkbox.checked = false));
  };

  return (
    <div className="container-fluid py-4 bg-light">
      <style>{`
        .product-card {
          transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
        }
        .product-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
        }
        .cursor-pointer {
          cursor: pointer;
        }
        .filter-sidebar {
          top: 20px;
          z-index: 10;
        }
        @media (max-width: 767.98px) {
          .filter-sidebar {
            position: relative;
            top: 0;
            margin-bottom: 20px;
          }
        }
      `}</style>
      <div className="row g-4 align-items-start">
        {/* Sidebar Filter */}
        <div className={`col-lg-3 col-md-4 ${isFilterVisible ? "d-block" : "d-none d-md-block"}`}>
          <div className="card border-0 shadow-sm p-3 sticky-top filter-sidebar">
            {/* Filter Header Banner */}
            <div className="mb-3 text-center border-bottom pb-3">
              <img src="/slider/filter.webp" alt="filter banner" className="img-fluid rounded mb-2" />
              <h6 className="fw-bold mb-1">Crop Tops, Ruching Craze...</h6>
              <p className="text-muted small mb-0">Min. 50% off + Extra 15% off</p>
            </div>

            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="mb-0 fw-bold">Filters</h5>
              <button className="btn btn-link text-decoration-none text-danger p-0" onClick={handleClearAllFilters}>
                Clear All
              </button>
            </div>

            {/* Categories */}
            <div className="mb-4">
              <h6 className="fw-bold mb-2 text-uppercase font-monospace text-muted small">Categories</h6>
              <div className="ps-2">
                {["Topwear", "Shirts", "T-shirts", "Tops"].map((cat, idx) => (
                  <div className="form-check mb-2" key={idx}>
                    <input
                      className="form-check-input shadow-none"
                      type="checkbox"
                      value={cat.toLowerCase()}
                      onChange={(e) => handleCheckboxChange(e, "categories")}
                      id={`cat${idx}`}
                    />
                    <label className="form-check-label text-secondary" htmlFor={`cat${idx}`}>
                      {cat}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <hr className="text-muted my-3 opacity-25" />

            {/* Price */}
            <div className="mb-4">
              <h6 className="fw-bold mb-2 text-uppercase font-monospace text-muted small">Price</h6>
              <div className="d-flex align-items-center gap-2 mt-2">
                <input
                  type="number"
                  name="min"
                  placeholder="Min"
                  className="form-control form-control-sm shadow-none"
                  value={filters.price.min}
                  onChange={handlePriceChange}
                />
                <span className="text-muted small">to</span>
                <input
                  type="number"
                  name="max"
                  placeholder="Max"
                  className="form-control form-control-sm shadow-none"
                  value={filters.price.max}
                  onChange={handlePriceChange}
                />
              </div>
            </div>

            <hr className="text-muted my-3 opacity-25" />

            {/* Brand Dropdown */}
            <div className="mb-3">
              <div
                className="d-flex justify-content-between align-items-center cursor-pointer"
                onClick={() => setShowBrand(!showBrand)}
              >
                <h6 className="fw-bold mb-0 text-uppercase font-monospace text-muted small">Brand</h6>
                <span className="text-muted">{showBrand ? <FaAngleUp /> : <FaAngleDown />}</span>
              </div>
              <div className={`collapse ${showBrand ? "show" : ""} mt-2 ps-2`}>
                {["Allen Solly", "Only", "Jockey", "Adidas", "Nike"].map(
                  (brand, idx) => (
                    <div className="form-check mb-2" key={idx}>
                      <input
                        className="form-check-input shadow-none"
                        type="checkbox"
                        value={brand}
                        onChange={(e) => handleCheckboxChange(e, "brands")}
                        id={`brand${idx}`}
                      />
                      <label className="form-check-label text-secondary" htmlFor={`brand${idx}`}>
                        {brand}
                      </label>
                    </div>
                  )
                )}
              </div>
            </div>

            <hr className="text-muted my-3 opacity-25" />

            {/* Size Dropdown */}
            <div className="mb-3">
              <div
                className="d-flex justify-content-between align-items-center cursor-pointer"
                onClick={() => setShowSize(!showSize)}
              >
                <h6 className="fw-bold mb-0 text-uppercase font-monospace text-muted small">Size</h6>
                <span className="text-muted">{showSize ? <FaAngleUp /> : <FaAngleDown />}</span>
              </div>
              <div className={`collapse ${showSize ? "show" : ""} mt-2 ps-2`}>
                {["XS", "S", "M", "L", "XL", "XXL"].map((size, idx) => (
                  <div className="form-check mb-2" key={idx}>
                    <input
                      className="form-check-input shadow-none"
                      type="checkbox"
                      value={size}
                      onChange={(e) => handleCheckboxChange(e, "sizes")}
                      id={`size${idx}`}
                    />
                    <label className="form-check-label text-secondary" htmlFor={`size${idx}`}>
                      {size}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <hr className="text-muted my-3 opacity-25" />

            {/* Color Dropdown */}
            <div className="mb-2">
              <div
                className="d-flex justify-content-between align-items-center cursor-pointer"
                onClick={() => setShowColor(!showColor)}
              >
                <h6 className="fw-bold mb-0 text-uppercase font-monospace text-muted small">Color</h6>
                <span className="text-muted">{showColor ? <FaAngleUp /> : <FaAngleDown />}</span>
              </div>
              <div className={`collapse ${showColor ? "show" : ""} mt-2 ps-2`}>
                {["Red", "Blue", "Black", "White", "Green"].map((color, idx) => (
                  <div className="form-check mb-2" key={idx}>
                    <input
                      className="form-check-input shadow-none"
                      type="checkbox"
                      value={color.toLowerCase()}
                      onChange={(e) => handleCheckboxChange(e, "colors")}
                      id={`color${idx}`}
                    />
                    <label className="form-check-label text-secondary" htmlFor={`color${idx}`}>
                      {color}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Product Section */}
        <div className="col-lg-9 col-md-8">
          <div className="card border-0 shadow-sm p-3 mb-4">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center align-items-start gap-3">
              <div>
                <h4 className="fw-bold mb-1">Clothing and Accessories</h4>
                <p className="text-muted small mb-0">
                  If you want to stay on top of the fashion trends... ({filteredProducts.length} items)
                </p>
              </div>

              {/* Filter button & Sort By */}
              <div className="d-flex flex-wrap align-items-center gap-3 w-100 w-md-auto justify-content-between justify-content-md-end">
                <button
                  className="btn btn-primary d-md-none fw-semibold shadow-sm w-100"
                  onClick={() => setIsFilterVisible(!isFilterVisible)}
                >
                  {isFilterVisible ? "✖ Close Filters" : "☰ Show Filters"}
                </button>

                <div className="d-flex align-items-center gap-2 w-100 w-md-auto">
                  <label htmlFor="sort" className="fw-bold text-nowrap mb-0 small">Sort By:</label>
                  <select
                    id="sort"
                    className="form-select form-select-sm shadow-none"
                    onChange={handleSortChange}
                    style={{ minWidth: "150px" }}
                  >
                    <option value="">Relevance</option>
                    <option value="highest">Price: High to Low</option>
                    <option value="lowest">Price: Low to High</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="row g-3">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <div key={product._id} className="col-12 col-sm-6 col-md-6 col-lg-4 col-xl-3">
                  <div className="card h-100 shadow-sm border-0 product-card overflow-hidden">
                    {/* Image Container */}
                    <div
                      className="bg-white p-3 border-bottom position-relative d-flex align-items-center justify-content-center"
                      style={{ height: "240px" }}
                    >
                      {product?.mainImages && product.mainImages.length > 0 ? (
                        <img
                          src={`${import.meta.env.VITE_REACT_APP_MAIN_URL}${product.mainImages[0].img}`}
                          alt={product.name || "product image"}
                          className="img-fluid"
                          style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain", mixBlendMode: "multiply" }}
                        />
                      ) : (
                        <div className="text-muted">No Image</div>
                      )}

                      {/* Optional Badge */}
                      <span className="badge bg-danger position-absolute top-0 start-0 m-2 px-2 py-1 shadow-sm rounded-pill">
                        88% off
                      </span>
                    </div>

                    {/* Card Body */}
                    <div className="card-body d-flex flex-column p-3">
                      <p className="text-muted small mb-1 fw-semibold text-uppercase" style={{ letterSpacing: "1px", fontSize: "0.7rem" }}>
                        Sevel Deals
                      </p>
                      <h6 className="card-title text-truncate mb-1 fw-bold text-dark" title={product?.name}>
                        {product?.name || "Product Name"}
                      </h6>
                      <p className="card-text text-muted small text-truncate mb-3" title={product?.description}>
                        {product?.description || "No description available for this item."}
                      </p>
                      <div className="mt-auto">
                        <div className="d-flex align-items-baseline gap-2 mb-3">
                          <h5 className="mb-0 fw-bold text-dark">${product?.price}</h5>
                          <span className="text-decoration-line-through text-muted small">
                            ${Math.round(product?.price * 1.88)}
                          </span>
                        </div>
                        <button
                          className="btn btn-primary w-100 fw-bold shadow-sm rounded-pill py-2"
                          onClick={() => {
                            dispatch(addToCart(product));
                            navigate(`/product/${product.slug}`);
                          }}
                        >
                          Add To Cart
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-12 py-5">
                <div className="text-center text-muted p-5 bg-white rounded shadow-sm">
                  <h5 className="fw-bold mb-3 text-dark">No products found</h5>
                  <p>Try adjusting your selected filters to find what you're looking for.</p>
                  <button className="btn btn-outline-primary mt-3 rounded-pill px-4 fw-semibold" onClick={handleClearAllFilters}>
                    Clear All Filters
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClothingAndAccessories;
