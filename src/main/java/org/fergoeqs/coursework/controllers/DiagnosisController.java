package org.fergoeqs.coursework.controllers;

import org.fergoeqs.coursework.dto.DiagnosisDTO;
import org.fergoeqs.coursework.services.DiagnosisService;
import org.fergoeqs.coursework.utils.Mappers.DiagnosisMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/diagnosis")
public class DiagnosisController {
    private final DiagnosisService diagnosisService;
    private final DiagnosisMapper diagnosisMapper;
    private static final Logger logger = LoggerFactory.getLogger(DiagnosisController.class);

    public DiagnosisController(DiagnosisService diagnosisService, DiagnosisMapper diagnosisMapper) {
        this.diagnosisService = diagnosisService;
        this.diagnosisMapper = diagnosisMapper;
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getDiagnosis(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(diagnosisMapper.toDTO(diagnosisService.getDiagnosisById(id)));
        } catch (Exception e) {
            logger.error("Error occurred while fetching diagnosis with id: {}", id, e);
            throw e;
        }
    }

    @GetMapping("/preliminary-diagnosis/{anamnesisId}")
    public ResponseEntity<?> getFirstDiagnosis(@PathVariable Long anamnesisId) {
        try {
            return ResponseEntity.ok(diagnosisMapper.toDTO(diagnosisService.getFirstByAnamnesisId(anamnesisId)));
        } catch (Exception e) {
            logger.error("Error occurred while fetching first diagnosis", e);
            throw e;
        }
    }

    @GetMapping("/all-diagnoses/{anamnesisId}")
    public ResponseEntity<?> getAllByAnamnesis(@PathVariable Long anamnesisId) {
        try {
            return ResponseEntity.ok(diagnosisMapper.toDTOs(diagnosisService.diagnosesExceptFirstByAnamnesisId(anamnesisId)));
        } catch (Exception e) {
            logger.error("Error occurred while fetching diagnoses for anamnesis with id: {}", anamnesisId, e);
            throw e;
        }
    }

    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_VET')")
    @PostMapping("/save")
    public ResponseEntity<?> saveDiagnosis(@RequestBody DiagnosisDTO diagnosisDTO) {
        try {
            return ResponseEntity.ok(diagnosisMapper.toDTO(diagnosisService.saveDiagnosis(diagnosisDTO)));
        } catch (Exception e) {
            logger.error("Error occurred while saving diagnosis", e);
            throw e;
        }
    }

    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_VET')")
    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateDiagnosis(@PathVariable Long id, @RequestBody DiagnosisDTO diagnosisDTO) {
        try {
            return ResponseEntity.ok(diagnosisMapper.toDTO(diagnosisService.updateDiagnosis(id, diagnosisDTO)));
        } catch (Exception e) {
            logger.error("Error occurred while updating diagnosis with id: {}", id, e);
            throw e;
        }
    }


}
