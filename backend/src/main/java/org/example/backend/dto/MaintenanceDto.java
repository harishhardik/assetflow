package org.example.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.example.backend.enums.MaintenanceStatus;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MaintenanceDto {
    private Long id;
    private AssetDto asset;
    private String issue;
    private String description;
    private String priority;
    private MaintenanceStatus status;
    private AuthDto.UserDto reportedBy;
    private AuthDto.UserDto assignedTo;
    private LocalDateTime createdAt;
    private LocalDateTime completedAt;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Create {
        @NotNull(message = "Asset ID is required")
        private Long assetId;

        @NotBlank(message = "Issue is required")
        private String issue;

        private String description;
        private String priority;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Assign {
        @NotNull(message = "Employee ID to assign is required")
        private Long assignedToId;
    }
}
