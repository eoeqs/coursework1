package org.fergoeqs.coursework.utils.Mappers;

import org.fergoeqs.coursework.dto.AppUserDTO;
import org.fergoeqs.coursework.dto.PetDTO;
import org.fergoeqs.coursework.models.AppUser;
import org.fergoeqs.coursework.models.Pet;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

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

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "username", ignore = true)
    @Mapping(target = "password", ignore = true)
    @Mapping(target = "roles", ignore = true)
    @Mapping(target = "schedule", ignore = true)
    @Mapping(target = "qualification", ignore = true)
    @Mapping(target = "workingHours", ignore = true)
    @Mapping(target = "clinic", ignore = true)
    @Mapping(target = "photoUrl", ignore = true)
    void updateUserFromDTO(AppUserDTO appUserDTO, @MappingTarget AppUser appUser);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "username", ignore = true)
    @Mapping(target = "password", ignore = true)
    @Mapping(target = "roles", ignore = true)
    @Mapping(target = "photoUrl", ignore = true)
    @Mapping(source = "clinic", target = "clinic.id")
    void updateUserForAdminFromDTO(AppUserDTO appUserDTO, @MappingTarget AppUser appUser);
}
