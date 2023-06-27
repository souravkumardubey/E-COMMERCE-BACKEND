require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const adminAuth = require("./admin/routes/auth");

app.use(express.json());
app.use("/admin", adminAuth);

mongoose
  .connect("mongodb://localhost/admin-backend")
  .then(() => console.log("Connected to db.."))
  .catch((err) => {
    console.error("Could not connect to MongoDB..");
  });

const port = process.env.USER_PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port:`);
});
