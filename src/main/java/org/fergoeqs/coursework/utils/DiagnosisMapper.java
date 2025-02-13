package org.fergoeqs.coursework.utils;

import org.fergoeqs.coursework.dto.DiagnosisDTO;
import org.fergoeqs.coursework.models.Diagnosis;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface DiagnosisMapper {
    @Mapping(source = "anamnesis.id", target = "anamnesis")
    DiagnosisDTO toDTO(Diagnosis diagnosis);
    @Mapping(source = "anamnesis.id", target = "anamnesis")
    List<DiagnosisDTO> toDTOs(List<Diagnosis> diagnoses);

    @Mapping(source = "anamnesis", target = "anamnesis.id")
    Diagnosis fromDTO(DiagnosisDTO diagnosisDTO);
    @Mapping(source = "anamnesis", target = "anamnesis.id")
    List<Diagnosis> fromDTOs(List<DiagnosisDTO> diagnosisDTOs);
}
