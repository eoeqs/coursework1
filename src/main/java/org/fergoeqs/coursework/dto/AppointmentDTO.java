package org.fergoeqs.coursework.dto;

import lombok.Getter;
import lombok.Setter;
import org.fergoeqs.coursework.models.AvailableSlots;
import org.fergoeqs.coursework.models.Pet;

@Setter
@Getter
public class AppointmentDTO {
    private Boolean priority;
    private Pet pet;
    private AvailableSlots slot;
}
