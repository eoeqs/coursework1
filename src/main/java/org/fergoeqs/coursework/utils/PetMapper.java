package org.fergoeqs.coursework.utils;

import org.fergoeqs.coursework.dto.PetDTO;
import org.fergoeqs.coursework.models.Pet;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface PetMapper {

    @Mapping(source = "name", target = "name")
    @Mapping(source = "breed", target = "breed")
    @Mapping(source = "type", target = "type")
    @Mapping(source = "weight", target = "weight")
    @Mapping(source = "sex", target = "sex")
    @Mapping(source = "age", target = "age")
    PetDTO petToPetDTO(Pet pet);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "actualVet", ignore = true)
    @Mapping(target = "owner", ignore = true)
    @Mapping(target = "sector", ignore = true)
    Pet petDTOToPet(PetDTO petDTO);
}


