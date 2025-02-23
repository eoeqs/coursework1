import React from "react";

const PetInfo = ({ petInfo, onEdit }) => {
    return (
        <div>
            <h2>Pet Profile</h2>
            <div>
                <div>
                    {petInfo.photoUrl ? (
                        <img
                            src={petInfo.photoUrl}
                            alt={`${petInfo.name}'s avatar`}
                            style={{width: '200px', height: '200px', borderRadius: '50%'}}
                        />
                    ) : (
                        <div>Pet profile pic placeholder</div>
                    )}
                </div>
            </div>

            <div>
                <p><strong>Name:</strong> {petInfo.name || "not specified"}</p>
                <p><strong>Type:</strong> {petInfo.type || "not specified"}</p>
                <p><strong>Age:</strong> {petInfo.age || "not specified"}</p>
                <p><strong>Sex:</strong> {petInfo.sex || "not specified"}</p>
                <p><strong>Weight:</strong> {petInfo.weight ? `${petInfo.weight} kg` : "not specified"}</p>
                <p><strong>Breed:</strong> {petInfo.breed || "not specified"}</p>
                <p><strong>Sector:</strong> {petInfo.sector || "not specified"}</p>
            </div>

            <button onClick={onEdit}>Edit pet profile</button>
            <button onClick={() => window.history.back()}>Close</button>
        </div>
    );
};

export default PetInfo;