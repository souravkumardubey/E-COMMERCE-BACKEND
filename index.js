require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const adminAuth = require("./server/routes/admin-auth");
const userAuth = require("./server/routes/user-auth");
const products = require("./server/routes/products");
const orders = require("./server/routes/orders");
const cart = require("./server/routes/cart");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const cookieParser = require("cookie-parser");

// app.use(bodyParser.json());

app.use(express.json());
app.use(cookieParser());
app.use("/admin", adminAuth);
app.use("/user", userAuth);
app.use("/products", products);
app.use("/orders", orders);
app.use("/cart", cart);
app.use(methodOverride("_method"));

mongoose
  .connect("mongodb://localhost/admin-backend")
  .then(() => console.log("Connected to db.."))
  .catch((err) => {
    console.error("Could not connect to MongoDB..");
  });

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
