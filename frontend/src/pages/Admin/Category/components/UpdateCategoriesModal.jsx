import React from "react";

const UpdateCategoriesModal = (props) => {

  const {
    show,
    handleClose,
    modalTitle,
    size,
    expandedArray,
    checkedArray,
    handleCategoryInput,
    categoryList,
    onSubmit,
  } = props;

  return (
    <div
      className={`modal fade ${show ? "show d-block" : ""}`}
      tabIndex="-1"
      style={show ? { backgroundColor: "rgba(0,0,0,0.5)" } : {}}
    >
      <div className={`modal-dialog modal-${size || "md"}`}>
        <div className="modal-content">
          {/* Modal Header */}
          <div className="modal-header">
            <h5 className="modal-title">{modalTitle}</h5>
            <button
              type="button"
              className="btn-close"
              onClick={handleClose}
            ></button>
          </div>

          {/* Modal Body */}
          <div className="modal-body">
            <div className="row">
              <div className="col">
                <h6>Expanded</h6>
              </div>
            </div>

            {expandedArray.length > 0 &&
              expandedArray.map((item, index) => (
                <div key={index} className="row mb-2">
                  <div className="col">
                    <input
                      type="text"
                      placeholder="Category Name"
                      value={item.name}
                      onChange={(e) =>
                        handleCategoryInput(
                          "name",
                          e.target.value,
                          index,
                          "expanded"
                        )
                      }
                      className="form-control"
                    />
                  </div>

                  <div className="col">
                    <select
                      className="form-control"
                      value={item.parentId}
                      onChange={(e) =>
                        handleCategoryInput(
                          "parentId",
                          e.target.value,
                          index,
                          "expanded"
                        )
                      }
                    >
                      <option value="">Select Category</option>
                      {categoryList.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col">
                    <select
                      className="form-control"
                      value={item.type}
                      onChange={(e) =>
                        handleCategoryInput(
                          "type",
                          e.target.value,
                          index,
                          "expanded"
                        )
                      }
                    >
                      <option value="">Select Type</option>
                      <option value="store">Store</option>
                      <option value="product">Product</option>
                      <option value="page">Page</option>
                    </select>
                  </div>
                </div>
              ))}

            <div className="row">
              <div className="col">
                <h6>Checked Categories</h6>
              </div>
            </div>

            {checkedArray.length > 0 &&
              checkedArray.map((item, index) => (
                <div key={index} className="row mb-2">
                  <div className="col">
                    <input
                      type="text"
                      placeholder="Category Name"
                      value={item.name}
                      onChange={(e) =>
                        handleCategoryInput(
                          "name",
                          e.target.value,
                          index,
                          "checked"
                        )
                      }
                      className="form-control"
                    />
                  </div>

                  <div className="col">
                    <select
                      className="form-control"
                      value={item.parentId}
                      onChange={(e) =>
                        handleCategoryInput(
                          "parentId",
                          e.target.value,
                          index,
                          "checked"
                        )
                      }
                    >
                      <option value="">Select Category</option>
                      {categoryList.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col">
                    <select
                      className="form-control"
                      value={item.type}
                      onChange={(e) =>
                        handleCategoryInput(
                          "type",
                          e.target.value,
                          index,
                          "checked"
                        )
                      }
                    >
                      <option value="">Select Type</option>
                      <option value="store">Store</option>
                      <option value="product">Product</option>
                      <option value="page">Page</option>
                    </select>
                  </div>
                </div>
              ))}
          </div>

          {/* Modal Footer */}
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

export default UpdateCategoriesModal;
