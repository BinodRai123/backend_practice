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