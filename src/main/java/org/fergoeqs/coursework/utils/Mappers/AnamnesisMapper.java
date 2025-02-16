package org.fergoeqs.coursework.utils.Mappers;

import org.fergoeqs.coursework.dto.AnamnesisDTO;
import org.fergoeqs.coursework.models.Anamnesis;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface AnamnesisMapper {

    @Mapping(source = "pet.id", target = "pet")
    @Mapping(source = "appointment.id", target = "appointment")
    AnamnesisDTO toDTO(Anamnesis anamnesis);
    @Mapping(source = "pet.id", target = "pet")
    @Mapping(source = "appointment.id", target = "appointment")
    List<AnamnesisDTO> toDTOs(List<Anamnesis> anamneses);

    @Mapping(target = "id", ignore = true)
    @Mapping(source = "pet", target = "pet.id")
    @Mapping(source = "appointment", target = "appointment.id")
    Anamnesis fromDTO(AnamnesisDTO anamnesisDTO);
    @Mapping(source = "pet", target = "pet.id")
    @Mapping(target = "id", ignore = true)
    @Mapping(source = "appointment", target = "appointment.id")
    List<Anamnesis> fromDTOs(List<AnamnesisDTO> anamnesisDTOs);
}
