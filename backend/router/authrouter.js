const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Resume=require('../model/Resume')
const User= require('../model/User');
const { auth, authAdmin } = require('../middleware/auth');
require('dotenv').config();

const authRouter = new express.Router();

authRouter.get('/check', auth, (req, res) => {
    res.status(200).send(req.email);
});

authRouter.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(404).send("Enter login credentials");
            return;
        }
        const data = await User.findOne({ email: email });
        if (!data) {
            res.status(404).send("User Not Found");
            return;
        }
        const match = await bcrypt.compare(password, data.password);
        if (match) {
            const token = jwt.sign({ user: email, role: data.role }, process.env.JWT_SECRET, { expiresIn: "24h" });
            res.status(200).send({ message: "Login successful", token: token });
        } else {
            res.status(404).send("Invalid Credentials");
        }
    } catch (e) {
        console.log(e);
        res.status(400).send("Internal Server Error");
    }
});

authRouter.post('/admin/login',async(req,res)=>{
    try{
        const{email,password}=req.body;
        if(!email || !password)
        {
            res.status(404).send("Enter Login Credentials");
            return;
        }
        const data= await User.findOne({email:email});
        if(!data)
        {
            res.status(404).send("User Not Found");
            return;
        }
        if(data.role!=='admin')
        {
            res.status(403).send("Access Denied");
            return;
        }
        const match = await bcrypt.compare(password,data.password);
        if(match)
        {
            const token=jwt.sign({user :email , role:data.role},process.env.JWT_SECRET,{expiresIn:"24h"});
            res.status(200).send({message:"Admin Login Successful",token:token});
        }
        else{
            res.status(404).send("Invalid Credentials");
        }
    }
    catch(e)
    {
        console.log(e);
        res.status(400).send("Internal Server Error");
    }
})

authRouter.post('/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            res.status(404).send("Insufficient data");
            return;
        }
        const data = await User.find({ email: email });
        if (data.length >= 1) {
            res.status(405).send("User Already Exists");
            return;
        }
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const user = new User({
            name: name,
            email: email,
            password: hashedPassword
        });
        await user.save();
        res.status(200).send("User created");
    } catch (e) {
        console.log(e);
        res.status(400).send("Internal Server Error");
    }
});

authRouter.get('/name', async (req, res) => {
    try {
        const { skills } = req.body;
        const data = await Resume.find({ skills: { $in: skills } }).select({ name: 1, _id: 0 });
        res.status(200).send(data);
    } catch (e) {
        console.log(e);
        res.status(404).send(e.message);
    }
});

authRouter.post('/resume', async (req, res) => {
    try {
        const { name, email, skills, education, resume } = req.body;
        if (!name || !email || !skills || skills.length < 2 || !education || !resume) {
            res.status(400).send("Data insufficiency");
            return;
        }
        const data = new Resume({
            name: name,
            email: email,
            skills: skills,
            education: education,
            resume: resume
        });
        await data.save();
        res.status(200).send("Successfully data entered"+data);
    } catch (e) {
        console.log(e);
        res.status(404).send("Error occurred");
    }
});

module.exports = authRouter;
