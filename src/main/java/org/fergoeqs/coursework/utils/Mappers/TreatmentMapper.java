package org.fergoeqs.coursework.utils.Mappers;

import org.fergoeqs.coursework.dto.PetDTO;
import org.fergoeqs.coursework.dto.TreatmentDTO;
import org.fergoeqs.coursework.models.Pet;
import org.fergoeqs.coursework.models.Treatment;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.util.List;

@Mapper(componentModel = "spring")
public interface TreatmentMapper {
    @Mapping(source = "diagnosis.id", target = "diagnosis")
    @Mapping(source = "pet.id", target = "pet")
    TreatmentDTO toDTO(Treatment treatment);
    @Mapping(source = "diagnosis.id", target = "diagnosis")
    @Mapping(source = "pet.id", target = "pet")
    List<TreatmentDTO> toDTOs(List<Treatment> treatments);

    @Mapping(target = "id", ignore = true)
    @Mapping(source = "diagnosis", target = "diagnosis.id")
    @Mapping(source = "pet", target = "pet.id")
    Treatment fromDTO(TreatmentDTO treatmentDTO);

    @Mapping(target = "id", ignore = true)
    @Mapping(source = "diagnosis", target = "diagnosis.id")
    @Mapping(source = "pet", target = "pet.id")
    List<Treatment> fromDTOs(List<TreatmentDTO> treatmentDTOs);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "diagnosis", ignore = true)
    @Mapping(target = "pet", ignore = true)
    void updateTreatmentFromDTO(TreatmentDTO treatmentDTO, @MappingTarget Treatment treatment);


}
