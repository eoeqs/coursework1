package org.fergoeqs.coursework.dto;

public record RegisterUserDto(
        String username,
        String email,
        String password,
        String phoneNumber,
        String name,
        String surname
) {}
