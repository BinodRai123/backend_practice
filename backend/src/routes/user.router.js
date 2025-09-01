const express = require("express");
const userModel = require("../models/user.model");

/* -- Crreating a Router -- */
const userRouter = express.Router();


/* -- Registering New User API -- */
userRouter.post("/register",async(req, res) => {
    /* -- Name and Password From User */
    const {name, password} = req.body;

    /* -- Registering New User In DB -- */
    await userModel.create({
        name: name,
        password: password
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
    /* -- Getting Id Of User -- */
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
userRouter.get("/login",(req,res) => {
    const {name , password} = req.query;

    console.log(name, password)
})

module.exports = userRouter;