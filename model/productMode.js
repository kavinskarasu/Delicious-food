const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A food must have  a name"],
    unique: true,
  },
  price: {
    type: Number,
    required: [true, "A food must have a price"],
  },
  description: {
    type: String,
    required: [true, "A food must have description"],
  },
  image: {
    type: String,
    required: [true, "A food must have image"],
  },
});

const food = mongoose.model("food", foodSchema);
module.exports = food;
