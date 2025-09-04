const {regsiterController,loginController} = require("../controllers/auth.controller");
const express = require("express");

const router = express.Router();

router.post("/register",regsiterController)


router.get("/user",loginController)

module.exports = router;