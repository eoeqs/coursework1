import React, { useState } from "react";
import useAxiosWithAuth from "../AxiosAuth";
import { Rating } from "react-simple-star-rating";
import "../pinkmodal.css";

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
        } catch (error) {
            console.error("Error submitting review:", error);
            setError("Failed to submit review. Please try again.");
        }
    };

    return (
        <div className="pink-modal-overlay" onClick={onClose}>
            <div className="pink-modal-container" onClick={(e) => e.stopPropagation()}>
                <div className="pink-modal-header">
                    <h3 className="pink-modal-header-title">Leave a Review for Dr. {vetName}</h3>
                </div>
                {error && <p className="pink-modal-error">{error}</p>}
                <form onSubmit={handleSubmit} className="pink-modal-form">
                    <div className="pink-modal-rating-section">
                        <label className="pink-modal-label">Rating (1-5):</label>
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
                    <div className="pink-modal-input-section">
                        <label className="pink-modal-label">Review:</label>
                        <textarea
                            value={review}
                            onChange={(e) => setReview(e.target.value)}
                            placeholder="Write your review here..."
                            className="pink-modal-textarea"
                        />
                    </div>
                    <div className="pink-modal-footer">
                        <button type="submit" className="pink-modal-action-button">Submit</button>
                        <button type="button" onClick={onClose} className="pink-modal-cancel-button">Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddReviewModal;