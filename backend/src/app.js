const express = require("express");
const cookieParser = require("cookie-parser");

/* -- Server is Created -- */
require("dotenv").config();
const userRouter = require("./routes/user.router"); 
const server = express();

/* -- Middleware and Router -- */
server.use(express.json());
server.use(cookieParser());  // <-- this must come first
server.use("/user", userRouter);

module.exports = server;
