package org.fergoeqs.coursework.dto;

import lombok.Getter;
import lombok.Setter;
import org.fergoeqs.coursework.models.AppUser;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
public class AvailableSlotsDTO {
    private LocalDate date;
    private LocalTime startTime;
    private LocalTime endTime;
    private AppUser vet;
}
