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
    const [quarantineData, setQuarantineData] = useState({
        reason: "",
        description: "",
        startDate: "",
        endDate: "",
        status: "CURRENT",
    });

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
            }
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
            setQuarantineData({ reason: "", description: "", startDate: "", endDate: "", status: "ACTIVE" });
        }
    };

    const fetchAvailableSectors = async (endpoint) => {
        try {
            const response = await axiosInstance.get(endpoint);
            const sectors = response.data;

            const sectorsWithQuarantine = await Promise.all(
                sectors.map(async (sector) => {
                    const quarantineResponse = await axiosInstance.get(`/quarantine/sector/${sector.id}`);
                    const quarantines = quarantineResponse.data;
                    const uniqueReasons = [...new Set(quarantines.map((q) => q.reason))];
                    return { ...sector, quarantineReasons: uniqueReasons };
                })
            );

            setAvailableSectors(sectorsWithQuarantine);
            setShowSectorModal(true);
        } catch (error) {
            console.error(`Error fetching sectors from ${endpoint}:`, error);
        }
    };

    const handleQuarantineChange = (e) => {
        const { name, value } = e.target;
        setQuarantineData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSectorSelect = async () => {
        if (!selectedSectorId || !quarantineData.reason || !quarantineData.description || !quarantineData.startDate || !quarantineData.endDate) {
            return;
        }

        try {
            const quarantineDTO = {
                reason: quarantineData.reason,
                description: quarantineData.description,
                startDate: new Date(quarantineData.startDate).toISOString(),
                endDate: new Date(quarantineData.endDate).toISOString(),
                status: quarantineData.status,
                sector: selectedSectorId,
                pet: petId,
            };
            await axiosInstance.post("/quarantine/save", quarantineDTO);
            await axiosInstance.put(`/pets/sector-place/${petId}`, null, { params: { sectorId: selectedSectorId } });
            setShowSectorModal(false);
        } catch (error) {
            console.error("Error saving quarantine or placing pet in sector:", error);
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
        <div style={modalOverlayStyles}>
            <div style={modalStyles}>
                <div style={headerStyles}>
                    <h3>{diagnosisId ? "Edit Clinical Diagnosis" : "Add Clinical Diagnosis"}</h3>
                </div>

                <div style={mainContentStyles}>
                    <div style={leftColumnStyles}>
                        <div style={infoSectionStyles}>
                            <p><strong>Owner:</strong> {ownerInfo ? `${ownerInfo.name} ${ownerInfo.surname}` : "Unknown"}</p>
                            <p><strong>Pet:</strong> {petInfo?.name}</p>
                            <p><strong>Type:</strong> {petInfo?.type}</p>
                            <p><strong>Complaints:</strong> {appointment?.description || "No complaints provided."}</p>



                            {petType === "DOG" ? (
                                <DogBodyMap onMark={handleBodyMark} initialMarker={tempMarker} />
                            ) : petType === "CAT" ? (
                                <CatBodyMap onMark={handleBodyMark} initialMarker={tempMarker} />
                            ) : (
                                <p>Unknown animal type</p>
                            )}
                        </div>

                    </div>

                    <div style={rightColumnStyles}>
                        <div style={inputSectionStyles}>
                            <label style={labelStyles}>Status:</label>
                            <div style={radioGroupStyles}>
                                <label style={radioLabelStyles}>
                                    <input
                                        style={{ marginRight: "4px" }}
                                        type="radio"
                                        name="status"
                                        value="Contagious"
                                        checked={formData.status === "Contagious"}
                                        onChange={() => handleStatusChange("Contagious")}
                                    />
                                    Contagious
                                </label>
                                <label style={radioLabelStyles}>
                                    <input
                                        style={{ marginRight: "4px" }}
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

                        <div style={inputSectionStyles}>
                            <label style={labelStyles}>Examination Plan:</label>
                            <textarea
                                value={formData.examinationPlan}
                                onChange={(e) => setFormData({...formData, examinationPlan: e.target.value})}
                                style={textareaStyles}
                                placeholder="Enter examination plan"
                            />
                        </div>

                        <div style={inputSectionStyles}>
                            <label style={labelStyles}>Symptoms:</label>
                            <div style={symptomListStyles}>
                                {symptoms.map((symptom) => (
                                    <label key={symptom.id} style={checkboxLabelStyles}>
                                        <input
                                            style={{ marginRight: "4px" }}
                                            type="checkbox"
                                            checked={selectedSymptoms.includes(symptom.id)}
                                            onChange={() => handleSymptomChange(symptom.id)}
                                        />
                                        {symptom.name}
                                    </label>
                                ))}
                            </div>
                            <div style={addSymptomStyles}>
                                <input
                                    type="text"
                                    value={newSymptom}
                                    onChange={(e) => setNewSymptom(e.target.value)}
                                    style={inputStyles}
                                    placeholder="Add new symptom"
                                />
                                <button onClick={handleAddSymptom} style={smallButtonStyles}>Add</button>
                            </div>
                        </div>

                        <div style={inputSectionStyles}>
                            <button onClick={handleAnalyzeDiagnosis} style={buttonStyles}>Analyze Diagnosis</button>
                            {recommendedDiagnoses.length > 0 && (
                                <div style={{marginTop: "10px"}}>
                                    <h4 style={subHeaderStyles}>Recommended Diagnoses</h4>
                                    {recommendedDiagnoses.map((diagnosis) => (
                                        <label key={diagnosis.id} style={radioLabelStyles}>
                                            <input
                                                style={{ marginRight: "4px" }}
                                                type="radio"
                                                name="diagnosis"
                                                checked={selectedDiagnosis?.id === diagnosis.id}
                                                onChange={() => setSelectedDiagnosis(diagnosis)}
                                            />
                                            {diagnosis.name} - {diagnosis.description}
                                        </label>
                                    ))}
                                    <button onClick={handleSaveRecommendedDiagnosis} style={smallButtonStyles}>
                                        Save Selected
                                    </button>
                                </div>

                            )}
                        </div>
                        <div style={inputSectionStyles}>
                            <label style={labelStyles}>Name:</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                style={inputStyles}
                                placeholder="Enter diagnosis name"
                            />
                        </div>

                        <div style={inputSectionStyles}>
                            <label style={labelStyles}>Description:</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({...formData, description: e.target.value})}
                                style={textareaStyles}
                                placeholder="Enter diagnosis description"
                            />
                        </div>
                    </div>
                </div>

                <div style={footerStyles}>
                    <button onClick={handleSave} style={buttonStyles}>Create</button>
                    <button onClick={onClose} style={cancelButtonStyles}>Cancel</button>
                </div>

                {showSectorModal && (
                    <div style={sectorModalStyles}>
                        <h4 style={subHeaderStyles}>Select Sector and Set Quarantine</h4>
                        {availableSectors.length > 0 ? (
                            <div>
                                {availableSectors.map((sector) => (
                                    <div key={sector.id} style={sectorItemStyles}>
                                        <label style={radioLabelStyles}>
                                            <input
                                                type="radio"
                                                name="sector"
                                                value={sector.id}
                                                checked={selectedSectorId === sector.id}
                                                onChange={() => setSelectedSectorId(sector.id)}
                                            />
                                            {sector.name || `Sector ${sector.id}`}
                                        </label>
                                        <p style={sectorInfoStyles}>
                                            <strong>Type:</strong> {sector.type || "Unknown"}<br />
                                            <strong>Pets:</strong> {sector.occupancy || 0} / {sector.capacity || "Unknown"}<br />
                                            <strong>Reasons:</strong> {sector.quarantineReasons?.join(", ") || "None"}
                                        </p>
                                    </div>
                                ))}
                                <div style={inputSectionStyles}>
                                    <label style={labelStyles}>Reason:</label>
                                    <input
                                        type="text"
                                        name="reason"
                                        value={quarantineData.reason}
                                        onChange={handleQuarantineChange}
                                        style={inputStyles}
                                        placeholder="Enter quarantine reason"
                                    />
                                    <label style={labelStyles}>Description:</label>
                                    <textarea
                                        name="description"
                                        value={quarantineData.description}
                                        onChange={handleQuarantineChange}
                                        style={textareaStyles}
                                        placeholder="Enter quarantine description"
                                    />
                                    <label style={labelStyles}>Start Date:</label>
                                    <input
                                        type="datetime-local"
                                        name="startDate"
                                        value={quarantineData.startDate}
                                        onChange={handleQuarantineChange}
                                        style={inputStyles}
                                    />
                                    <label style={labelStyles}>End Date:</label>
                                    <input
                                        type="datetime-local"
                                        name="endDate"
                                        value={quarantineData.endDate}
                                        onChange={handleQuarantineChange}
                                        style={inputStyles}
                                    />
                                </div>
                                <div style={footerStyles}>
                                    <button onClick={handleSectorSelect} disabled={!selectedSectorId} style={buttonStyles}>
                                        Confirm
                                    </button>
                                    <button onClick={() => setShowSectorModal(false)} style={cancelButtonStyles}>Cancel</button>
                                </div>
                            </div>
                        ) : (
                            <p>No available sectors found.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

const modalOverlayStyles = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
};

const modalStyles = {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
    width: "1200px",
    maxWidth: "95%",
    height: "auto",
    maxHeight: "85vh",
    overflowY: "hidden",
    display: "flex",
    flexDirection: "column",
};

const headerStyles = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "10px",
    textAlign: "center",
    borderBottom: "2px solid #f0f0f0",
};

const mainContentStyles = {
    display: "flex",
    gap: "20px",
    flex: 1,
    overflowY: "hidden",
};

const leftColumnStyles = {
    width: "50%",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
};

const rightColumnStyles = {
    width: "50%",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
};

const infoSectionStyles = {
    backgroundColor: "#f9f9f9",
    padding: "10px",
    borderRadius: "5px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
};

const inputSectionStyles = {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
};

const labelStyles = {
    fontSize: "12px",
    fontWeight: "bold",
    color: "#682020",
};

const inputStyles = {
    padding: "6px",
    borderRadius: "4px",
    border: "1px solid #ddd",
    fontSize: "12px",
    width: "100%",
};

const textareaStyles = {
    padding: "6px",
    borderRadius: "4px",
    border: "1px solid #ddd",
    fontSize: "12px",
    height: "80px",
    width: "100%",
    resize: "none",
};

const radioGroupStyles = {
    display: "flex",
    gap: "15px",
};

const radioLabelStyles = {
    display: "flex",
    alignItems: "center",
    fontSize: "12px",
    color: "#682020",
};

const checkboxLabelStyles = {
    display: "flex",
    alignItems: "center",
    fontSize: "12px",
    margin: "5px 0",
    color: "#682020",
};

const symptomListStyles = {
    maxHeight: "150px",
    overflowY: "auto",
    padding: "5px",
    border: "1px solid #ddd",
    borderRadius: "4px",
};

const addSymptomStyles = {
    display: "flex",
    gap: "10px",
    marginTop: "10px",
};

const subHeaderStyles = {
    fontSize: "14px",
    fontWeight: "bold",
    margin: "10px 0 5px",
    color: "#682020",
};

const buttonStyles = {
    padding: "6px 12px",
    backgroundColor: "rgba(161,63,63,0.85)",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "12px",
    transition: "background-color 0.3s",
};

const smallButtonStyles = {
    padding: "4px 8px",
    backgroundColor: "rgba(175,74,74,0.84)",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "12px",
};

const cancelButtonStyles = {
    padding: "6px 12px",
    backgroundColor: "#ccc",
    color: "#333",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "12px",
};

const footerStyles = {
    display: "flex",
    justifyContent: "center",
    gap: "15px",
    marginTop: "15px",
};

const sectorModalStyles = {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
    zIndex: 1001,
    width: "500px",
    maxWidth: "90%",
    maxHeight: "80vh",
    overflowY: "auto",
};

const sectorItemStyles = {
    padding: "10px",
    borderBottom: "1px solid #ddd",
};

const sectorInfoStyles = {
    fontSize: "12px",
    marginLeft: "20px",
    color: "#682020",
};

export default EditClinicalDiagnosisModal;