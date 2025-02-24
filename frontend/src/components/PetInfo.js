import React from "react";

const PetInfo = ({ petInfo, onEdit }) => {
    return (
        <div className="container bg-pink rounded-3" style={{maxWidth: '320px', padding: "20px"}}>
            {/*<h2 className="text-pink mt-1 ps-4">Pet Profile</h2>*/}
            <div>
                <div className="mb-4 ps-2">
                    {petInfo.photoUrl ? (
                        <img className="avatar"
                            src={petInfo.photoUrl}
                            alt={`${petInfo.name}'s avatar`}
                            style={{width: '250px', height: '250px', borderRadius: '2%'}}
                        />
                    ) : (
                        <div>Pet profile pic placeholder</div>
                    )}
                </div>
            </div>

            <div className="ps-2">
                <h1> {petInfo.name || "not specified"}</h1>
                <p style={{ marginBottom: '5px' }}><strong>Type:</strong> {petInfo.type || "not specified"}</p>
                <p style={{ marginBottom: '5px' }}><strong>Breed:</strong> {petInfo.breed || "not specified"}</p>
                <p style={{ marginBottom: '5px' }}><strong>Age:</strong> {petInfo.age || "not specified"}</p>
                <p style={{ marginBottom: '5px' }}><strong>Sex:</strong> {petInfo.sex || "not specified"}</p>
                <p style={{ marginBottom: '5px' }}><strong>Weight:</strong> {petInfo.weight ? `${petInfo.weight} kg` : "not specified"}</p>
                <p style={{ marginBottom: '5px' }}><strong>Sector:</strong> {petInfo.sector || "not specified"}</p>
            </div>

            <button className="button rounded-3 btn-no-border" onClick={onEdit}>Edit pet profile</button>
        </div>
    );
};

export default PetInfo;