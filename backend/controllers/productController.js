import fs from "fs";
import slugify from "slugify";

import braintree from "braintree";
import dotenv from "dotenv";

import productModel from "../model/productModel.js";
import categoryModal from "../model/categoryModal.js";
import orderModel from "../model/orderModel.js";
import userModel from "../model/userModel.js";
import Razorpay from "razorpay";

dotenv.config();



const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

export const createOrderController = async (req, res) => {
  console.log("hellow body",req.body);
  try {
    const options = {
      amount: req.body.amount * 100, // in paise
      currency: "INR",
      receipt: `order_rcptid_${Math.random() * 1000}`,
    };
    console.log("option",options)
    const order = await instance.orders.create(options);
    console.log("orders",order);
    res.status(200).json({ success: true, order });
  } catch (error) {
    console.log(error);
    res.status(500).send("Failed to create Razorpay order");
  }
};

export const razorpayOrderController = async (req, res) => {
  try {
    const {
      razorpayPaymentId,
      razorpayOrderId,
      razorpaySignature,
      cart,
      buyer,
      shippingInfo,
    } = req.body;

    const order = await new orderModel({
      products: cart.map((p) => p._id),
      payment: {
        razorpayPaymentId,
        razorpayOrderId,
        razorpaySignature,
      },
      buyer,
      ...shippingInfo,
    }).save();

    res.status(201).json({ success: true, order });
  } catch (error) {
    console.log("Order Save Error:", error);
    res.status(500).json({ success: false, message: "Order creation failed" });
  }
};




export const createProductController = async (req, res) => {
  try {
    const {
      name,
      price,
      description,
      category,
      visibility,
      quantity,
      createdBy,
    } = req.body;

    let productPictures = [];
    const { mainImage, productPicture } = req.files;

    if (productPicture && productPicture.length > 0) {
      productPictures = productPicture.map((file) => {
        return { img: file.filename };
      });
    }
    let mainImages = [];

    if (mainImage && mainImage.length > 0) {
      mainImages = mainImage.map((file) => {
        return { img: file.filename };
      });
    }

    const product = new productModel({
      name: name,
      slug: slugify(name),
      price,
      quantity,
      description,
      mainImages,
      productPictures,
      category,
      visibility,
      createdBy: req.user._id,
    });

    await product.save();

    res.status(200).send({
      success: true,
      product,
      files: req.files,
      message: "Product Created SuccessFully ",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in creating product",
      error,
    });
  }
};

// getProductController
export const getProductController = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = 10;
    const totalPosts = await productModel.countDocuments();
    console.log("totalPost",totalPosts);
    console.log("hello");

    const totalPages = Math.ceil(totalPosts / perPage);
    console.log("totalPage",totalPages);

    if (page > totalPages) {
      return res.status(404).json({ message: "page not found" });
    }
    const posts = await productModel
      .find()
      .populate("category")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .exec();

    // console.log(products);

    // const products = await productModel
    //   .find({})
    //   .populate("category")
    //   .limit(12)
    //   .sort({ createdAt: -1 });

    res.status(200).send({
      posts,
      totalPages,
      page,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in getting products",
      error,
    });
  }
};
export const visibleProductController = async (req, res) => {
  try {
    const products = await productModel
      .find({ visibility: req.params.buttonid })
      .populate("category");

    res.status(200).send({
      success: true,
      message: "Error in Get visible Products",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Visible",
      error,
    });
  }
};

// get single product
export const getSingleProductController = async (req, res) => {
  try {
    const product = await productModel
      .findOne({ slug: req.params.slug })
      .populate("category");



    res.status(200).send({
      success: true,
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Eror while getitng single product",
      error,
    });
  }
};

// get photo
export const productPhotoController = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.pid).select("photo");
    if (product.photo.data) {
      res.set("Content-type", product.photo.contentType);
      return res.status(200).send(product.photo.data);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Erorr while getting photo",
      error,
    });
  }
};

//delete Product
export const deleteProductController = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    await productModel.findByIdAndDelete(id);
    res.status(200).send({
      success: true,
      message: "Product Deleted Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while deleting Porduct",
      error,
    });
  }
};

//update products
export const updateProductController = async (req, res) => {
  try {
    const {
      name,
      price,
      description,
      category,
      visibility,
      quantity,
      createdBy,
    } = req.body;
    let productPictures = [];

    if (req.files.length > 0) {
      productPictures = req.files.map((file) => {
        return { img: file.filename };
      });
    }

    const products = await productModel.findByIdAndUpdate(
      req.params.pid,
      {
        name: name,
        slug: slugify(name),
        price,
        quantity,
        description,
        productPictures,
        category,
        visibility,
        createdBy: req.user._id,
      },
      { new: true }
    );

    await products.save();
    res.status(201).send({
      success: true,
      message: "Product Updated Successfully",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in Updte product",
    });
  }
};

// product count
export const productCountController = async (req, res) => {
  try {
    const total = await productModel.find({}).estimatedDocumentCount();
    res.status(200).send({
      success: true,
      total,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      message: "Error in product count",
      error,
      success: false,
    });
  }
};

// product list base on page
export const productListController = async (req, res) => {
  try {
    const perPage = 6;
    const page = req.params.page ? req.params.page : 1;
    const products = await productModel
      .find({})
      .limit(perPage)
      .skip((page - 1) * perPage)
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "error in per page ctrl",
      error,
    });
  }
};

// filters
export const productFiltersController = async (req, res) => {
  try {
    const { checked, radio } = req.body;
    let args = {};
    if (checked.length > 0) args.visibility = checked;
    if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };

    const products = await productModel.find(args);
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error WHile Filtering Products",
      error,
    });
  }
};

export const realtedProductController = async (req, res) => {
  try {
    const { pid, cid } = req.params;
    const products = await productModel
      .find({
        category: cid,
        _id: { $ne: pid },
      })
      .limit(3)
      .populate("category");

    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "error while geting related product",
      error,
    });
  }
};

//productCategoryController
export const productCategoryController = async (req, res) => {
  try {
    const category = await  categoryModal.findOne({ slug: req.params.slug });
    const products = await productModel.find({ category }).populate("category");

    res.status(200).send({
      success: true,
      category,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in productCategory",
      error,
    });
  }
};

//searchProductController
export const searchProductController = async (req, res) => {
  try {
    const { keyword } = req.params;
    console.log(keyword);

    const results = await productModel.find({
      $or: [
        { name: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ],
    });
    console.log(results);
    res.json(results);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in search product",
      error,
    });
  }
};

//payment gateway api
//token
export const braintreeTokenController = async (req, res) => {
  try {
    gateway.clientToken.generate({}, function (err, response) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.send(response);
      }
    });
  } catch (error) {
    console.log(error);
  }
};

//payment
export const brainTreePaymentController = async (req, res) => {
  try {
    const {
      nonce,
      cart,
      name,
      lname,
      userEmail,
      country,
      state,
      city,
      address,
      pinCode,
      number,
    } = req.body;
    console.log(req.body);

    let total = 0;
    cart.map((i) => {
      total += i.price;
    });
    let newTransaction = gateway.transaction.sale(
      {
        amount: total,
        paymentMethodNonce: nonce,
        options: {
          submitForSettlement: true,
        },
      },
      function (error, result) {
        if (result) {
          const order = new orderModel({
            products: cart,
            payment: result,
            buyer: req.user._id,
            name,
            lname,
            userEmail,
            country,
            state,
            city,
            address,
            pinCode,
            number,
          }).save();
          res.json({ ok: true });
        } else {
          res.status(500).send(error);
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
};

// createProductReviewController

export const createProductReviewController = async (req, res) => {
  try {
    const { rating, comment, id } = req.body;
    console.log(req.body);
    
    const user = await  userModel.findById(req.user._id);

    const review = {
      user: req.user._id,
      name: user.name,
      rating: Number(rating),
      comment,
    };
   
    const product = await productModel.findById(id);

    const isReviewed = product.reviews.find(
      (rev) => rev.user.toString() === req.user._id.toString()
    );

    if (isReviewed) {
      product.reviews.forEach((rev) => {
        if (rev.user.toString() === req.user._id.toString())
          (rev.rating = rating), (rev.comment = comment);
      });
    } else {
      product.reviews.push(review);
      product.numOfReviews = product.reviews.length;
    }

    let avg = 0;

    product.reviews.forEach((rev) => {
      avg += rev.rating;
    });

    product.ratings = avg / product.reviews.length;

    await product.save();

    res.status(200).send({
      success: true,
      message: "Reviews Submitted Seccessfully !",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in search product",
      error,
    });
  }
};

//getProductReviewsController
export const getProductReviewsController = async (req, res) => {
  try {
    const product = await productModel.findById(req.query.id);

    if (!product) {
      return res.send({ product: "Product not found" });
    }
    res.status(200).send({
      success: true,
      reviews: product.reviews,
    });

  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in getting Reviews",
      error,
    });
  }
};

// deleteReviewController

export const deleteReviewController = async(req, res)=>{
  try{
    console.log("hello");
    console.log(req.query);

    const product = await productModel.findById(req.query.productId);

    
    if (!product) {
      return res.send({ product: "Product not found" });
    }
    const reviews = product.reviews.filter(
      (rev) => rev._id.toString() !== req.query.id.toString()
    );
    console.log(reviews);

    let avg = 0;

  reviews.forEach((rev) => {
    avg += rev.rating;
  });

  let ratings = 0;

  if (reviews.length === 0) {
    ratings = 0;
  } else {
    ratings = avg / reviews.length;
  }

  const numOfReviews = reviews.length;

  await productModel.findByIdAndUpdate(
    req.query.productId,
    {
      reviews,
      ratings,
      numOfReviews,
    },
    {
      new: true,
    }
  );
  res.status(200).send({
    success: true,
    message:"User's reviews deleted successfully"

  });

  }catch(error){
    console.log(error);
    res.status(500).send({

      success:false,
      message:"error in deleting products",
      error
    })

  }
  
}

// newly added controller

export const getProductsByCategoryIdController = async (req, res) => {
  try {
    const { cid } = req.query; // category id from query string
    console.log("query", req.query);
    console.log("params", req.params)
    

    if (!cid) {
      return res.status(400).json({ success: false, message: "Category ID (cid) is required" });
    }

    const products = await productModel
      .find({ category: cid })
      .populate("category")
      .populate("createdBy", "userName email"); // optional

      console.log("products", products);
    return res.status(200).json({
      success: true,
      total: products.length,
      products,
    });
  } catch (error) {
    console.error("Error in getProductsByCategoryId:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
