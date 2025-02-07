package org.fergoeqs.coursework.utils;

import org.fergoeqs.coursework.dto.PetDTO;
import org.fergoeqs.coursework.models.Pet;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface PetMapper {

    PetDTO petToPetDTO(Pet pet);

    List<PetDTO> petsToPetDTOs(List<Pet> pets);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "actualVet", ignore = true)
    @Mapping(target = "owner", ignore = true)
    @Mapping(target = "sector", ignore = true)
    Pet petDTOToPet(PetDTO petDTO);
}


