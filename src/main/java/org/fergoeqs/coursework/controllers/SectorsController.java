package org.fergoeqs.coursework.controllers;

import org.fergoeqs.coursework.dto.SectorDTO;
import org.fergoeqs.coursework.models.enums.CategoryType;
import org.fergoeqs.coursework.services.SectorsService;
import org.fergoeqs.coursework.utils.Mappers.SectorMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/sectors")
public class SectorsController {
    private final SectorsService sectorsService;
    private final SectorMapper sectorMapper;
    private static final Logger logger = LoggerFactory.getLogger(SectorsController.class);

    public SectorsController(SectorsService sectorsService, SectorMapper sectorMapper) {
        this.sectorsService = sectorsService;
        this.sectorMapper = sectorMapper;
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAllSectors(){
        try {
            return ResponseEntity.ok(sectorMapper.sectorsToSectorDTOs(sectorsService.findAllSectors()));
        } catch (Exception e) {
            logger.error("Sectors fetching failed: {}", e.getMessage());
            throw e;
        }
    }

    @GetMapping("/available-dangerous")
    public ResponseEntity<?> getAvailableDangerousSectors(){
        try {
            return ResponseEntity.ok(sectorMapper.sectorsToSectorDTOs(sectorsService.findAllAvailableByType(CategoryType.DANGEROUS)));
        } catch (Exception e) {
            logger.error("Dangerous sectors fetching failed: {}", e.getMessage());
            throw e;
        }
    }

    @GetMapping("/available-contagious")
    public ResponseEntity<?> getAvailableContagiousSectors(){
        try {
            return ResponseEntity.ok(sectorMapper.sectorsToSectorDTOs(sectorsService.findAllAvailableByType(CategoryType.CONTAGIOUS)));
        } catch (Exception e) {
            logger.error("Contagious sectors fetching failed: {}", e.getMessage());
            throw e;
        }
    }

    @PostMapping("/new")
    public ResponseEntity<?> createSector(@RequestBody SectorDTO sectorDTO) {
        try {
            return ResponseEntity.ok(sectorMapper.sectorToSectorDTO(sectorsService.addSector(sectorDTO)));
        } catch (Exception e) {
            logger.error("Sector creation failed: {}", e.getMessage());
            throw e;
        }
    }

    @DeleteMapping("/delete/{sectorId}")
    public ResponseEntity<?> deleteSector(@PathVariable Long sectorId) {
        try {
            sectorsService.deleteSector(sectorId);
            return ResponseEntity.ok("Sector " + sectorId + " deleted");
        } catch (Exception e) {
            logger.error("Sector deletion failed: {}", e.getMessage());
            throw e;
        }
    }

}
