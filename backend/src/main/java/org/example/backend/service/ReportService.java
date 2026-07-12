package org.example.backend.service;

import lombok.RequiredArgsConstructor;
import org.example.backend.dto.ReportsDto;
import org.example.backend.entity.Asset;
import org.example.backend.entity.Department;
import org.example.backend.entity.Maintenance;
import org.example.backend.entity.User;
import org.example.backend.mapper.EntityMapper;
import org.example.backend.repository.AssetRepository;
import org.example.backend.repository.DepartmentRepository;
import org.example.backend.repository.MaintenanceRepository;
import org.example.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
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

        return ReportsDto.AssetReport.builder()
                .totalAssets(totalAssets)
                .statusBreakdown(statusBreakdown)
                .categoryBreakdown(categoryBreakdown)
                .totalValue(totalValue)
                .assets(assets.stream().map(EntityMapper::toAssetDto).collect(Collectors.toList()))
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

        return ReportsDto.MaintenanceReport.builder()
                .totalRequests(totalRequests)
                .priorityBreakdown(priorityBreakdown)
                .statusBreakdown(statusBreakdown)
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
}
