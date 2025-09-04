const { model } = require("mongoose");
const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

async function regsiterController(req,res){
   const {name, password} = req.body;

    const isuserNameAlreadyExist = await userModel.findOne({
        name
    })
    
    if(isuserNameAlreadyExist){
        return res.status(409).json({
            message:"Username Already Exist"
        })
    }

    // new user register in DB
    const user = await userModel.create({
        name,
        password: await bcrypt.hash(password, 10)
    });
    console.log(user._id)

    //Create a token for user
    const token = jwt.sign({
        id:user._id
    }, process.env.JWT_SECRET_KEY);

    // store token in frontend cookie localstorage
    res.cookie("token",token);

    res.status(201).json({
        message:"User Register Sucessfull"
    })

}

async function loginController(req,res){
    const {name, password} = req.body;

    const user = await userModel.findOne({
        name: name
    })

    if(!user){
        return res.status(400).json({
            message:"invalid user name"
        })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if(!isPasswordValid){
        return res.status(400).json({
            message:"invalid password "
        })
    }

    const token = jwt.sign({id:user._id}, process.env.JWT_SECRET_KEY);
    res.cookie("token",token);

    res.status(200).json({
        message:"login sucessfully",
        user:user
    })
}


module.exports = {
    regsiterController,
    loginController
}