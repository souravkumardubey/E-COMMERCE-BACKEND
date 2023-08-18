const mongoose = require("mongoose");
const Joi = require("joi");
const myCustomJoi = Joi.extend(require("joi-phone-number"));

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    min: 1,
    max: 255,
  },
  email: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
    min: 5,
    max: 255,
  },
  phoneNo: {
    type: String,
    required: true,
    min: 10,
    max: 10,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 1024,
  },
  orders: {
    type: [],
  },
  cart: {
    type: [],
  },
});

const User = mongoose.model("User", userSchema);

const validateUser = (user) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6).max(1024),
    address: Joi.string().required().min(5).max(255),
    phoneNo: myCustomJoi
      .string()
      .phoneNumber({ defaultCountry: "IN", strict: true })
      .required(),
  });
  return schema.validate(user);
};

exports.User = User;
exports.validateUser = validateUser;
