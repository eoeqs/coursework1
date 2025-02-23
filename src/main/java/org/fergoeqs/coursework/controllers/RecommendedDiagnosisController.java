package org.fergoeqs.coursework.controllers;

import org.fergoeqs.coursework.dto.RecommendedDiagnosisDTO;
import org.fergoeqs.coursework.models.enums.BodyPart;
import org.fergoeqs.coursework.services.RecommendedDiagnosisService;
import org.fergoeqs.coursework.utils.Mappers.RecommendedDiagnosisMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recommended-diagnosis")
public class RecommendedDiagnosisController {
    private final RecommendedDiagnosisService recommendedDiagnosisService;
    private final RecommendedDiagnosisMapper recommendedDiagnosisMapper;
    private static final Logger logger = LoggerFactory.getLogger(RecommendedDiagnosisController.class);

    public RecommendedDiagnosisController(RecommendedDiagnosisService recommendedDiagnosisService, RecommendedDiagnosisMapper recommendedDiagnosisMapper) {
        this.recommendedDiagnosisService = recommendedDiagnosisService;
        this.recommendedDiagnosisMapper = recommendedDiagnosisMapper;
    }

    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_VET')")
    @GetMapping("/all-by-symptoms")
    public ResponseEntity<?> getAllRecommendedDiagnosisBySymptoms(@RequestParam List<Long> symptomsId,
                                                                  @RequestParam BodyPart bodyPart) {
        try {
            return ResponseEntity.ok(recommendedDiagnosisMapper.toDTOs(
                    recommendedDiagnosisService.findBySymptomsAndBodyPart(symptomsId, bodyPart)));
        } catch (Exception e) {
            logger.error("Error getting recommended diagnosis by symptoms");
            throw e;
        }
    }

    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_VET')")
    @PostMapping("/save")
    public ResponseEntity<?> saveRecommendedDiagnosis(@RequestBody RecommendedDiagnosisDTO recommendedDiagnosisDTO) {
        try {
            return ResponseEntity.ok(recommendedDiagnosisMapper.toDTO(
                    recommendedDiagnosisService.save(recommendedDiagnosisDTO)));
        } catch (Exception e) {
            logger.error("Error saving recommended diagnosis", e);
            throw e;
        }
    }


}
