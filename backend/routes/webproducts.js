import express from 'express';
import { body, validationResult } from "express-validator";
import fetchUser from "../middlewere/fetchuser.js";
import Products from '../model/Webproducts.js'

const route = express.Router()

route.post('/addproduct', [
    // Validation chain for the 'title' field
    body('title').isLength({ min: 3 }).withMessage('Title should be atleast 5 chracters long'),

    // Validation chain for the 'img' field
    body('img').exists().withMessage('Img required'),

    // Validation chain for the 'email' field
    body('description').isLength({min: 5}).withMessage('Description should be atleast 5 characters'),

    // Validation chain for the 'password' field
    body('price').exists().withMessage('Price shoud be exist')

], async (req, res) => {
    try {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { title, img, description, price } = req.body;

        let newProducts = new Products({
            title: title,
            img: img,
            description: description,
            price: price
        })
        res.status(200).json({newProducts})
        newProducts = await newProducts.save()

    } catch (error) {
        console.error(`Something is wrong on code ${error}`)
    }
})

route.get('/getproducts', async (req, res) => {
    try {
        const products = await Products.find();
        return res.json(products)

    } catch (error) {
        console.error(`Something is wrong on code ${error}`)
    }
})

export default route;