const jwt = require("jsonwebtoken");
const jwtSecret = process.env.TOKEN_SECRET;

const admin = (req, res, next) => {
  try {
    const token = req.cookies?.authToken;
    if (!token) return res.status(404).json({ message: "Access denied" });
    try {
      const decoded = jwt.verify(token, jwtSecret);
      console.log(decoded);
      if (decoded.role === "admin") next();
      else throw new Error("Access denied");
    } catch (error) {
      console.log(error);
      return res.status(404).send(new Error(error.message));
    }
  } catch (error) {
    console.log(error);
    return res.status(404).send(new Error(error.message));
  }
};

const user = (req, res, next) => {
  try {
    const token = req.cookies?.authToken;
    if (!token) return res.status(404).json({ message: "Access denied" });
    try {
      const decoded = jwt.verify(token, jwtSecret);
      console.log(decoded);
      if (decoded.role === "user") next();
      else throw new Error("Access denied");
    } catch (error) {
      console.log(error);
      return res.status(404).send(new Error(error.message));
    }
  } catch (error) {
    console.log(error);
    return res.status(404).send(new Error(error.message));
  }
};

module.exports = admin;
module.exports = user;
