const Joi = require("joi");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const { Product, validateProduct } = require("../models/Product");
const { User, validateUser } = require("../models/User");
const { admin, user } = require("../middlewares/auth");
const multer = require("multer");
const path = require("path");

// * get all cart products
router.get("/", async (req, res) => {
  try {
    const decodedToken = jwt.verify(
      req.headers["auth-token"],
      process.env.TOKEN_SECRET
    );
    const reqId = decodedToken.id;
    const account = await User.findOne(reqId);
    return res.status(200).send(account.cart);
  } catch (error) {
    return res.status(404).send(new Error("Something went wrong"));
  }
});

// * add product to cart
router.put("/add/:id", async (req, res) => {
  try {
    const decodedToken = jwt.verify(
      req.headers["auth-token"],
      process.env.TOKEN_SECRET
    );
    const reqId = decodedToken.id;
    const account = await User.findOne({ _id: reqId });
    const prod = await Product.findOne({ _id: req.params.id });
    prod.quantity = 1;
    account.cart.push(prod);
    const updCart = await User.findByIdAndUpdate(reqId, {
      $set: { cart: account.cart },
    });
    return res.status(200).send("Product added to cart.");
  } catch (error) {
    return res.status(404).send(new Error("Something went wrong"));
  }
});

router.put("/edit/:id", async (req, res) => {
  try {
    await Product.findByIdAndUpdate(req.params.id, {
      productName: req.body.productName,
      productCategory: req.body.productCategory,
      price: req.body.price,
      discountedPrice: req.body.discountedPrice,
      inStock: req.body.inStock,
      description: req.body.description,
    });
    return res.status(200).send("Product updated");
  } catch (error) {
    return res.status(404).send(new Error("Product not found."));
  }
});

// router.delete("/:id", async (req, res) => {
//   try {
//     const decodedToken = jwt.verify(
//       req.headers["auth-token"],
//       process.env.TOKEN_SECRET
//     );
//     const userId = decodedToken.id;
//     const productId = req.params.id;
//     return res.status(200).send("Product deleted.");
//   } catch (error) {
//     return res.status(404).send(new Error("Product not found."));
//   }
// });

router.delete("/:id", async (req, res) => {
  try {
    const decodedToken = jwt.verify(
      req.headers["auth-token"],
      process.env.TOKEN_SECRET
    );
    const userId = decodedToken.id;
    const productId = req.params.id;
    const user = await User.findById(userId);

    if (!user) return res.status(404).send("User not found.");

    const productIndex = user.cart.findIndex(
      (product) => product._id.toString() === productId
    );

    if (productIndex === -1)
      return res.status(404).send("Product not found in the cart.");

    user.cart.splice(productIndex, 1);
    await user.save();
    return res.status(200).send("Product deleted from cart.");
  } catch (error) {
    return res.status(500).send("An error occurred.");
  }
});

module.exports = router;
