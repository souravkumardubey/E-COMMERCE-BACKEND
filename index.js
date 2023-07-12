require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const adminAuth = require("./admin/routes/auth");
const product = require("./admin/routes/product");

app.use(express.json());
app.use("/admin", adminAuth);
app.use("/catalogue/products", product);

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
