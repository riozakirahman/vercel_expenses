const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userRouter = require("./routes/route.user");
const mainRouter = require("./routes/route.main");
const User = require("./models/model.user");
const dotenv = require("dotenv");
dotenv.config();
const { verifyToken } = require("./middlewares/auth");
const cookieParser = require("cookie-parser");
const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.listen(process.env.PORT || 4000, () => {
  mongoose.connect(process.env.MONGODB_URL);
});
app.get("/", (req, res) => {
  res.json("Hello from the backend");
});

app.use(userRouter);
app.use(verifyToken, mainRouter);
app.use((err, req, res, next) => {
  const { statusCode = 400, message } = err;
  console.log(err.message);
  res.status(statusCode).send({
    isError: true,
    message: statusCode === 500 ? "Internal Server Error" : message,
  });
});
module.exports = app;
