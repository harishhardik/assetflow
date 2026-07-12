package org.example.backend.dto;

import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.example.backend.enums.TransferStatus;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TransferRequestDto {
    private Long id;
    private AssetDto asset;
    private DepartmentDto fromDepartment;
    private DepartmentDto toDepartment;
    private AuthDto.UserDto requestedBy;
    private AuthDto.UserDto approvedBy;
    private TransferStatus status;
    private String remarks;
    private LocalDateTime createdAt;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Create {
        @NotNull(message = "Asset ID is required")
        private Long assetId;

        @NotNull(message = "Target department ID is required")
        private Long toDepartmentId;

        private String remarks;
    }
}
