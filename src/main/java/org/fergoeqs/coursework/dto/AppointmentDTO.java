package org.fergoeqs.coursework.dto;

public record AppointmentDTO (
    Boolean priority,
    Long slotId,
    Long petId ){}
