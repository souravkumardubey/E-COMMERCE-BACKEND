const jwt = require("jsonwebtoken");
const jwtSecret = process.env.TOKEN_SECRET;

const auth = (req, res, next) => {
  try {
    const token = req.cookies?.authToken;
    if (!token) return res.status(404).json({ message: "Access denied" });
    try {
      const decoded = jwt.verify(token, jwtSecret);
      next();
    } catch (error) {
      console.log(error);
      return res.status(404).send(new Error(error.message));
    }
  } catch (error) {
    console.log(error);
    return res.status(404).send(new Error(error.message));
  }
};

module.exports = auth;
