const express = require("express");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const router = express.Router();
const { admin, user } = require("../middlewares/auth");
const { Cart } = require("../models/Cart");

const decodedToken = jwt.verify(
  req.headers["auth-token"],
  process.env.TOKEN_SECRET
);

router.post("/add/:id", async (req, res) => {
  try {
    const item = {
      productId: req.body.productId,
      quantity: req.body.quantity,
      price: req.body.price,
    };
    const reqId = decodedToken.id;
    let cart = await Cart.findOne({ customerId: reqId });
    if (!cart) {
      cart = new Order({
        customerId: req.params.id,
        items: [item],
      });
      await cart.save();
    } else {
      const updatedCart = await Cart.findByIdAndUpdate(cart._id, {
        $set: {
          items: [...cart.items, prod],
        },
      });
    }
    return res.status(200).send("Product added to cart.");
  } catch (error) {
    res.status(404).send(new Error("Something went wrong. Please try again!"));
  }
});
router.get("/", async (req, res) => {
  try {
  } catch (error) {
    return res.status(404).json({ message: "Something went wrong." });
  }
});

module.exports = router;
