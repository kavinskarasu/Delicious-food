const express = require("express");
const router = express.Router();
const authController = require("../controller/authContoller");
const cartController = require("../controller/cartController");
const viewController = require("../controller/viewController");
const orderController = require("../controller/orderController");

router
  .route("/checkout-sessin/")
  .get(authController.prodect, orderController.checkoutOrder);
router.route("/order").get(orderController.payment);
module.exports = router;
