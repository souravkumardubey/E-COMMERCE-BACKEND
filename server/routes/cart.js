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

router.get("/", user, async (req, res) => {
  try {
    const decodedToken = jwt.verify(
      req.headers["auth-token"],
      process.env.TOKEN_SECRET
    );
    const reqId = decodedToken.id;
    let cart = await Cart.findOne({ customerId: reqId });
    if (!cart) return res.status(200).send({});
    return res.status(200).send(cart);
  } catch (error) {
    return res.status(404).send(new Error(error.message));
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const decodedToken = jwt.verify(
      req.headers["auth-token"],
      process.env.TOKEN_SECRET
    );

    const reqId = decodedToken.id;
    const itemIdToDelete = req.params.id;

    let cart = await Cart.findOne({ customerId: reqId });

    if (!cart) return res.status(404).send("Cart not found.");

    const itemIndexToDelete = cart.items.findIndex(
      (item) => item.productId === itemIdToDelete
    );

    if (itemIndexToDelete === -1)
      return res.status(404).send("Item not found in cart.");

    cart.items.splice(itemIndexToDelete, 1);
    await cart.save();

    return res.status(200).send("Item removed from cart.");
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const decodedToken = jwt.verify(
      req.headers["auth-token"],
      process.env.TOKEN_SECRET
    );

    const reqId = decodedToken.id;
    const itemIdToUpdate = req.params.id;
    const newQuantity = req.body.quantity;

    if (typeof newQuantity !== "number" || newQuantity <= 0)
      return res.status(400).send("Invalid quantity value.");

    let cart = await Cart.findOne({ customerId: reqId });

    if (!cart) return res.status(404).send("Cart not found.");

    const itemToUpdate = cart.items.find((item) => item._id == itemIdToUpdate);

    if (!itemToUpdate) return res.status(404).send("Item not found in cart.");

    itemToUpdate.quantity = newQuantity;
    await cart.save();

    return res.status(200).send("Item quantity updated in cart.");
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

module.exports = router;
