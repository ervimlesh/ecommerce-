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
  }, [location]);

  useEffect(() => {
    applyFilters();
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
    <div className="fil ">
      {/* Row layout */}

      {/* Sidebar on desktop / Slide on mobile */}
      <div className={`filter  ${isFilterVisible ? "show" : ""}`}>
        {/* Filter content unchanged */}
        <div>
          <img src="../public/slider/filter.webp" alt="filter banner" />
          <h5 className="crop">Crop Tops, Ruching Craze...</h5>
          <p className="cro">Min. 50% off + Extra 15% off</p>
        </div>

        <div className="f-o">
          <h4>Filter</h4>
          <div onClick={handleClearAllFilters}>Clear All</div>
        </div>

        {/* Categories */}
        <div className="filter-section border p-3 rounded mb-3">
          <h6 className="mb-3">CATEGORIES</h6>
          {["Topwear", "Shirts", "T-shirts", "Tops"].map((cat, idx) => (
            <div className="form-check" key={idx}>
              <input
                className="form-check-input"
                type="checkbox"
                value={cat.toLowerCase()}
                onChange={(e) => handleCheckboxChange(e, "categories")}
                id={`cat${idx}`}
              />
              <label className="form-check-label" htmlFor={`cat${idx}`}>
                {cat}
              </label>
            </div>
          ))}
        </div>

        {/* Price */}
        <div className="gender-section">
          <h6>Price</h6>
        </div>
        <div className="price-filter px-3 pb-2">
          <input
            type="number"
            name="min"
            placeholder="Min"
            value={filters.price.min}
            onChange={handlePriceChange}
          />
          <input
            type="number"
            name="max"
            placeholder="Max"
            value={filters.price.max}
            onChange={handlePriceChange}
          />
        </div>

        {/* Brand Dropdown */}
        <div
          className="gender-section"
          onClick={() => setShowBrand(!showBrand)}
          style={{ cursor: "pointer" }}
        >
          <h6>Brand {showBrand ? <FaAngleUp /> : <FaAngleDown />}</h6>
        </div>
        <div className={`dropdown-transition ${showBrand ? "show" : ""}`}>
          <div className="px-3 pb-2">
            {["Allen Solly", "Only", "Jockey", "Adidas", "Nike"].map(
              (brand, idx) => (
                <div className="form-check" key={idx}>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value={brand}
                    onChange={(e) => handleCheckboxChange(e, "brands")}
                    id={`brand${idx}`}
                  />
                  <label className="form-check-label" htmlFor={`brand${idx}`}>
                    {brand}
                  </label>
                </div>
              )
            )}
          </div>
        </div>

        {/* Size Dropdown */}
        <div
          className="gender-section"
          onClick={() => setShowSize(!showSize)}
          style={{ cursor: "pointer" }}
        >
          <h6>Size {showSize ? <FaAngleUp /> : <FaAngleDown />}</h6>
        </div>
        <div className={`dropdown-transition ${showSize ? "show" : ""}`}>
          <div className="px-3 pb-2">
            {["XS", "S", "M", "L", "XL", "XXL"].map((size, idx) => (
              <div className="form-check" key={idx}>
                <input
                  className="form-check-input"
                  type="checkbox"
                  value={size}
                  onChange={(e) => handleCheckboxChange(e, "sizes")}
                  id={`size${idx}`}
                />
                <label className="form-check-label" htmlFor={`size${idx}`}>
                  {size}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Color Dropdown */}
        <div
          className="gender-section"
          onClick={() => setShowColor(!showColor)}
          style={{ cursor: "pointer" }}
        >
          <h6>Color {showColor ? <FaAngleUp /> : <FaAngleDown />}</h6>
        </div>
        <div className={`dropdown-transition ${showColor ? "show" : ""}`}>
          <div className="px-3 pb-2">
            {["Red", "Blue", "Black", "White", "Green"].map((color, idx) => (
              <div className="form-check" key={idx}>
                <input
                  className="form-check-input"
                  type="checkbox"
                  value={color.toLowerCase()}
                  onChange={(e) => handleCheckboxChange(e, "colors")}
                  id={`color${idx}`}
                />
                <label className="form-check-label" htmlFor={`color${idx}`}>
                  {color}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Product Section */}
      <div className="filter1 p-3">
        {/* Filter button visible only on mobile */}
        <div className="d-md-none mb-3">
          <button
            className="filter-toggle-btn"
            onClick={() => setIsFilterVisible(!isFilterVisible)}
          >
            {isFilterVisible ? "✖ Close Filters" : "☰ Show Filters"}
          </button>
        </div>

        <p className="m-4 text-muted">
          If you want to stay on top of the fashion trends...
        </p>

        <div className="short-by outline-none mb-3">
          <label htmlFor="sort">Sort by: Price</label>
          <select id="sort" onChange={handleSortChange}>
            <option value="">Select</option>
            <option value="highest">Highest</option>
            <option value="lowest">Lowest</option>
          </select>
        </div>

        <div className="f-p">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div key={product._id}>
                <p className="mb-1">Sevel Deals</p>
                {product?.mainImages.map((picture, index) => (
                  <img
                    key={index}
                    src={`${import.meta.env.VITE_REACT_APP_MAIN_URL}${picture.img
                      }`}
                    alt="images"
                  />
                ))}
                <p className="woman-solid"> {product?.name} </p>
                <a className="mf-0"> {product?.description} ....</a>
                <a className="ra">
                  <h6>$ {product?.price} </h6> <a className="off">88% off</a>
                </a>
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    dispatch(addToCart(product));
                    navigate(`/product/${product.slug}`);
                  }}
                >
                  Add To Cart
                </button>
              </div>
            ))
          ) : (
            <p>No products found with selected filters.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClothingAndAccessories;
