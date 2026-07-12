package org.example.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.example.backend.enums.AssetCondition;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AssetAllocationDto {
    private Long id;
    private AssetDto asset;
    private AuthDto.UserDto employee;
    private LocalDateTime allocatedDate;
    private LocalDateTime expectedReturnDate;
    private LocalDateTime returnedDate;
    private String status;
    private String remarks;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Create {
        @NotNull(message = "Asset ID is required")
        private Long assetId;

        @NotNull(message = "Employee ID is required")
        private Long employeeId;

        private LocalDateTime expectedReturnDate;
        private String remarks;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Return {
        @NotNull(message = "Asset return condition is required")
        private AssetCondition condition;

        private String remarks;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class TransferRequestInput {
        @NotNull(message = "Target department ID is required")
        private Long toDepartmentId;

        private String remarks;
    }
}
