import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useAxiosWithAuth from "../AxiosAuth";
import PetInfo from "./PetInfo";
import AppointmentModal from "./AppointmentModal";
import EditDiagnosisModal from "./EditDianosisModal";
import EditExaminationPlanModal from "./EditExaminationPlanModal";
import EditClinicalDiagnosisModal from "./EditClinicalDiagnosisModal";
import EditTreatmentModal from "./EditTreatmentModal";

const AnamnesisDetailsPage = () => {
    const { id } = useParams();
    const axiosInstance = useAxiosWithAuth();
    const [anamnesis, setAnamnesis] = useState(null);
    const [petInfo, setPetInfo] = useState(null);
    const [doctorName, setDoctorName] = useState("");
    const [diagnosis, setDiagnosis] = useState(null);
    const [clinicalDiagnoses, setClinicalDiagnoses] = useState([]);
    const [appointment, setAppointment] = useState(null);
    const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
    const [isEditDiagnosisModalOpen, setIsEditDiagnosisModalOpen] = useState(false);
    const [isEditExaminationPlanModalOpen, setIsEditExaminationPlanModalOpen] = useState(false);
    const [isEditClinicalDiagnosisModalOpen, setIsEditClinicalDiagnosisModalOpen] = useState(false);
    const [selectedClinicalDiagnosis, setSelectedClinicalDiagnosis] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [treatments, setTreatments] = useState([]);
    const [isEditTreatmentModalOpen, setIsEditTreatmentModalOpen] = useState(false);
    const [selectedTreatment, setSelectedTreatment] = useState(null);
    const [userRole, setUserRole] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const anamnesisResponse = await axiosInstance.get(`/anamnesis/${id}`);
                setAnamnesis(anamnesisResponse.data);

                const petResponse = await axiosInstance.get(`/pets/pet/${anamnesisResponse.data.pet}`);
                setPetInfo(petResponse.data);

                if (petResponse.data.actualVet) {
                    const doctorResponse = await axiosInstance.get(`/users/user-info/${petResponse.data.actualVet}`);
                    setDoctorName(doctorResponse.data.name);
                }

                const diagnosisResponse = await axiosInstance.get(`/diagnosis/preliminary-diagnosis/${id}`);
                console.log(diagnosisResponse.data)
                setDiagnosis(diagnosisResponse.data);

                const clinicalDiagnosesResponse = await axiosInstance.get(`/diagnosis/all-diagnoses/${id}`);
                setClinicalDiagnoses(clinicalDiagnosesResponse.data);

                const appointmentResponse = await axiosInstance.get(`/appointments/appointment/${anamnesisResponse.data.appointment}`);
                setAppointment(appointmentResponse.data);

                if (appointmentResponse.data.slotId) {
                    const slotResponse = await axiosInstance.get(`/slots/${appointmentResponse.data.slotId}`);
                    setAppointment(prevAppointment => ({
                        ...prevAppointment,
                        slot: slotResponse.data
                    }));
                }

                const treatmentsResponse = await axiosInstance.get(`/treatments/all-by-pet/${petResponse.data.id}`);
                setTreatments(treatmentsResponse.data);

                const userResponse = await axiosInstance.get("/users/current-user-info");
                setUserRole(userResponse.data.role);
            } catch (error) {
                console.error("Error fetching data:", error);
                setError("Failed to fetch data. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id, axiosInstance]);

    const handleSaveDiagnosis = async (updatedData) => {
        try {
            const response = await axiosInstance.put(`/diagnosis/update/${diagnosis.id}`, updatedData);
            setDiagnosis(response.data);
            setIsEditDiagnosisModalOpen(false);
            alert("Diagnosis updated successfully!");
        } catch (error) {
            console.error("Error updating diagnosis:", error);
            alert("Failed to update diagnosis. Please try again later.");
        }
    };

    const handleSaveExaminationPlan = async (updatedPlan) => {
        try {
            const updatedDiagnosis = { ...diagnosis, examinationPlan: updatedPlan };
            const response = await axiosInstance.put(`/diagnosis/update/${diagnosis.id}`, updatedDiagnosis);
            setDiagnosis(response.data);
            setIsEditExaminationPlanModalOpen(false);
            alert("Examination plan updated successfully!");
        } catch (error) {
            console.error("Error updating examination plan:", error);
            alert("Failed to update examination plan. Please try again later.");
        }
    };

    const handleSaveClinicalDiagnosis = async (clinicalDiagnosisData) => {
        try {
            if (selectedClinicalDiagnosis) {
                const response = await axiosInstance.put(`/diagnosis/update/${selectedClinicalDiagnosis.id}`, clinicalDiagnosisData);
                setClinicalDiagnoses(clinicalDiagnoses.map(d => d.id === response.data.id ? response.data : d));
            } else {
                const response = await axiosInstance.post("/diagnosis/save", { ...clinicalDiagnosisData, anamnesis: id });
                setClinicalDiagnoses([...clinicalDiagnoses, response.data]);
            }
            setIsEditClinicalDiagnosisModalOpen(false);
            alert("Clinical diagnosis saved successfully!");
        } catch (error) {
            console.error("Error saving clinical diagnosis:", error);
            alert("Failed to save clinical diagnosis. Please try again later.");
        }
    };

    const handleSaveTreatment = async (treatmentData) => {
        try {
            if (selectedTreatment) {
                const response = await axiosInstance.put(`/treatments/update/${selectedTreatment.id}`, treatmentData);
                setTreatments(treatments.map(t => t.id === response.data.id ? response.data : t));
            } else {
                const response = await axiosInstance.post("/treatments/add", treatmentData);
                setTreatments([...treatments, response.data]);
            }
            setIsEditTreatmentModalOpen(false);
            alert("Treatment saved successfully!");
        } catch (error) {
            console.error("Error saving treatment:", error);
            alert("Failed to save treatment. Please try again later.");
        }
    };

    const handleCompleteTreatment = async (treatmentId) => {
        try {
            const response = await axiosInstance.put(`/treatments/complete/${treatmentId}`);
            setTreatments(treatments.map(t => t.id === response.data.id ? response.data : t));
            alert("Treatment marked as complete!");
        } catch (error) {
            console.error("Error completing treatment:", error);
            alert("Failed to complete treatment. Please try again later.");
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (!anamnesis || !petInfo) {
        return <div>No data found.</div>;
    }

    return (
        <div style={{display: "flex", gap: "20px"}}>
            <div style={{flex: 1}}>
                <PetInfo petInfo={petInfo} onEdit={() => {
                }}/>

                <div style={{marginTop: "20px"}}>
                    <h3>Treatment Recommendations</h3>
                    {treatments.length > 0 ? (
                        <table border="1" cellPadding="10" cellSpacing="0">
                            <thead>
                            <tr>
                                <th>Treatment</th>
                                <th>Description</th>
                                <th>Start Date</th>
                                <th>End Date</th>
                                {userRole === "ROLE_VET" && <th>Complete</th>}
                                <th>Action</th>
                            </tr>
                            </thead>
                            <tbody>
                            {treatments.map((treatment) => (
                                <tr key={treatment.id}>
                                    <td>{treatment.treatment}</td>
                                    <td>{treatment.description}</td>
                                    <td>{new Date(treatment.startDate).toLocaleDateString()}</td>
                                    <td>{new Date(treatment.endDate).toLocaleDateString()}</td>
                                    {userRole === "ROLE_VET" && (
                                        <td>
                                            <input
                                                type="checkbox"
                                                checked={treatment.isCompleted}
                                                onChange={() => handleCompleteTreatment(treatment.id)}
                                            />
                                        </td>
                                    )}
                                    <td>
                                        <button onClick={() => {
                                            setSelectedTreatment(treatment);
                                            setIsEditTreatmentModalOpen(true);
                                        }}>
                                            Edit
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>No treatment recommendations found.</p>
                    )}
                    {userRole === "ROLE_VET" && (
                        <button onClick={() => {
                            setSelectedTreatment(null);
                            setIsEditTreatmentModalOpen(true);
                        }}>
                            Add New Treatment
                        </button>
                    )}
                </div>

                <div style={{marginTop: "20px"}}>
                    <h3>Diagnosis</h3>
                    <p>{diagnosis ? diagnosis.name : "No diagnosis provided."}</p>
                </div>
                <div style={{marginTop: "20px"}}>
                    <h3>Doctor</h3>
                    <p>{doctorName || "No doctor assigned."}</p>
                </div>
            </div>

            <div style={{flex: 1}}>
                <h2>Anamnesis Details</h2>
                <div>
                    <p><strong>Date:</strong> {new Date(anamnesis.date).toLocaleDateString()}</p>
                    <div style={{marginTop: "20px"}}>
                        <h3>Complaints</h3>
                        <p>{anamnesis.description || "No complaints provided."}</p>
                        <button onClick={() => setIsAppointmentModalOpen(true)}>Show an appointment</button>
                    </div>
                </div>

                <div style={{marginTop: "20px"}}>
                    <h3>Preliminary Diagnosis</h3>
                    {diagnosis ? (
                        <div>
                            <p><strong>Name:</strong> {diagnosis.name}</p>
                            <p><strong>Description:</strong> {diagnosis.description}</p>
                            <p><strong>Date:</strong> {new Date(diagnosis.date).toLocaleDateString()}</p>
                            <p><strong>Contagious:</strong> {diagnosis.contagious ? "Yes" : "No"}</p>
                            <button onClick={() => setIsEditDiagnosisModalOpen(true)}>Edit</button>
                        </div>
                    ) : (
                        <p>No preliminary diagnosis provided.</p>
                    )}
                </div>

                <div style={{marginTop: "20px"}}>
                    <h3>Examination Plan</h3>
                    {diagnosis && diagnosis.examinationPlan ? (
                        <div>
                            <p>{diagnosis.examinationPlan}</p>
                            <button onClick={() => setIsEditExaminationPlanModalOpen(true)}>Edit</button>
                        </div>
                    ) : (
                        <p>No examination plan provided.</p>
                    )}
                </div>

                <div style={{marginTop: "20px"}}>
                    <h3>Clinical Diagnosis</h3>
                    {clinicalDiagnoses.length > 0 ? (
                        <table border="1" cellPadding="10" cellSpacing="0">
                            <thead>
                            <tr>
                                <th>Name</th>
                                <th>Description</th>
                                <th>Date</th>
                                <th>Contagious</th>
                                <th>Action</th>
                            </tr>
                            </thead>
                            <tbody>
                            {clinicalDiagnoses.map((diagnosis) => (
                                <tr key={diagnosis.id}>
                                    <td>{diagnosis.name}</td>
                                    <td>{diagnosis.description}</td>
                                    <td>{new Date(diagnosis.date).toLocaleDateString()}</td>
                                    <td>{diagnosis.contagious ? "Yes" : "No"}</td>
                                    <td>
                                        <button onClick={() => {
                                            setSelectedClinicalDiagnosis(diagnosis);
                                            setIsEditClinicalDiagnosisModalOpen(true);
                                        }}>
                                            Edit
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>No clinical diagnoses found.</p>
                    )}
                    <button onClick={() => {
                        setSelectedClinicalDiagnosis(null);
                        setIsEditClinicalDiagnosisModalOpen(true);
                    }}>
                        Add Clinical Diagnosis
                    </button>
                </div>

                <button onClick={() => window.history.back()}>Back</button>
            </div>

            {isAppointmentModalOpen && (
                <AppointmentModal
                    appointment={appointment}
                    onClose={() => setIsAppointmentModalOpen(false)}
                />
            )}

            {isEditDiagnosisModalOpen && (
                <EditDiagnosisModal
                    diagnosis={diagnosis}
                    onClose={() => setIsEditDiagnosisModalOpen(false)}
                    onSave={handleSaveDiagnosis}
                />
            )}

            {isEditExaminationPlanModalOpen && (
                <EditExaminationPlanModal
                    examinationPlan={diagnosis?.examinationPlan}
                    onClose={() => setIsEditExaminationPlanModalOpen(false)}
                    onSave={handleSaveExaminationPlan}
                />
            )}

            {isEditClinicalDiagnosisModalOpen && (
                <EditClinicalDiagnosisModal
                    diagnosis={selectedClinicalDiagnosis}
                    onClose={() => setIsEditClinicalDiagnosisModalOpen(false)}
                    onSave={handleSaveClinicalDiagnosis}
                />
            )}

            {isEditTreatmentModalOpen && (
                <EditTreatmentModal
                    treatment={selectedTreatment}
                    onClose={() => setIsEditTreatmentModalOpen(false)}
                    onSave={handleSaveTreatment}
                    diagnosisId={diagnosis?.id}
                    petId={petInfo?.id}
                />
            )}

        </div>
    );
};

export default AnamnesisDetailsPage;