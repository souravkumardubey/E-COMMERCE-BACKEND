const express = require("express");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const router = express.Router();
const { admin, user } = require("../middlewares/auth");
const { Cart } = require("../models/Cart");

router.post("/add/:id", async (req, res) => {
  try {
    const decodedToken = jwt.verify(
      req.headers["auth-token"],
      process.env.TOKEN_SECRET
    );

    const item = {
      productId: req.params.id,
      quantity: req.body.quantity,
      price: req.body.price,
    };

    const reqId = decodedToken.id;
    let cart = await Cart.findOne({ customerId: reqId });

    if (!cart) {
      try {
        cart = new Cart({
          customerId: reqId,
          items: [item],
        });
        await cart.save();
      } catch (error) {
        return res.status(404).send(error.message);
      }
    } else {
      const updatedCart = await Cart.findByIdAndUpdate(cart._id, {
        $set: {
          items: [...cart.items, item],
        },
      });
    }
    return res.status(200).send("Product added to cart.");
  } catch (error) {
    res.status(404).send(error.message);
  }
});

module.exports = router;
