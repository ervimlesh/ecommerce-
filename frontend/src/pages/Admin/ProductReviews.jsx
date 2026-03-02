import React, { Fragment, useState } from "react";
import axios from "axios";
import AdminSidebar from "../../components/AdminSidebar";

const ProductReviews = () => {
  const [productId, setProductId] = useState("");
  const [reviews, setReviews] = useState([]);

  const deleteReviewHandler = async (reviewId) => {
    try {
      const { data } = await axios.delete(
        `/api/v1/product/delete-reviews?id=${reviewId}&productId=${productId}`
      );

      if (data.success) {
        alert("Review deleted successfully");
        setReviews((prev) => prev.filter((r) => r._id !== reviewId));
      } else {
        alert("Something went wrong");
      }
    } catch (error) {
      console.log(error);
      alert("An error occurred");
    }
  };

  const productReviewsSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.get(`/api/v1/product/reviews?id=${productId}`);
      if (data.success && data.reviews) {
        setReviews(data.reviews);
        alert("Reviews fetched successfully");
      } else {
        alert("No reviews found or something went wrong");
      }
    } catch (error) {
      console.log(error);
      alert("An error occurred");
    }
  };

  return (
    <Fragment>
      <div className="d-flex">
        <div className="col-md-3">
          <AdminSidebar />
        </div>

        <div className="col-md-9 p-4">
          <h2 className="mb-4 text-center">Product Reviews</h2>

          <form onSubmit={productReviewsSubmitHandler} className="mb-4">
            <div className="mb-3">
              <label htmlFor="productId" className="form-label">
                Enter Product ID
              </label>
              <input
                type="text"
                id="productId"
                className="form-control"
                placeholder="Enter Product ID"
                required
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Search
            </button>
          </form>

          {reviews && reviews.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-bordered table-striped table-sm">
                <thead className="table-light">
                  <tr>
                    <th>#</th>
                    <th>Rating</th>
                    <th>Comment</th>
                    <th>User</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {reviews.map((r, idx) => (
                    <tr key={r._id}>
                      <td>{idx + 1}</td>
                      <td>{r.rating}</td>
                      <td>{r.comment}</td>
                      <td>{r.name}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => deleteReviewHandler(r._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <h5 className="text-center text-muted mt-4">No Reviews Found</h5>
          )}
        </div>
      </div>
    </Fragment>
  );
};

export default ProductReviews;
