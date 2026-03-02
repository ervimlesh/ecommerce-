import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    products: [
      {
        type: mongoose.ObjectId,
        ref: "Products",
      },
    ], 
    payment: {},
    buyer: {
      type: mongoose.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      default: "Not Process",
      enum: ["Not Process", "Processing", "Shipped", "deliverd", "cancel"],
    },
    name:{
      type:String,
    },
    lname:{
      type:String,
    },
    userEmail:{
      type:String,
    },
    country:{
      type:String,
    },
    state:{
      type:String,
    },
    city:{
      type:String,
    },
    address:{
      type:String,
    },
    pinCode:{
      type:String,
    },
    number:{
      type:String,
    }
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
