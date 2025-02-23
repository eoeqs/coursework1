package org.fergoeqs.coursework.controllers;

import org.fergoeqs.coursework.dto.ClinicDTO;
import org.fergoeqs.coursework.services.ClinicsService;
import org.fergoeqs.coursework.utils.Mappers.ClinicMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.*;

@Service
@RestController
@RequestMapping("/api/clinics")
public class ClinicsController {
    private final ClinicsService clinicsService;
    private final ClinicMapper clinicMapper;
    private static final Logger logger = LoggerFactory.getLogger(ClinicsController.class);

    public ClinicsController(ClinicsService clinicsService, ClinicMapper clinicMapper) {
        this.clinicsService = clinicsService;
        this.clinicMapper = clinicMapper;
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAllClinics() {
        try {
            return ResponseEntity.ok(clinicMapper.clinicsToClinicDTOs(clinicsService.findAll()));
        } catch (Exception e) {
            logger.error("Clinics fetching failed: {}", e.getMessage());
            throw e;
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getClinicById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(clinicMapper.clinicToClinicDTO(clinicsService.findById(id)));
        } catch (Exception e) {
            logger.error("Clinic fetching failed: {}", e.getMessage());
            throw e;
        }
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PostMapping("/save")
    public ResponseEntity<?> saveClinic(@RequestBody ClinicDTO clinicDTO) {
        try {
            return ResponseEntity.ok(clinicsService.save(clinicDTO));
        } catch (Exception e) {
            logger.error("Clinic creation failed: {}", e.getMessage());
            throw e;
        }
    }
}
