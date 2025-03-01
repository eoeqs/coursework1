import React, { useState, useEffect } from "react";
import useAxiosWithAuth from "../AxiosAuth";
import DogBodyMap from "./DogBodyMap";
import CatBodyMap from "./CatBodyMap";

const EditClinicalDiagnosisModal = ({ diagnosisId, petId, appointmentId, anamnesisId, onClose, onSave, onSaveRecommended }) => {
    const axiosInstance = useAxiosWithAuth();
    const [petType, setPetType] = useState(null);
    const [bodyMarker, setBodyMarker] = useState(null);
    const [tempMarker, setTempMarker] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [ownerInfo, setOwnerInfo] = useState(null);
    const [petInfo, setPetInfo] = useState(null);
    const [symptoms, setSymptoms] = useState([]);
    const [selectedSymptoms, setSelectedSymptoms] = useState([]);
    const [newSymptom, setNewSymptom] = useState("");
    const [recommendedDiagnoses, setRecommendedDiagnoses] = useState([]);
    const [selectedDiagnosis, setSelectedDiagnosis] = useState(null);
    const [appointment, setAppointment] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        contagious: false,
        examinationPlan: "",
        status: "",
    });
    const [availableSectors, setAvailableSectors] = useState([]);
    const [selectedSectorId, setSelectedSectorId] = useState(null);
    const [showSectorModal, setShowSectorModal] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const petResponse = await axiosInstance.get(`/pets/pet/${petId}`);
                setPetType(petResponse.data.type);
                setPetInfo(petResponse.data);

                if (petResponse.data.owner) {
                    const ownerResponse = await axiosInstance.get(`/users/user-info/${petResponse.data.owner}`);
                    setOwnerInfo(ownerResponse.data);
                }

                const markerResponse = await axiosInstance.get(`/body-marker/appointment/${appointmentId}`);
                setBodyMarker(markerResponse.data);
                setTempMarker(markerResponse.data);

                const symptomsResponse = await axiosInstance.get("/symptoms/all");
                setSymptoms(symptomsResponse.data);

                const appointmentResponse = await axiosInstance.get(`/appointments/appointment/${appointmentId}`);
                setAppointment(appointmentResponse.data);

                if (diagnosisId) {
                    const diagnosisResponse = await axiosInstance.get(`/diagnosis/${diagnosisId}`);
                    const diagnosis = diagnosisResponse.data;
                    setFormData({
                        name: diagnosis.name || "",
                        description: diagnosis.description || "",
                        contagious: diagnosis.contagious || false,
                        examinationPlan: diagnosis.examinationPlan || "",
                        status: diagnosis.contagious ? (diagnosis.dangerous ? "Dangerous" : "Contagious") : "",
                    });
                    setSelectedSymptoms(diagnosis.symptoms || []);
                    if (diagnosis.bodyPart) {
                        setTempMarker((prev) => ({ ...prev, bodyPart: diagnosis.bodyPart }));
                    }
                }
            } catch (error) {
                setError("Error fetching data");
                console.error("Fetch error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [diagnosisId, petId, appointmentId, axiosInstance]);

    const handleBodyMark = (mark) => {
        setTempMarker({
            bodyPart: mark.part,
            positionX: mark.x,
            positionY: mark.y,
            appointment: appointmentId,
            pet: petId,
        });
    };

    const handleSaveRecommendedDiagnosis = () => {
        if (selectedDiagnosis) {
            onSaveRecommended(selectedDiagnosis.id);
            setSelectedDiagnosis(null);
        } else {
            alert("Please select a recommended diagnosis first.");
        }
    };

    const handleSymptomChange = (symptomId) => {
        setSelectedSymptoms((prev) =>
            prev.includes(symptomId) ? prev.filter((id) => id !== symptomId) : [...prev, symptomId]
        );
    };

    const handleAddSymptom = async () => {
        if (newSymptom.trim()) {
            try {
                const response = await axiosInstance.post("/symptoms/save", {
                    name: newSymptom,
                    description: "",
                });
                setSymptoms([...symptoms, response.data]);
                setNewSymptom("");
            } catch (error) {
                console.error("Error adding symptom:", error);
                alert("Failed to add symptom.");
            }
        }
    };

    const handleAnalyzeDiagnosis = async () => {
        if (selectedSymptoms.length > 0 && tempMarker?.bodyPart) {
            try {
                const response = await axiosInstance.get("/recommended-diagnosis/all-by-symptoms", {
                    params: {
                        symptomsId: selectedSymptoms.join(","),
                        bodyPart: tempMarker.bodyPart,
                    },
                });
                setRecommendedDiagnoses(response.data);
            } catch (error) {
                console.error("Error analyzing diagnosis:", error);
                alert("Failed to analyze diagnosis.");
            }
        } else {
            alert("Please select symptoms and mark a body part.");
        }
    };

    const handleStatusChange = (status) => {
        const newStatus = formData.status === status ? "" : status;
        setFormData((prev) => ({
            ...prev,
            status: newStatus,
            contagious: newStatus === "Contagious" || newStatus === "Dangerous",
        }));

        if (newStatus === "Contagious") {
            fetchAvailableSectors("/sectors/available-contagious");
        } else if (newStatus === "Dangerous") {
            fetchAvailableSectors("/sectors/available-dangerous");
        } else {
            setShowSectorModal(false);
            setAvailableSectors([]);
            setSelectedSectorId(null);
        }
    };

    const fetchAvailableSectors = async (endpoint) => {
        try {
            const response = await axiosInstance.get(endpoint);
            setAvailableSectors(response.data);
            setShowSectorModal(true);
        } catch (error) {
            console.error(`Error fetching sectors from ${endpoint}:`, error);
            alert("Failed to fetch available sectors.");
        }
    };

    const handleSectorSelect = async () => {
        if (!selectedSectorId) {
            alert("Please select a sector.");
            return;
        }

        try {
            await axiosInstance.put(`/pets/sector-place/${petId}`, null, {
                params: { sectorId: selectedSectorId },
            });
            alert(`Pet ${petId} successfully placed in sector ${selectedSectorId}`);
            setShowSectorModal(false);
        } catch (error) {
            console.error("Error placing pet in sector:", error);
            alert("Failed to place pet in sector.");
        }
    };

    const handleSave = () => {
        const diagnosisData = {
            ...formData,
            symptoms: selectedSymptoms,
            bodyPart: tempMarker?.bodyPart,
            anamnesis: anamnesisId,
            date: diagnosisId ? undefined : new Date().toISOString(),
            dangerous: formData.status === "Dangerous",
        };
        onSave(diagnosisData);
    };

    if (loading) return <div className="loading-overlay">Loading...</div>;
    if (error) return <div className="error-overlay">{error}</div>;

    return (
        <div style={modalStyles}>
            <h3>{diagnosisId ? "Edit Clinical Diagnosis" : "Add Clinical Diagnosis"}</h3>
            <p><strong>Owner Name:</strong> {ownerInfo ? `${ownerInfo.name} ${ownerInfo.surname}` : "Unknown"}</p>
            <p><strong>Pet Name:</strong> {petInfo?.name}</p>
            <p><strong>Pet Type:</strong> {petInfo?.type}</p>
            <p><strong>Complaints:</strong> {appointment?.description || "No complaints provided."}</p>

            <div style={{ margin: "20px 0" }}>
                {petType === "DOG" ? (
                    <DogBodyMap onMark={handleBodyMark} initialMarker={tempMarker} />
                ) : petType === "CAT" ? (
                    <CatBodyMap onMark={handleBodyMark} initialMarker={tempMarker} />
                ) : (
                    <p>Unknown animal type</p>
                )}
            </div>

            <div style={{ margin: "20px 0" }}>
                <h4>Diagnosis Details</h4>
                <div>
                    <label>Name:</label>
                    <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Enter diagnosis name"
                    />
                </div>
                <div>
                    <label>Description:</label>
                    <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={4}
                        cols={40}
                        placeholder="Enter diagnosis description"
                    />
                </div>
                <div style={{ margin: "10px 0" }}>
                    <label>Status:</label>
                    <div>
                        <label>
                            <input
                                type="radio"
                                name="status"
                                value="Contagious"
                                checked={formData.status === "Contagious"}
                                onChange={() => handleStatusChange("Contagious")}
                            />
                            Contagious
                        </label>
                        <label style={{ marginLeft: "20px" }}>
                            <input
                                type="radio"
                                name="status"
                                value="Dangerous"
                                checked={formData.status === "Dangerous"}
                                onChange={() => handleStatusChange("Dangerous")}
                            />
                            Dangerous
                        </label>
                    </div>
                </div>
                <div>
                    <label>Examination Plan:</label>
                    <textarea
                        value={formData.examinationPlan}
                        onChange={(e) => setFormData({ ...formData, examinationPlan: e.target.value })}
                        rows={4}
                        cols={40}
                        placeholder="Enter examination plan"
                    />
                </div>
            </div>

            <div style={{ margin: "20px 0" }}>
                <h4>Symptoms</h4>
                {symptoms.map((symptom) => (
                    <div key={symptom.id}>
                        <label>
                            <input
                                type="checkbox"
                                checked={selectedSymptoms.includes(symptom.id)}
                                onChange={() => handleSymptomChange(symptom.id)}
                            />
                            {symptom.name}
                        </label>
                    </div>
                ))}
                <div>
                    <input
                        type="text"
                        value={newSymptom}
                        onChange={(e) => setNewSymptom(e.target.value)}
                        placeholder="Add new symptom"
                    />
                    <button onClick={handleAddSymptom}>Add Symptom</button>
                </div>
            </div>

            <div style={{ margin: "20px 0" }}>
                <button onClick={handleAnalyzeDiagnosis}>Analyze for recommended diagnosis</button>
                {recommendedDiagnoses.length > 0 && (
                    <div>
                        <h4>Recommended Diagnoses</h4>
                        {recommendedDiagnoses.map((diagnosis) => (
                            <div key={diagnosis.id}>
                                <label>
                                    <input
                                        type="radio"
                                        name="diagnosis"
                                        checked={selectedDiagnosis?.id === diagnosis.id}
                                        onChange={() => setSelectedDiagnosis(diagnosis)}
                                    />
                                    {diagnosis.name} - {diagnosis.description}
                                </label>
                            </div>
                        ))}
                        <button onClick={handleSaveRecommendedDiagnosis}>Save Selected Recommended Diagnosis</button>
                    </div>
                )}
            </div>

            <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
                <button onClick={handleSave}>Save</button>
                <button onClick={onClose}>Cancel</button>
            </div>

            {showSectorModal && (
                <div style={sectorModalStyles}>
                    <h4>Select Sector</h4>
                    {availableSectors.length > 0 ? (
                        <div>
                            {availableSectors.map((sector) => (
                                <div key={sector.id}>
                                    <label>
                                        <input
                                            type="radio"
                                            name="sector"
                                            value={sector.id}
                                            checked={selectedSectorId === sector.id}
                                            onChange={() => setSelectedSectorId(sector.id)}
                                        />
                                        {sector.name || `Sector ${sector.id}`}
                                    </label>
                                </div>
                            ))}
                            <button onClick={handleSectorSelect} disabled={!selectedSectorId}>
                                Confirm
                            </button>
                            <button onClick={() => setShowSectorModal(false)}>Cancel</button>
                        </div>
                    ) : (
                        <p>No available sectors found.</p>
                    )}
                </div>
            )}
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

const sectorModalStyles = {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    zIndex: 1001,
    maxWidth: "400px",
    width: "90%",
};

export default EditClinicalDiagnosisModal;