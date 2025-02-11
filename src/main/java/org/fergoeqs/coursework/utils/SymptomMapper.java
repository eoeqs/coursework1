package org.fergoeqs.coursework.utils;

import org.fergoeqs.coursework.dto.SymptomDTO;
import org.fergoeqs.coursework.models.Symptom;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface SymptomMapper {
    SymptomDTO toDTO(Symptom symptom);
    List<SymptomDTO> toDTOs(List<Symptom> symptoms);

    Symptom fromDTO(SymptomDTO symptomDTO);
    List<Symptom> fromDTOs(List<SymptomDTO> symptomDTOs);
}
