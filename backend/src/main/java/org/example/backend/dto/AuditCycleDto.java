package org.example.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.example.backend.enums.AuditItemStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuditCycleDto {
    private Long id;
    private String name;
    private LocalDate startDate;
    private LocalDate endDate;
    private String status;
    private Long departmentId;
    private String departmentName;
    private String location;
    private AuthDto.UserDto createdBy;
    private LocalDateTime createdAt;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Create {
        @NotBlank(message = "Audit cycle name is required")
        private String name;

        private LocalDate startDate;
        private LocalDate endDate;
        private Long departmentId;
        private String location;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Item {
        private Long id;
        private Long auditCycleId;
        private AssetDto asset;
        private AuditItemStatus status;
        private AuthDto.UserDto verifiedBy;
        private LocalDateTime verificationDate;
        private String remarks;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class MarkItem {
        @NotNull(message = "Asset ID is required")
        private Long assetId;

        @NotNull(message = "Audit status is required")
        private AuditItemStatus status;

        private String remarks;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Report {
        private AuditCycleDto auditCycle;
        private List<Item> discrepancies;
        private long totalVerified;
        private long totalMissing;
        private long totalDamaged;
        private long totalChecked;
    }
}
