import React from "react";
import { useSearch } from "../context/Search.jsx";
import { IoIosArrowForward } from "react-icons/io";
import { NavLink } from "react-router-dom";
import Layout from "../components/Layout/Layout.jsx";
import {  useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../features/cartSlice.jsx";

const Search = () => {
  const [values] = useSearch();
    const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <Layout title={"search-products"}>
      {/* Breadcrumb */}
      <div className="container-fluid bg-light py-2">
        <div className="container">
          <ul className="list-inline mb-0">
            <li className="list-inline-item">
              <NavLink to="/" className="text-decoration-none text-dark">
                Home <IoIosArrowForward />
              </NavLink>
            </li>
            <li className="list-inline-item">
              <NavLink className="text-decoration-none text-dark">
                Search <IoIosArrowForward />
              </NavLink>
            </li>
            <li className="list-inline-item">
              <NavLink className="text-decoration-none text-dark">
                Products <IoIosArrowForward />
              </NavLink>
            </li>
          </ul>
        </div>
      </div>

      {/* Search Results Heading */}
      <div
        className="container-fluid py-3"
        style={{ backgroundColor: "#f8f8f8" }}
      >
        <div
          className="container text-center py-3"
          style={{ backgroundColor: "#f1f1f1", color: "rgb(26 63 76)" }}
        >
          <h4>Search Results</h4>
          <p>
            {values?.results.length < 1
              ? "No Products Found"
              : `Total Products : ${values?.results.length}`}
          </p>
        </div>

        {/* Product Grid */}
        <div className="container mt-4">
          <div className="row">
            {values?.results.map((p, index) => (
              <div
                className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4"
                key={index}
              >
                <div className="card h-100">
                  {/* Images */}
                  {p.mainImages.length > 0 && (
                    <img
                      src={`${import.meta.env.VITE_REACT_APP_MAIN_URL}${
                        p.mainImages[0].img
                      }`}
                      className="card-img-top"
                      alt={p.name}
                      style={{ objectFit: "cover", height: "200px" }}
                    />
                  )}
                  {/* Product Details */}
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">{p.name}</h5>
                    <p className="card-text">
                      {p.description.substring(0, 30)}...
                    </p>
                    <p className="text-primary font-weight-bold">₹{p.price}</p>
                    <button
                      className=" btn btn-primary"
                      onClick={() =>
                        dispatch(addToCart(p)) &&
                        navigate(`/product/${p.slug}`)
                      }
                    >
                      Add To Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Search;
