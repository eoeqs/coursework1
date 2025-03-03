import React, { useState } from "react";
import useAxiosWithAuth from "../AxiosAuth";
import { Rating } from "react-simple-star-rating";

const AddReviewModal = ({ vetId, vetName, ownerId, onClose, onSave }) => {
    const axiosInstance = useAxiosWithAuth();
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState("");
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!rating || rating < 1 || rating > 5) {
            setError("Please select a rating between 1 and 5 stars.");
            return;
        }
        if (review.length > 1000) {
            setError("Review must not exceed 1000 characters.");
            return;
        }

        setError(null);

        try {
            const reviewData = {
                rating,
                review: review.trim(),
                vet: vetId,
                owner: ownerId,
            };
            const response = await axiosInstance.post("/rating-and-reviews/save", reviewData);
            setSuccessMessage("Review submitted successfully.");
            onSave(response.data);
            setTimeout(() => {
                onClose();
            }, 2000);
        } catch (error) {
            console.error("Error submitting review:", error);
            setError("Failed to submit review. Please try again.");
        }
    };

    return (
        <div style={modalStyles}>
            <h3>Leave a Review for Dr. {vetName}</h3>
            {error && <p style={{ color: "red" }}>{error}</p>}
            {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: "15px" }} className="stars">
                    <label>Rating (1-5):</label>
                    <Rating
                        onClick={(rate) => {
                            console.log("Selected rating:", rate);
                            setRating(rate);
                        }}
                        ratingValue={rating}
                        size={24}
                        fillColor="#ffd700"
                        emptyColor="#ccc"
                        className="rating"
                        initialValue={0}
                        allowHalf={false}
                    />
                </div>
                <div style={{ marginBottom: "15px" }}>
                    <label>Review (optional):</label>
                    <textarea
                        value={review}
                        onChange={(e) => setReview(e.target.value)}
                        placeholder="Write your review here (max 1000 characters)..."
                        rows={4}
                        cols={40}
                        style={{ width: "100%", marginTop: "5px" }}
                        maxLength={1000}
                    />
                    <small>{review.length}/1000 characters</small>
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                    <button type="submit">Submit</button>
                    <button type="button" onClick={onClose}>
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

const modalStyles = {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    zIndex: 1000,
    maxWidth: "500px",
    width: "90%",
};

export default AddReviewModal;