package org.fergoeqs.coursework.utils;

import org.fergoeqs.coursework.dto.PetDTO;
import org.fergoeqs.coursework.models.Pet;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

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


    @Mapping(target = "actualVet", ignore = true)
    @Mapping(target = "owner", ignore = true)
    @Mapping(target = "sector", ignore = true)
    Pet petDTOToPet(PetDTO petDTO);

    @Mapping(target = "actualVet", ignore = true)
    @Mapping(target = "owner", ignore = true)
    @Mapping(target = "sector", ignore = true)
    List<Pet> petDTOsToPets(List<PetDTO> petDTOs);
}


