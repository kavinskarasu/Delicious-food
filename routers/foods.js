const express = require("express");
const router = express.Router();
const prodectController = require("../controller/prodects");
const authController = require("../controller/authContoller");

router
  .route("/:id")
  .delete(
    authController.prodect,
    authController.restrictTo("admin"),
    prodectController.deleteFood
  );

router
  .route("/")
  .get(authController.prodect, prodectController.getAllprodect)
  .post(
    authController.prodect,
    authController.restrictTo("admin"),
    prodectController.postProdect
  );

router.route("/adminlogin").post(authController.login);

module.exports = router;
