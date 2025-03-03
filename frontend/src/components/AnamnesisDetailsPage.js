import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useAxiosWithAuth from "../AxiosAuth";
import PetInfo from "./PetInfo";
import AppointmentModal from "./AppointmentModal";
import EditDiagnosisModal from "./EditDiagnosisModal";
import EditExaminationPlanModal from "./EditExaminationPlanModal";
import EditClinicalDiagnosisModal from "./EditClinicalDiagnosisModal";
import EditTreatmentModal from "./EditTreatmentModal";
import Header from "./Header";
import AddProcedureModal from "./AddProcedureModal";
import AttachmentDetailsModal from "./AttachmentDetailsModal";
import AddAttachmentModal from "./AddAttachmentModal";
import GenerateReportModal from "./GenerateReportModal";

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
    const [selectedClinicalDiagnosisId, setSelectedClinicalDiagnosisId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [treatments, setTreatments] = useState([]);
    const [isEditTreatmentModalOpen, setIsEditTreatmentModalOpen] = useState(false);
    const [selectedTreatment, setSelectedTreatment] = useState(null);
    const [userRole, setUserRole] = useState("");
    const [procedures, setProcedures] = useState([]);
    const [selectedProcedure, setSelectedProcedure] = useState(null);
    const [isProcedureModalOpen, setIsProcedureModalOpen] = useState(false);
    const [isAddProcedureModalOpen, setIsAddProcedureModalOpen] = useState(false);
    const [attachments, setAttachments] = useState([]);
    const [isAttachmentModalOpen, setIsAttachmentModalOpen] = useState(false);
    const [selectedAttachment, setSelectedAttachment] = useState(null);
    const [isAddAttachmentModalOpen, setIsAddAttachmentModalOpen] = useState(false);
    const [isGenerateReportModalOpen, setIsGenerateReportModalOpen] = useState(false);
    const [reportValidationMessage, setReportValidationMessage] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);

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
                setDiagnosis(diagnosisResponse.data);

                const clinicalDiagnosesResponse = await axiosInstance.get(`/diagnosis/all-diagnoses/${id}`);
                setClinicalDiagnoses(clinicalDiagnosesResponse.data);

                const appointmentResponse = await axiosInstance.get(`/appointments/appointment/${anamnesisResponse.data.appointment}`);
                setAppointment(appointmentResponse.data);

                if (appointmentResponse.data.slotId) {
                    const slotResponse = await axiosInstance.get(`/slots/${appointmentResponse.data.slotId}`);
                    setAppointment((prevAppointment) => ({
                        ...prevAppointment,
                        slot: slotResponse.data,
                    }));
                }

                const treatmentsResponse = await axiosInstance.get(`/treatments/all-by-pet/${petResponse.data.id}`);
                setTreatments(treatmentsResponse.data);

                const proceduresResponse = await axiosInstance.get(`/procedures/by-anamnesis/${id}`);
                setProcedures(proceduresResponse.data);

                const attachmentsResponse = await axiosInstance.get(`/diagnostic-attachment/all-by-anamnesis/${id}`);
                setAttachments(attachmentsResponse.data);

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
            if (diagnosis?.id) {
                const response = await axiosInstance.put(`/diagnosis/update/${diagnosis.id}`, updatedData);
                setDiagnosis(response.data);
                setIsEditDiagnosisModalOpen(false);
                alert("Diagnosis updated successfully!");
            } else {
                const response = await axiosInstance.post("/diagnosis/save", { ...updatedData, anamnesis: id });
                setDiagnosis(response.data);
                setIsEditDiagnosisModalOpen(false);
                alert("Diagnosis added successfully! Page will reload.");
                window.location.reload();
            }
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
            if (selectedClinicalDiagnosisId) {
                const response = await axiosInstance.put(`/diagnosis/update/${selectedClinicalDiagnosisId}`, clinicalDiagnosisData);
                setClinicalDiagnoses(clinicalDiagnoses.map((d) => (d.id === response.data.id ? response.data : d)));
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
                setTreatments(treatments.map((t) => (t.id === response.data.id ? response.data : t)));
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

    const handleSaveProcedure = async (procedureData) => {
        try {
            const response = await axiosInstance.post("/procedures/add", procedureData);
            setProcedures([...procedures, response.data]);
            setIsAddProcedureModalOpen(false);
            alert("Procedure added successfully!");
        } catch (error) {
            console.error("Error adding procedure:", error);
            alert("Failed to add procedure. Please try again later.");
        }
    };

    const handleCompleteTreatment = async (treatmentId) => {
        try {
            const response = await axiosInstance.put(`/treatments/complete/${treatmentId}`);
            setTreatments(treatments.map((t) => (t.id === response.data.id ? response.data : t)));
            alert("Treatment marked as complete!");
        } catch (error) {
            console.error("Error completing treatment:", error);
            alert("Failed to complete treatment. Please try again later.");
        }
    };

    const handleSaveRecommendedDiagnosis = async (diagnosisId) => {
        try {
            const response = await axiosInstance.post(`/diagnosis/save-recomended/${id}`, diagnosisId, {
                headers: { "Content-Type": "application/json" },
            });
            setClinicalDiagnoses([...clinicalDiagnoses, response.data]);
            alert("Recommended diagnosis saved successfully!");
        } catch (error) {
            console.error("Error saving recommended diagnosis:", error);
            alert("Failed to save recommended diagnosis. Please try again later.");
        }
    };

    const handleSaveAttachment = (newAttachment) => {
        setAttachments((prev) => [...prev, newAttachment]);
    };

    const openAttachmentModal = (attachment) => {
        setSelectedAttachment(attachment);
        setIsAttachmentModalOpen(true);
    };

    const closeAttachmentModal = () => {
        setIsAttachmentModalOpen(false);
        setSelectedAttachment(null);
    };

    const openAddAttachmentModal = () => {
        setIsAddAttachmentModalOpen(true);
    };

    const closeAddAttachmentModal = () => {
        setIsAddAttachmentModalOpen(false);
    };

    const openGenerateReportModal = () => {
        const missingFields = [];

        if (!diagnosis || !diagnosis.name) {
            missingFields.push("Preliminary Diagnosis");
        }
        if (!diagnosis || !diagnosis.examinationPlan) {
            missingFields.push("Examination Plan");
        }
        if (procedures.length === 0) {
            missingFields.push("Procedures Performed");
        }
        if (treatments.filter((t) => !t.isCompleted).length === 0) {
            missingFields.push("Treatment Recommendations");
        }

        if (missingFields.length > 0) {
            setReportValidationMessage(
                `Report generation is not available yet. Please ensure the following are provided: ${missingFields.join(", ")}.`
            );
            return;
        }

        setReportValidationMessage("");
        setIsGenerateReportModalOpen(true);
    };

    const closeGenerateReportModal = () => {
        setIsGenerateReportModalOpen(false);
    };

    const handleGenerateReport = async (formData) => {
        try {
            const response = await axiosInstance.post(`/reports/generate-report/${id}`, formData);
            alert("Report generated successfully!");
            closeGenerateReportModal();
            console.log("Generated report URL:", response.data);
        } catch (error) {
            console.error("Error generating report:", error);
            alert("Failed to generate report. Please try again later.");
        }
    };

    const handleViewReport = async () => {
        try {
            const response = await axiosInstance.get(`/reports/${id}`);
            window.open(response.data, "_blank");
        } catch (error) {
            console.error("Error fetching report:", error);
            alert("Failed to fetch report. Please try again later.");
        }
    };

    if (loading) {
        return <div className="loading-overlay">Loading...</div>;
    }

    if (error) {
        return <div className="error-overlay">{error}</div>;
    }

    if (!anamnesis || !petInfo) {
        return <div>No data found.</div>;
    }

    return (
        <div>
            <Header />
            <div className="container mt-3" style={{ display: "flex", gap: "50px", paddingTop: '80px' }}>
                <div>
                    <PetInfo petInfo={petInfo} onEdit={() => {
                    }}/>
                    <div style={{marginTop: "20px"}}>
                        <h4 style={{marginBottom: "5px"}}>Diagnosis</h4>
                        <p>{diagnosis ? diagnosis.name : "No diagnosis provided."}</p>
                    </div>
                    <div style={{marginTop: "10px"}}>
                        <h4 style={{marginBottom: "5px"}}>Doctor</h4>
                        <p>{doctorName || "No doctor assigned."}</p>
                    </div>
                    <button className="button rounded-3 btn-no-border" onClick={() => window.history.back()}>
                        Back to pet profile
                    </button>
                </div>

                <div style={{flex: 1}}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <h3>
                        <strong>Anamnesis details </strong> (appeal
                        from {new Date(anamnesis.date).toLocaleDateString()}: {diagnosis ? diagnosis.name : "No diagnosis"})
                    </h3>
                    <div>
                        {(userRole === "ROLE_VET" || userRole === "ROLE_ADMIN") && (
                            <button className="button rounded-3 btn-no-border" onClick={openGenerateReportModal}>
                                Generate Report
                            </button>
                        )}
                        <button
                            className="button rounded-3 btn-no-border"
                            onClick={handleViewReport}
                            style={{marginLeft: "5px"}}
                        >
                            View Report
                        </button>
                        {reportValidationMessage && (
                            <p style={{color: "red", marginTop: "10px"}}>{reportValidationMessage}</p>
                        )}
                    </div>
                    </div>
                    <h3 className="py-1">Complaints</h3>
                    <div className="bg-table element-space" style={{flex: 1}}>
                        <div>
                            <div style={{
                                marginTop: "14px",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center"
                            }}>
                                <p>{anamnesis.description || "No complaints provided."}</p>
                                <button className="button rounded-3 btn-no-border"
                                        onClick={() => setIsAppointmentModalOpen(true)}>
                                    Show an appointment
                                </button>
                            </div>
                        </div>
                    </div>
                    <h3>Preliminary Diagnosis</h3>
                    <div className="bg-table element-space prem_diagnsosis" style={{flex: 1}}>
                        <div style={{marginTop: "15px"}}>
                            {diagnosis ? (
                                <div style={{
                                    marginTop: "15px",
                                    display: "flex",
                                    flexDirection: "column",
                                    height: "100%"
                                }}>
                                    <p style={{marginBottom: "5px"}}><strong>Name:</strong> {diagnosis.name}</p>
                                    <p style={{marginBottom: "5px"}}>
                                        <strong>Date:</strong> {new Date(diagnosis.date).toLocaleDateString()}
                                    </p>
                                    <p style={{marginBottom: "5px"}}>
                                        <strong>Contagious:</strong> {diagnosis.contagious ? "Yes" : "No"}
                                    </p>
                                    <p style={{marginBottom: "0px"}}>
                                        <strong>Description:</strong> {diagnosis.description}
                                    </p>
                                    <div style={{marginTop: "auto", textAlign: "right"}}>
                                        <button className="button btn-no-border"
                                                onClick={() => setIsEditDiagnosisModalOpen(true)}>
                                            Edit
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <p>No preliminary diagnosis provided.</p>
                            )}
                            {!diagnosis && (userRole === "ROLE_VET" || userRole === "ROLE_ADMIN") && (
                                <button className="button rounded-3 btn-no-border"
                                        onClick={() => setIsEditDiagnosisModalOpen(true)}>
                                    Add Preliminary Diagnosis
                                </button>
                            )}
                        </div>
                    </div>
                    <h3>Examination Plan</h3>
                    <div className="bg-table element-space" style={{flex: 1}}>
                        <div style={{marginTop: "20px"}}>
                            {diagnosis && diagnosis.examinationPlan ? (
                                <div style={{
                                    marginTop: "20px",
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center"
                                }}>
                                    <p>{diagnosis.examinationPlan}</p>
                                    {(userRole === "ROLE_VET" || userRole === "ROLE_ADMIN") && (
                                        <button className="button btn-no-border"
                                                onClick={() => setIsEditExaminationPlanModalOpen(true)}>
                                            Edit
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <p>No examination plan provided.</p>
                            )}
                        </div>
                    </div>
                    <h3>Clinical Diagnosis</h3>
                    <div className="bg-table element-space prem_diagnsosis" style={{flex: 1}}>
                        <div style={{marginTop: "20px"}}>
                            {clinicalDiagnoses.length > 0 ? (
                                <table cellPadding="3" cellSpacing="0" className="uniq-table">
                                    <tbody>
                                    {clinicalDiagnoses.map((diagnosis) => (
                                        <tr key={diagnosis.id}>
                                            <td><strong>{diagnosis.name}</strong></td>
                                            <td>{diagnosis.description}</td>
                                            <td>{new Date(diagnosis.date).toLocaleDateString()}</td>
                                            <td>{diagnosis.contagious ? "contagious" : "non-contagious"}</td>
                                            <td>
                                                {(userRole === "ROLE_VET" || userRole === "ROLE_ADMIN") && (
                                                    <button
                                                        className="button btn-no-border"
                                                        onClick={() => {
                                                            setSelectedClinicalDiagnosisId(diagnosis.id);
                                                            setIsEditClinicalDiagnosisModalOpen(true);
                                                        }}
                                                    >
                                                        Edit
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p>No clinical diagnoses found.</p>
                            )}
                            {(userRole === "ROLE_VET" || userRole === "ROLE_ADMIN") && (
                                <button
                                    className="button rounded-3 btn-no-border"
                                    onClick={() => {
                                        setSelectedClinicalDiagnosisId(null);
                                        setIsEditClinicalDiagnosisModalOpen(true);
                                    }}
                                >
                                    Add Clinical Diagnosis
                                </button>
                            )}
                        </div>
                    </div>
                    <h3>Procedures Performed</h3>
                    <div>
                        <div className="bg-table element-space prem_diagnsosis" style={{flex: 1}}>
                            {procedures.length > 0 ? (
                                <table cellPadding="3" cellSpacing="0" className="uniq-table">
                                    <tbody>
                                    {procedures.map((procedure) => (
                                        <tr key={procedure.id}>
                                            <td>{new Date(procedure.date).toLocaleDateString()}</td>
                                            <td>{procedure.type}</td>
                                            <td>{procedure.name}</td>
                                            <td>
                                                <button
                                                    className="button btn-no-border"
                                                    onClick={() => {
                                                        setSelectedProcedure(procedure);
                                                        setIsProcedureModalOpen(true);
                                                    }}
                                                >
                                                    More
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p>No procedures found.</p>
                            )}
                            {(userRole === "ROLE_ADMIN" || userRole === "ROLE_VET") && (
                                <button className="button rounded-3 btn-no-border"
                                        onClick={() => setIsAddProcedureModalOpen(true)}>
                                    Add New Procedure
                                </button>
                            )}
                        </div>
                    </div>
                    <h3>Diagnostic Attachments</h3>
                    <div className="bg-table element-space prem_diagnsosis" style={{padding: "20px"}}>
                        {attachments.length > 0 ? (
                            <table cellPadding="3" cellSpacing="0" className="uniq-table table-right-end">
                                <tbody>
                                {attachments.map((attachment) => (
                                    <tr key={attachment.id}>
                                        <td>{attachment.name}</td>
                                        <td>
                                            <button className="button btn-no-border"
                                                    onClick={() => openAttachmentModal(attachment)}>
                                                More
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        ) : (
                            <p>No diagnostic attachments found.</p>
                        )}
                        {(userRole === "ROLE_VET" || userRole === "ROLE_ADMIN") && (
                            <button className="button rounded-3 btn-no-border" onClick={openAddAttachmentModal}>
                                Add Attachment
                            </button>
                        )}
                    </div>
                </div>

                <div className="mt-1 rounded-1 treatment-vet element-space"
                     style={{marginTop: "30px", padding: "20px"}}>
                    <h3>Treatment Recommendations</h3>
                    {treatments.filter((treatment) => !treatment.isCompleted).length > 0 ? (
                        <table cellPadding="3" cellSpacing="0" className="uniq-table">
                            <tbody>
                            {treatments
                                .filter((treatment) => !treatment.isCompleted)
                                .map((treatment) => (
                                    <tr key={treatment.id}>
                                        <td>
                                            {treatment.treatment}
                                            <b>Name: {treatment.name}</b>{" "}
                                            {(userRole === "ROLE_VET" || userRole === "ROLE_ADMIN") && (
                                                <input
                                                    type="checkbox"
                                                    checked={treatment.isCompleted}
                                                    onChange={() => handleCompleteTreatment(treatment.id)}
                                                />
                                            )}{" "}
                                            <br />
                                            <b>Description</b>: {treatment.description} <br />
                                            <b>Prescribed Medication</b>: {treatment.prescribedMedication} <br />
                                            <b>Duration</b>: {treatment.duration} <br />
                                            {(userRole === "ROLE_VET" || userRole === "ROLE_ADMIN") && (
                                                <button
                                                    className="button btn-no-border"
                                                    onClick={() => {
                                                        setSelectedTreatment(treatment);
                                                        setIsEditTreatmentModalOpen(true);
                                                    }}
                                                >
                                                    Edit treatment recommendation
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>No active treatment recommendations found.</p>
                    )}
                    {(userRole === "ROLE_VET" || userRole === "ROLE_ADMIN") && (
                        <button
                            className="button rounded-3 btn-no-border"
                            onClick={() => {
                                setSelectedTreatment(null);
                                setIsEditTreatmentModalOpen(true);
                            }}
                        >
                            Add New Treatment
                        </button>
                    )}
                </div>

                {isAppointmentModalOpen && (
                    <AppointmentModal appointment={appointment} onClose={() => setIsAppointmentModalOpen(false)} />
                )}

                {isEditDiagnosisModalOpen && (
                    <EditDiagnosisModal
                        diagnosisId={diagnosis?.id}
                        petId={petInfo?.id}
                        appointmentId={appointment?.id}
                        anamnesisId={id}
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
                        diagnosisId={selectedClinicalDiagnosisId}
                        petId={petInfo?.id}
                        appointmentId={appointment?.id}
                        anamnesisId={id}
                        onClose={() => setIsEditClinicalDiagnosisModalOpen(false)}
                        onSave={handleSaveClinicalDiagnosis}
                        onSaveRecommended={handleSaveRecommendedDiagnosis}
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

                {isAddProcedureModalOpen && (
                    <AddProcedureModal
                        onClose={() => setIsAddProcedureModalOpen(false)}
                        onSave={handleSaveProcedure}
                        petId={petInfo?.id}
                        anamnesisId={id}
                        vetId={petInfo?.actualVet}
                    />
                )}

                {isProcedureModalOpen && (
                    <div className="modal-overlay" onClick={() => setIsProcedureModalOpen(false)}>
                        <div className="modal-form" style={modalStyles}>
                            <div className="modal-header">
                                <h3>Procedure Details</h3>
                            </div>
                            <div className="rounded-3" style={{ backgroundColor: "rgba(179, 35, 35, 0.06)", padding: "10px" }}>
                                <p><strong>Type:</strong> {selectedProcedure.type}</p>
                                <p><strong>Name:</strong> {selectedProcedure.name}</p>
                                <p><strong>Description:</strong> {selectedProcedure.description}</p>
                                <p><strong>Notes:</strong> {selectedProcedure.notes}</p>
                                <p><strong>Date:</strong> {new Date(selectedProcedure.date).toLocaleDateString()}</p>
                            </div>
                        </div>
                    </div>
                )}

                {isAttachmentModalOpen && (
                    <AttachmentDetailsModal attachment={selectedAttachment} onClose={closeAttachmentModal} />
                )}

                {isAddAttachmentModalOpen && (
                    <AddAttachmentModal
                        diagnoses={[diagnosis, ...clinicalDiagnoses].filter((d) => d)}
                        anamnesisId={id}
                        onClose={closeAddAttachmentModal}
                        onSave={handleSaveAttachment}
                    />
                )}

                {isGenerateReportModalOpen && (
                    <GenerateReportModal
                        anamnesisId={id}
                        onClose={closeGenerateReportModal}
                        onSave={handleGenerateReport}
                    />
                )}
            </div>
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

export default AnamnesisDetailsPage;