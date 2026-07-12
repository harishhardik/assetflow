package org.example.backend.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardDto {
    private long totalAssets;
    private long availableAssets;
    private long allocatedAssets;
    private long maintenanceCount;
    private long pendingTransfers;
    private long todaysBookings;
    private long totalEmployees;
}
