package org.fergoeqs.coursework.utils;

import org.fergoeqs.coursework.dto.HealthUpdateDTO;
import org.fergoeqs.coursework.models.HealthUpdate;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface HealthUpdateMapper {
    @Mapping(source = "pet.id", target = "pet")
    HealthUpdateDTO toDTO(HealthUpdate healthUpdate);
    @Mapping(source = "pet.id", target = "pet")
    List<HealthUpdateDTO> toDTOs(List<HealthUpdate> healthUpdates);

    @Mapping(source = "pet", target = "pet.id")
    HealthUpdate fromDTO(HealthUpdateDTO healthUpdateDTO);
    @Mapping(source = "pet", target = "pet.id")
    List<HealthUpdate> fromDTOs(List<HealthUpdateDTO> healthUpdateDTOs);

}
