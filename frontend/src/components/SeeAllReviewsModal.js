import React from "react";
import "../pinkmodal.css";

const SeeAllReviewsModal = ({ vet, ratings, onClose }) => {
    const renderStars = (rating) => {
        const stars = Math.round(rating);
        return "⭐".repeat(stars) + "☆".repeat(5 - stars);
    };

    return (
        <div className="pink-modal-overlay" onClick={onClose}>
            <div className="pink-modal-container" onClick={(e) => e.stopPropagation()}>
                <div className="pink-modal-header">
                    <h3 className="pink-modal-header-title">Reviews for Dr. {vet.name} {vet.surname}</h3>
                </div>
                <div className="pink-modal-vet-info">
                    {vet.photoUrl ? (
                        <img
                            src={vet.photoUrl}
                            alt={`${vet.name} ${vet.surname}`}
                            className="pink-modal-vet-photo"
                        />
                    ) : (
                        <div className="pink-modal-vet-photo-placeholder">No photo</div>
                    )}
                    <div className="pink-modal-vet-details">
                        <h4>{vet.name} {vet.surname}</h4>
                        <p>Expert in {vet.qualification || "Veterinary Medicine"}</p>
                    </div>
                </div>
                <h4 className="pink-modal-subheader">All Reviews</h4>
                {ratings && ratings.length > 0 ? (
                    <div className="pink-modal-reviews-list">
                        {ratings.map((rating) => (
                            <div key={rating.id} className="pink-modal-review-item">
                                Anonymous:
                                <p>{renderStars(rating.rating)} ({rating.rating})</p>
                                <p>"{rating.review}"</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="pink-modal-no-reviews">No reviews available for this veterinarian.</p>
                )}
                <div className="pink-modal-footer">
                    <button onClick={onClose} className="pink-modal-cancel-button button btn-no-border rounded-3">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SeeAllReviewsModal;