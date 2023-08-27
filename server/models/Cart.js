const mongoose = require("mongoose");
const Joi = require("joi");
const joiObjectid = require("joi-objectid");

const cartSchema = new mongoose.Schema({
  customerId: {
    type: String,
    required: true,
  },
  items: [
    {
      productId: {
        type: String,
      },
      quantity: {
        type: Number,
        default: 1,
      },
      price: {
        type: Number,
      },
    },
  ],
});

const Cart = mongoose.model("Cart", cartSchema);
exports.Cart = Cart;
