const { model } = require("mongoose");
const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");

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
        name,password
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
}


module.exports = {
    regsiterController,
    loginController
}