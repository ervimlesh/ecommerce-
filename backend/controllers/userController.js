import { comparePassword, hashPassword } from "../helper/authHelper.js";
import userModel from "../model/userModel.js";
import orderModel from "../model/orderModel.js"
import JWT from "jsonwebtoken";
import sendInvoiceMail from "../utils/sendInvoiceMail.js";
export const registerController = async (req, res) => {
  try {
    const { name, email, password, confirmPassword, answer } = req.body;
    console.log(name, email, password, confirmPassword, answer);
    if (!answer) {
      return res.send({ message: "Answer is required" });
    }
    if (password != confirmPassword) {
      return res.send({ message: " password  and confirm password is not carrect" });
    }
    const existingUser = await userModel.findOne({ email });


    if (existingUser) {
      return res.status(200).send({
        success: false,
        message: "Already register please login",
      });
    }
    const hashedPassword = await hashPassword(password);

    const user = await new userModel({
      name,

      email,
      password: hashedPassword,
      answer,
    }).save();

    res.status(200).send({
      success: true,
      message: "Registered successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in registration ",
      error,
    });
  }
};
export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(req.body);
    //validation
    if (!email || !password) {
      return res.status(200).send({
        success: false,
        message: "Invalid email or password",
      });
    }
    //check user
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(200).send({
        success: false,
        message: "Email is not registerd",
      });
    }
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(200).send({
        success: false,
        message: "Invalid Password",
      });
    }
    //token
    const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.status(200).send({
      success: true,
      message: "login successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in login",
      error,
    });
  }
};


// User order
export const getOrdersController = async (req, res) => {
  try {
    console.log("hello order");
    const orders = await orderModel
      .find({ buyer: req.user._id })
      .populate("products")
      .populate("buyer");
    console.log(orders);
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error WHile Geting Orders",
      error,
    });
  }
};

//Admin orders
export const getAllOrdersController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({})
      .populate("products")
      .populate("buyer", "name")
      .sort({ createdAt: -1 });

    console.log(orders);

    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error WHile Geting Orders",
      error,
    });
  }
};

//order status
export const orderStatusController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const orders = await orderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error While Updateing Order",
      error,
    });
  }
};

export const addressController = async (req, res) => {
  try {
    console.log("hello order");
    console.log(req.body);
    const {
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

    const adminEmail = process.env.EMAIL; // Admin email from environment

    if (!name) {
      return res.send({ message: "Name is required" });
    }
    if (!lname) {
      return res.send({ message: "lname is required" });
    }
    if (!userEmail) {
      return res.send({ message: "Email is required" });
    }
    if (!country) {
      return res.send({ message: "Country is required" });
    }
    if (!state) {
      return res.send({ message: "State is required" });
    }
    if (!city) {
      return res.send({ message: "City is required" });
    }
    if (!address) {
      return res.send({ message: "Address is required" });
    }
    if (!pinCode) {
      return res.send({ message: "Pincode is required" });
    }
    if (!number) {
      return res.send({ message: "Number is required" });
    }

    const order = await orderModel({
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

    let config = {
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    };

    let transporter = nodemailer.createTransport(config);
    let MailGenerator = new Mailgen({
      theme: "default",
      product: {
        name: "Mailgen",
        link: "https://mailgen.js/",
      },
    });

    let response = {
      body: {
        name: "BGS Energy",
        intro: "Your information has arrived!",
        table: {
          data: [
            {
              item: "BGS Supplier utility",
              description: "BGS for gas, water & utility supplier",
              price: "Get Quote",
            },
          ],
        },
        outro: "Looking forward to do more business",
      },
    };
    let mail = MailGenerator.generate(response);


    let message = {
      from: process.env.EMAIL,
      to: userEmail,
      subject: "Get quote",
      html: mail,
    };
    let adminMessage = {
      from: process.env.EMAIL,
      to: adminEmail,
      subject: "New Quote Request",
      html: mail,
    };

    transporter
      .sendMail(message)
      .then(() => {
        return transporter.sendMail(adminMessage);
      })

      .then(() => {
        return res.status(201).json({
          msg: " A New Email received Successfully",
        });
      });

    res.status(200).send({
      success: true,
      message: "Address Submitted Successfully",
      order,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in order Address",
      error,
    });
  }
};


export const getOrderByIdController = async (req, res) => {
  try {
    const order = await orderModel.findById(req.params.orderId)
      .populate("buyer", "name email")
      .populate("products"); // ✅ use lowercase `products` (schema field name)

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error("Error getting order:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const sendInvoiceController = async (req, res) => {
  console.log("its calling");
  try {
    console.log("its called")
    const order = await orderModel.findById(req.params.orderId)
      .populate("buyer", "name email")
      .populate("products");

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    // Import and call email sender utility
    await sendInvoiceMail(order);

    res.status(200).json({ success: true, message: "Invoice sent successfully" });
  } catch (error) {
    console.error("Error sending invoice:", error);
    res.status(500).json({ success: false, message: "Failed to send invoice" });
  }
};

export const forgotPasswordController = async (req, res) => {
  try {
    const { email, answer, newPassword } = req.body;

    // validation
    if (!email || !answer || !newPassword) {
      return res.status(200).send({
        success: false,
        message: "All fields are required",
      });
    }

    // check user
    const user = await userModel.findOne({ email, answer });

    if (!user) {
      return res.status(200).send({
        success: false,
        message: "Wrong email or answer",
      });
    }

    // hash new password
    const hashedPassword = await hashPassword(newPassword);

    // update password
    await userModel.findByIdAndUpdate(user._id, {
      password: hashedPassword,
    });

    res.status(200).send({
      success: true,
      message: "Password Reset Successfully",
    });

  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Something went wrong",
      error,
    });
  }
};
