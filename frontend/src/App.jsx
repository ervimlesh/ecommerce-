import "./App.css";
import "../public/style.css";
import "./assets/mainStyle.css";
import "./assets/admin.css";
import "./assets/mobail.css";
import "./assets/shipping.css";
import Home from "./pages/Home";
import { Routes, Route } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import SuperAdminRoute from "./Routes/SuperAdminRoute";
import SuperAdminDashboard from "./pages/SuperAdmin/SuperAdminDashboard";
import UserRoute from "./Routes/UserRoute";
import AdminRoute from "./Routes/AdminRoute";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import UserDashboard from "./pages/User/UserDashboard";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import { Toaster } from "react-hot-toast";
import Category from "./pages/Admin/Category";
import Products from "./pages/Admin/Products";
import UpdateProduct from "./pages/Admin/Products/UpdateProduct";
import ProductListPage from "./pages/ProductListPage";
import ProductDetails from "./pages/ProductDetails";
import CartPage from "./pages/CartPage";
import Shipping from "./pages/Shipping";
import Search from "./pages/Search";
import AdminOrder from "./pages/Admin/Orders/AdminOrder";
import ProductReviews from "./pages/Admin/ProductReviews";
import UserOrder from "./pages/User/UserOrder";
import UserProfile from "./pages/User/UserProfile";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import AdminInvoicePreview from "./pages/Admin/Orders/AdminInvoicePreview";

function App() {
  return (
    <>
      <Toaster />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:slug" element={<ProductListPage />} />
        <Route path="/product/:slug" element={<ProductDetails />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/shipping" element={<Shipping />} />
        <Route path="/search" element={<Search />} />

        {/* SuperAdmin Routes */}
        <Route path="/dashboard" element={<SuperAdminRoute />}>
          <Route path="super-admin" element={<SuperAdminDashboard />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/dashboard" element={<AdminRoute />}>
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="admin/create-product" element={<Products />} />
          <Route
            path="admin/update-product/:slug"
            element={<UpdateProduct />}
          />
          <Route path="admin/create-category" element={<Category />} />
          <Route path="admin/orders" element={<AdminOrder />} />
          <Route path="admin/reviews" element={<ProductReviews />} />
          <Route path="admin/invoice/:orderId" element={<AdminInvoicePreview />} />
        </Route>

        {/* User Routes */}
        <Route path="/dashboard" element={<UserRoute />}>
          <Route path="user" element={<UserDashboard />} />
          <Route path="user/orders" element={<UserOrder />} />
          <Route path="user/profile" element={<UserProfile />} />
          <Route path="user/forgot-password" element={<ForgotPassword />} />
        </Route>

        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        
      </Routes>
    </>
  );
}

export default App;
