package org.fergoeqs.coursework.dto;

public record AppointmentDTO (
    Long id,
    Boolean priority,
    Long slotId,
    Long petId ){}
