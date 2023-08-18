const express = require("express");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const router = express.Router();
const { admin, user } = require("../middlewares/auth");
const { Order, validateOrder } = require("../models/Order");

router.get("/", admin, async (req, res) => {
  try {
    const orders = await Order.find();
    if (!orders)
      return res.status(404).json({ message: "Something went wrong." });

    return res.status(200).send(orders);
  } catch (error) {
    return res.status(404).json({ message: "Something went wrong." });
  }
});

router.post("/new-order", user, async (req, res) => {
  try {
    const { error, value } = validateOrder(req.body);
    if (error) return res.status(404).send(error.details[0].message);

    const order = new Order({
      ..._.pick(req.body, [
        "items",
        "orderedDate",
        "address",
        "totalPrice",
        "orderStatus",
      ]),
    });
    await order.save();
    res.status(200).send(order);
  } catch (error) {
    return res.status(404).send(new Error("Something went wrong"));
  }
});

router.get("/order/:id", admin, async (req, res) => {
  try {
    const order = await Order.findById({ _id: req.params.id });
    if (!order) return res.status(404).json({ message: "No order found." });
    return res.status(200).send(order);
  } catch (error) {
    return res.status(404).json({ message: "No order found." });
  }
});

router.put("/order-accepted/:id", async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, {
      orderStatus: "Accepted",
    });
    if (!order) return res.status(404).send(error.details[0].message);
    await order.save();
    return res.status(200).send(order);
  } catch (error) {
    return res.status(404).json({ message: "No product found." });
  }
});

module.exports = router;
