import React, { useEffect, useState } from "react";
import useAxiosWithAuth from "../AxiosAuth";
import DogBodyMap from "./DogBodyMap";
import CatBodyMap from "./CatBodyMap";

const EditDiagnosisModal = ({ diagnosisId, petId, appointmentId, anamnesisId, onClose, onSave }) => {
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

    const handleSaveRecommendedDiagnosis = async () => {
        if (selectedDiagnosis) {
            try {
                await axiosInstance.post(`/diagnosis/save-recommended/${anamnesisId}`, selectedDiagnosis.id, {
                    headers: { "Content-Type": "application/json" },
                });
                setSelectedDiagnosis(null);
            } catch (error) {
                console.error("Error saving recommended diagnosis:", error);
            }
        }
    };

    const handleSave = () => {
        const diagnosisData = {
            ...formData,
            symptoms: selectedSymptoms,
            bodyPart: tempMarker?.bodyPart,
            anamnesis: anamnesisId,
            date: diagnosisId ? undefined : new Date().toISOString(),
        };
        onSave(diagnosisData);
    };

    if (loading) return <div className="loading-overlay">Loading...</div>;
    if (error) return <div className="error-overlay">{error}</div>;

    return (
        <div style={modalOverlayStyles}>
            <div style={modalStyles}>
                <div style={headerStyles}>
                    <h3>{diagnosisId ? "Edit Preliminary Diagnosis" : "Add Preliminary Diagnosis"}</h3>
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
                            <label style={labelStyles}>Name:</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                style={inputStyles}
                                placeholder="Enter diagnosis name"
                            />
                        </div>

                        <div style={inputSectionStyles}>
                            <label style={labelStyles}>Description:</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                style={textareaStyles}
                                placeholder="Enter diagnosis description"
                            />
                        </div>

                        <div style={inputSectionStyles}>
                            <label style={labelStyles}>Contagious:</label>
                            <label style={checkboxLabelStyles}>
                                <input
                                    style={{ marginRight: "8px" }}
                                    type="checkbox"
                                    checked={formData.contagious}
                                    onChange={(e) => setFormData({ ...formData, contagious: e.target.checked })}
                                />
                                Yes
                            </label>
                        </div>

                        <div style={inputSectionStyles}>
                            <label style={labelStyles}>Examination Plan:</label>
                            <textarea
                                value={formData.examinationPlan}
                                onChange={(e) => setFormData({ ...formData, examinationPlan: e.target.value })}
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
                                            type="checkbox"
                                            checked={selectedSymptoms.includes(symptom.id)}
                                            onChange={() => handleSymptomChange(symptom.id)}
                                            style={{ marginRight: "8px" }}
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
                                <div style={{ marginTop: "10px" }}>
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
                    </div>
                </div>

                <div style={footerStyles}>
                    <button onClick={handleSave} style={buttonStyles}>Save</button>
                    <button onClick={onClose} style={cancelButtonStyles}>Cancel</button>
                </div>
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

const bodyMapContainerStyles = {
    width: "200px",
    height: "200px",
    margin: "0 auto",
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

export default EditDiagnosisModal;