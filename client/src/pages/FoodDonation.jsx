import React, { useState, useEffect } from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import "./FoodDonation.css";

function FoodDonation() {
  const [foodName, setFoodName] = useState("");
  const [foodTag, setFoodTag] = useState("");
  const [quantity, setQuantity] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [address, setAddress] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [step, setStep] = useState(1);

  const navigate = useNavigate();
  const email = localStorage.getItem("email");

  useEffect(() => {
    // Set expiryDate to 2 days from the current date
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + 2);
    setExpiryDate(currentDate.toISOString().split("T")[0]);
  }, []);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setImage(file);
      setImagePreview(reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handlePredict = async (event) => {
    event.preventDefault();
    if (!image) return;

    try {
      const formData = new FormData();
      formData.append("image", image);
      const response = await axios.post("http://127.0.0.1:5000/predict", formData);
      if (response.status !== 200) {
        throw new Error("Failed to get prediction from server");
      }

      setPrediction(response.data.prediction);
      setFoodName(response.data.prediction);
      setStep(2);
    } catch (error) {
      console.error("Error predicting:", error);
      setPrediction("Failed to get prediction. Please try again later.");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("foodName", foodName);
    formData.append("foodTag", foodTag);
    formData.append("quantity", quantity);
    formData.append("expiryDate", expiryDate);
    formData.append("address", address);
    formData.append("image", image);
    formData.append("email", email);

    // Send the form data to the server using Axios
    try {
      const response = await axios.post("http://localhost:3000/fooddonation", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Response:", response.data);
      // return response.data;
      navigate('/dashboard/food');
    } catch (error) {
      console.error(error);
    }
  };

  const handleRetry = () => {
    setStep(1);
    setImage(null);
    setImagePreview(null);
    setPrediction(null);
  };

  return (
    <div className="foodDonation_container">
      <div className="foodDonation_heading">
        <h1 className="heading-foodd">FOOD DONATION FORM</h1>
      </div>
      <div className="foodDonation_wrapper">
        {step === 1 && (
          <form className="food-donation_form" onSubmit={handlePredict}>
            <div className="form_element">
              <label htmlFor="image">Upload Image</label>
              <input
                type="file"
                id="image"
                name="image"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>
            {imagePreview && (
              <div className="image_preview">
                <img src={imagePreview} alt="Uploaded" style={{ maxWidth: '100%', maxHeight: '300px' }} />
              </div>
            )}
            <button id="foodDonation_submit-btn" type="submit">
              Predict
            </button>
          </form>
        )}
        {step === 2 && (
          <div>
            <div className="prediction_result">
              <h2>Prediction:</h2>
              <p>{prediction}</p>
              <button type="button" onClick={() => setStep(3)}>Yes</button>
              <button type="button" onClick={handleRetry}>No</button>
            </div>
          </div>
        )}
        {step === 3 && (
          <form className="food-donation_form" onSubmit={handleSubmit}>
            <div className="form_element">
              <label htmlFor="foodName">Food name</label>
              <input
                type="text"
                id="foodName"
                name="foodName"
                value={foodName}
                readOnly
              />
            </div>
            <div className="form_element">
              <label htmlFor="quantity">Quantity</label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                value={quantity}
                onChange={(event) => setQuantity(event.target.value)}
              />
            </div>
            <div className="form_element">
              <label htmlFor="foodTag">Food type or tag</label>
              <select
                id="foodTag"
                name="foodTag"
                value={foodTag}
                onChange={(event) => setFoodTag(event.target.value)}
              >
                <option value="" disabled selected>
                  Choose type
                </option>
                <option value="veg" style={{ color: "black" }}>
                  Veg
                </option>
                <option value="nonveg" style={{ color: "black" }}>
                  Non Veg
                </option>
              </select>
            </div>
            <div className="form_element">
              <label htmlFor="expiryDate">Expiry Date</label>
              <input
                type="date"
                id="expiryDate"
                name="expiryDate"
                value={expiryDate}
                readOnly
              />
            </div>
            <div className="form_element">
              <label htmlFor="address">Address</label>
              <input
                type="text"
                id="address"
                name="address"
                value={address}
                onChange={(event) => setAddress(event.target.value)}
              />
            </div>
            <button id="foodDonation_submit-btn" type="submit">
              Submit
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default FoodDonation;
