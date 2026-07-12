package org.example.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.example.backend.enums.AssetCondition;
import org.example.backend.enums.AssetStatus;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AssetDto {
    private Long id;
    private String assetTag;
    private String assetName;
    private String serialNumber;
    private String description;
    private LocalDate purchaseDate;
    private BigDecimal purchasePrice;
    private String vendor;
    private String location;
    private AssetStatus status;
    private AssetCondition condition;
    private DepartmentDto department;
    private CategoryDto category;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Create {
        @NotBlank(message = "Asset tag is required")
        private String assetTag;

        @NotBlank(message = "Asset name is required")
        private String assetName;

        @NotBlank(message = "Serial number is required")
        private String serialNumber;

        private String description;
        private LocalDate purchaseDate;
        private BigDecimal purchasePrice;
        private String vendor;
        private String location;
        private AssetStatus status; // defaults to AVAILABLE if not provided
        private AssetCondition condition; // defaults to GOOD if not provided

        @NotNull(message = "Department ID is required")
        private Long departmentId;

        @NotNull(message = "Category ID is required")
        private Long categoryId;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class UpdateStatus {
        @NotNull(message = "Asset status is required")
        private AssetStatus status;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class AllocationHistory {
        private Long id;
        private Long employeeId;
        private String employeeName;
        private String employeeEmail;
        private LocalDateTime allocatedDate;
        private LocalDateTime expectedReturnDate;
        private LocalDateTime returnedDate;
        private String status;
        private String remarks;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class TransferHistory {
        private Long id;
        private String fromDepartmentName;
        private String toDepartmentName;
        private String requestedByName;
        private String approvedByName;
        private String status;
        private String remarks;
        private LocalDateTime createdAt;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class MaintenanceHistory {
        private Long id;
        private String issue;
        private String description;
        private String priority;
        private String status;
        private String reportedByName;
        private String assignedToName;
        private LocalDateTime createdAt;
        private LocalDateTime completedAt;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class DetailWithHistory {
        private AssetDto asset;
        private java.util.List<AllocationHistory> allocations;
        private java.util.List<TransferHistory> transfers;
        private java.util.List<MaintenanceHistory> maintenanceLogs;
    }
}
