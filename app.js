const express = require("express");
const path = require("path");
const ejs = require("ejs");

const cookieParser = require("cookie-parser");
const app = express();

const foodRouter = require("./routers/foods");
const userRouter = require("./routers/user");
const viewRouter = require("./routers/viewRouter");
const orderRouter = require("./routers/orderRouter");
app.use(express.json());
app.use(cookieParser());
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "views"));
app.use("/api/v1/prodects", foodRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/views", viewRouter);
app.use("/api/v1/payment", orderRouter);
module.exports = app;
