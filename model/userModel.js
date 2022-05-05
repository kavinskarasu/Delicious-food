const Mongoose = require("mongoose");
const secure = require("bcryptjs");
const crypto = require("crypto");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const prodect = require("../model/prodectMode");

const userSchema = new Mongoose.Schema({
  name: {
    type: String,
    required: [true, "please enter your name"],
  },
  email: {
    type: String,
    required: [true, "please provied your email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "please provide a valid email"],
  },
  password: {
    type: String,
    required: [true, "please provide your password "],
    minlength: 8,
  },
  // image: {
  //   type: String,
  //   required: [true, "please provide the image"],
  // },

  role: {
    type: String,

    default: "user",
  },
  cart: [
    {
      prodect: {
        type: Mongoose.Schema.ObjectId,
        required: [true, "prodect must have a id"],
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

  active: {
    type: String,
    default: false,
  },
  activateToken: {
    type: String,
  },
  activateExpires: Date,
});
userSchema.pre("save", async function(next) {
  ///hashing ths password for security
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await secure.hash(this.password, 12);
  console.log(this.password);
  next();
});
userSchema.methods.createPasswordResetToken = function() {
  const Token = crypto.randomBytes(32).toString("hex");

  this.activateToken = crypto
    .createHash("sha256")
    .update(Token)
    .digest("hex");

  console.log({ Token }, this.activateToken);

  this.activateExpires = Date.now() + 10 * 60 * 1000;

  return Token;
};
userSchema.methods.correctPassword = async function(
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};
const user = Mongoose.model("user", userSchema);

module.exports = user;
