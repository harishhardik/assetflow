package org.example.backend.dto;

import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ActivityLogDto {
    private Long id;
    private String action;
    private String details;
    private String performedByName;
    private String performedByEmail;
    private LocalDateTime createdAt;
}
