package org.fergoeqs.coursework.dto;

import org.fergoeqs.coursework.models.enums.RoleType;
import java.util.Set;

public record AppUserDTO(
    Long id,
    String username,
    String email,
    String phoneNumber,
    String name,
    String surname,
    Set<RoleType> roles,
    Long clinic,
    String schedule,
    String qualification,
    String workingHours) {
}
