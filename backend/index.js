import express from "express"
import cors from "cors"
import morgan from "morgan"
import bodyParser from "body-parser";
import colors from "colors"
import authRoutes from "./routes/authRoutes.js"
import dotenv from "dotenv"
import connectDb from "./config/connectDb.js";
import categoryRoute from "./routes/categoryRoute.js";
import productRoutes from "./routes/productRoutes.js";
export const app = express();


dotenv.config();
connectDb();

app.use(express.static('uploads'));  

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/category", categoryRoute);
app.use("/api/v1/product", productRoutes);

app.use("/api/v1/otp", (req, res) => {
  res.send("welcome");
});
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`.bgCyan.white);
})

