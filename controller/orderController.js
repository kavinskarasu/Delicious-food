const user = require("../model/userModel");
const prodects = require("../model/prodectMode");
var axios = require("axios");
const mongoose = require("mongoose");

const orderfood = require("../model/order");

const stripe = require("stripe")(
  "sk_test_51KsUbhSDMTMOlquGG6QmzxU897WGdIWNrlFyfpb5NBM8qY0eBcpxV7hjc6HcSzo7iF7oDe9ws06GFSdXMbQSoC9800nJBv6JWR"
);
exports.checkoutOrder = async (req, res, next) => {
  const User = await user.findById(req.user._id);

  let a = [];
  for (let i = 0; i < User.cart.length; i++) {
    let current = User.cart[i];
    const prodect = await prodects.findById(current._id);

    a.push({
      name: `${current.name}`,

      images: [`${current.image}`],
      amount: prodect.price * 100,
      currency: "INR",
      quantity: current.quantity,
    });
  }

  // 2) Create checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    success_url: `${req.protocol}://${req.get(
      "host"
    )}/api/v1/views/overview?User=${User._id}&cart=${User.cart}&total=${
      User.total
    }`,

    cancel_url: `${req.protocol}://${req.get("host")}/api/v1/views/overview`,
    customer_email: req.user.email,
    client_reference_id: `User` + User._id,
    line_items: a,
  });
  // const d = await user.updateOne(
  //   { _id: mongoose.Types.ObjectId(req.user._id) },
  //   { $set: { cart: [] } }
  // );
  res.status(200).json({
    status: "success",

    session,
  });
};

exports.payment = async (req, res, next) => {
  const stripe = require("stripe")(
    "pk_test_51KsUbhSDMTMOlquGb8WgWWymfSIvz8RYKktfyRIct2m6WgnQduk44xSiWLez0gOwRkypHNBXdg8SD3ZiiiJmRFWf00rHaqn1Nt"
  );

  // const stripe = Stripe(
  //   "pk_test_51KsUbhSDMTMOlquGb8WgWWymfSIvz8RYKktfyRIct2m6WgnQduk44xSiWLez0gOwRkypHNBXdg8SD3ZiiiJmRFWf00rHaqn1Nt"
  // );

  try {
    // 1) Get checkout session from API
    // const session = await axios(
    //   `http://127.0.0.1:4000/api/v1/payment/checkout-sessin/`
    // );

    let session = await axios({
      method: "GET",
      url: "/api/v1/payment/checkout-sessin",
    })
      .then((data) => {
        {
        }
      })
      .catch((err) => {
        //console.log(err);
      });

    // // 2) Create checkout form + chanre credit card
    // await stripe.redirectToCheckout({
    //   sessionId: session.data.session.id,
    // });
  } catch (err) {
    console.log(err);
  }
};

exports.orderfood = async (req, res, next) => {
  try {
    const { User, cart, total } = req.query;
    const orderUser = await user.findById(User);
    if (!User && !cart && !total) {
      return next();
    }
    const oldCart = orderUser.cart;
    //console.log(orderUser.cart);
    await user.updateOne(
      { _id: mongoose.Types.ObjectId(User) },
      { $set: { cart: [] } }
    );
    // console.log(User, orderUser, total);
    const a = await orderfood.create({
      User,
      orders: oldCart,
      total,
    });

    res.redirect(req.originalUrl.split("?")[0]);
    // console.log(newOrder);
  } catch (err) {
    console.log(err.message);
  }
};

exports.ordersConfirmed = async (req, res, next) => {
  const ordered = await orderfood.find();
  res.status(200).json({
    status: "success",
    data: {
      ordered,
    },
  });
};

exports.ordersbyUser = async (req, res, next) => {
  const UserId = req.user._id;
  const cart = await orderfood.find({ User: UserId });

  console.log(cart[0].User.cart);
  res.status(200).json({
    status: "success",
    data: {
      cart,
    },
  });
};
