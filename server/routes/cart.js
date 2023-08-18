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
router.post("/add/:id", admin, async (req, res) => {
  try {
    const decodedToken = jwt.verify(
      req.headers["auth-token"],
      process.env.TOKEN_SECRET
    );
    const reqId = decodedToken.id;
    const account = await User.findOne(reqId);
    const prod = await Product.findOne(req.params.id);
    prod.quantity = 1;
    account.cart.push(prod);
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

router.delete("/:id", async (req, res) => {
  try {
    const delId = req.params.id;
    const products = await Product.findByIdAndDelete({ _id: delId });
    return res.status(404).send(new Error("Product deleted."));
  } catch (error) {
    return res.status(404).send(new Error("Product not found."));
  }
});

module.exports = router;
