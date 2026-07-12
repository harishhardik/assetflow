package org.example.backend.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.backend.dto.MaintenanceDto;
import org.example.backend.enums.MaintenanceStatus;
import org.example.backend.service.MaintenanceService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/maintenance")
@RequiredArgsConstructor
@Tag(name = "Maintenance", description = "Endpoints for raising, assigning, resolving, and listing asset maintenance requests")
public class MaintenanceController {

    private final MaintenanceService maintenanceService;

    @GetMapping
    @Operation(summary = "Get list of maintenance requests, optionally filtered by status")
    public ResponseEntity<List<MaintenanceDto>> getMaintenanceRequests(
            @RequestParam(required = false) MaintenanceStatus status
    ) {
        if (status != null) {
            return ResponseEntity.ok(maintenanceService.getRequestsByStatus(status));
        }
        return ResponseEntity.ok(maintenanceService.getAllRequests());
    }

    @PostMapping
    @Operation(summary = "Raise a new maintenance request for an asset (marks asset as under maintenance)")
    public ResponseEntity<MaintenanceDto> raiseRequest(@Valid @RequestBody MaintenanceDto.Create request) {
        return ResponseEntity.ok(maintenanceService.raiseRequest(request));
    }

    @PutMapping("/{id}/approve")
    @PreAuthorize("hasAnyRole('ADMIN', 'ASSET_MANAGER')")
    @Operation(summary = "Approve a maintenance request (Admin/Asset Manager only)")
    public ResponseEntity<MaintenanceDto> approveRequest(@PathVariable Long id) {
        return ResponseEntity.ok(maintenanceService.approveRequest(id));
    }

    @PutMapping("/{id}/reject")
    @PreAuthorize("hasAnyRole('ADMIN', 'ASSET_MANAGER')")
    @Operation(summary = "Reject a maintenance request (Admin/Asset Manager only)")
    public ResponseEntity<MaintenanceDto> rejectRequest(@PathVariable Long id) {
        return ResponseEntity.ok(maintenanceService.rejectRequest(id));
    }

    @PutMapping("/{id}/assign")
    @PreAuthorize("hasAnyRole('ADMIN', 'ASSET_MANAGER')")
    @Operation(summary = "Assign a maintenance request to an employee (Admin/Asset Manager only)")
    public ResponseEntity<MaintenanceDto> assignRequest(
            @PathVariable Long id,
            @Valid @RequestBody MaintenanceDto.Assign request
    ) {
        return ResponseEntity.ok(maintenanceService.assignRequest(id, request.getAssignedToId()));
    }

    @PutMapping("/{id}/start")
    @Operation(summary = "Mark a maintenance request as In Progress")
    public ResponseEntity<MaintenanceDto> startWork(@PathVariable Long id) {
        return ResponseEntity.ok(maintenanceService.startWork(id));
    }

    @PutMapping("/{id}/resolve")
    @Operation(summary = "Mark a maintenance request as resolved (returns asset status back to AVAILABLE)")
    public ResponseEntity<MaintenanceDto> resolveRequest(@PathVariable Long id) {
        return ResponseEntity.ok(maintenanceService.resolveRequest(id));
    }
}
