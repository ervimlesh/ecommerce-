import React from "react";

const AddCategoryModal = (props) => {
  const {
    show,
    handleClose,
    modalTitle,
    categoryName,
    setCategoryName,
    parentCategoryId,
    setParentCategoryId,
    categoryList,
    handleCategoryImage,
    onSubmit,
  } = props;

  return (
    <div
      className={`modal fade ${show ? "show d-block" : ""}`}
      tabIndex="-1"
      style={show ? { backgroundColor: "rgba(0,0,0,0.5)" } : {}}
    >
      <div className="modal-dialog">
        <div className="modal-content">
          {/* Header */}
          <div className="modal-header">
            <h5 className="modal-title">{modalTitle}</h5>
            <button
              type="button"
              className="btn-close"
              onClick={handleClose}
            ></button>
          </div>

          {/* Body */}
          <div className="modal-body">
            <form>
              <div className="row">
                <div className="col">
                  <div className="mb-3">
                    <label className="form-label">Category Name</label>
                    <input
                      type="text"
                      placeholder="Category Name"
                      value={categoryName}
                      onChange={(e) => setCategoryName(e.target.value)}
                      className="form-control form-control-sm"
                    />
                  </div>
                </div>

                <div className="col">
                  <div className="mb-3">
                    <label className="form-label">Parent Category</label>
                    <select
                      value={parentCategoryId}
                      onChange={(e) => setParentCategoryId(e.target.value)}
                      className="form-control form-control-sm"
                    >
                      <option value="">Select Category</option>
                      {categoryList.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="row mt-3">
                <div className="col">
                  <div className="mb-3">
                    <label className="form-label">Category Image</label>
                    <input
                      type="file"
                      name="categoryImage"
                      onChange={handleCategoryImage}
                      className="form-control"
                    />
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleClose}
            >
              Close
            </button>
            <button
              type="button"
              style={{ backgroundColor: "#333" }}
              className="btn btn-primary btn-sm"
              onClick={onSubmit}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCategoryModal;
