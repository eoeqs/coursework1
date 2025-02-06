package org.fergoeqs.coursework.dto;

import org.fergoeqs.coursework.models.AppUser;

import java.time.LocalDate;
import java.time.LocalTime;

public record AvailableSlotsDTO (
    LocalDate date,
    LocalTime startTime,
    LocalTime endTime,
    AppUser vet){}
