package org.fergoeqs.coursework.services;

import org.fergoeqs.coursework.dto.SymptomDTO;
import org.fergoeqs.coursework.models.RecommendedDiagnosis;
import org.fergoeqs.coursework.models.Symptom;
import org.fergoeqs.coursework.repositories.RecommendedDiagnosisRepository;
import org.fergoeqs.coursework.repositories.SymptomsRepository;
import org.fergoeqs.coursework.utils.SymptomMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SymptomsService {
    private final SymptomsRepository symptomsRepository;
    private final SymptomMapper symptomMapper;
    private final RecommendedDiagnosisRepository recDiagnosisRepository;

    public SymptomsService(SymptomsRepository symptomsRepository, SymptomMapper symptomMapper,
                           RecommendedDiagnosisRepository recommendedDiagnosisRepository) {
        this.symptomsRepository = symptomsRepository;
        this.symptomMapper = symptomMapper;
        this.recDiagnosisRepository = recommendedDiagnosisRepository;
    }

    public List<Symptom> findAllSymptoms() {
        return symptomsRepository.findAll();
    }

    public Symptom findSymptomByName(String name) {
        return symptomsRepository.findByName(name).orElse(null);
    }

    public List<Symptom> findByDiagnosisId(Long diagnosisId) {
        RecommendedDiagnosis recommendedDiagnosis = recDiagnosisRepository.findById(diagnosisId).orElse(null);
        if (!(recommendedDiagnosis == null)) {
            return  recommendedDiagnosis.getSymptoms();
        }
        else {return null;}
    }

    public Symptom save(SymptomDTO symptomDTO) {
        return symptomsRepository.save(symptomMapper.fromDTO(symptomDTO));
    }




}
