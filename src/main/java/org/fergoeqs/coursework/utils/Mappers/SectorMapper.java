package org.fergoeqs.coursework.utils.Mappers;

import org.fergoeqs.coursework.dto.SectorDTO;
import org.fergoeqs.coursework.models.Sector;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface SectorMapper {
    SectorDTO sectorToSectorDTO(Sector sector);
    List<SectorDTO> sectorsToSectorDTOs(List<Sector> sectors);

    Sector sectorDTOToSector(SectorDTO sectorDTO);
    List<Sector> sectorDTOsToSectors(List<SectorDTO> sectorDTOs);
}
