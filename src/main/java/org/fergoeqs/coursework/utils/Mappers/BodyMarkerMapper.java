package org.fergoeqs.coursework.utils.Mappers;

import org.fergoeqs.coursework.dto.BodyMarkerDTO;
import org.fergoeqs.coursework.models.BodyMarker;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.util.List;

@Mapper(componentModel = "spring")
public interface BodyMarkerMapper {
    @Mapping(source = "pet.id", target = "pet")
    @Mapping(source = "appointment.id", target = "appointment")
    BodyMarkerDTO toDTO(BodyMarker bodyMarker);
    @Mapping(source = "pet.id", target = "pet")
    @Mapping(source = "appointment.id", target = "appointment")
    List<BodyMarkerDTO> toDTOs(List<BodyMarker> bodyMarkers);

    @Mapping(target = "pet", ignore = true)
    @Mapping(target = "appointment", ignore = true)
    BodyMarker fromDTO(BodyMarkerDTO bodyMarkerDTO);
//    @Mapping(source = "pet", target = "pet.id")
//    @Mapping(source = "appointment", target = "appointment.id")
    @Mapping(target = "pet", ignore = true)
    @Mapping(target = "appointment", ignore = true)
    List<BodyMarker> fromDTOs(List<BodyMarkerDTO> bodyMarkerDTOs);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "pet", ignore = true)
    @Mapping(target = "appointment", ignore = true)
    void updateBodyMarkerFromDTO(BodyMarkerDTO bodyMarkerDTO, @MappingTarget BodyMarker bodyMarker);
}