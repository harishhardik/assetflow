package org.example.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DepartmentDto {
    private Long id;

    @NotBlank(message = "Department name is required")
    private String name;

    private String description;
    private String status;
    private Long parentDepartmentId;
    private String parentDepartmentName;
    private Long departmentHeadId;
    private String departmentHeadName;
    private LocalDateTime createdAt;
}
