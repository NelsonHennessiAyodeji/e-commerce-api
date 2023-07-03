require("dotenv").config();
require("express-async-errors");

//App starters Import
const express = require("express");
const app = express();

//Database connection Import
const db = require("./database/connectDB");

//Cookie Parser Import
const cookieParser = require("cookie-parser");

//Router Imports
const authRouter = require("./routers/authRouter");
const userRouter = require("./routers/userRouter");
const productRouter = require("./routers/productRouter");
const reviewRouter = require("./routers/reviewRouter");

//Middleware Import
const notFound = require("./middleware/not-found");
const errorHandler = require("./middleware/error-handler");

//Invoking Middleware
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));

//Invoking Routers
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/reviews", reviewRouter);

//Pseudo Home Route
app.get("/", (req, res) => {
  res.send({ home: "E-Commerce API", cookie: req.signedCookies });
});

//Error Handler Middleware
app.use(notFound);
app.use(errorHandler);

//Port Variable
const port = process.env.PORT || 3000;

//Project Startup Logic
const start = async () => {
  try {
    await db(process.env.MONGO_URI);
    app.listen(port, () => console.log(`Server listening on port ${port}...`));
  } catch (error) {
    console.log(error.message);
  }
};

//Invoking the start method to run the app
start();

// TODO: Solevt the remove mant review issue
// TODO: AVG RATING Is not working
