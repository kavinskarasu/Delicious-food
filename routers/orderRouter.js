const express = require("express");
const router = express.Router();
const authController = require("../controller/authContoller");
const cartController = require("../controller/cartController");
const viewController = require("../controller/viewController");
const orderController = require("../controller/orderController");

router
  .route("/checkout-sessin/")
  .get(authController.protect, orderController.checkoutOrder);
router.route("/order").get(orderController.payment);
router
  .route("/orders")
  .get(
    authController.protect,
    authController.restrictTo("admin"),
    orderController.ordersConfirmed
  );
router.route("/ordersByUser").get(
  authController.protect,

  orderController.ordersbyUser
);
module.exports = router;
