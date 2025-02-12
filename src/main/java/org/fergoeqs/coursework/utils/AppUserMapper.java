package org.fergoeqs.coursework.utils;

import org.fergoeqs.coursework.dto.AppUserDTO;
import org.fergoeqs.coursework.models.AppUser;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface AppUserMapper {
    AppUserDTO toDTO(AppUser user);
    List<AppUserDTO> toDTOs(List<AppUser> users);

    AppUser fromDTO(AppUserDTO userDto);
    List<AppUser> fromDTOs(List<AppUserDTO> userDto);
}
