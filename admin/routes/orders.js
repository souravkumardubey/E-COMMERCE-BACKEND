const Joi = require("joi");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const router = express.Router();
const { Order, validateOrder } = require("../models/Order");

router.post("/new-order", async (req, res) => {});

module.exports = router;
