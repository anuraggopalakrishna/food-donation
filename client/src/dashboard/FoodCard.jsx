import React, { useState } from "react";
import { FaCalendarAlt, FaCartArrowDown, FaHome, FaHourglassEnd } from "react-icons/fa";
import axios from "axios";
import Modal from "react-modal";
import "./FoodCard.css";

Modal.setAppElement("#root");

const FoodCard = ({ id, name, quantity, date, address, tag }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [nameOfUser, setNameOfUser] = useState("");
  const handleCheckStatus = () => {
    setShowDetails(!showDetails);
  };

  const handleClaim = async () => {
    const confirmClaim = window.confirm("Do you want to claim this food?");
    if (confirmClaim) {
      try {
        // Fetch user details
        const userEmail = localStorage.getItem("email");
        const response = await axios.get(`http://localhost:3000/user/${userEmail}`);

        setPhoneNumber(response.data.number);
        setEmail(response.data.email);
        setNameOfUser(response.data.name);
        setShowModal(true);
      } catch (error) {
        console.log("Error claiming the food:", error.message);
      }
    }
  };

  const handleConfirmClaim = async () => {
    try {
      // Remove the food item from the database
      await axios.delete(`http://localhost:3000/foods/${id}`);
      setShowModal(false);
    } catch (error) {
      console.log("Error removing the food item:", error.message);
    }
  };

  return (
    <div>
      <div className="card">
        <p
          style={{
            position: "absolute",
            top: "0.5rem",
            left: "0.5rem",
            padding: "0.5rem 1rem",
            background: "#f5f5f5",
            color: "#333",
            fontSize: "1rem",
            fontWeight: "bold",
            borderRadius: "0.5rem",
          }}
        >
          {tag ? tag : "food"}
        </p>
        <img
          className="foodcard-img"
          src={`https://source.unsplash.com/random/?${name}`}
          alt="Card Image"
        />
        <div className="card-content">
          <h2 className="food-title">{name}</h2>
          <div className="food-details">
            <ul className="icons">
              <li>
                <span className="icons-name">
                  <FaCartArrowDown />
                </span>
                : {quantity} kg
              </li>
              <li>
                <span className="icons-name">
                  <FaHourglassEnd />
                </span>
                : { new Date(date).toLocaleString() }
              </li>
              <li>
                <span className="icons-name">
                  <FaHome />
                </span>
                : {address}
              </li>
            </ul>
          </div>
          <button className="food-btn" onClick={handleCheckStatus}>
            Check Status
          </button>
          {showDetails && (
            <div className="food-details-card">
              <h3>Details:</h3>
              <p>Name: {name}</p>
              <p>Quantity: {quantity} kg</p>
              <p>Expiry Date: {new Date(date).toLocaleString()}</p>
              <p>Address: {address}</p>
              <button className="food-claim-btn" onClick={handleClaim}>
                Claim
              </button>
            </div>
          )}
        </div>
      </div>

      <Modal isOpen={showModal} onRequestClose={() => setShowModal(false)} className="Modal" overlayClassName="Overlay">
        <h2>Contact Information</h2>
        <br />
        <p>Name: {nameOfUser}</p>
        <p>Email: {email}</p>
        <p>Phone Number: {phoneNumber}</p>
        <br />
        <p>Please note down this information. The listing will be removed once you confirm the claim.</p>
        <div className="modal-buttons">
          <button className="confirm-btn" onClick={handleConfirmClaim}>Confirm Claim</button>
          <button className="cancel-btn" onClick={() => setShowModal(false)}>Cancel</button>
        </div>
      </Modal>
    </div>
  );
};

export default FoodCard;
