import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import AdminSidebar from "../../../components/AdminSidebar.jsx";

const UpdateProduct = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [productPictures, setProductPictures] = useState([]);

  const [category, setCategory] = useState([]);
  const [id, setId] = useState("");

  const navigate = useNavigate();
  const params = useParams();

  //getAll category
  const getAllCategory = async () => {
    try {
      const { data } = await axios.get("/api/v1/category/get-category");

      if (data?.success) {
        setCategory(data?.category);
      }
    } catch (error) {
      console.log(error);
      toast.error("something went wrong in category");
    }
  };

  useEffect(() => {
    getAllCategory();
  }, []);

  //get single product
  const getSingleProduct = async () => {
    try {
      const { data } = await axios.get(
        `/api/v1/product/get-product/${params.slug}`
      );
      setName(data.product.name);
      setId(data.product._id);
      setDescription(data.product.description);
      setPrice(data.product.price);
      setVisibility(data.product.visibility);
      setQuantity(data.product.quantity);
      setCategoryId(data.product.category._id);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getSingleProduct();
    //eslint-disable-next-line
  }, []);
  const handleProductPictures = (e) => {
    setProductPictures([...productPictures, e.target.files[0]]);
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

  //create product function
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const productData = new FormData();
      productData.append("name", name);
      productData.append("price", price);
      productData.append("quantity", quantity);
      productData.append("visibility", visibility);
      productData.append("description", description);
      productData.append("category", categoryId);

      for (let pic of productPictures) {
        productData.append("productPicture", pic);
      }

      const { data } = axios.put(
        `/api/v1/product/update-product/${id}`,
        productData
      );
      if (data?.success) {
        toast.error(data?.message);
      } else {
        toast.success("Product Updated Successfully");
        // navigate("/dashboard/admin/products");
      }
    } catch (error) {
      console.log(error);
      toast.error("something went wrong");
    }
  };

  return (
    <div className="d-flex" style={{ minHeight: "100vh", backgroundColor: "#f1f3f6" }}>
      <AdminSidebar />
      <div className="flex-grow-1 p-3 p-md-5 w-100" style={{ overflowX: "hidden" }}>
        <div className="container-fluid bg-white p-4 p-md-5 rounded shadow-sm border mx-auto" style={{ maxWidth: "1000px" }}>
          <div className="border-bottom pb-3 mb-4">
            <h3 className="fw-bold fs-4 m-0" style={{ color: "#212121" }}>Update Product</h3>
          </div>

          <div className="row g-4">
            <div className="col-md-6">
              <label className="form-label fw-semibold text-secondary">Name</label>
              <input
                type="text"
                value={name}
                placeholder="Product Name"
                className="form-control"
                onChange={(e) => setName(e.target.value)}
              />
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
              <label className="form-label fw-semibold text-secondary">Price</label>
              <input
                type="number"
                value={price}
                placeholder="Price"
                className="form-control"
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold text-secondary">Quantity</label>
              <input
                type="number"
                value={quantity}
                placeholder="Quantity"
                className="form-control"
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold text-secondary">Visible Products</label>
              <input
                type="text"
                value={visibility}
                placeholder="Visible Products"
                className="form-control"
                onChange={(e) => setVisibility(e.target.value)}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold text-secondary">Product Pictures</label>
              <input
                type="file"
                multiple
                name="productPicture"
                className="form-control"
                onChange={handleProductPictures}
              />
              {productPictures.length > 0 && (
                <div className="mt-2 text-muted small fw-medium">
                  {productPictures.length} file(s) selected
                </div>
              )}
            </div>

            <div className="col-12">
              <label className="form-label fw-semibold text-secondary">Description</label>
              <textarea
                rows="4"
                value={description}
                placeholder="Product Description"
                className="form-control"
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="col-12 mt-5">
              <button
                className="btn text-white px-5 py-2 fw-semibold shadow-sm w-100"
                style={{ backgroundColor: "#2874f0", borderRadius: "4px", fontSize: "16px" }}
                onClick={handleUpdate}
              >
                UPDATE PRODUCT
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateProduct;
