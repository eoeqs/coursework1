package org.fergoeqs.coursework.utils.Mappers;

import org.fergoeqs.coursework.dto.AnamnesisDTO;
import org.fergoeqs.coursework.models.Anamnesis;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface AnamnesisMapper {

    @Mapping(source = "pet.id", target = "pet")
    AnamnesisDTO toDTO(Anamnesis anamnesis);
    @Mapping(source = "pet.id", target = "pet")

    List<AnamnesisDTO> toDTOs(List<Anamnesis> anamneses);
    @Mapping(source = "pet", target = "pet.id")
    Anamnesis fromDTO(AnamnesisDTO anamnesisDTO);
    @Mapping(source = "pet", target = "pet.id")
    List<Anamnesis> fromDTOs(List<AnamnesisDTO> anamnesisDTOs);
}
