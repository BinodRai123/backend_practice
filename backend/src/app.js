const express = require("express");
const jwt = require("jsonwebtoken");

require("dotenv").config();
const userRouter = require("./routes/user.router");

/* -- Server is Created -- */
const server = express();

/* -- Middleware and Router -- */
server.use(express.json());
server.use("/user",userRouter);

module.exports = server;