const express = require('express');
const { sign } = require('jsonwebtoken');
const zod = require('zod');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');
const { User } = require('../db');
const router = express.router();
const { authMiddleware } = require('./middleware');

const signupSchema = zod.object({
    username: zod.string().email(),
    firstName: zod.string(),
    lastName: zod.string(),
    password: zod.string(),
})

const updateSchema = zod.object({
    password: zod.string().optional(),
    firstName: zod.string().optional(),
    lastName: zod.string().optional(),
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

    // Add random balance upto 1000
    await Account.create({
        userId: newUser._id,
        balance: 1 + Math.random() * 1000   ,
    });

    const token = jwt.sign({
        userId: newUser._id,
    }, JWT_SECRET); 
    
    res.json({
        message: 'User created',
        token: token,
    });

})

router.post('/signin', async(req, res) => {
    const body = req.body;
    const {success} = signupSchema.safeParse(body);

    if (!success) {
        return res.status(411).json({message: 'Invalid input'});
    }
    
    const user = await User.findOne({
        username: body.username,
        password: body.password,
    });

    if (!user) {
        return res.status(411).json({message: 'Eroor while logging in'});
    }

    const token = jwt.sign({
        userId: user._id,
    }, JWT_SECRET); 
    
    res.status(200).json({
        message: 'User signed in',
        token: token,
    });

})

router.put('/' , authMiddleware, async(req, res) => {
    const { success } = updateSchema.safeParse(req.body);
    if (!success) {
        return res.status(411).json({message: 'Error while updating information'});
    }

    await User.updateOne({ _id: req.userId }, req.body);
    res.json({ message: 'User updated' });
})

router.get('/bulk', async(req, res) => {
    const filter = req.query.filter || '';
    
    const users = await User.find({
        $or: [{
            firstName: {
                $regex: filter,
            }
        }, {
            lastName: {
                $regex: filter,
            }
        }]
    })

    res.json({
        user: users.map(user => ({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id,
        })) 
    })
})






module.exports = router;



































































