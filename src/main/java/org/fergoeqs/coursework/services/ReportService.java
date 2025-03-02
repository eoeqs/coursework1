package org.fergoeqs.coursework.services;
import org.fergoeqs.coursework.dto.ReportDTO;
import org.fergoeqs.coursework.models.*;
import org.fergoeqs.coursework.repositories.ReportRepository;
import org.fergoeqs.coursework.utils.ReportGenerator;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;

@Service
public class ReportService {
    private final ReportRepository reportRepository;
    private final ReportGenerator reportGenerator;
    private final AnamnesisService anamnesisService;
    private final DiagnosisService diagnosisService;
    private final TreatmentService treatmentService;
    private final MedicalProcedureService medicalProcedureService;
    private final HealthUpdatesService healthUpdateService;

    public ReportService(ReportRepository reportRepository, ReportGenerator reportGenerator, AnamnesisService anamnesisService, DiagnosisService diagnosisService, TreatmentService treatmentService, MedicalProcedureService medicalProcedureService, HealthUpdatesService healthUpdateService) {
        this.reportRepository = reportRepository;
        this.reportGenerator = reportGenerator;
        this.anamnesisService = anamnesisService;
        this.diagnosisService = diagnosisService;
        this.treatmentService = treatmentService;
        this.medicalProcedureService = medicalProcedureService;
        this.healthUpdateService = healthUpdateService;
    }

    public Report generatePetReport(Long anamnesisId, ReportDTO reportDTO, AppUser author) throws IOException, URISyntaxException {
        Anamnesis anamnesis = anamnesisService.findAnamnesisById(anamnesisId);
        List<Diagnosis> diagnoses = diagnosisService.getDiagnosesByAnamnesisId(anamnesis.getId());
        List<MedicalProcedure> procedures = medicalProcedureService.findByAnamnesis(anamnesisId);
        List<HealthUpdate> healthUpdates = healthUpdateService.findAllByPet(anamnesis.getPet().getId());
        List<Treatment> treatments = treatmentService.findByPetIdAndIsCompletedFalse(anamnesis.getPet().getId());
        Report report = new Report();
        report.setAnamnesis(anamnesis);
        report.setVet(author);
        report.setContentUrl(reportGenerator.generatePetReport(reportDTO, anamnesis.getPet(), anamnesis, diagnoses, procedures, healthUpdates, treatments));
        Report checkRep = reportRepository.findReportByAnamnesisId(anamnesisId);
        if (checkRep == null) {
            return reportRepository.save(report);
        } else {return checkRep; }
    }

    public String getReportUrlByAnamnesis(Long anamnesisId){
        return reportGenerator.generateReportUrl(reportRepository.findReportByAnamnesisId(anamnesisId).getContentUrl());
    }

}
