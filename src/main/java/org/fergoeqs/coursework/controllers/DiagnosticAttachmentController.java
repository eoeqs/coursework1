package org.fergoeqs.coursework.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.fergoeqs.coursework.dto.DiagnosticAttachmentDTO;
import org.fergoeqs.coursework.services.DiagnosticAttachmentService;
import org.fergoeqs.coursework.utils.Mappers.DiagnosticAttachmentMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/diagnostic-attachment")
public class DiagnosticAttachmentController {
    private final DiagnosticAttachmentService diagnosticAttachmentService;
    private final DiagnosticAttachmentMapper diagnosticAttachmentMapper;
    private static final Logger logger = LoggerFactory.getLogger(DiagnosticAttachmentController.class);

    public DiagnosticAttachmentController(DiagnosticAttachmentService diagnosticAttachmentService, DiagnosticAttachmentMapper diagnosticAttachmentMapper) {
        this.diagnosticAttachmentService = diagnosticAttachmentService;
        this.diagnosticAttachmentMapper = diagnosticAttachmentMapper;
    }

    @GetMapping("/all-by-anamnesis/{anamnesisId}")
    public ResponseEntity<?> getAllAttachmentsByAnamnesis(@PathVariable Long anamnesisId) {
        try {
            return ResponseEntity.ok(diagnosticAttachmentMapper.toDTOs(
                    diagnosticAttachmentService.findByAnamnesis(anamnesisId)));
        } catch (Exception e) {
            logger.error("Error getting diagnostic attachments by anamnesis");
            throw e;
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getAttachment(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(diagnosticAttachmentMapper.toDTO(
                    diagnosticAttachmentService.findById(id)));
        } catch (Exception e) {
            logger.error("Error getting diagnostic attachment");
            throw e;
        }
    }

    @GetMapping("/url/{id}")
    public ResponseEntity<?> getAttachmentUrl(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(diagnosticAttachmentService.getAttachmentUrl(id));
        } catch (Exception e) {
            logger.error("Error getting diagnostic attachment url");
            throw e;
        }
    }

    @PostMapping("/new")
    public ResponseEntity<?> saveAttachment(@RequestParam("diagnosticAttachmentDTO") String diagnosticAttachmentDTOJson,
                                            @RequestParam("file") MultipartFile file) throws IOException {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            DiagnosticAttachmentDTO diagnosticAttachmentDTO = objectMapper.readValue(diagnosticAttachmentDTOJson, DiagnosticAttachmentDTO.class);
            return ResponseEntity.ok(diagnosticAttachmentMapper.toDTO(diagnosticAttachmentService.save(diagnosticAttachmentDTO, file)));
        } catch (Exception e) {
            logger.error("Error saving diagnostic attachment", e);
            throw e;
        }
    }

}
