const express = require("express");
const router = express.Router();
const viewController = require("../controller/viewController");
const authContoller = require("../controller/authContoller");
const cartController = require("../controller/cartController");
const orderController = require("../controller/orderController");
const adminContoller = require("../controller/authContoller");
router.use(authContoller.isLoggedin);
router.route("/").get(orderController.orderfood, viewController.overview);
router.route("/adminlogin").get(viewController.adminLoginForm);
router.route("/userlogin").get(viewController.userLoginForm);
router.route("/signup").get(viewController.userSignupForm);

router.route("/activate/:token").get(viewController.acctivated);
router.route("/notify").get(viewController.notify);
router.route("/adminOverview").get(viewController.AdminOverview);
router.route("/postfood").get(viewController.postfood);
router.route("/getfood").get(viewController.getAllfood);
router.route("/getusers").get(viewController.getUsers);
router.route("/viewCart").get(cartController.total, viewController.viewcart);
router.route("/adminorders").get(viewController.ordersConfirmed);
router
  .route("/ordersByUser")
  .get(authContoller.protect, viewController.ordersbyUser);
module.exports = router;
