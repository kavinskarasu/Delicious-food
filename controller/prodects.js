const food = require("../model/productMode");
const AppError = require("./../utils/appError");
exports.getAllprodect = async (req, res, next) => {
  try {
    const foods = await food.find();
    res.status(200).json({
      status: "success",
      data: {
        foods,
      },
    });
  } catch (err) {
    next(new AppError(err, 404));
  }
};

exports.postProdect = async (req, res, next) => {
  try {
    // if (req.user != "admin") {
    //   next(new AppError("Only admin can access this page", 403));
    // }
    const newProdect = await food.create(req.body);

    res.status(200).json({
      status: "success",
      data: {
        newProdect,
      },
    });
  } catch (err) {
    next(new AppError(err, 403));
  }
};

exports.deleteFood = async (req, res, next) => {
  const deletedFood = await food.findOneAndRemove(req.params.id);
  res.status(200).json({
    status: "success",
  });
};
