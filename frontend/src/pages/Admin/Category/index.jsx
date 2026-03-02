import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import CheckboxTree from "react-checkbox-tree";
import {
  IoIosCheckboxOutline,
  IoIosCheckbox,
  IoIosArrowForward,
  IoIosArrowDown,
  IoIosAdd,
  IoIosTrash,
  IoIosCloudUpload,
} from "react-icons/io";

import "react-checkbox-tree/lib/react-checkbox-tree.css";
import UpdateCategoriesModal from "./components/UpdateCategoriesModal.jsx";
import AddCategoryModal from "./components/AddCategoryModal.jsx";
import "./style.css";
import AdminSidebar from "../../../components/AdminSidebar.jsx";

// Inlined Modal Component without react-bootstrap
const Modal = (props) => {
  return (
    <div
      className={`modal fade ${props.show ? "show d-block" : ""}`}
      tabIndex="-1"
      style={props.show ? { backgroundColor: "rgba(0,0,0,0.5)" } : {}}
    >
      <div className={`modal-dialog modal-${props.size || "md"}`}>
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{props.modalTitle}</h5>
            <button
              type="button"
              className="btn-close"
              onClick={props.handleClose}
            ></button>
          </div>
          <div className="modal-body">{props.children}</div>
          <div className="modal-footer">
            {props.buttons &&
              props.buttons.map((btn, index) => (
                <button
                  key={index}
                  className={`btn btn-${btn.color}`}
                  onClick={btn.onClick}
                  style={{ marginRight: "10px" }}
                >
                  {btn.label}
                </button>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const Category = (props) => {
  const [categoryName, setCategoryName] = useState("");
  const [parentCategoryId, setParentCategoryId] = useState("");
  const [categoryImage, setCategoryImage] = useState("");
  const [show, setShow] = useState(false);
  const [checked, setChecked] = useState([]);
  const [expanded, setExpanded] = useState([]);
  const [checkedArray, setCheckedArray] = useState([]);
  const [expandedArray, setExpandedArray] = useState([]);
  const [updateCategoryModal, setUpdateCategoryModal] = useState(false);
  const [deleteCategoryModal, setDeleteCategoryModal] = useState(false);

  const [category, setCategory] = useState([]);

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

  const handleClose = async () => {
    if (categoryName === "") {
      alert("Category name is required");

      setShow(false);
      return;
    }

    const form = new FormData();
    form.append("name", categoryName);
    form.append("parentId", parentCategoryId);
    form.append("categoryImage", categoryImage);

    try {
      const { data } = await axios.post(
        "/api/v1/category/create-category",
        form
      );

      if (data?.success) {
        toast.success("Category Created Successfully");
        await getAllCategory();
      } else {
        toast.error(data?.message || "Something went wrong");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while creating the category");
    }

    setCategoryName("");
    setParentCategoryId("");
    setCategoryImage(null);
    setShow(false);
  };

  const handleShow = () => setShow(true);

  const renderCategories = (categories) => {
    let myCategories = [];

    for (let category of categories) {
      myCategories.push({
        label: category.name,
        value: category._id,
        children:
          category.children.length > 0 && renderCategories(category.children),
      });
    }
    return myCategories;
  };

  const createCategoryList = (categories, options = []) => {
    for (let category of categories) {
      options.push({
        value: category._id,
        name: category.name,
        parentId: category.parentId,
        type: category.type,
      });
      if (category.children.length > 0) {
        createCategoryList(category.children, options);
      }
    }

    return options;
  };

  const handleCategoryImage = (e) => {
    setCategoryImage(e.target.files[0]);
  };

  const updateCategory = () => {
    updateCheckedAndExpandedCategories();
    setUpdateCategoryModal(true);
  };

  const updateCheckedAndExpandedCategories = () => {
    const categories = createCategoryList(category);
    const checkedArray = [];
    const expandedArray = [];
    checked.length > 0 &&
      checked.forEach((categoryId) => {
        const category = categories.find(
          (category) => categoryId == category.value
        );
        category && checkedArray.push(category);
      });
    expanded.length > 0 &&
      expanded.forEach((categoryId) => {
        const category = categories.find(
          (category) => categoryId == category.value
        );
        category && expandedArray.push(category);
      });
    setCheckedArray(checkedArray);
    setExpandedArray(expandedArray);
  };

  const handleCategoryInput = (key, value, index, type) => {
    if (type == "checked") {
      const updatedCheckedArray = checkedArray.map((item, _index) =>
        index == _index ? { ...item, [key]: value } : item
      );
      setCheckedArray(updatedCheckedArray);
    } else if (type == "expanded") {
      const updatedExpandedArray = expandedArray.map((item, _index) =>
        index == _index ? { ...item, [key]: value } : item
      );
      setExpandedArray(updatedExpandedArray);
    }
  };

  const updateCategoriesForm = async () => {
    try {
      const form = new FormData();

      expandedArray.forEach((item) => {
        form.append("_id", item.value);
        form.append("name", item.name);
        form.append("parentId", item.parentId ? item.parentId : "");
        form.append("type", item.type || "");
      });

      checkedArray.forEach((item) => {
        form.append("_id", item.value);
        form.append("name", item.name);
        form.append("parentId", item.parentId ? item.parentId : "");
        form.append("type", item.type || "");
      });

      // Debug: See exactly what is in FormData
      for (let [key, value] of form.entries()) {
        console.log(key, value);
      }

      const { data } = await axios.put(
        "/api/v1/category/update-category",
        form
      );

      if (data?.success) {
        toast.success("Category Updated Successfully");
        getAllCategory();
        setUpdateCategoryModal(false);
      } else {
        toast.error(data?.message || "Something went wrong");
      }
    } catch (error) {
      console.error(error);
      toast.error("Server Error");
    }
  };

  const deleteCategory = () => {
    updateCheckedAndExpandedCategories();
    setDeleteCategoryModal(true);
  };

  const deleteCategories = async () => {
    console.log("it is calling");
    try {
      // ✅ Only take selected checkboxes
      const checkedIdsArray = checkedArray.map((item) => ({
        _id: item.value,
      }));
      console.log("checkedIdsArray", checkedIdsArray);

      // ❌ Don't merge with expandedArray (that caused all deletes)
      const idsArray = checkedIdsArray;

      if (idsArray.length === 0) {
        toast.error("No categories selected for deletion");
        return;
      }

      const { data } = await axios.delete("/api/v1/category/delete-category", {
        data: idsArray,
      });

      if (data?.success) {
        toast.success("Category Deleted successfully");
        setDeleteCategoryModal(false);
        getAllCategory(); // refresh categories
      }
    } catch (error) {
      console.log(error);
      toast.error("Error while deleting category");
    }

    setDeleteCategoryModal(false);
  };

  const renderDeleteCategoryModal = () => {
    return (
      <Modal
        modalTitle="Confirm"
        show={deleteCategoryModal}
        handleClose={() => setDeleteCategoryModal(false)}
        buttons={[
          {
            label: "No",
            color: "primary",
            onClick: () => {
              alert("no");
            },
          },
          {
            label: "Yes",
            color: "danger",
            onClick: deleteCategories,
          },
        ]}
      >
        <h5>Expanded</h5>
        {expandedArray.map((item, index) => (
          <span key={index}>{item.name}</span>
        ))}
        <h5>Checked</h5>
        {checkedArray.map((item, index) => (
          <span key={index}>{item.name}</span>
        ))}
      </Modal>
    );
  };

  const categoryList = createCategoryList(category);

  return (
    <>
      <div className="d-flex">
        <div>
          <AdminSidebar />
        </div>

        <div className="container">
          <div className="row">
            <div className="col-12">
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <h3>Category</h3>
                <div className="actionBtnContainer">
                  <span>Actions: </span>
                  <button onClick={handleShow}>
                    <IoIosAdd /> <span>Add</span>
                  </button>
                  <button onClick={deleteCategory}>
                    <IoIosTrash /> <span>Delete</span>
                  </button>
                  <button onClick={updateCategory}>
                    <IoIosCloudUpload /> <span>Edit</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <CheckboxTree
                nodes={renderCategories(category)}
                checked={checked}
                expanded={expanded}
                onCheck={(checked) => setChecked(checked)}
                onExpand={(expanded) => setExpanded(expanded)}
                icons={{
                  check: <IoIosCheckbox />,
                  uncheck: <IoIosCheckboxOutline />,
                  halfCheck: <IoIosCheckboxOutline />,
                  expandClose: <IoIosArrowForward />,
                  expandOpen: <IoIosArrowDown />,
                }}
              />
            </div>
          </div>
        </div>
        <AddCategoryModal
          show={show}
          handleClose={() => setShow(false)}
          onSubmit={handleClose}
          modalTitle={"Add New Category"}
          categoryName={categoryName}
          setCategoryName={setCategoryName}
          parentCategoryId={parentCategoryId}
          setParentCategoryId={setParentCategoryId}
          categoryList={categoryList}
          handleCategoryImage={handleCategoryImage}
        />
        <UpdateCategoriesModal
          show={updateCategoryModal}
          handleClose={() => setUpdateCategoryModal(false)}
          onSubmit={updateCategoriesForm}
          modalTitle={"Update Categories"}
          size="lg"
          expandedArray={expandedArray}
          checkedArray={checkedArray}
          handleCategoryInput={handleCategoryInput}
          categoryList={categoryList}
        />

        {renderDeleteCategoryModal()}
      </div>
    </>
  );
};

export default Category;
