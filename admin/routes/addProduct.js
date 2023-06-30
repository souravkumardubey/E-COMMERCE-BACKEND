const Joi = require("joi");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const { Product, validateProduct } = require("../models/product");
const multer = require("multer");

router.post("/add", (req, res) => {
  const { error, value } = validateProduct(req.body);
  if (error) return res.status(400).send(error.details[0].message);
});

module.exports = router;
