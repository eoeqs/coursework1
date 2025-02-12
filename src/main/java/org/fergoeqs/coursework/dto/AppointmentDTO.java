package org.fergoeqs.coursework.dto;

public record AppointmentDTO (
    Long id,
    Boolean priority,
    String description,
    Long slotId,
    Long petId ){}
