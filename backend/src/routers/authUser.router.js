const express = require("express");
const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");

const router = express.Router();

router.post("/register",)


router.get("/user",async(req,res)=>{
    const token = req.cookies.token;

    if(!token){
        res.status(401).json({
            message:"unauthorized"
        })
    }

    try {
        const decode = jwt.verify(token,process.env.JWT_SECRET_KEY);
        const user = await userModel.findOne({
            _id:decode.id
        }).select("-password -__v");

        res.status(200).json({
            message:"user details",
            user:user
        })
    } catch (error) {
        json.status(401).json({
            message:"invalid token"
        })
    }

})

router.get("/alluser",async(req,res) => {
    const user = await userModel.find();

    res.status(200).json({
        message:"user fetch sucesful",
        user:user
    })
})

module.exports = router;