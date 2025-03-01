package org.fergoeqs.coursework.utils.Mappers;

import org.fergoeqs.coursework.dto.RecommendedDiagnosisDTO;
import org.fergoeqs.coursework.models.Diagnosis;
import org.fergoeqs.coursework.models.RecommendedDiagnosis;
import org.fergoeqs.coursework.models.Symptom;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface RecommendedDiagnosisMapper {

    @Mapping(source = "symptoms", target = "symptoms", qualifiedByName = "mapSymptomsToIds")
    RecommendedDiagnosisDTO toDTO(RecommendedDiagnosis recommendedDiagnosis);

    @Mapping(source = "symptoms", target = "symptoms", qualifiedByName = "mapSymptomsToIds")
    List<RecommendedDiagnosisDTO> toDTOs(List<RecommendedDiagnosis> recommendedDiagnosisList);

    @Mapping(source = "symptoms", target = "symptoms", ignore = true)
    RecommendedDiagnosis fromDTO(RecommendedDiagnosisDTO recommendedDiagnosisDTO);

    @Mapping(source = "symptoms", target = "symptoms", ignore = true)
    List<RecommendedDiagnosis> fromDTOs(List<RecommendedDiagnosisDTO> recommendedDiagnosisDTOList);

    @Named("mapSymptomsToIds")
    default List<Long> mapSymptomsToIds(List<Symptom> symptoms) {
        if (symptoms == null) {
            return null;
        }
        return symptoms.stream()
                .map(Symptom::getId)
                .collect(Collectors.toList());
    }
}

