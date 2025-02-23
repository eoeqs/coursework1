package org.fergoeqs.coursework.utils.Mappers;

import org.fergoeqs.coursework.dto.DiagnosticAttachmentDTO;
import org.fergoeqs.coursework.models.DiagnosticAttachment;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface DiagnosticAttachmentMapper {
    @Mapping(source = "anamnesis.id", target = "anamnesis")
    DiagnosticAttachmentDTO toDTO(DiagnosticAttachment diagnosticAttachment);
    @Mapping(source = "anamnesis.id", target = "anamnesis")
    List<DiagnosticAttachmentDTO> toDTOs(List<DiagnosticAttachment> diagnosticAttachments);

    @Mapping(target = "id", ignore = true)
    @Mapping(source = "anamnesis", target = "anamnesis.id")
    DiagnosticAttachment fromDTO(DiagnosticAttachmentDTO diagnosticAttachmentDTO);
    @Mapping(target = "id", ignore = true)
    @Mapping(source = "anamnesis", target = "anamnesis.id")
    List<DiagnosticAttachment> fromDTOs(List<DiagnosticAttachmentDTO> diagnosticAttachmentDTOs);
}
