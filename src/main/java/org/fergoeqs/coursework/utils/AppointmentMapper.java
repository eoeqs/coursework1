package org.fergoeqs.coursework.utils;

import org.fergoeqs.coursework.dto.AppointmentDTO;
import org.fergoeqs.coursework.models.Appointment;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface AppointmentMapper {
    @Mapping(source = "slot.id", target = "slotId")
    @Mapping(source = "pet.id", target = "petId")
    AppointmentDTO appointmentToAppointmentDTO(Appointment appointment);

    @Mapping(source = "slot.id", target = "slotId")
    @Mapping(source = "pet.id", target = "petId")
    List<AppointmentDTO> appointmentsToAppointmentDTOs(List<Appointment> appointment);

    @Mapping(source = "slotId", target = "slot.id")
    @Mapping(source = "petId", target = "pet.id")
    Appointment appointmentDTOToAppointment(AppointmentDTO appointmentDTO);

    @Mapping(source = "slotId", target = "slot.id")
    @Mapping(source = "petId", target = "pet.id")
    List<Appointment> appointmentDTOsToAppointments(List<AppointmentDTO> appointmentDTOs);
}
