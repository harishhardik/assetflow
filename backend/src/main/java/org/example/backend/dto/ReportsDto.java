package org.example.backend.dto;

import lombok.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public class ReportsDto {

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class AssetReport {
        private long totalAssets;
        private Map<String, Long> statusBreakdown;
        private Map<String, Long> categoryBreakdown;
        private BigDecimal totalValue;
        private List<AssetDto> assets;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class MaintenanceReport {
        private long totalRequests;
        private Map<String, Long> priorityBreakdown;
        private Map<String, Long> statusBreakdown;
        private List<MaintenanceDto> maintenanceLogs;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class DepartmentReport {
        private String departmentName;
        private long employeeCount;
        private long assetCount;
        private BigDecimal totalAssetValue;
    }
}
