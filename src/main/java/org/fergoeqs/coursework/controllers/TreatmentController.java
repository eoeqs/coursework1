package org.fergoeqs.coursework.controllers;

import org.fergoeqs.coursework.dto.TreatmentDTO;
import org.fergoeqs.coursework.models.Treatment;
import org.fergoeqs.coursework.services.TreatmentService;
import org.fergoeqs.coursework.utils.Mappers.TreatmentMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/treatments")
public class TreatmentController {
    private final TreatmentService treatmentService;
    private final TreatmentMapper treatmentMapper;
    private static final Logger logger = LoggerFactory.getLogger(TreatmentController.class);

    public TreatmentController(TreatmentService treatmentService, TreatmentMapper treatmentMapper) {
        this.treatmentService = treatmentService;
        this.treatmentMapper = treatmentMapper;
    }

    @GetMapping("/actual-by-pet/{petId}")
    public ResponseEntity<?> getTreatmentsByPet(@PathVariable Long petId) {
        try {
            List<Treatment> treatments = treatmentService.findByPetIdAndIsCompletedFalse(petId);
            return ResponseEntity.ok(treatmentMapper.toDTOs(treatments));
        } catch (Exception e) {
            logger.error("Error getting actual treatments by pet: {}", e.getMessage());
            throw e;
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getTreatment(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(treatmentMapper.toDTO(treatmentService.findTreatmentById(id)));
        } catch (Exception e) {
            logger.error("Error getting treatment: {}", e.getMessage());
            throw e;
        }
    }

    @GetMapping("/all-by-pet/{petId}")
    public ResponseEntity<?> getAllTreatmentsByPet(@PathVariable Long petId) {
        try {
            List<Treatment> treatments = treatmentService.findByPetId(petId);
            return ResponseEntity.ok(treatmentMapper.toDTOs(treatments));
        } catch (Exception e) {
            logger.error("Error getting treatments by pet: {}", e.getMessage());
            throw e;
        }
    }

    @PostMapping("/add")
    public ResponseEntity<?> addTreatment(@RequestBody TreatmentDTO treatmentDTO) {
        try {
            return ResponseEntity.ok(treatmentMapper.toDTO(treatmentService.save(treatmentDTO)));
        } catch (Exception e) {
            logger.error("Error adding treatment: {}", e.getMessage());
            throw e;
        }
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateTreatment(@PathVariable Long id, @RequestBody TreatmentDTO treatmentDTO) {
        try {
            return ResponseEntity.ok(treatmentMapper.toDTO(treatmentService.update(treatmentDTO, id)));
        } catch (Exception e) {
            logger.error("Error updating treatment: {}", e.getMessage());
            throw e;
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteTreatment(@PathVariable Long id) {
        try {
            treatmentService.deleteTreatmentById(id);
            return ResponseEntity.ok("Treatment deleted successfully");
        } catch (Exception e) {
            logger.error("Error deleting treatment: {}", e.getMessage());
            throw e;
        }
    }
}
