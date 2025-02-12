package org.fergoeqs.coursework.utils;

import org.fergoeqs.coursework.dto.AppUserDTO;
import org.fergoeqs.coursework.models.AppUser;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface AppUserMapper {
    @Mapping(source = "clinic.id", target = "clinic")
    AppUserDTO toDTO(AppUser user);
    @Mapping(source = "clinic.id", target = "clinic")
    List<AppUserDTO> toDTOs(List<AppUser> users);

    @Mapping(source = "clinic", target = "clinic.id")
    AppUser fromDTO(AppUserDTO userDto);
    @Mapping(source = "clinic", target = "clinic.id")
    List<AppUser> fromDTOs(List<AppUserDTO> userDto);
}
