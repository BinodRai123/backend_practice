const express = require("express");
const userModel = require("../models/user.model");
const multer = require("multer");

/* -- Crreating a Router -- */
const userRouter = express.Router();


/* -- Registering New User API -- */
userRouter.post("/register",async(req, res) => {
    /* -- Name and Password From User */
    const {name, password,music} = req.body;

    /* -- Registering New User In DB -- */
    await userModel.create({
        name: name,
        password: password,
        music:music
    })

    /* -- Sending SucessFull Message */
    res.status(201).json({
        message:"user regsiter sucessfully"
    })
})

/* -- Fetching All Users Data API -- */
userRouter.get("/", async (req, res) => {
    /* -- Fetching All Users From DB -- */
    const users = await userModel.find();
    
    /* -- Sending All Users -- */
    res.status(200).json({
        users: users
    })
})

/* -- Deleting Specific User API -- */
userRouter.delete("/delete/:id", async (req, res) => {
    const id = req.params.id;

    /* -- Deleting User through Id -- */
    const DeletedUser = await userModel.findByIdAndDelete(id);

    /* -- If User Not In The DB */
    if(!DeletedUser) return res.status(404).json({
        message: "User Not Found"
    })

    /* -- Response Deleted Sucessfull -- */
    res.status(200).json({
        message: "User Deleted Sucessfully "
    })

})

/* -- LogIn API -- */
userRouter.post("/login",async (req,res) => {
    const {name , password} = req.body;

    /* -- Searching The Name and Password in DB -- */
    const user = await userModel.findOne({name});

    /* -- Check if User Exist -- */
    if(!user) return res.status(404).json({
        message: "User Name not Found"
    })

    /* -- Check Password Does Match Or Not -- */
    if(password != user.password ) return res.json({
        message: "Password not Match"
    })

    res.status(200).json({
        message: "Login Sucessfully"
    })

})

module.exports = userRouter;