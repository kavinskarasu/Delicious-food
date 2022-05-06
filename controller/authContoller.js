const user = require("../model/userModel");
const jwt = require("jsonwebtoken");
const AppError = require("./../utils/appError");
const Email = require("../utils/sendEmail");
const bcrypt = require("bcryptjs");
const { promisify } = require("util");
const crypto = require("crypto");
const { resolveSoa } = require("dns");
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT, {
    expiresIn: "10h",
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expiresIn: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

  res.cookie("jwt", token, cookieOptions);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

exports.signUp = async (req, res, next) => {
  try {
    const newUser = await user.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      cart: req.body.cart,
    });

    const activateToken = newUser.createPasswordResetToken();
    await newUser.save({ validateBeforeSave: false });
    //const token = createToken(newUser._id);
    const activateAccount = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/views/activate/${activateToken}`;
    const message = `please activate your account: ${activateAccount}.\n, please ignore this email! if it is not you`;
    const url = activateAccount;

    new Email(newUser, url).sendWelcome();

    try {
      // await sendEmail({
      //   email: newUser.email,
      //   subject: "Your account activation  token (valid for 10 min)",
      //   message,
      // });

      res.status(200).json({
        status: "success",
        message: "Token sent to email!",
      });
    } catch (err) {
      user.activateToken = undefined;
      user.activateExpires = undefined;
      await newUser.save({ validateBeforeSave: false });
      console.log(err);
      return next(
        new AppError("There was an error sending the email. Try again later!"),
        500
      );
    }
  } catch (err) {
    next(new AppError(err, 400));
  }
};

exports.login = async (req, res, next) => {
  try {
    const email = req.body.email;

    const loginPassword = req.body.password;
    // console.log(req.body.email);
    // console.log(req.body.password);

    if (!email || !loginPassword) {
      return next(new AppError("plesase enter your email and password", 400));
    }

    //console.log(email);

    const loginUser = await user.findOne({ email });
    // console.log(loginUser);
    // console.log(loginUser.password);

    if (
      !loginUser ||
      !(await loginUser.correctPassword(loginPassword, loginUser.password))
    ) {
      // console.log(password);

      return next(new AppError("Incorrect email or password", 401));
    }
    if (loginUser.active == "false") {
      return next(new AppError("please acivate your account", 401));
    }
    console.log(loginUser.cart.length);
    createSendToken(loginUser._id, 200, res);
  } catch (err) {
    return next(new AppError(err.message, 403));
  }
};

exports.activateAccount = async (req, res, next) => {
  try {
    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");
    const User = await user.findOne({
      activateToken: hashedToken,
      activateExpires: { $gt: Date.now() },
    });
    if (!User) {
      return next(new AppError("Token is invalid or has expired", 400));
    }
    User.active = "true";
    User.activateToken = undefined;
    User.activateExpires = undefined;
    await User.save();
    res.send("Account activated");
  } catch (err) {
    res.send(err.message);
  }
};

exports.protect = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }
    if (!token) {
      next(new AppError("Access denied", 403));
    }
    const decoded = await promisify(jwt.verify)(token, process.env.JWT);

    const currentUser = await user.findById(decoded.id);

    if (!currentUser) {
      return next(
        new AppError(
          "The user belonging to this token does no longer exist.",
          401
        )
      );
    }
    req.user = currentUser;
    next();
  } catch (err) {
    res.status(400).json({
      status: "faliure",
      err: err.message,
    });
  }
};
exports.isLoggedin = async (req, res, next) => {
  try {
    if (req.cookies.jwt) {
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT
      );

      const currentUser = await user.findById(decoded.id);

      console.log(currentUser);
      if (!currentUser) {
        return next();
      }
      req.user = currentUser.name;
      req.id = currentUser._id;

      return next();
    }

    next();
  } catch (err) {
    next();
  }
};

exports.restrictTo = (role) => {
  return (req, res, next) => {
    try {
      if (role != req.user.role) {
        return next(new AppError("Only admin can access this page"), 403);
      }
      next();
    } catch (err) {
      next(new AppError(err), 400);
    }
  };
};

exports.adminlogin = async (req, res, next) => {
  try {
    const email = req.body.email;

    const loginPassword = req.body.password;
    // console.log(req.body.email);
    // console.log(req.body.password);

    if (!email || !loginPassword) {
      return next(new AppError("plesase enter your email and password", 400));
    }

    //console.log(email);

    const loginUser = await user.findOne({ email });
    // console.log(loginUser);
    // console.log(loginUser.password);

    if (
      !loginUser ||
      !(await loginUser.correctPassword(loginPassword, loginUser.password))
    ) {
      // console.log(password);

      return next(new AppError("Incorrect email or password", 401));
    }
    if (loginUser.role != "admin") {
      return next(new AppError("Only admin can access this page", 403));
    }
    createSendToken(loginUser._id, 200, res);
  } catch (err) {
    return next(new AppError(err.message, 403));
  }
};

exports.logout = (req, res) => {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: "success" });
};
