import React, { useState } from "react";
import useAxiosWithAuth from "../AxiosAuth";
import { Rating } from "react-simple-star-rating";

const AddReviewModal = ({ vetId, vetName, ownerId, onClose, onSave }) => {
    const axiosInstance = useAxiosWithAuth();
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState("");
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!rating || rating < 1 || rating > 5) {
            setError("Please select a rating between 1 and 5.");
            return;
        }
        if (!review.trim()) {
            setError("Please enter a review.");
            return;
        }

        try {
            const reviewData = {
                rating,
                review,
                vet: vetId,
                owner: ownerId,
            };
            const response = await axiosInstance.post("/rating-and-reviews/save", reviewData);
            onSave(response.data);
            onClose();
            alert("Review submitted successfully!");
        } catch (error) {
            console.error("Error submitting review:", error);
            setError("Failed to submit review. Please try again.");
        }
    };

    return (
        <div style={modalStyles}>
            <h3>Leave a Review for Dr. {vetName}</h3>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div style={{marginBottom: "15px"}} className="stars">
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
                    />
                </div>
                <div style={{marginBottom: "15px"}}>
                    <label>Review:</label>
                    <textarea
                        value={review}
                        onChange={(e) => setReview(e.target.value)}
                        placeholder="Write your review here..."
                        rows={4}
                        cols={40}
                        style={{width: "100%", marginTop: "5px"}}
                    />
                </div>
                <div style={{display: "flex", gap: "10px" }}>
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