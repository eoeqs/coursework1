package org.fergoeqs.coursework.services;

import org.fergoeqs.coursework.dto.AvailableSlotsDTO;
import org.fergoeqs.coursework.models.AvailableSlots;
import org.fergoeqs.coursework.repositories.AvailableSlotsRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class AvailableSlotsService {

    private final AvailableSlotsRepository availableSlotsRepository;

    public AvailableSlotsService(AvailableSlotsRepository availableSlotsRepository) {
        this.availableSlotsRepository = availableSlotsRepository;
    }

    public List<AvailableSlots> getAvailableSlots() {
        return availableSlotsRepository.findByIsAvailableTrue();
    }

    public AvailableSlots getAvailableSlotById(Long id) {
        return availableSlotsRepository.findById(id).orElse(null);
    }

    public AvailableSlots addAvailableSlot(AvailableSlotsDTO availableSlotDTO) {
        AvailableSlots availableSlot = new AvailableSlots();
        availableSlot.setDate(availableSlotDTO.date());
        availableSlot.setStartTime(availableSlotDTO.startTime());
        availableSlot.setEndTime(availableSlotDTO.endTime());
        availableSlot.setVet(availableSlotDTO.vet());
        availableSlot.setIsAvailable(true);
        return availableSlotsRepository.save(availableSlot);
    }

    public void deleteAvailableSlot(Long id, Long deleterId) {
        availableSlotsRepository.deleteById(id); //TODO: убедиться, что только админ сможет создавать и удалять слоты
    }
}
