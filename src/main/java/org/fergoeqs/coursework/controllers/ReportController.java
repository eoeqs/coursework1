package org.fergoeqs.coursework.controllers;

import org.fergoeqs.coursework.dto.ReportDTO;
import org.fergoeqs.coursework.services.ReportService;
import org.fergoeqs.coursework.services.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.net.URISyntaxException;

@RestController
@RequestMapping("/api/reports")
public class ReportController {
    private final ReportService reportService;
    private final UserService userService;

    public ReportController(ReportService reportService, UserService userService) {
        this.reportService = reportService;
        this.userService = userService;
    }
    @PreAuthorize("hasRole('ROLE_OWNER') or hasRole('ROLE_VET') or hasRole('ROLE_ADMIN')")
    @GetMapping("/{anamnesisId}")
    public ResponseEntity<?> getReport(@PathVariable Long anamnesisId) {
        return ResponseEntity.ok(reportService.getReportUrlByAnamnesis(anamnesisId));
    }

    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_VET')")
    @PostMapping("/generate-report/{anamnesisId}")
    public ResponseEntity<?> getReport(@PathVariable Long anamnesisId, @RequestBody ReportDTO reportDTO) throws IOException, URISyntaxException {
        return ResponseEntity.ok(reportService.generatePetReport(anamnesisId, reportDTO, userService.getAuthenticatedUser()));
    }

}
