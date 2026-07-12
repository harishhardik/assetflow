package org.example.backend.service;

import lombok.RequiredArgsConstructor;
import org.example.backend.dto.ReportsDto;
import org.example.backend.entity.Asset;
import org.example.backend.entity.AssetAllocation;
import org.example.backend.entity.Booking;
import org.example.backend.entity.Department;
import org.example.backend.entity.Maintenance;
import org.example.backend.entity.User;
import org.example.backend.enums.AssetStatus;
import org.example.backend.mapper.EntityMapper;
import org.example.backend.repository.AssetAllocationRepository;
import org.example.backend.repository.AssetRepository;
import org.example.backend.repository.BookingRepository;
import org.example.backend.repository.DepartmentRepository;
import org.example.backend.repository.MaintenanceRepository;
import org.example.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final AssetRepository assetRepository;
    private final MaintenanceRepository maintenanceRepository;
    private final DepartmentRepository departmentRepository;
    private final UserRepository userRepository;
    private final BookingRepository bookingRepository;
    private final AssetAllocationRepository assetAllocationRepository;

    @Transactional(readOnly = true)
    public ReportsDto.AssetReport getAssetReport() {
        List<Asset> assets = assetRepository.findAll();
        
        long totalAssets = assets.size();
        BigDecimal totalValue = assets.stream()
                .map(Asset::getPurchasePrice)
                .filter(p -> p != null)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Map<String, Long> statusBreakdown = assets.stream()
                .collect(Collectors.groupingBy(a -> a.getStatus().name(), Collectors.counting()));

        Map<String, Long> categoryBreakdown = assets.stream()
                .collect(Collectors.groupingBy(a -> a.getCategory().getName(), Collectors.counting()));

        // Nearing retirement: purchased > 5 years ago
        LocalDate fiveYearsAgo = LocalDate.now().minusYears(5);
        List<Asset> nearingRetirement = assets.stream()
                .filter(a -> a.getPurchaseDate() != null && a.getPurchaseDate().isBefore(fiveYearsAgo))
                .collect(Collectors.toList());

        // Utilization: count allocations per asset
        Map<Long, Long> allocationCounts = new HashMap<>();
        for (Asset asset : assets) {
            List<AssetAllocation> allocs = assetAllocationRepository.findByAssetIdOrderByAllocatedDateDesc(asset.getId());
            allocationCounts.put(asset.getId(), (long) allocs.size());
        }

        // Most used: top 5 assets by allocation count
        List<Asset> mostUsed = assets.stream()
                .sorted((a1, a2) -> Long.compare(allocationCounts.getOrDefault(a2.getId(), 0L), allocationCounts.getOrDefault(a1.getId(), 0L)))
                .limit(5)
                .collect(Collectors.toList());

        // Idle assets: status is AVAILABLE and allocation count is 0
        List<Asset> idle = assets.stream()
                .filter(a -> a.getStatus() == AssetStatus.AVAILABLE && allocationCounts.getOrDefault(a.getId(), 0L) == 0L)
                .collect(Collectors.toList());

        return ReportsDto.AssetReport.builder()
                .totalAssets(totalAssets)
                .statusBreakdown(statusBreakdown)
                .categoryBreakdown(categoryBreakdown)
                .totalValue(totalValue)
                .assets(assets.stream().map(EntityMapper::toAssetDto).collect(Collectors.toList()))
                .mostUsedAssets(mostUsed.stream().map(EntityMapper::toAssetDto).collect(Collectors.toList()))
                .idleAssets(idle.stream().map(EntityMapper::toAssetDto).collect(Collectors.toList()))
                .nearingRetirementAssets(nearingRetirement.stream().map(EntityMapper::toAssetDto).collect(Collectors.toList()))
                .build();
    }

    @Transactional(readOnly = true)
    public ReportsDto.MaintenanceReport getMaintenanceReport() {
        List<Maintenance> maintenanceList = maintenanceRepository.findAll();

        long totalRequests = maintenanceList.size();

        Map<String, Long> priorityBreakdown = maintenanceList.stream()
                .collect(Collectors.groupingBy(Maintenance::getPriority, Collectors.counting()));

        Map<String, Long> statusBreakdown = maintenanceList.stream()
                .collect(Collectors.groupingBy(m -> m.getStatus().name(), Collectors.counting()));

        // Maintenance frequency by category
        Map<String, Long> frequencyByCategory = maintenanceList.stream()
                .filter(m -> m.getAsset() != null && m.getAsset().getCategory() != null)
                .collect(Collectors.groupingBy(m -> m.getAsset().getCategory().getName(), Collectors.counting()));

        return ReportsDto.MaintenanceReport.builder()
                .totalRequests(totalRequests)
                .priorityBreakdown(priorityBreakdown)
                .statusBreakdown(statusBreakdown)
                .maintenanceFrequencyByCategory(frequencyByCategory)
                .maintenanceLogs(maintenanceList.stream().map(EntityMapper::toMaintenanceDto).collect(Collectors.toList()))
                .build();
    }

    @Transactional(readOnly = true)
    public List<ReportsDto.DepartmentReport> getDepartmentReports() {
        List<Department> departments = departmentRepository.findAll();
        List<Asset> assets = assetRepository.findAll();
        List<User> users = userRepository.findAll();

        List<ReportsDto.DepartmentReport> reports = new ArrayList<>();

        for (Department dept : departments) {
            long employeeCount = users.stream()
                    .filter(u -> u.getDepartment() != null && u.getDepartment().getId().equals(dept.getId()))
                    .count();

            List<Asset> deptAssets = assets.stream()
                    .filter(a -> a.getDepartment() != null && a.getDepartment().getId().equals(dept.getId()))
                    .collect(Collectors.toList());

            long assetCount = deptAssets.size();

            BigDecimal totalAssetValue = deptAssets.stream()
                    .map(Asset::getPurchasePrice)
                    .filter(p -> p != null)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            reports.add(ReportsDto.DepartmentReport.builder()
                    .departmentName(dept.getName())
                    .employeeCount(employeeCount)
                    .assetCount(assetCount)
                    .totalAssetValue(totalAssetValue)
                    .build());
        }

        return reports;
    }

    @Transactional(readOnly = true)
    public ReportsDto.BookingReport getBookingReport() {
        List<Booking> bookings = bookingRepository.findAll();

        long totalBookings = bookings.size();

        Map<String, Long> bookingsByResource = bookings.stream()
                .filter(b -> b.getResource() != null)
                .collect(Collectors.groupingBy(b -> b.getResource().getName(), Collectors.counting()));

        // Hour-of-day heatmap
        Map<String, Long> peakUsageWindows = new HashMap<>();
        for (int i = 0; i < 24; i++) {
            peakUsageWindows.put(String.format("%02d:00", i), 0L);
        }

        for (Booking booking : bookings) {
            if (booking.getStartTime() != null) {
                int hour = booking.getStartTime().getHour();
                String key = String.format("%02d:00", hour);
                peakUsageWindows.put(key, peakUsageWindows.getOrDefault(key, 0L) + 1);
            }
        }

        return ReportsDto.BookingReport.builder()
                .totalBookings(totalBookings)
                .bookingsByResource(bookingsByResource)
                .peakUsageWindows(peakUsageWindows)
                .bookings(bookings.stream().map(EntityMapper::toBookingDto).collect(Collectors.toList()))
                .build();
    }
}
