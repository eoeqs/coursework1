package org.fergoeqs.coursework.controllers;

import org.fergoeqs.coursework.dto.SymptomDTO;
import org.fergoeqs.coursework.services.SymptomsService;
import org.fergoeqs.coursework.utils.SymptomMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/symptoms")
public class SymptomsController {
    private final SymptomsService symptomsService;
    private final SymptomMapper symptomMapper;
    private static final Logger logger = LoggerFactory.getLogger(SymptomsController.class);

    public SymptomsController(SymptomsService symptomsService, SymptomMapper symptomMapper) {
        this.symptomsService = symptomsService;
        this.symptomMapper = symptomMapper;
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAllSymptoms() {
        try {
            return ResponseEntity.ok(symptomMapper.toDTOs(symptomsService.findAllSymptoms()));
        } catch (Exception e) {
            logger.error("Fetching symptoms failed: ", e);
            throw e;
        }
    }

    @GetMapping("/by-diagnosis/{diagnosisId}")
    public ResponseEntity<?> getSymptomsByDiagnosis(@PathVariable Long diagnosisId) { //pathVariable ли?
        try {
            return ResponseEntity.ok(symptomMapper.toDTOs(symptomsService.findByDiagnosisId(diagnosisId)));
        } catch (Exception e) {
            logger.error("Fetching symptoms by diagnosis failed: ", e);
            throw e;
        }
    }

    @PostMapping("/save")
    public ResponseEntity<?> saveSymptom(@RequestBody SymptomDTO symptomDTO) {
        try {
            symptomsService.save(symptomDTO);
            return ResponseEntity.ok(symptomDTO);
        } catch (Exception e) {
            logger.error("Saving symptom failed: ", e);
            throw e;
        }
    }
}
