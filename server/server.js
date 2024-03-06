const express = require("express");
const dotenv = require("dotenv");
const colors = require("colors");
const morgan = require("morgan");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoute");
const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const PaymentRoutes = require("./routes/PaymentRoutes");
dotenv.config();

const app = express();

connectDB();

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/product", productRoutes);
app.use("/api/v1/order", orderRoutes);
app.use("/api/v1/payment", PaymentRoutes);

app.get("/", (req, res) => {
  res.send("<h1>Welcome to ecommerce app</h1>");
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(
    `Server Running on ${process.env.DEV_MODE} mode on port ${PORT}`.bgCyan
      .white
  );
});
