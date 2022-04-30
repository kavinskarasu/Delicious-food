const express = require("express");
const router = express.Router();
const authController = require("../controller/authContoller");
const cartController = require("../controller/cartController");
const viewController = require("../controller/viewController");
router.post("/signup", authController.signUp);
router.post("/login", authController.login);
router.get("/activateaccount/:token", authController.activateAccount);
router.patch(
  "/cart/:id/:quanity",
  authController.prodect,
  cartController.cartItem
);
router.patch(
  "/cartQuanity/:id/:quanity",
  authController.prodect,
  cartController.quanity
);

router.delete("/:id", authController.prodect, cartController.removeItem);
router.post("/adminlogin", authController.adminlogin);
module.exports = router;
