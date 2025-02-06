package org.fergoeqs.coursework.dto;

import lombok.Getter;
import lombok.Setter;
import org.fergoeqs.coursework.models.enums.PetType;
import org.fergoeqs.coursework.models.enums.SexEnum;

import java.math.BigDecimal;

@Getter
@Setter
public class PetDTO {
    private String name;
    private String breed;
    private PetType type;
    private BigDecimal weight;
    private SexEnum sex;
    private Integer age;
}
