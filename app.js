require("dotenv").config();
require("express-async-errors");

//App starters Import
const express = require("express");
const app = express();

// extra security packages
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const rateLimiter = require("express-rate-limit");

//Database connection Import
const db = require("./database/connectDB");

//Cookie Parser Import
const cookieParser = require("cookie-parser");

//Router Imports
const authRouter = require("./routers/authRouter");
const userRouter = require("./routers/userRouter");
const productRouter = require("./routers/productRouter");
const reviewRouter = require("./routers/reviewRouter");
const orderRouter = require("./routers/orderRouter");

//Middleware Import
const notFound = require("./middleware/not-found");
const errorHandler = require("./middleware/error-handler");

//Invoking Middleware
app.set("trust proxy", 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
  })
);
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));

//Invoking Routers
app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use("/products", productRouter);
app.use("/reviews", reviewRouter);
app.use("/orders", orderRouter);

//Pseudo Home Route
app.get("/", (req, res) => {
  res.send({ home: "E-Commerce API Home page", cookie: req.signedCookies });
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
