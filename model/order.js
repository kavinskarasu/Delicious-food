const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  User: {
    type: mongoose.Schema.ObjectId,
    ref: "user",
    required: [true, "User must belong to the order"],
  },
  orders: [
    {
      prodect: {
        type: mongoose.Schema.ObjectId,
        index: true,

        sparse: true,
        ref: "food",
      },
      price: {
        type: Number,
        default: 1,
      },
      quantity: {
        type: Number,
        default: 1,
      },
      name: {
        type: String,
      },
      image: {
        type: String,
      },
    },
  ],
  total: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  paid: {
    type: Boolean,
    default: true,
  },
});
orderSchema.pre(/^find/, function(next) {
  this.populate("User").populate({
    path: "orders",
    select: "name",
  });
  next();
});

const orderfood = mongoose.model("orderfood", orderSchema);
module.exports = orderfood;
