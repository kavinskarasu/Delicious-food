const { json } = require("express");
const user = require("../model/userModel");
let mongoose = require("mongoose");
const { postProdect } = require("./prodects");
const foods = require("../model/prodectMode");

exports.cartItem = async (req, res, next) => {
  try {
    const User = req.user;
    const prodect = mongoose.Types.ObjectId(req.params.id);
    let x = 10;
    // await user.findByIdAndUpdate(
    //   { _id: User._id },
    //   { $push: { cart: { $each:  } } }

    const prodectName = await foods.findById(prodect);
    // );
    const foodName = await prodectName.name;
    const foodPrice = await prodectName.price;
    const foodImage = await prodectName.image;
    const quanity = req.params.quanity;

    const z = await user.findOne(
      { _id: User._id },
      { cart: { $elemMatch: { name: foodName } } }
    );

    if (z.cart.length == 0) {
      await user.updateOne(
        { _id: User._id },
        {
          $addToSet: {
            cart: {
              _id: prodect,
              name: foodName,
              image: foodImage,
              quanity: quanity,
              price: foodPrice * quanity,
            },
          },
        }
      );
    }
    await User.save({ validateBeforeSave: false });

    const UserCart = User.cart;

    User.total = 0;
    for (let i = 0; i < UserCart.length; i++) {
      //console.log(UserCart[i].price);
      User.total = User.total + UserCart[i].price;
      //console.log(User.total);
    }

    await User.save({ validateBeforeSave: false });
    //console.log(User);
    res.status(200).json({
      status: "success",
      data: {
        //User,
      },
    });
  } catch (err) {
    console.log(err);
  }
};

exports.quanity = async (req, res, next) => {
  try {
    const User = req.user;
    const prodect = mongoose.Types.ObjectId(req.params.id);

    const prodectName = await foods.findById(prodect);
    // );
    const foodName = await prodectName.name;
    const foodPrice = await prodectName.price;
    const foodImage = await prodectName.image;
    const quanity = req.params.quanity;
    const a = await user.updateOne(
      { _id: User._id },
      {
        $set: {
          "cart.$[elemX].price": quanity * foodPrice,
          "cart.$[elemX].quantity": quanity,
        },
      },
      {
        arrayFilters: [
          {
            "elemX.name": foodName,
          },
        ],
      }
    );
    await User.save({ validateBeforeSave: false });
    const UserCart = User.cart;
    User.total = 0;
    for (let i = 0; i < UserCart.length; i++) {
      User.total = User.total + UserCart[i].price;
    }
    await User.save({ validateBeforeSave: false });
    //console.log(User);
    res.status(200).json({
      status: "success",
      data: {
        //User,
      },
    });
  } catch (err) {
    console.log(err);
  }
};

exports.removeItem = async (req, res, next) => {
  const User = req.user;
  console.log(req.params.id);
  const prodect = await foods.findById(req.params.id);

  const d = await user.updateOne(
    { _id: mongoose.Types.ObjectId(req.user._id) },
    { $pull: { cart: { name: prodect.name } } }
  );
  //res.redirect("cart");
  //console.log(d);
  await User.save({ validateBeforeSave: false });
  const UserCart = User.cart;
  User.total = 0;
  for (let i = 0; i < UserCart.length; i++) {
    User.total = User.total + UserCart[i].price;
  }
  await User.save({ validateBeforeSave: false });
  if (d) {
    res.send("Done").status(200);
  } else {
    res.send("No data").status(204);
  }

  res.end();
};

// exports.removeAllItem = (req, res, next) => {
//   const User = req.user;
// };

exports.total = async (req, res, next) => {
  let User = await user.findById(req.id);
  let UserCart = User.cart;
  User.total = 0;
  for (let i = 0; i < UserCart.length; i++) {
    User.total = User.total + UserCart[i].price;
  }
  await User.save({ validateBeforeSave: false });
  next();
};
