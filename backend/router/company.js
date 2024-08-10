const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { Resume } = require('../model/Resume');
const { authcompany } = require('../middleware/auth');

const company = new express.Router();

company.post('/getinfo', async (req, res) => {
    try {
        const { designation, skills } = req.body;
        if (!designation || !skills) {
            res.status(404).send("Enter Required Skills");
            return;
        }

        const data = await Resume.find({ skills: { $in: skills } });
        res.status(200).send(data);
    } catch (e) {
        console.error(e);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = company;