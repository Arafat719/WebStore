import express from "express";
import { body, validationResult } from "express-validator";
import User from "../model/User.js";
import bcrypt from 'bcrypt';
import JWT from 'jsonwebtoken';
import fetchUser from "../middlewere/fetchuser.js";

const route = express.Router()

//ROUTER: 1 User using using POST: /createuser 
route.post('/createuser', [
    // Validation chain for the 'email' field
    body('name').isLength({ min: 5 }).withMessage('Name should be atleast 5 chracters long'),

    // Validation chain for the 'email' field
    body('email').isEmail().withMessage('Enter a valid email address'),

    // Validation chain for the 'password' field
    body('password').isLength({ min: 5 }).withMessage('Password must be at least 5 characters long')

], async (req, res) => {

    try {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const {name, email, password} = req.body;

        const existUser = await User.findOne({email})
        if(existUser) {
            return res.json({"error": "Sorry invelid email address"})
        }

        const salt = await bcrypt.genSalt(10)
        const secPass = await bcrypt.hash(password, salt)

        let newUser = new User({
            name: name,
            email: email,
            password: secPass
        })

        const data = {
            user: {
                id: newUser._id
            }
        }

        const token = JWT.sign(data, process.env.JWT_SECRET)
        
        newUser = await newUser.save()

        res.json(token)

    } catch (error) {
        console.error(`Something is wrong on code ${error}`)
    }

})

//ROUTER: 2 Login user using POST: /getuser login required
route.post('/login', [
    // Validation chain for the 'email' field
    body('email').isEmail().withMessage('Enter a valid email address'),

    // Validation chain for the 'password' field
    body('password').exists().withMessage('Password must be at least 5 characters long')

], async (req, res) => {

    try {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const {email, password} = req.body;

        const user = await User.findOne({email})
        if(!user) {
            return res.status(400).json({"error": "Sorry invelid credentials email"})
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if(!isMatch) {
            return res.status(400).json({"error": "Sorry invelid credentials password"})
        }

        const data = {
            user: {
                id: user._id
            }
        }

        const token = JWT.sign(data, process.env.JWT_SECRET)
        res.json(token)        

    } catch (error) {
        console.error(`Something is wrong on code ${error}`)
    }

})

//ROUTER: 3 Getting user info using POST: /getuser login required
route.get('/getuser', fetchUser, async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select('-password')
        res.json({ user })
    } catch (error) {
        console.log(error)
    }
})


export default route;
