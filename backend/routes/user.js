const express = require('express');
const { sign } = require('jsonwebtoken');
const zod = require('zod');
const { User } = require('../db');
const router = express.router();

const signupSchema = zod.object({
    username: zod.string().email(),
    firstName: zod.string(),
    lastName: zod.string(),
    password: zod.string(),
})
router.post('/signup', async(req, res) => {
    const body = req.body;
    const {success} = signupSchema.safeParse(body);
    if (!success) {
        return res.status(411).json({message: 'Invalid input'});
    }
    
    const existingUser = await User.findOne({
        username: body.username
    });

    if (existingUser) {
        return res.status(411).json({message: 'Email already taken'});
    }

    const newUser = await User.create(body);  
});
module.exports = router;



































































