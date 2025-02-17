package org.fergoeqs.coursework.controllers;

import org.fergoeqs.coursework.dto.AnamnesisDTO;
import org.fergoeqs.coursework.services.AnamnesisService;
import org.fergoeqs.coursework.utils.Mappers.AnamnesisMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/anamnesis")
public class AnamnesisController {
    private final AnamnesisService anamnesisService;
    private final AnamnesisMapper anamnesisMapper;
    private static final Logger logger = LoggerFactory.getLogger(AnamnesisController.class);

    public AnamnesisController(AnamnesisService anamnesisService, AnamnesisMapper anamnesisMapper) {
        this.anamnesisService = anamnesisService;
        this.anamnesisMapper = anamnesisMapper;
    }


    @GetMapping("/{id}")
    public ResponseEntity<?> getAnamnesis(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(anamnesisMapper.toDTO(anamnesisService.findAnamnesisById(id)));
        } catch (Exception e) {
            logger.error("Error getting anamnesis", e);
            throw e;
        }
    }

    @GetMapping("/all-by-patient/{petId}")
    public ResponseEntity<?> getAllByPatient(@PathVariable Long petId) {
        try {
            return ResponseEntity.ok(anamnesisMapper.toDTOs(anamnesisService.findAllAnamnesesByPet(petId)));
        } catch (Exception e) {
            logger.error("Error getting anamnesis by patient", e);
            throw e;
        }
    }

    @PostMapping("/save")
    public ResponseEntity<?> saveAnamnesis(@RequestBody AnamnesisDTO anamnesisDTO) {
        try {
            return ResponseEntity.ok(anamnesisMapper.toDTO(anamnesisService.saveAnamnesis(anamnesisDTO)));
        } catch (Exception e) {
            logger.error("Error saving anamnesis", e);
            throw e;
        } //TODO: если у ветеринара стоит галочка "создать анамнез" при принятии записи, перенаправить на заполнение анамнеза
    }

}
