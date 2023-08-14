const mongoose = require("mongoose");
const Joi = require("joi");
const myCustomJoi = Joi.extend(require("joi-phone-number"));

const adminSchema = new mongoose.Schema({
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
  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 1024,
  },
  shopName: {
    type: String,
    required: true,
    min: 1,
    max: 255,
  },
  shopAddress: {
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
  products: [String],
});

const Admin = mongoose.model("Admin", adminSchema);

const validateAdmin = (user) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6).max(1024),
    shopName: Joi.string().required().min(1).max(255),
    shopAddress: Joi.string().required().min(5).max(255),
    phoneNo: myCustomJoi
      .string()
      .phoneNumber({ defaultCountry: "IN", strict: true })
      .required(),
  });
  return schema.validate(user);
};

exports.Admin = Admin;
exports.validateAdmin = validateAdmin;
