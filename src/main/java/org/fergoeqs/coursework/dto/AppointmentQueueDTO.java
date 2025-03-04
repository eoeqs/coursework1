package org.fergoeqs.coursework.dto;

import java.sql.Date;
import java.sql.Time;

public record AppointmentQueueDTO (
        Long queueId,
         Integer position,
         Long appointmentId,
         Boolean priority,
         String description,
         Long petId,
         Long slotId,
         Date slotDate,
         Time startTime,
         Time endTime,
         Long vetId
){
}
