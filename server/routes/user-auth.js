const Joi = require("joi");
const jwt = require("jsonwebtoken");
const { User, validateUser } = require("../models/User");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const validate = (user) => {
  const schema = Joi.object({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  });
  return schema.validate(user);
};

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Invalid credentials" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!user) return res.status(404).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: "user" },
      process.env.TOKEN_SECRET
    );
    res.cookie("userAuthToken", token, {
      httpOnly: true,
    });
    res.header("userAuthToken", token).send({ token: token });
  } catch (err) {
    return res.status(404).json({ message: "Invalid credentials" });
  }
});

router.post("/signup", async (req, res) => {
  const { error, value } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  let user = await User.findOne({ email: req.body.email });
  if (user)
    return res.status(400).send("User with this email already registered.");
  user = new User(
    _.pick(req.body, [
      "name",
      "email",
      "shopName",
      "address",
      "phoneNo",
      "password",
    ])
  );
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();
  res.send(user);
});

module.exports = router;
