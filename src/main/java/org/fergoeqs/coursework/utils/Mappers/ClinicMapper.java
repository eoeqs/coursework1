package org.fergoeqs.coursework.utils.Mappers;

import org.fergoeqs.coursework.dto.ClinicDTO;
import org.fergoeqs.coursework.models.Clinic;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ClinicMapper {
    ClinicDTO clinicToClinicDTO(Clinic clinic);
    List<ClinicDTO> clinicsToClinicDTOs(List<Clinic> clinics);

    Clinic clinicDTOToClinic(ClinicDTO clinicDTO);
    List<Clinic> clinicDTOsToClinics(List<ClinicDTO> clinicDTOs);
}
