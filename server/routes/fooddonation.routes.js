import { Router } from "express";
import multer from "multer";
import axios from "axios";
import Food from "../models/food.js";
import User from "../models/user.js";
import fs from 'fs'

const router = Router();
// const upload = multer({ dest: 'uploads/' });



// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

router.delete("/foods/:id", async (req, res) => {
    try {
        const food = await Food.findByIdAndDelete(req.params.id);
        if (!food) {
            return res.status(404).json({ message: "Food not found" });
        }
        res.json({ message: "Food item removed" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


router.post("/fooddonation", upload.single('image'), async (req, res) => {
    try {
        const { foodName, foodTag, quantity, expiryDate, address, email } = req.body;
        const image = req.file;

        // Find the user by email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Save the form data to the database
        const food = await Food.create({
            foodName: foodName,
            quantity: quantity,
            expiryDate: expiryDate,
            address: address,
            foodTag: foodTag,
            user: user._id,
        });

        await food.save();

        user.food.push(food._id);
        await user.save();

        res.status(201).json(food);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

export default router


