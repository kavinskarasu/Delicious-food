const prodect = require("../model/productMode");
const user = require("../model/userModel");
const AppError = require("../utils/appError");
const authContoller = require("../controller/authContoller");
const orderfood = require("../model/order");
const crypto = require("crypto");

exports.overview = async (req, res) => {
  const prodects = await prodect.find();
  const user = req.user;
  res.status(200).render("overview", {
    prodects,
    user,
  });
};

exports.adminLoginForm = (req, res, next) => {
  res.status(200).render("adminlogin");
};

exports.userLoginForm = (req, res, next) => {
  res.status(200).render("loginform");
};
exports.userSignupForm = (req, res, next) => {
  res.status(200).render("signup");
};

exports.acctivated = async (req, res, next) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  const User = await user.findOne({
    activateToken: hashedToken,
    activateExpires: { $gt: Date.now() },
  });
  if (!User) {
    return next(new AppError("Token is invalid or has expired", 400));
  }
  User.active = "true";
  User.activateToken = undefined;
  User.activateExpires = undefined;
  await User.save();
  const login = `${req.protocol}://${req.get("host")}/userlogin`;
  const loginUser = User.name;
  res.status(200).render("acctivated", {
    login,
    loginUser,
  });
};

exports.notify = (req, res, next) => {
  res.render("notify");
};

exports.AdminOverview = (req, res, next) => {
  res.status(200).render("adminOverview");
};

exports.postfood = (req, res, next) => {
  res.status(200).render("postprodect");
};

exports.getAllfood = async (req, res, next) => {
  const prodects = await prodect.find();

  res.status(200).render("getProdect", {
    prodects,
  });
};

exports.getUsers = async (req, res, next) => {
  const users = await user.find();
  res.status(200).render("users", {
    users,
  });
};

exports.viewcart = async (req, res, next) => {
  const User = await user.findById(req.id);
  const cart = User.cart;
  const total = User.total;

  res.status(200).render("cart", {
    cart,
    total,
  });
};
exports.ordersConfirmed = async (req, res, next) => {
  const cart = await orderfood.find();
  console.log(cart);
  res.status(200).render("adminOrder", {
    cart,
  });
};

exports.ordersbyUser = async (req, res, next) => {
  const UserId = req.user._id;
  const cart = await orderfood.find({ User: UserId });

  res.status(200).render("orders", {
    cart,
  });
};
