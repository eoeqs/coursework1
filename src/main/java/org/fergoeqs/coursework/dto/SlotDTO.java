package org.fergoeqs.coursework.dto;

import java.time.LocalDate;
import java.time.LocalTime;

public record SlotDTO(
    Long id,
    LocalDate date,
    LocalTime startTime,
    LocalTime endTime,
    Long vetId){}
