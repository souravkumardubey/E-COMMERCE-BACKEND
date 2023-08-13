require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const adminAuth = require("./admin/routes/auth");
const products = require("./admin/routes/products");
const orders = require("./admin/routes/orders");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");

// app.use(bodyParser.json());

app.use(express.json());
app.use("/admin", adminAuth);
app.use("/admin/products", products);
app.use("/admin/orders", orders);
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
