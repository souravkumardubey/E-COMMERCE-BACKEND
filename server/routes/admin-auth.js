const Joi = require("joi");
const jwt = require("jsonwebtoken");
const { Admin, validateAdmin } = require("../models/Admin");
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

// router.post("/login", async (req, res) => {
//   const { error } = validate(req.body);
//   if (error) return res.status(400).send(error.details[0].message);

//   let user = await Admin.findOne({ email: req.body.email });
//   if (!user) return res.status(400).send("Invalid email or password.");

//   const validPassword = await bcrypt.compare(req.body.password, user.password);
//   if (!validPassword) return res.status(400).send("Invalid email or password.");

// const token = jwt.sign(
//   { id: user._id, role: "admin" },
//   process.env.TOKEN_SECRET
// );
//   res.header("auth-token", token).send({ token: token });
// });
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Admin.findOne({ email });
    if (!user) return res.status(404).json({ message: "Invalid credentials" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!user) return res.status(404).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: "admin" },
      process.env.TOKEN_SECRET
    );
    res.cookie("authToken", token, {
      httpOnly: true,
    });
    res.header("authToken", token).send({ token: token });
  } catch (err) {
    return res.status(404).json({ message: "Invalid credentials" });
  }
});

router.post("/signup", async (req, res) => {
  const { error, value } = validateAdmin(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  let user = await Admin.findOne({ email: req.body.email });
  if (user)
    return res.status(400).send("User with this email already registered.");
  user = new Admin(
    _.pick(req.body, [
      "name",
      "email",
      "password",
      "shopName",
      "shopAddress",
      "phoneNo",
    ])
  );
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();
  res.send(user);
});

router.get("/logout", (req, res) => {
  try {
    res.clearCookie("authToken");
    res.status(200).send("User successfully logged out");
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
