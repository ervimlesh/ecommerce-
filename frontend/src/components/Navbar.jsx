import React, { useEffect } from "react";
import { FaShoppingCart, FaUserCircle } from "react-icons/fa";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { PiStorefront } from "react-icons/pi";
import { CiLogin } from "react-icons/ci";
import { useAuth } from "../context/Auth";
import { NavLink, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { getCartTotal } from "../features/cartSlice";
import SearchInput from "./Form/SearchInput";

const Navbar = () => {
  const [auth, setAuth] = useAuth();
  const { cart, totalQuantity } = useSelector((state) => state.allCart);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getCartTotal());
  }, [cart, dispatch]);

  const navigate = useNavigate();

  const handleLogout = () => {
    setAuth({
      ...auth,
      user: null,
      token: "",
    });
    localStorage.removeItem("auth");
    toast.success("Logout Successfully");
    navigate("/");
  };

  return (
    <header className="fk-header">
      <div className="fk-header-container">
        {/* Left: Logo */}
        <div className="fk-logo-container">
          <a href="/" className="fk-logo-link">
            <img
              src="/ram.svg"
              alt="Logo"
              className="fk-logo-img"
              onError={(e) => { e.target.onerror = null; e.target.src = "https://static-assets-web.flixcart.com/batman-returns/batman-returns/p/images/fkheaderlogo_exploreplus-44005d.svg"; }}
            />
          </a>
        </div>

        {/* Center: Search */}
        <div className="fk-search-container">
          <SearchInput />
        </div>

        {/* Right: Actions */}
        <div className="fk-action-container">
          {!auth?.user ? (
            <div className="fk-login-dropdown">
              <a href="/login" className="fk-login-btn">
                <CiLogin className="fk-icon fk-login-icon" />
                <span>Login</span>
              </a>
            </div>
          ) : (
            <div className="fk-user-dropdown dropdown">
              <NavLink
                className="fk-user-btn dropdown-toggle"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                style={{ border: "none" }}
              >
                <FaUserCircle className="fk-icon" /> {auth?.user?.name}
              </NavLink>
              <ul className="dropdown-menu">
                <li>
                  <NavLink
                    to={`/dashboard/${auth?.user?.role === 1
                        ? "admin"
                        : auth?.user?.role === 2
                          ? "super-admin"
                          : "user"
                      }`}
                    className="dropdown-item"
                  >
                    Dashboard
                  </NavLink>
                </li>
                <li>
                  <NavLink onClick={handleLogout} className="dropdown-item">
                    Logout
                  </NavLink>
                </li>
              </ul>
            </div>
          )}

          <a href="/cart" className="fk-action-link">
            <span className="fk-cart-icon-wrapper">
              <FaShoppingCart className="fk-icon" />
              {totalQuantity > 0 && <span className="fk-cart-badge">{totalQuantity}</span>}
            </span>
            <span className="fk-action-text">Cart</span>
          </a>

          <a href="#" className="fk-action-link fk-hide-mobile">
            <PiStorefront className="fk-icon" />
            <span className="fk-action-text">Become a Seller</span>
          </a>

          <div className="fk-more-dropdown fk-hide-mobile">
            <a href="#" className="fk-action-link">
              <HiOutlineDotsVertical className="fk-icon" style={{ fontSize: '20px' }} />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
