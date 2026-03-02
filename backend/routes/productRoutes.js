import express from "express";
import { isAdmin, requireSignIn } from "../middleware/authMiddleware.js";
import {

  brainTreePaymentController,
  braintreeTokenController,
  createProductController,
  createProductReviewController,
  deleteProductController,
  deleteReviewController,
  getProductController,
  getProductReviewsController,
  getSingleProductController,
  productCategoryController,

  productCountController,
  productFiltersController,
  productListController,
  productPhotoController,
  realtedProductController,
  searchProductController,
  updateProductController,
  visibleProductController,
  getProductsByCategoryIdController,
  createOrderController,
  razorpayOrderController,
} from "../controllers/productController.js";
import multer from "multer";
import shortid from "shortid";
import path from "path";
import { fileURLToPath } from "url";

//ES module fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(path.dirname(__dirname), "uploads/"));
  },
  filename: function (req, file, cb) {
    cb(null, shortid.generate() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

router.post(
  "/create-product",
  requireSignIn,
  isAdmin,
  upload.fields([{ name: "mainImage", maxCount: 10 }, { name: "productPicture", maxCount: 10 }]),
  createProductController
);

// get product for Admin
router.get("/get-product", getProductController);

// visible product
router.get("/visible-product/:buttonid", visibleProductController);
//single product
router.get("/get-product/:slug", getSingleProductController);

//similar product
router.get("/related-product/:pid/:cid", realtedProductController);

//get photo
router.get("/product-photo/:pid", productPhotoController);

//delete Products
router.delete("/delete-product/:id", deleteProductController);

//routes
router.put(
  "/update-product/:pid",
  requireSignIn, isAdmin,
  upload.array("productPicture"),
  updateProductController
);
//product count
router.get("/product-count", productCountController);
//product per page
router.get("/product-list/:page", productListController);

//filter product
router.post("/product-filters", productFiltersController);
//allFilter
// router.get("/all-filters", allFilterController);

//category wise Product
router.get("/product-category/:slug", productCategoryController);
//search Product
router.get("/search/:keyword", searchProductController);



//payments routes
//token
router.get("/braintree/token", braintreeTokenController);
//payments
router.post("/braintree/payment", requireSignIn, brainTreePaymentController);

// create review
router.put("/review", requireSignIn, createProductReviewController)

// get reviews
router.get("/reviews", requireSignIn, isAdmin, getProductReviewsController);

// delete reviews
router.delete("/delete-reviews", requireSignIn, isAdmin, deleteReviewController)

// newly added route
router.get("/products-by-cat", getProductsByCategoryIdController);

// --------------------Razorypay-------
router.post("/razorpay/order", createOrderController);
router.post("/razorpay/save-order", razorpayOrderController);
export default router;
