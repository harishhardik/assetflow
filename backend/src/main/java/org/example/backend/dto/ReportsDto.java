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
        private List<AssetDto> mostUsedAssets;
        private List<AssetDto> idleAssets;
        private List<AssetDto> nearingRetirementAssets;
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
        private Map<String, Long> maintenanceFrequencyByCategory;
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

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class BookingReport {
        private long totalBookings;
        private Map<String, Long> bookingsByResource;
        private Map<String, Long> peakUsageWindows; // hour-of-day -> count
        private List<BookingDto> bookings;
    }
}
