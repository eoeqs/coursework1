package org.fergoeqs.coursework.utils;

import org.fergoeqs.coursework.dto.SlotDTO;
import org.fergoeqs.coursework.models.Slot;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface SlotMapper {
    @Mapping(source = "vet.id", target = "vetId")
    SlotDTO slotToSlotDTO(Slot slot);
    @Mapping(source = "vet.id", target = "vetId")
    List<SlotDTO> slotsToSlotDTOs(List<Slot> slots);

    @Mapping(source = "vetId", target = "vet.id")
    Slot slotDTOToSlot(SlotDTO slotDTO);
    @Mapping(source = "vetId", target = "vet.id")
    List<Slot> slotDTOsToSlots(List<SlotDTO> slotDTOs);
}

