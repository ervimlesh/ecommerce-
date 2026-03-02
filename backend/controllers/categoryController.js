import slugify from "slugify";
import categoryModal from "../model/categoryModal.js";

//
function createCategories(categories, parentId = null) {
  const categoryList = [];
  let category;
  if (parentId == null) {
    category = categories.filter((cat) => cat.parentId == undefined);
  } else {
    category = categories.filter((cat) => cat.parentId == parentId);
  }

  for (let cate of category) {
    categoryList.push({
      _id: cate._id,
      name: cate.name,
      categoryImage: cate.categoryImage,
      slug: cate.slug,
      parentId: cate.parentId,
      type: cate.type,
      children: createCategories(categories, cate._id),
    });
  }
  //  console.log( "cat data",categoryList);
  return categoryList;
}

//
export const createCategoryController = async (req, res) => {
  // console.log("req?.body", req.body)
  // console.log("req?.files", req.file);
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(200).send({ message: "Name is required" });
    }
    const existingCategory = await categoryModal.findOne({ name });

    if (existingCategory) {
      return res.status(200).send({
        success: false,
        message: "Category Already Exisits",
      });
    }
    const categoryObj = {
      name: req.body.name,
      slug: slugify(name),
      createdBy: req.user._id,
    };

    if (req.file) {
      categoryObj.categoryImage = req.file.filename;
    }
    if (req.body.parentId) {
      categoryObj.parentId = req.body.parentId;
    }
    const category = new categoryModal(categoryObj);

    await category.save();

    res.status(200).send({
      success: true,
      message: "Category created Successfully",
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Errro in Category",
    });
  }
};

//update category
export const updateCategoryController = async (req, res) => {
  console.log("update part data", req.body);

  try {
    const { _id, name, parentId, type } = req.body;
    const updatedCategories = [];

    if (Array.isArray(name)) {
      for (let i = 0; i < name.length; i++) {
        const category = {
          name: name[i],
          type: type[i] === "undefined" ? "" : type[i], // prevent literal "undefined"
        };

        // Handle empty parentId case
        if (parentId[i] === "" || parentId[i] === null) {
          category.parentId = null; // explicitly remove parent
        } else {
          category.parentId = parentId[i];
        }

        const updatedCategory = await categoryModal.findOneAndUpdate(
          { _id: _id[i] },
          category,
          { new: true }
        );

        updatedCategories.push(updatedCategory);
      }

      return res.status(201).send({
        success: true,
        message: "Category Updated Successfully",
        updatedCategories,
      });
    } else {
      const category = {
        name,
        type: type === "undefined" ? "" : type,
      };

      if (parentId === "" || parentId === null) {
        category.parentId = null;
      } else {
        category.parentId = parentId;
      }

      const updatedCategory = await categoryModal.findOneAndUpdate(
        { _id },
        category,
        { new: true }
      );

      return res.status(201).send({
        success: true,
        message: "Category Updated Successfully",
        updatedCategory,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in category controller",
    });
  }
};

// get all cat
export const categoryControlller = async (req, res) => {
  try {
    // categoryModal.find({}).exec((categories) => {
    //   if (categories) {
    //     const category = createCategories(categories);
    //     res.status(200).json({ category });
    //   }
    // });

    const categories = await categoryModal.find({});

    if (categories) {
      const category = createCategories(categories);

      res.status(200).send({
        success: true,
        message: "All Categories List",
        category,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while getting all categories",
    });
  }
};

// single category
export const singleCategoryController = async (req, res) => {
  try {
    const category = await categoryModal.findOne({ slug: req.params.slug });
    res.status(200).send({
      success: true,
      message: "Get SIngle Category SUccessfully",
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error While getting Single Category",
    });
  }
};

//delete category
export const deleteCategoryController = async (req, res) => {
  try {
    const idsArray = req.body; // axios sends { data: ... } into req.body
    console.log("Incoming delete idsArray:", idsArray);

    if (!idsArray || !Array.isArray(idsArray)) {
      return res.status(400).send({
        success: false,
        message: "Invalid data format. Expected an array of category IDs.",
      });
    }

    // Extract only _id values
    const ids = idsArray.map((c) => c._id);
    console.log("Deleting categories with ids:", ids);

    const result = await categoryModal.deleteMany({ _id: { $in: ids } });

    if (result.deletedCount === 0) {
      return res.status(404).send({
        success: false,
        message: "No categories found to delete",
      });
    }

    res.status(200).send({
      success: true,
      message: "Categories deleted successfully",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("Delete category error:", error);
    res.status(500).send({
      success: false,
      message: "Error while deleting category",
      error: error.message,
    });
  }
};
