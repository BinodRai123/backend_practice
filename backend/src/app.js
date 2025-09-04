const express = require("express");
const userRouter = require("./routers/authUser.router");
const cookieParser = require("cookie-parser");

const server = express();

server.use(express.json());
server.use(cookieParser());
server.use("/auth",userRouter);


module.exports = server;