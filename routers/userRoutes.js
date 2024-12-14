const express = require("express");
const router = express.Router();
const User = require("../models/user");

const { jwtMiddleWare, generateToken } = require("../jwt");

//USER SIGN UP ROUTE

router.post('/signup', async (req, res) => {
    try {
        const data = req.body;
        const newUser = new User(data);
        //CHECK FOR USER IS NEW OR NOT?
        const isDuplicate = await User.findOne({ aadharNumber: newUser.aadharNumber });
        if (isDuplicate) {
            console.log("AADHAR ALREADY EXIST")
            return res.status(401).json({ massage: "AADHAR ALREADY EXIST" });
        }

        //SAVING USER INTO DATABASE
        const savedUser = await newUser.save();
        console.log("NEW USER ADDED");

        //CREATING TOKEN AND SEND THE TOKEN AS RESPONSE
        const payLoad = {
            id: savedUser.id
        }
        const token = generateToken(payLoad);
        res.status(200).json({ response: savedUser, token: token });
    }
    catch (err) {
        console.log("Internal Server Error : ", err);
        return res.status(500).json({ err: "Internal Server Error" });
    }
})

//USER LOGIN ROUTE

router.post('/login', async (req, res) => {
    try {
        // FETCHING AADHAR NO AND PASSWORD FROM THE REQUEST BODY
        const { aadharNumber, password } = req.body;

        //CHECKING AADHAR NO IS EXIST IN DATABSE OR NOT
        const user = await User.findOne({ aadharNumber: aadharNumber });
        if (!user) return res.status(404).json({ err: "INVALID AADHAR NUMBER" });
        //CHECKING FOR THE CORRECT PASSWORD
        const userPassword = await User.findOne({ password: password });
        if (!userPassword) return res.status(404).json({ err: "INVALID PASSWORD" });

        const payload = {
            id: user.id
        }
        const token = generateToken(payload);
        res.status(200).json({ token });
    }
    catch (err) {
        console.log("Internal Server Error : ", err);
        res.status(500).json({ err: "Internal Server Error" });
    }
})


//USER PROFILE ROUTE

router.get('/profile', jwtMiddleWare, async (req, res) => {
    try {
        const user = req.user;
        const userId = user.id;
        const userData = await User.findById(userId);
        res.status(200).json(userData);
    }
    catch (err) {
        console.log("Internal Server Error : ", err);
        res.status(500).json({ err: "Internal Server Error" });
    }
})


//CHANGE USER PASSWORD 

router.put('/profile/update', jwtMiddleWare, async (req, res) => {
    try {
        const data = req.user;
        const { currentPassword, newPassword } = req.body;
        const userId = data.id;
        const user = await User.findById(userId);
        if (!(await user.comparePassword(currentPassword))) {
            return res.status(404).json({ err: "INVALID CURRENT PASSWORD" });
        }
        user.password = newPassword;
        await user.save();
        console.log("PASSWORD UPDATED");
        res.status(200).json({ massage: "PASSWORD UPDATED" });
    }
    catch (err) {
        console.log("Internal Server Error : ", err);
        res.status(500).json({ err: "Internal Server Error" });
    }
})

module.exports = router;