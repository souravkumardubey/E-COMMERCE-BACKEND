const Joi = require("joi");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const { Product, validateProduct } = require("../models/product");
const multer = require("multer");
const path = require("path");

// const upload = multer({ storage: storage });

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "../images");
//   },
//   filename: (req, file, cb) => {
//     console.log(file);
//     cb(null, Date.now() + path.extname(file.originalname));
//   },
// });

router.post("/add", async (req, res) => {
  const { error, value } = validateProduct(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const product = new Product(
    _.pick(req.body, [
      "productName",
      "productCategory",
      "price",
      "discountedPrice",
      "inStock",
      "description",
    ])
  );
  await user.save();
  res.send(user);
});

module.exports = router;
