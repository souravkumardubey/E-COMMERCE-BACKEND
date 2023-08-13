const Joi = require("joi");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const router = express.Router();
const { Order, validateOrder } = require("../models/Order");

router.get("/", async (req, res) => {
  try {
    const orders = await Order.find();
    if (!orders)
      return res.status(404).json({ message: "Something went wrong." });

    return res.status(200).send(orders);
  } catch (error) {
    return res.status(404).json({ message: "Something went wrong." });
  }
});

router.post("/new-order", async (req, res) => {
  try {
    const { error, value } = validateOrder(req.body);
    if (error) return res.status(404).send(new Error(error.details[0].message));
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
    return res.status(404).send(new Error(error.details[0].message));
  }
});

router.get("/order/:id", async (req, res) => {
  try {
    const order = await Order.findById({ _id: req.params.id });
    if (!order) return res.status(404).json({ message: "No order found." });
    return res.status(200).send(order);
  } catch (error) {
    return res.status(404).json({ message: "No order found." });
  }
});

router.put("/order/:id", async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, {
      orderStatus: "Accepted",
    });
    if (!order) return res.status(404).json({ message: "No product found." });
    return res.status(200).send(order);
  } catch (error) {
    return res.status(404).json({ message: "No product found." });
  }
});

module.exports = router;
