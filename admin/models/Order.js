const mongoose = require("mongoose");
const Joi = require("joi");

const orderSchema = new mongoose.Schema({
  orders: {
    type: [
      {
        productId: {
          type: String,
          required: true,
        },
        productDescription: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        totalCost: {
          type: Number,
          required: true,
        },
      },
    ],
    required: true,
  },
  orderedDate: {
    type: Date,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  orderStatus: {
    type: Boolean,
    default: false,
  },
});

const Order = mongoose.model("Order", orderSchema);

const validateOrder = (order) => {
  const productSchema = Joi.object({
    productId: Joi.string().required(),
    productDescription: Joi.string().required(),
    price: Joi.number().required(),
    quantity: Joi.number().required(),
    totalCost: Joi.number().required(),
  });

  const schema = Joi.object({
    orders: Joi.array().items(productSchema).required(),
    orderedDate: Joi.date().required(),
    address: Joi.string().required(),
    totalPrice: Joi.number().required(),
    orderStatus: Joi.boolean(),
  });

  return schema.validate(order);
};

exports.Order = Order;
exports.validateOrder = validateOrder;
