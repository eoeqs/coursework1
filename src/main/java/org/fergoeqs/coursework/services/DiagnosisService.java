package org.fergoeqs.coursework.services;

import org.fergoeqs.coursework.dto.DiagnosisDTO;
import org.fergoeqs.coursework.models.Diagnosis;
import org.fergoeqs.coursework.models.RecommendedDiagnosis;
import org.fergoeqs.coursework.repositories.DiagnosisRepository;
import org.fergoeqs.coursework.utils.Mappers.DiagnosisMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Transactional(readOnly = true)
@Service
public class DiagnosisService {
    private final DiagnosisRepository diagnosisRepository;
    private final AnamnesisService anamnesisService;
    private final DiagnosisMapper diagnosisMapper;
    private final RecommendedDiagnosisService recommendedDiagnosisService;

    public DiagnosisService(DiagnosisRepository diagnosisRepository, AnamnesisService anamnesisService,
                            DiagnosisMapper diagnosisMapper, RecommendedDiagnosisService recommendedDiagnosisService) {
        this.diagnosisRepository = diagnosisRepository;
        this.anamnesisService = anamnesisService;
        this.diagnosisMapper = diagnosisMapper;
        this.recommendedDiagnosisService = recommendedDiagnosisService;
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
        return diagnosisRepository.findFirstByAnamnesisIdOrderByDateAsc(anamnesisId).orElse(null);
    }

    @Transactional
    public Diagnosis saveDiagnosis(DiagnosisDTO diagnosisDTO){
        Diagnosis diagnosis = diagnosisMapper.fromDTO(diagnosisDTO);
        diagnosis.setAnamnesis(anamnesisService.findAnamnesisById(diagnosisDTO.anamnesis()));
        diagnosis.setDate(LocalDateTime.now());
        return diagnosisRepository.save(diagnosis);
    }

    @Transactional
    public Diagnosis updateDiagnosis(Long id, DiagnosisDTO diagnosisDTO){
        Diagnosis diagnosis = diagnosisRepository.findById(id).orElse(null);
        if (diagnosis == null) return null;
        diagnosisMapper.updateDiagnosisFromDTO(diagnosisDTO, diagnosis);
        return diagnosisRepository.save(diagnosis);
    }

    @Transactional
    public Diagnosis RecommendedToClinical(Long rdId, Long anamnesisId){
        RecommendedDiagnosis rd = recommendedDiagnosisService.findById(rdId);
        if (rd == null) return null;
        Diagnosis diagnosis = new Diagnosis();
        diagnosis.setName(rd.getName());
        diagnosis.setDescription(rd.getDescription());
        diagnosis.setContagious(rd.getContagious());
        diagnosis.setAnamnesis(anamnesisService.findAnamnesisById(anamnesisId));
        diagnosis.setDate(LocalDateTime.now());
        return diagnosisRepository.save(diagnosis);
    }
}
