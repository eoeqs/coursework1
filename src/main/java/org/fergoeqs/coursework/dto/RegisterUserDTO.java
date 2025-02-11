package org.fergoeqs.coursework.dto;

public record RegisterUserDTO(
        String username,
        String email,
        String password,
        String phoneNumber,
        String name,
        String surname
) {}
