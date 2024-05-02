import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ImageUploader = () => {
    const [image, setImage] = useState(null);
    const [prediction, setPrediction] = useState(null);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onloadend = () => {
            setImage(reader.result);
        };

        if (file) {
            reader.readAsDataURL(file);
        }
    };

    const handlePredict = async () => {
        if (!image) return;

        try {
            const formData = new FormData();
            formData.append('img', image);
            console.log(formData);
            const response = await axios.post('http://127.0.0.1:5000/predict', formData);

            if (response.status !== 200) {
                throw new Error('Failed to get prediction from server');
            }

            setPrediction(response.data.prediction);
        } catch (error) {
            console.error('Error predicting:', error);
            setPrediction('Failed to get prediction. Please try again later.');
        }
    };

    return (
        <div>
            <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
            />
            {image && (
                <div>
                    <img src={image} alt="Uploaded" style={{ maxWidth: '100%', maxHeight: '300px' }} />
                    <button onClick={handlePredict}>Predict</button>
                </div>
            )}
            {prediction && (
                <div>
                    <h2>Prediction:</h2>
                    <p>{prediction}</p>
                </div>
            )}
        </div>
    );
};

export default ImageUploader;
