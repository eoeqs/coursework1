package org.fergoeqs.coursework.controllers;

import org.fergoeqs.coursework.dto.MedicalProcedureDTO;
import org.fergoeqs.coursework.services.MedicalProcedureService;
import org.fergoeqs.coursework.utils.Mappers.MedicalProcedureMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/api/procedures")
public class MedicalProcedureController {
    private final MedicalProcedureService medicalProcedureService;
    private final MedicalProcedureMapper medicalProcedureMapper;
    private static final Logger logger = LoggerFactory.getLogger(MedicalProcedureController.class);

    public MedicalProcedureController(MedicalProcedureService medicalProcedureService, MedicalProcedureMapper medicalProcedureMapper) {
        this.medicalProcedureService = medicalProcedureService;
        this.medicalProcedureMapper = medicalProcedureMapper;
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getProcedure(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(medicalProcedureMapper.toDTO(medicalProcedureService.findMedicalProcedureById(id)));
        } catch (Exception e) {
            logger.error("Error getting procedure: {}", e.getMessage());
            throw e;
        }
    }

    @GetMapping("/report/{id}")
    public ResponseEntity<?> getProcedureReport(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(medicalProcedureService.getReportUrl(id));
        } catch (Exception e) {
            logger.error("Error getting procedure report: {}", e.getMessage());
            throw e;
        }
    }

    @GetMapping("/all-by-pet/{petId}")
    public ResponseEntity<?> getAllProceduresByPet(@PathVariable Long petId) {
        try {
            return ResponseEntity.ok(medicalProcedureMapper.toDTOs(medicalProcedureService.findByPetId(petId)));
        } catch (Exception e) {
            logger.error("Error getting procedures by pet: {}", e.getMessage());
            throw e;
        }
    }

    @GetMapping("by-anamnesis/{id}")
    public ResponseEntity<?> getProceduresByAnamnesis(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(medicalProcedureMapper.toDTOs(medicalProcedureService.findByAnamnesis(id)));
        } catch (Exception e) {
            logger.error("Error getting procedures by anamnesis: {}", e.getMessage());
            throw e;
        }
    }

    @PostMapping("/add")
    public ResponseEntity<?> addProcedure(@RequestBody MedicalProcedureDTO medicalProcedureDTO) throws IOException {
        try {
            return ResponseEntity.ok(medicalProcedureMapper.toDTO(medicalProcedureService.save(medicalProcedureDTO)));
        } catch (Exception e) {
            logger.error("Error adding procedure: {}", e.getMessage());
            throw e;
        }
    }

}
