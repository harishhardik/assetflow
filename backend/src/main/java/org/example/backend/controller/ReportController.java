package org.example.backend.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.example.backend.dto.ReportsDto;
import org.example.backend.service.ReportService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
@Tag(name = "Reports", description = "Endpoints for exporting analytical reports")
public class ReportController {

    private final ReportService reportService;

    @GetMapping("/assets")
    @Operation(summary = "Get asset status and category distribution reports")
    public ResponseEntity<ReportsDto.AssetReport> getAssetReport() {
        return ResponseEntity.ok(reportService.getAssetReport());
    }

    @GetMapping("/maintenance")
    @Operation(summary = "Get maintenance tickets, priorities, and status breakdown reports")
    public ResponseEntity<ReportsDto.MaintenanceReport> getMaintenanceReport() {
        return ResponseEntity.ok(reportService.getMaintenanceReport());
    }

    @GetMapping("/departments")
    @Operation(summary = "Get department-wise employee count, asset counts, and capital values")
    public ResponseEntity<List<ReportsDto.DepartmentReport>> getDepartmentReports() {
        return ResponseEntity.ok(reportService.getDepartmentReports());
    }
}
