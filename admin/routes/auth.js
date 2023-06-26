const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();

router.post("/signup", (req, res) => {
  res.send("SignUp Page...");
});
router.post("/login", (req, res) => {
  res.send("Login Page...");
});

module.exports = router;
