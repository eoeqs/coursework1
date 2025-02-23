package org.fergoeqs.coursework.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.fergoeqs.coursework.models.DiagnosticAttachment;

import java.util.List;

@Repository
public interface DiagnosticAttachmentRepository extends JpaRepository<DiagnosticAttachment, Long> {
    List<DiagnosticAttachment> findAllByAnamnesisId(Long anamnesisId);
}
