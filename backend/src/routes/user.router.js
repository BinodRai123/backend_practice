const express = require("express");
const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const jwt_secret = process.env.JWT_SECRET_KEY;

/* -- Crreating a Router -- */
const userRouter = express.Router();

/* -- Registering New User API -- */
userRouter.post("/register", async (req, res) => {
  const { name, password } = req.body;

  const user = await userModel.create({
    name,
    password,
  });

  //Creates a token
  const token = jwt.sign(
    {
      id: user._id,
    },
    jwt_secret
  );

  /* -- Sending SucessFull Message */
  res.status(201).json({
    message: "user regsiter sucessfully",
    token: token,
  });
});

/* -- Fetching All Users Data API -- */
userRouter.get("/user", async (req, res) => {
  const { token } = req.body;

  if (!token) {
    res.status(401).json({
      message: "unAuthorized",
    });
  }

  try {
    const decoded = jwt.verify(token, jwt_secret);

    const user = await userModel.findOne({
        _id: decoded.id
    })

    res.status(201).json({
        message: "authentication sucessfull",
        user: user
    })

  } catch (error) {
    return res.status(401).json({
      message: "invalid token",
    });
  }
});

/* -- LogIn API -- */
userRouter.post("/login", async (req, res) => {
  const { name, password } = req.body;

  /* -- Searching The Name and Password in DB -- */
  const user = await userModel.findOne({ name });

  /* -- Check if User Exist -- */
  if (!user)
    return res.status(404).json({
      message: "User Name not Found",
    });

  /* -- Check Password Does Match Or Not -- */
  if (password != user.password)
    return res.json({
      message: "Password not Match",
    });

  res.status(200).json({
    message: "Login Sucessfully",
  });
});

module.exports = userRouter;
