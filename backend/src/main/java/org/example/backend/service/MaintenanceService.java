package org.example.backend.service;

import lombok.RequiredArgsConstructor;
import org.example.backend.dto.MaintenanceDto;
import org.example.backend.entity.Asset;
import org.example.backend.entity.Maintenance;
import org.example.backend.entity.User;
import org.example.backend.enums.AssetStatus;
import org.example.backend.enums.MaintenanceStatus;
import org.example.backend.exception.ConflictException;
import org.example.backend.exception.ResourceNotFoundException;
import org.example.backend.mapper.EntityMapper;
import org.example.backend.repository.AssetRepository;
import org.example.backend.repository.MaintenanceRepository;
import org.example.backend.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MaintenanceService {

    private final MaintenanceRepository maintenanceRepository;
    private final AssetRepository assetRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    @Transactional
    public MaintenanceDto raiseRequest(MaintenanceDto.Create dto) {
        Asset asset = assetRepository.findById(dto.getAssetId())
                .orElseThrow(() -> new ResourceNotFoundException("Asset not found with ID: " + dto.getAssetId()));

        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User reporter = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

        // Update asset status to MAINTENANCE
        asset.setStatus(AssetStatus.MAINTENANCE);
        assetRepository.save(asset);

        Maintenance mt = Maintenance.builder()
                .asset(asset)
                .issue(dto.getIssue())
                .description(dto.getDescription())
                .priority(dto.getPriority() != null ? dto.getPriority() : "MEDIUM")
                .status(MaintenanceStatus.PENDING)
                .reportedBy(reporter)
                .build();

        Maintenance saved = maintenanceRepository.save(mt);
        return EntityMapper.toMaintenanceDto(saved);
    }

    @Transactional
    public MaintenanceDto approveRequest(Long id) {
        Maintenance mt = maintenanceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Maintenance request not found with ID: " + id));

        if (mt.getStatus() != MaintenanceStatus.PENDING) {
            throw new ConflictException("Maintenance request is already resolved or approved: " + mt.getStatus());
        }

        mt.setStatus(MaintenanceStatus.APPROVED);
        Maintenance saved = maintenanceRepository.save(mt);
        return EntityMapper.toMaintenanceDto(saved);
    }

    @Transactional
    public MaintenanceDto assignRequest(Long id, Long employeeId) {
        Maintenance mt = maintenanceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Maintenance request not found with ID: " + id));

        if (mt.getStatus() == MaintenanceStatus.RESOLVED) {
            throw new ConflictException("Cannot assign a resolved maintenance request");
        }

        User assignee = userRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee to assign not found with ID: " + employeeId));

        mt.setStatus(MaintenanceStatus.ASSIGNED);
        mt.setAssignedTo(assignee);
        Maintenance saved = maintenanceRepository.save(mt);

        // Generate Notification
        notificationService.createNotification(
                "Maintenance Assigned",
                "Maintenance request for asset '" + mt.getAsset().getAssetName() + "' has been assigned to you.",
                assignee
        );

        return EntityMapper.toMaintenanceDto(saved);
    }

    @Transactional
    public MaintenanceDto startWork(Long id) {
        Maintenance mt = maintenanceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Maintenance request not found with ID: " + id));

        if (mt.getStatus() == MaintenanceStatus.PENDING || mt.getStatus() == MaintenanceStatus.RESOLVED) {
            throw new ConflictException("Cannot start work on request in status: " + mt.getStatus());
        }

        mt.setStatus(MaintenanceStatus.IN_PROGRESS);
        Maintenance saved = maintenanceRepository.save(mt);
        return EntityMapper.toMaintenanceDto(saved);
    }

    @Transactional
    public MaintenanceDto resolveRequest(Long id) {
        Maintenance mt = maintenanceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Maintenance request not found with ID: " + id));

        if (mt.getStatus() == MaintenanceStatus.RESOLVED) {
            throw new ConflictException("Maintenance request is already resolved");
        }

        mt.setStatus(MaintenanceStatus.RESOLVED);
        mt.setCompletedAt(LocalDateTime.now());

        // Update asset status back to AVAILABLE
        Asset asset = mt.getAsset();
        asset.setStatus(AssetStatus.AVAILABLE);
        assetRepository.save(asset);

        Maintenance saved = maintenanceRepository.save(mt);
        return EntityMapper.toMaintenanceDto(saved);
    }

    @Transactional(readOnly = true)
    public List<MaintenanceDto> getRequestsByStatus(MaintenanceStatus status) {
        return maintenanceRepository.findByStatus(status).stream()
                .map(EntityMapper::toMaintenanceDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<MaintenanceDto> getAllRequests() {
        return maintenanceRepository.findAll().stream()
                .map(EntityMapper::toMaintenanceDto)
                .collect(Collectors.toList());
    }
}
