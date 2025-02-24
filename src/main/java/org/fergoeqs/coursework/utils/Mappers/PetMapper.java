package org.fergoeqs.coursework.utils.Mappers;

import org.fergoeqs.coursework.dto.PetDTO;
import org.fergoeqs.coursework.models.Pet;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.util.List;

@Mapper(componentModel = "spring")
public interface PetMapper {

    @Mapping(source = "owner.id", target = "owner")
    @Mapping(source = "sector.id", target = "sector")
    @Mapping(source = "actualVet.id", target = "actualVet")
    PetDTO petToPetDTO(Pet pet);
    @Mapping(source = "owner.id", target = "owner")
    @Mapping(source = "sector.id", target = "sector")
    @Mapping(source = "actualVet.id", target = "actualVet")
    List<PetDTO> petsToPetDTOs(List<Pet> pets);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "actualVet", ignore = true)
    @Mapping(target = "owner", ignore = true)
    @Mapping(target = "sector", ignore = true)
    @Mapping(target = "photoUrl", ignore = true)
    Pet petDTOToPet(PetDTO petDTO);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "actualVet", ignore = true)
    @Mapping(target = "owner", ignore = true)
    @Mapping(target = "sector", ignore = true)
    @Mapping(target = "photoUrl", ignore = true)
    List<Pet> petDTOsToPets(List<PetDTO> petDTOs);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "actualVet", ignore = true)
    @Mapping(target = "owner", ignore = true)
    @Mapping(target = "sector", ignore = true)
    @Mapping(target = "photoUrl", ignore = true)
    void updatePetFromDTO(PetDTO petDTO, @MappingTarget Pet pet);
}


