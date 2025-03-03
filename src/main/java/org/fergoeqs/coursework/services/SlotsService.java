package org.fergoeqs.coursework.services;

import org.fergoeqs.coursework.dto.SlotDTO;
import org.fergoeqs.coursework.models.AppUser;
import org.fergoeqs.coursework.models.Slot;
import org.fergoeqs.coursework.repositories.SlotsRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class SlotsService {

    private final SlotsRepository slotsRepository;
    private final UserService userService;

    public SlotsService(SlotsRepository slotsRepository, UserService userService) {
        this.slotsRepository = slotsRepository;
        this.userService = userService;
    }

    public List<Slot> getAllSlots() {
        return slotsRepository.findAll();
    }

    public List<Slot> getAvailableSlots() {
        return slotsRepository.findByIsAvailableTrueAndIsPriorityFalse();
    }

    public List<Slot> getAvailablePrioritySlots() {
        return slotsRepository.findByIsAvailableTrueAndIsPriorityTrue();
    }

    public Slot getSlotById(Long id) {
        return slotsRepository.findById(id).orElse(null);
    }

    public void addAvailableSlot(SlotDTO availableSlotDTO) {
        AppUser vet = userService.findById(availableSlotDTO.vetId()).orElse(null);
        Slot availableSlot = new Slot();
        availableSlot.setDate(availableSlotDTO.date());
        availableSlot.setStartTime(availableSlotDTO.startTime());
        availableSlot.setEndTime(availableSlotDTO.endTime());
        availableSlot.setVet(vet);
        availableSlot.setIsAvailable(true);
        availableSlot.setIsPriority(availableSlotDTO.isPriority());
        if (!availableSlot.getStartTime().isBefore(availableSlot.getEndTime())) {
            throw new IllegalArgumentException("Start time must be before end time");
        }
        slotsRepository.save(availableSlot);
    }

    public void updateSlotStatus(Long id, Boolean isAvailable) {
        Slot slot = slotsRepository.findById(id).orElse(null);
        if (slot != null) {
            slot.setIsAvailable(isAvailable);
            slotsRepository.save(slot);
        }
    }

    public void deleteSlot(Long id) {
        slotsRepository.deleteById(id);
    }
}
