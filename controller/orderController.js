const user = require("../model/userModel");
const stripe = require("stripe")(
  "sk_test_51KsUbhSDMTMOlquGG6QmzxU897WGdIWNrlFyfpb5NBM8qY0eBcpxV7hjc6HcSzo7iF7oDe9ws06GFSdXMbQSoC9800nJBv6JWR"
);
exports.checkoutOrder = async (req, res, next) => {
  const User = await user.findById(req.user._id);
  console.log(req.params.id);
  // 2) Create checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    success_url: `${req.protocol}://${req.get("host")}/api/v1/views/overview`,

    cancel_url: `${req.protocol}://${req.get("host")}/api/v1/views/overview`,
    customer_email: req.user.email,
    client_reference_id: req.params.id,
    line_items: [
      {
        name: `Tour`,
        description: "hello",
        images: [
          "https://images.everydayhealth.com/images/diet-nutrition/34da4c4e-82c3-47d7-953d-121945eada1e00-giveitup-unhealthyfood.jpg?w=1110",
        ],
        amount: 300,
        currency: "usd",
        quantity: 1,
      },
    ],
  });
  res.status(200).json({
    status: "success",
    data: {
      session,
    },
  });
};
