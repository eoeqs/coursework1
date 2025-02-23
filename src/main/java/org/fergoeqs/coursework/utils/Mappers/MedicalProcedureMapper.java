package org.fergoeqs.coursework.utils.Mappers;

import org.fergoeqs.coursework.dto.MedicalProcedureDTO;
import org.fergoeqs.coursework.models.MedicalProcedure;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface MedicalProcedureMapper {
    @Mapping(source = "vet.id", target = "vet")
    @Mapping(source = "pet.id", target = "pet")
    @Mapping(source = "anamnesis.id", target = "anamnesis")
    MedicalProcedureDTO toDTO(MedicalProcedure medicalProcedure);
    @Mapping(source = "vet.id", target = "vet")
    @Mapping(source = "pet.id", target = "pet")
    @Mapping(source = "anamnesis.id", target = "anamnesis")
    List<MedicalProcedureDTO> toDTOs(List<MedicalProcedure> medicalProcedures);

    @Mapping(target = "id", ignore = true)
    @Mapping(source = "vet", target = "vet.id")
    @Mapping(source = "pet", target = "pet.id")
    @Mapping(source = "anamnesis", target = "anamnesis.id")
    MedicalProcedure fromDTO(MedicalProcedureDTO medicalProcedureDTO);
    @Mapping(target = "id", ignore = true)
    @Mapping(source = "vet", target = "vet.id")
    @Mapping(source = "pet", target = "pet.id")
    @Mapping(source = "anamnesis", target = "anamnesis.id")
    List<MedicalProcedure> fromDTOs(List<MedicalProcedureDTO> medicalProcedureDTOs);
}
