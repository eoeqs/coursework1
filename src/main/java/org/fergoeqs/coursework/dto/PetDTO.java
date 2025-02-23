package org.fergoeqs.coursework.dto;


import org.fergoeqs.coursework.models.enums.PetType;
import org.fergoeqs.coursework.models.enums.SexEnum;

import java.math.BigDecimal;

public record PetDTO (Long id,
    String name,
    String breed,
    PetType type,
    BigDecimal weight,
    SexEnum sex,
    Integer age, Long actualVet, Long owner, Long sector, String photoUrl)
{}
