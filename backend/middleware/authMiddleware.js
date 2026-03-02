// middleware/authMiddleware.js


import JWT from "jsonwebtoken";
import userModel from "../model/userModel.js";

// Protected Routes token based
export const requireSignIn = async (req, res, next) => {
  try {
    const decode = JWT.verify(
      req.headers.authorization,
      process.env.JWT_SECRET
    );
    req.user = decode;
    console.log("it's working now for user");
    next();
  } catch (error) {
    console.log(error);
    res.status(200).send({
      success: false,
      message: "Authentication failed",
    });
  }
};

// Admin access
export const isAdmin = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user._id);
    if (user.role !== 1) {
      return res.status(200).send({
        success: false,
        message: "Unauthorized Access - Admin Only",
      });
    }
    next();
  } catch (error) {
    console.log(error);
    res.status(200).send({
      success: false,
      error,
      message: "Error in admin middleware",
    });
  }
};

// Super Admin access
export const isSuperAdmin = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user._id);
    if (user.role !== 2) {
      return res.status(200).send({
        success: false,
        message: "Unauthorized Access - Super Admin Only",
      });
    }
    next();
  } catch (error) {
    console.log(error);
    res.status(401).send({
      success: false,
      error,
      message: "Error in super admin middleware",
    });
  }
};
