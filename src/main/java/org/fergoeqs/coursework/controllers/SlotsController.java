package org.fergoeqs.coursework.controllers;

import org.fergoeqs.coursework.dto.SlotDTO;
import org.fergoeqs.coursework.models.Slot;
import org.fergoeqs.coursework.services.SlotsService;
import org.fergoeqs.coursework.utils.SlotMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/slots")
public class SlotsController {
    private final SlotsService slotsService;
    private final SlotMapper slotMapper;
    private static final Logger logger = LoggerFactory.getLogger(SlotsController.class);

    public SlotsController (SlotsService slotsService, SlotMapper slotMapper) {
        this.slotsService = slotsService;
        this.slotMapper = slotMapper;
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getSlot(@PathVariable Long id) {
        try {
            Slot slot = slotsService.getSlotById(id);
            return ResponseEntity.ok(slotMapper.slotToSlotDTO(slot));
        } catch (Exception e) {
            logger.error("Failed to get slot: {}", e.getMessage());
            throw e;
        }
    }

    @GetMapping("/available-slots")
    public ResponseEntity<?> getAvailableSlots() {
        try {
            List<Slot> slots = slotsService.getAvailableSlots();
            return ResponseEntity.ok(slotMapper.slotsToSlotDTOs(slots));
        } catch (Exception e) {
            logger.error("Failed to get available slots: {}", e.getMessage());
            throw e;
        }
    }

    @GetMapping("/all")
    public ResponseEntity<?> getSlots() {
        try {
            List<Slot> slots = slotsService.getAllSlots();
            return ResponseEntity.ok(slotMapper.slotsToSlotDTOs(slots));
        } catch (Exception e) {
            logger.error("Failed to get slots: {}", e.getMessage());
            throw e;
        }
    }

    @PostMapping("/add-slot")
    public ResponseEntity<?> addSlot(@RequestBody SlotDTO slotDTO) {
        try {
            slotsService.addAvailableSlot(slotDTO);
            return ResponseEntity.ok(slotDTO);
        } catch (Exception e) {
            logger.error("Failed to add slot: {}", e.getMessage());
            throw e;
        }
    }

    @PostMapping("book-slot/{id}")
    public ResponseEntity<?> bookSlot(@PathVariable Long id) {
        try {
            slotsService.updateSlotStatus(id, false);
            return ResponseEntity.ok("Slot booked successfully");
        } catch (Exception e) {
            logger.error("Failed to book slot: {}", e.getMessage());
            throw e;
        }
    }

    @PostMapping("release-slot/{id}")
    public ResponseEntity<?> releaseSlot(@PathVariable Long id) {
        try {
            slotsService.updateSlotStatus(id, true);
            return ResponseEntity.ok("Slot released successfully");
        } catch (Exception e) {
            logger.error("Failed to release slot: {}", e.getMessage());
            throw e;
        }
    }

    @DeleteMapping("/delete-slot/{id}")
    public ResponseEntity<?> deleteSlot(@PathVariable Long id) {
        try {
            slotsService.deleteSlot(id);
            return ResponseEntity.ok("Slot deleted successfully");
        } catch (Exception e) {
            logger.error("Failed to delete slot: {}", e.getMessage());
            throw e;
        }
    }

}
