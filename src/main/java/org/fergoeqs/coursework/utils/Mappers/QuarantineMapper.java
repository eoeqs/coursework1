package org.fergoeqs.coursework.utils.Mappers;

import org.fergoeqs.coursework.dto.QuarantineDTO;
import org.fergoeqs.coursework.models.Quarantine;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface QuarantineMapper {
    @Mapping(source = "pet.id", target = "pet")
    @Mapping(source = "sector.id", target = "sector")
    QuarantineDTO toDTO(Quarantine quarantine);
    @Mapping(source = "pet.id", target = "pet")
    @Mapping(source = "sector.id", target = "sector")
    List<QuarantineDTO> toDTOs(List<Quarantine> quarantines);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "pet", ignore = true)
    @Mapping(target = "sector", ignore = true)
    Quarantine fromDTO(QuarantineDTO quarantineDTO);
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "pet", ignore = true)
    @Mapping(target = "sector", ignore = true)
    List<Quarantine> fromDTOs(List<QuarantineDTO> quarantineDTOs);
}
