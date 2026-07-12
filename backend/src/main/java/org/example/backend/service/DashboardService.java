package org.example.backend.service;

import lombok.RequiredArgsConstructor;
import org.example.backend.dto.DashboardDto;
import org.example.backend.enums.AssetStatus;
import org.example.backend.enums.MaintenanceStatus;
import org.example.backend.enums.TransferStatus;
import org.example.backend.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final AssetRepository assetRepository;
    private final MaintenanceRepository maintenanceRepository;
    private final TransferRequestRepository transferRequestRepository;
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public DashboardDto getDashboardSummary() {
        long totalAssets = assetRepository.count();
        long availableAssets = assetRepository.countByStatus(AssetStatus.AVAILABLE);
        long allocatedAssets = assetRepository.countByStatus(AssetStatus.ALLOCATED);

        long maintenanceCount = maintenanceRepository.countByStatusIn(
                List.of(
                        MaintenanceStatus.PENDING,
                        MaintenanceStatus.APPROVED,
                        MaintenanceStatus.ASSIGNED,
                        MaintenanceStatus.IN_PROGRESS
                )
        );

        long pendingTransfers = transferRequestRepository.countByStatus(TransferStatus.PENDING);

        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
        LocalDateTime endOfDay = LocalDate.now().atTime(LocalTime.MAX);
        long todaysBookings = bookingRepository.countBookingsOnDate(startOfDay, endOfDay);

        long totalEmployees = userRepository.count();

        return DashboardDto.builder()
                .totalAssets(totalAssets)
                .availableAssets(availableAssets)
                .allocatedAssets(allocatedAssets)
                .maintenanceCount(maintenanceCount)
                .pendingTransfers(pendingTransfers)
                .todaysBookings(todaysBookings)
                .totalEmployees(totalEmployees)
                .build();
    }
}
