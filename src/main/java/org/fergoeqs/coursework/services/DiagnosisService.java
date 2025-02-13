package org.fergoeqs.coursework.services;

import org.fergoeqs.coursework.dto.DiagnosisDTO;
import org.fergoeqs.coursework.models.Diagnosis;
import org.fergoeqs.coursework.repositories.DiagnosisRepository;
import org.fergoeqs.coursework.utils.DiagnosisMapper;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class DiagnosisService {
    private final DiagnosisRepository diagnosisRepository;
    private final AnamnesisService anamnesisService;
    private final DiagnosisMapper diagnosisMapper;

    public DiagnosisService(DiagnosisRepository diagnosisRepository, AnamnesisService anamnesisService,
                            DiagnosisMapper diagnosisMapper) {
        this.diagnosisRepository = diagnosisRepository;
        this.anamnesisService = anamnesisService;
        this.diagnosisMapper = diagnosisMapper;
    }

    public Diagnosis getDiagnosisById(Long id) {
        return diagnosisRepository.findById(id).orElse(null);
    }

    public List<Diagnosis> getDiagnosesByAnamnesisId(Long anamnesisId) {
        return diagnosisRepository.findByAnamnesisId(anamnesisId);
    }

    public List<Diagnosis> diagnosesExceptFirstByAnamnesisId(Long anamnesisId) {
        return diagnosisRepository.findAllExceptFirstDiagnosisByAnamnesisId(anamnesisId);
    }

    public Diagnosis getFirstByAnamnesisId(Long anamnesisId) {
        return diagnosisRepository.findFirstDiagnosisByAnamnesisId(anamnesisId).orElse(null);
    }

    public Diagnosis saveDiagnosis(DiagnosisDTO diagnosisDTO){
        Diagnosis diagnosis = diagnosisMapper.fromDTO(diagnosisDTO);
        diagnosis.setAnamnesis(anamnesisService.findAnamnesisById(diagnosisDTO.anamnesis()));
        diagnosis.setDate(LocalDateTime.now());
        return diagnosisRepository.save(diagnosis);
    }
}
