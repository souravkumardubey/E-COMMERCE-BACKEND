const jwt = require("jsonwebtoken");
const authenticateJWT = (req, res, next) => {
  const decodedToken = jwt.verify(
    req.headers["auth-token"],
    process.env.TOKEN_SECRET
  );
  if (decodedToken) {
    const token = decodedToken.split(" ")[1];

    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

module.exports = authenticateJWT;
