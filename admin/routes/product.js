const Joi = require("joi");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const { Product, validateProduct } = require("../models/Product");
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

router.get("/", async (req, res) => {
  const decodedToken = jwt.verify(
    req.headers["auth-token"],
    process.env.TOKEN_SECRET
  );
  const reqId = decodedToken.id;
  const products = await Product.find({ adminId: reqId });
  res.json(products);
});

router.post("/add", async (req, res) => {
  try {
    const { error, value } = validateProduct(req.body);
    if (error) return res.status(404).send(new Error(error.details[0].message));
    const decodedToken = jwt.verify(
      req.headers["auth-token"],
      process.env.TOKEN_SECRET
    );
    const adminId = decodedToken.id;
    // console.log(adminId);
    const product = new Product({
      ..._.pick(req.body, [
        "productName",
        "productCategory",
        "price",
        "discountedPrice",
        "inStock",
        "description",
      ]),
      adminId: adminId,
    });

    await product.save();
    res.status(200).send(product);
  } catch (error) {
    return res.status(404).send(new Error("Something went wrong."));
  }
});

router.post("/edit/:id", async (req, res) => {
  try {
    const productId = req.params.productId;
    const product = await Product.findById(productId);
    if (!product)
      return res.status(404).json({ message: "Product not found." });
    res.status(200).send(product);
  } catch (error) {
    return res.status(404).send(new Error("Product not found."));
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const delId = req.params.id;
    const products = await Product.findByIdAndDelete({ _id: delId });
    return res.status(404).send(new Error("Product not found."));
  } catch (error) {
    return res.status(404).send(new Error("Product not found."));
  }
});

module.exports = router;
