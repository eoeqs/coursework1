package org.fergoeqs.coursework.utils.Mappers;

import org.fergoeqs.coursework.dto.DiagnosisDTO;
import org.fergoeqs.coursework.models.Diagnosis;
import org.fergoeqs.coursework.models.RecommendedDiagnosis;
import org.fergoeqs.coursework.models.Symptom;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Named;

import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface DiagnosisMapper {
    @Mapping(source = "anamnesis.id", target = "anamnesis")
    @Mapping(source = "symptoms", target = "symptoms", qualifiedByName = "mapSymptomsToIds")
    DiagnosisDTO toDTO(Diagnosis diagnosis);
    @Mapping(source = "anamnesis.id", target = "anamnesis")
    @Mapping(source = "symptoms", target = "symptoms", qualifiedByName = "mapSymptomsToIds")
    List<DiagnosisDTO> toDTOs(List<Diagnosis> diagnoses);

    @Mapping(source = "anamnesis", target = "anamnesis.id")
    @Mapping(source = "symptoms", target = "symptoms", ignore = true)
    Diagnosis fromDTO(DiagnosisDTO diagnosisDTO);
    @Mapping(source = "anamnesis", target = "anamnesis.id")
    @Mapping(source = "symptoms", target = "symptoms", ignore = true)
    List<Diagnosis> fromDTOs(List<DiagnosisDTO> diagnosisDTOs);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "anamnesis", ignore = true)
    @Mapping(target = "date", ignore = true)
    @Mapping(source = "symptoms", target = "symptoms", ignore = true)
    void updateDiagnosisFromDTO(DiagnosisDTO diagnosisDTO, @MappingTarget Diagnosis diagnosis);

    @Named("mapSymptomsToIds")
    default List<Long> mapSymptomsToIds(List<Symptom> symptoms) {
        if (symptoms == null) {
            return null;
        }
        return symptoms.stream()
                .map(Symptom::getId)
                .collect(Collectors.toList());
    }

    @Mapping(target = "id", ignore = true)
    RecommendedDiagnosis toRecommendedDiagnosis(Diagnosis diagnosis);
}
