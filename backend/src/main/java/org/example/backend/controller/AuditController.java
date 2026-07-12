package org.example.backend.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.backend.dto.AuditCycleDto;
import org.example.backend.service.AuditService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/audits")
@RequiredArgsConstructor
@Tag(name = "Audits", description = "Endpoints for scheduling asset audit cycles, checking item status, locking cycles, and exporting discrepancy reports")
public class AuditController {

    private final AuditService auditService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'ASSET_MANAGER')")
    @Operation(summary = "Create/Schedule a new asset audit cycle (Admin/Manager only)")
    public ResponseEntity<AuditCycleDto> createCycle(@Valid @RequestBody AuditCycleDto.Create request) {
        return ResponseEntity.ok(auditService.createCycle(request));
    }

    @PostMapping("/{id}/items")
    @Operation(summary = "Mark/Log an audited asset in a cycle (Verified/Missing/Damaged)")
    public ResponseEntity<AuditCycleDto.Item> markAsset(
            @PathVariable Long id,
            @Valid @RequestBody AuditCycleDto.MarkItem request
    ) {
        return ResponseEntity.ok(auditService.markAsset(id, request));
    }

    @PostMapping("/{id}/close")
    @PreAuthorize("hasAnyRole('ADMIN', 'ASSET_MANAGER')")
    @Operation(summary = "Lock/Close an active audit cycle (Admin/Manager only)")
    public ResponseEntity<AuditCycleDto> closeCycle(@PathVariable Long id) {
        return ResponseEntity.ok(auditService.closeCycle(id));
    }

    @GetMapping("/{id}/report")
    @Operation(summary = "Get the discrepancy report for an audit cycle (listing missing and damaged items)")
    public ResponseEntity<AuditCycleDto.Report> getReport(@PathVariable Long id) {
        return ResponseEntity.ok(auditService.generateReport(id));
    }
}
