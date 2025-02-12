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


    @Mapping(source = "owner", target = "owner.id")
    @Mapping(source = "sector", target = "sector.id")
    @Mapping(source = "actualVet", target = "actualVet.id")
    Pet petDTOToPet(PetDTO petDTO);

    @Mapping(source = "owner", target = "owner.id")
    @Mapping(source = "sector", target = "sector.id")
    @Mapping(source = "actualVet", target = "actualVet.id")
    List<Pet> petDTOsToPets(List<PetDTO> petDTOs);
}


