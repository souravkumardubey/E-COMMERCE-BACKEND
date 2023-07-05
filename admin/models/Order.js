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
  orderStatus: {
    type: String,
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
});

const Order = mongoose.model("Order", productSchema);

// const validateOrder = (user) => {
//   const schema = Joi.object({});
//   return schema.validate(user);
// };

exports.Order = Order;
exports.validateOrder = validateOrder;
