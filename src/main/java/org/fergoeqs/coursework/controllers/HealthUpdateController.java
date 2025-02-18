package org.fergoeqs.coursework.controllers;

import org.fergoeqs.coursework.dto.HealthUpdateDTO;
import org.fergoeqs.coursework.services.HealthUpdatesService;
import org.fergoeqs.coursework.utils.Mappers.HealthUpdateMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/health")
public class HealthUpdateController {
    private final HealthUpdatesService healthUpdateService;
    private final HealthUpdateMapper healthUpdateMapper;
    private static final Logger logger = LoggerFactory.getLogger(HealthUpdateController.class);

    public HealthUpdateController(HealthUpdatesService healthUpdateService, HealthUpdateMapper healthUpdateMapper) {
        this.healthUpdateService = healthUpdateService;
        this.healthUpdateMapper = healthUpdateMapper;
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getHealthUpdate(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(healthUpdateMapper.toDTO(healthUpdateService.findById(id)));
        } catch (Exception e) {
            logger.error("Error while fetching health update with id: {}", id, e);
            throw e;
        }
    }

    @GetMapping("/first/{petId}")
    public ResponseEntity<?> getFirstHealthUpdate(@PathVariable Long petId) {
        try {
            return ResponseEntity.ok(healthUpdateMapper.toDTO(healthUpdateService.findFirstByPet(petId)));
        } catch (Exception e) {
            logger.error("Error while fetching first health update for pet with id: {}", petId, e);
            throw e;
        }
    }

    @GetMapping("/all/{petId}")
    public ResponseEntity<?> getAllHealthUpdates(@PathVariable Long petId) {
        try {
            return ResponseEntity.ok(healthUpdateMapper.toDTOs(healthUpdateService.findAllByPet(petId)));
        } catch (Exception e) {
            logger.error("Error while fetching all health updates for pet with id: {}", petId, e);
            throw e;
        }
    }

    @PostMapping("/save")
    public ResponseEntity<?> saveHealthUpdate(@RequestBody HealthUpdateDTO healthUpdateDTO) {
        try {
            return ResponseEntity.ok(healthUpdateMapper.toDTO(healthUpdateService.save(healthUpdateDTO)));
        } catch (Exception e) {
            logger.error("Error while saving health update: {}", healthUpdateDTO, e);
            throw e;
        }
    }
}
