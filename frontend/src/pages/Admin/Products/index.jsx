import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import "./style.css";
import { Link } from "react-router-dom";
import Pagination from "../../../components/extraComponent/Pagination.jsx";
import AdminSidebar from "../../../components/AdminSidebar.jsx";

const Products = () => {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [visibilty, setVisibility] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [productPictures, setProductPictures] = useState([]);
  const [mainImages, setMainImages] = useState([]);
  const [pageNo, setPageNo] = useState(1);
  const [totalPosts, setTotalPosts] = useState();
  const [show, setShow] = useState(false);
  const [productDetailModal, setProductDetailModal] = useState(false);
  const [productDetails, setProductDetails] = useState(null);
  const [category, setCategory] = useState([]);
  const [allProducts, setAllProducts] = useState([]);

  const getAllCategory = async () => {
    try {
      const { data } = await axios.get("/api/v1/category/get-category");
      if (data?.success) {
        setCategory(data?.category);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong in category");
    }
  };

  useEffect(() => {
    getAllCategory();
  }, []);

  const getAllProducts = async () => {
    try {
      const { data } = await axios.get(
        `/api/v1/product/get-product?page=${pageNo}`
      );
      setAllProducts(data.posts);
      setTotalPosts(data.totalPages);
    } catch (error) {
      console.log(error);
      toast.error("Something Went Wrong");
    }
  };

  useEffect(() => {
    getAllProducts();
  }, [pageNo]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleProductPictures = (e) => {
    setProductPictures([...productPictures, ...Array.from(e.target.files)]);
  };

  const handleMainImages = (e) => {
    setMainImages([...mainImages, ...Array.from(e.target.files)]);
  };

  const submitProductForm = async () => {
    const form = new FormData();
    form.append("name", name);
    form.append("quantity", quantity);
    form.append("price", price);
    form.append("description", description);
    form.append("category", categoryId);
    form.append("visibility", visibilty);

    for (let pic of productPictures) {
      form.append("productPicture", pic);
    }
    for (let main of mainImages) {
      form.append("mainImage", main);
    }

    const { data } = await axios.post("/api/v1/product/create-product", form);
    setShow(false);

    if (data?.success) {
      toast.success("Product Created Successfully");
      getAllProducts();
    } else {
      toast.error(data?.message);
    }
  };

  const handleDelete = async (pId) => {
    try {
      const { data } = await axios.delete(
        `/api/v1/product/delete-product/${pId}`
      );
      if (data?.success) {
        toast.success("Product Deleted successfully");
        getAllProducts();
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong in delete category");
    }
  };

  const createCategoryList = (categories, options = []) => {
    for (let category of categories) {
      options.push({ value: category._id, name: category.name });
      if (category.children.length > 0) {
        createCategoryList(category.children, options);
      }
    }
    return options;
  };

  const renderAddProductModal = () => {
    return (
      show && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0, 0, 0, 0.6)", zIndex: 1050 }}>
          <div className="modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable">
            <div className="modal-content border-0 shadow">
              <div className="modal-header text-white" style={{ backgroundColor: "#2874f0" }}>
                <h5 className="modal-title fw-bold">Add New Product</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={handleClose}
                ></button>
              </div>
              <div className="modal-body p-4">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold text-secondary">Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={name}
                      placeholder="Product Name"
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold text-secondary">Price</label>
                    <input
                      type="number"
                      className="form-control"
                      value={price}
                      placeholder="Price"
                      onChange={(e) => setPrice(e.target.value)}
                    />
                  </div>

                  <div className="col-md-12">
                    <label className="form-label fw-semibold text-secondary">Description</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={description}
                      placeholder="Product Description"
                      onChange={(e) => setDescription(e.target.value)}
                    ></textarea>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold text-secondary">Category</label>
                    <select
                      className="form-select"
                      value={categoryId}
                      onChange={(e) => setCategoryId(e.target.value)}
                    >
                      <option>Select Category</option>
                      {createCategoryList(category).map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold text-secondary">Visibility</label>
                    <select
                      className="form-select"
                      value={visibilty}
                      onChange={(e) => setVisibility(e.target.value)}
                    >
                      <option>wear</option>
                      <option>unstiched</option>
                      <option>bear</option>
                      <option>men</option>
                      <option>women</option>
                      <option>kid</option>
                      <option>accessories</option>
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold text-secondary">Product Pictures</label>
                    <input
                      type="file"
                      multiple
                      className="form-control"
                      onChange={handleProductPictures}
                    />
                    {productPictures.length > 0 && (
                      <div className="mt-2 text-muted small fw-medium">
                        {productPictures.length} file(s) selected
                      </div>
                    )}
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold text-secondary">Main Images</label>
                    <input
                      type="file"
                      multiple
                      className="form-control"
                      onChange={handleMainImages}
                    />
                    {mainImages.length > 0 && (
                      <div className="mt-2 text-muted small fw-medium">
                        {mainImages.length} file(s) selected
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="modal-footer bg-light border-top-0">
                <button
                  className="btn btn-outline-secondary px-4 fw-semibold"
                  onClick={handleClose}
                >
                  Cancel
                </button>
                <button
                  className="btn text-white px-4 fw-semibold shadow-sm"
                  style={{ backgroundColor: "#fb641b" }}
                  onClick={submitProductForm}
                >
                  Save Product
                </button>
              </div>
            </div>
          </div>
        </div>
      )
    );
  };

  const showProductDetailsModal = (product) => {
    setProductDetails(product);
    setProductDetailModal(true);
  };

  const handleCloseProductDetailsModal = () => {
    setProductDetailModal(false);
  };

  const renderProductDetailsModal = () => {
    if (!productDetails) return null;

    return (
      productDetailModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.6)", zIndex: 1050 }}>
          <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content border-0 shadow">
              <div className="modal-header text-white" style={{ backgroundColor: "#2874f0" }}>
                <h5 className="modal-title fw-bold">Product Details</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={handleCloseProductDetailsModal}
                ></button>
              </div>
              <div className="modal-body p-4">
                <div className="row mb-3">
                  <div className="col-md-6 mb-3 mb-md-0">
                    <label className="text-muted small text-uppercase fw-bold mb-1">Name</label>
                    <p className="fs-6 fw-medium text-dark mb-0">{productDetails.name}</p>
                  </div>
                  <div className="col-md-6">
                    <label className="text-muted small text-uppercase fw-bold mb-1">Price</label>
                    <p className="fs-6 fw-bold text-success mb-0" style={{ color: "#388e3c" }}>₹{productDetails.price}</p>
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-md-6 mb-3 mb-md-0">
                    <label className="text-muted small text-uppercase fw-bold mb-1">Category</label>
                    <p className="fs-6 fw-medium text-dark mb-0">{productDetails?.category?.name}</p>
                  </div>
                  <div className="col-md-6">
                    <label className="text-muted small text-uppercase fw-bold mb-1">Quantity</label>
                    <p className="fs-6 fw-medium text-dark mb-0">{productDetails.quantity}</p>
                  </div>
                </div>
                <div className="row mb-4">
                  <div className="col-md-12">
                    <label className="text-muted small text-uppercase fw-bold mb-1">Description</label>
                    <p className="fs-6 text-dark mb-0">{productDetails.description}</p>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12">
                    <label className="text-muted small text-uppercase fw-bold mb-2">Product Pictures</label>
                    <div
                      style={{
                        display: "flex",
                        gap: "15px",
                        flexWrap: "wrap",
                      }}
                    >
                      {productDetails.productPictures.map((picture, i) => (
                        <div key={i} className="border rounded p-1 shadow-sm" style={{ backgroundColor: "#fff" }}>
                          <img
                            src={`${import.meta.env.VITE_REACT_APP_MAIN_URL}${picture.img
                              }`}
                            alt="product"
                            style={{ height: "100px", width: "100px", objectFit: "contain" }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer bg-light border-top-0">
                <button
                  className="btn btn-outline-secondary px-4 fw-semibold"
                  onClick={handleCloseProductDetailsModal}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )
    );
  };

  const renderProducts = () => {
    return (
      <table className="table table-hover align-middle mb-0" style={{ fontSize: "14px", minWidth: "900px" }}>
        <thead className="table-light text-muted border-bottom">
          <tr>
            <th className="fw-semibold px-3 py-3">#</th>
            <th className="fw-semibold px-3 py-3">Name</th>
            <th className="fw-semibold px-3 py-3">Price</th>
            <th className="fw-semibold px-3 py-3">Quantity</th>
            <th className="fw-semibold px-3 py-3">Category</th>
            <th className="fw-semibold px-3 py-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="border-top-0">
          {allProducts.map((product, id) => (
            <tr key={product._id} className="border-bottom">
              <td className="px-3 py-3">{id + 1}</td>
              <td className="px-3 py-3 fw-medium text-dark">{product.name}</td>
              <td className="px-3 py-3 fw-medium" style={{ color: "#388e3c" }}>₹{product.price}</td>
              <td className="px-3 py-3">{product.quantity}</td>
              <td className="px-3 py-3">
                <span className="badge bg-secondary bg-opacity-10 text-secondary fw-semibold border">
                  {product?.category?.name || "N/A"}
                </span>
              </td>
              <td className="px-3 py-3">
                <div className="d-flex justify-content-center gap-2">
                  <button
                    onClick={() => showProductDetailsModal(product)}
                    className="btn btn-sm btn-outline-info fw-semibold px-3"
                  >
                    Info
                  </button>
                  <Link
                    to={`/dashboard/admin/update-product/${product.slug}`}
                    className="btn btn-sm btn-outline-primary fw-semibold px-3"
                  >
                    Edit
                  </Link>
                  <button
                    className="btn btn-sm btn-outline-danger fw-semibold px-3"
                    onClick={() => handleDelete(product._id)}
                  >
                    Del
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div className="d-flex" style={{ minHeight: "100vh", backgroundColor: "#f1f3f6" }}>
      <AdminSidebar />
      <div className="flex-grow-1 p-3 p-md-4 w-100" style={{ overflowX: "hidden" }}>
        <div className="container-fluid bg-white p-0 rounded shadow-sm border overflow-hidden">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center bg-white p-3 p-md-4 border-bottom">
            <h3 className="mb-3 mb-md-0 fw-bold fs-4" style={{ color: "#212121" }}>Products</h3>
            <button
              onClick={handleShow}
              className="btn text-white px-4 py-2 fw-semibold shadow-sm w-100 w-md-auto"
              style={{ backgroundColor: "#2874f0", borderRadius: "4px" }}
            >
              + Add New Product
            </button>
          </div>
          <div className="table-responsive p-0">
            {renderProducts()}
          </div>
          <div className="d-flex justify-content-end p-3 p-md-4 bg-white border-top">
            <Pagination
              pageNo={pageNo}
              setPageNo={setPageNo}
              totalPosts={totalPosts}
            />
          </div>
        </div>
        {renderAddProductModal()}
        {renderProductDetailsModal()}
      </div>
    </div>
  );
};

export default Products;
