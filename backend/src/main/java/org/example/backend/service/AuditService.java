package org.example.backend.service;

import lombok.RequiredArgsConstructor;
import org.example.backend.dto.AuditCycleDto;
import org.example.backend.entity.Asset;
import org.example.backend.entity.AuditCycle;
import org.example.backend.entity.AuditItem;
import org.example.backend.entity.Department;
import org.example.backend.entity.User;
import org.example.backend.enums.AssetCondition;
import org.example.backend.enums.AuditItemStatus;
import org.example.backend.enums.AssetStatus;
import org.example.backend.exception.ConflictException;
import org.example.backend.exception.ResourceNotFoundException;
import org.example.backend.mapper.EntityMapper;
import org.example.backend.repository.AssetRepository;
import org.example.backend.repository.AuditCycleRepository;
import org.example.backend.repository.AuditItemRepository;
import org.example.backend.repository.DepartmentRepository;
import org.example.backend.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuditService {

    private final AuditCycleRepository auditCycleRepository;
    private final AuditItemRepository auditItemRepository;
    private final AssetRepository assetRepository;
    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    private final ActivityLogService activityLogService;

    @Transactional
    public AuditCycleDto createCycle(AuditCycleDto.Create dto) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

        Department dept = null;
        if (dto.getDepartmentId() != null) {
            dept = departmentRepository.findById(dto.getDepartmentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Department not found with ID: " + dto.getDepartmentId()));
        }

        AuditCycle cycle = AuditCycle.builder()
                .name(dto.getName())
                .startDate(dto.getStartDate() != null ? dto.getStartDate() : LocalDate.now())
                .endDate(dto.getEndDate())
                .status("ACTIVE")
                .department(dept)
                .location(dto.getLocation())
                .createdBy(user)
                .build();

        AuditCycle saved = auditCycleRepository.save(cycle);
        activityLogService.log("Audit Cycle Created", "Created audit cycle: " + saved.getName());
        return EntityMapper.toAuditCycleDto(saved);
    }

    @Transactional
    public AuditCycleDto.Item markAsset(Long cycleId, AuditCycleDto.MarkItem dto) {
        AuditCycle cycle = auditCycleRepository.findById(cycleId)
                .orElseThrow(() -> new ResourceNotFoundException("Audit cycle not found with ID: " + cycleId));

        if ("CLOSED".equals(cycle.getStatus())) {
            throw new ConflictException("Cannot mark items in a closed audit cycle");
        }

        Asset asset = assetRepository.findById(dto.getAssetId())
                .orElseThrow(() -> new ResourceNotFoundException("Asset not found with ID: " + dto.getAssetId()));

        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User verifier = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

        // If marked DAMAGED, update asset condition
        if (dto.getStatus() == AuditItemStatus.DAMAGED) {
            asset.setCondition(AssetCondition.DAMAGED);
            assetRepository.save(asset);
        }

        // Check if item already checked in this cycle
        AuditItem item = auditItemRepository.findByAuditCycleIdAndAssetId(cycleId, dto.getAssetId())
                .orElse(null);

        if (item == null) {
            item = AuditItem.builder()
                    .auditCycle(cycle)
                    .asset(asset)
                    .status(dto.getStatus())
                    .verifiedBy(verifier)
                    .verificationDate(LocalDateTime.now())
                    .remarks(dto.getRemarks())
                    .build();
        } else {
            item.setStatus(dto.getStatus());
            item.setVerifiedBy(verifier);
            item.setVerificationDate(LocalDateTime.now());
            item.setRemarks(dto.getRemarks());
        }

        AuditItem saved = auditItemRepository.save(item);
        activityLogService.log("Asset Audited", "Audited asset " + asset.getAssetTag() + " in cycle " + cycle.getName() + " as " + dto.getStatus());
        return EntityMapper.toAuditItemDto(saved);
    }

    @Transactional
    public AuditCycleDto closeCycle(Long cycleId) {
        AuditCycle cycle = auditCycleRepository.findById(cycleId)
                .orElseThrow(() -> new ResourceNotFoundException("Audit cycle not found with ID: " + cycleId));

        if ("CLOSED".equals(cycle.getStatus())) {
            throw new ConflictException("Audit cycle is already closed");
        }

        cycle.setStatus("CLOSED");
        if (cycle.getEndDate() == null) {
            cycle.setEndDate(LocalDate.now());
        }

        // Process audit items and update asset statuses (e.g. LOST for missing, RETIRED/DAMAGED for damaged)
        List<AuditItem> items = auditItemRepository.findByAuditCycleId(cycleId);
        for (AuditItem item : items) {
            Asset asset = item.getAsset();
            if (item.getStatus() == AuditItemStatus.MISSING) {
                asset.setStatus(AssetStatus.LOST);
                assetRepository.save(asset);
            } else if (item.getStatus() == AuditItemStatus.DAMAGED) {
                asset.setCondition(AssetCondition.DAMAGED);
                asset.setStatus(AssetStatus.RETIRED);
                assetRepository.save(asset);
            }
        }

        AuditCycle saved = auditCycleRepository.save(cycle);
        activityLogService.log("Audit Cycle Closed", "Closed audit cycle: " + cycle.getName());
        return EntityMapper.toAuditCycleDto(saved);
    }

    @Transactional(readOnly = true)
    public AuditCycleDto.Report generateReport(Long cycleId) {
        AuditCycle cycle = auditCycleRepository.findById(cycleId)
                .orElseThrow(() -> new ResourceNotFoundException("Audit cycle not found with ID: " + cycleId));

        List<AuditItem> allItems = auditItemRepository.findByAuditCycleId(cycleId);
        List<AuditItem> discrepancies = auditItemRepository.findByAuditCycleIdAndStatusNot(cycleId, AuditItemStatus.VERIFIED);

        long totalChecked = allItems.size();
        long totalVerified = allItems.stream().filter(i -> i.getStatus() == AuditItemStatus.VERIFIED).count();
        long totalMissing = allItems.stream().filter(i -> i.getStatus() == AuditItemStatus.MISSING).count();
        long totalDamaged = allItems.stream().filter(i -> i.getStatus() == AuditItemStatus.DAMAGED).count();

        return AuditCycleDto.Report.builder()
                .auditCycle(EntityMapper.toAuditCycleDto(cycle))
                .discrepancies(discrepancies.stream().map(EntityMapper::toAuditItemDto).collect(Collectors.toList()))
                .totalChecked(totalChecked)
                .totalVerified(totalVerified)
                .totalMissing(totalMissing)
                .totalDamaged(totalDamaged)
                .build();
    }
}
