import React from "react";

const SeeAllReviewsModal = ({ vet, ratings, onClose }) => {
    const renderStars = (rating) => {
        const stars = Math.round(rating);
        return "⭐".repeat(stars) + "☆".repeat(5 - stars);
    };

    return (
        <div style={modalStyles}>
            <h3>Reviews for Dr. {vet.name} {vet.surname}</h3>
            <div style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
                {vet.photoUrl ? (
                    <img
                        src={vet.photoUrl}
                        alt={`${vet.name} ${vet.surname}`}
                        style={{ width: "100px", height: "100px", borderRadius: "50%", marginRight: "20px" }}
                    />
                ) : (
                    <div style={{ width: "100px", height: "100px", marginRight: "20px" }}>No photo</div>
                )}
                <div>
                    <h4>{vet.name} {vet.surname}</h4>
                    <p>Expert in {vet.qualification || "Veterinary Medicine"}</p>
                </div>
            </div>
            <h4>All Reviews</h4>
            {ratings && ratings.length > 0 ? (
                <div style={{ maxHeight: "300px", overflowY: "auto" }}>
                    {ratings.map((rating) => (
                        <div key={rating.id} style={{ marginBottom: "15px", borderBottom: "1px solid #ddd", paddingBottom: "10px" }}>
                            <p>{renderStars(rating.rating)} ({rating.rating})</p>
                            <p>"{rating.review}"</p>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No reviews available for this veterinarian.</p>
            )}
            <button
                className="button btn-no-border rounded-3"
                onClick={onClose}
                style={{ marginTop: "20px" }}
            >
                Close
            </button>
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
    maxWidth: "600px",
    width: "90%",
};

export default SeeAllReviewsModal;