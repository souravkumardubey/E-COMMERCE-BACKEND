const express = require("express");
const app = express();
const adminAuth = require("./admin/routes/auth");

app.use("/admin/", adminAuth);

const port = process.env.USER_PORT ? process.env.USER_PORT : 5000;
app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
