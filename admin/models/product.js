const mongoose = require("mongoose");
const Joi = require("joi");

const productSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true,
    min: 1,
    max: 255,
  },
  productCategory: {
    type: String,
    required: true,
    min: 1,
    max: 255,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  discountedPrice: {
    type: Number,
    required: true,
    min: 0,
  },
  inStock: {
    type: Number,
    required: true,
    min: 1,
  },
  description: {
    type: String,
    required: true,
  },
  adminId: {
    type: String,
    required: true,
  },
});

const Product = mongoose.model("Product", productSchema);

const validateProduct = (user) => {
  const schema = Joi.object({
    productName: Joi.string().required().min(1),
    productCategory: Joi.string().required().min(1),
    price: Joi.number().integer().required().min(0),
    discountedPrice: Joi.number().integer().required().min(0),
    inStock: Joi.number().integer().required().min(1),
    description: Joi.string().required(),
  });
  return schema.validate(user);
};

exports.Product = Product;
exports.validateProduct = validateProduct;
