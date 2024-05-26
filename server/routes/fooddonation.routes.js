import { Router } from "express";
import multer from "multer";
import axios from "axios";
import Food from "../models/food.js";
import User from "../models/user.js";
import fs from 'fs'

const router = Router();
const upload = multer({ dest: 'uploads/' });

router.post("/fooddonation", upload.single('image'), async (req, res) => {
    try {
        const {foodTag,  quantity, expiryDate, address, email } = req.body;
        const image = req.file;

        const user = await User.findOne({ email });

        // Send the image to the prediction service
        const formData = new FormData(); 
        formData.append('image', fs.createReadStream(image.path));

        const predictionResponse = await axios.post('http://localhost:5000/predict', formData, {
            headers:
            {"Content-Type": "multipart/form-data",}
        });

        foodName = predictionResponse.data.prediction;

        // Save the form data to the database
        const food = await Food.create({
            foodName,
            quantity,
            expiryDate,
            address,
            foodTag,
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

export default router;
