package org.example.backend.service;

import lombok.RequiredArgsConstructor;
import org.example.backend.dto.AssetAllocationDto;
import org.example.backend.dto.TransferRequestDto;
import org.example.backend.entity.Asset;
import org.example.backend.entity.AssetAllocation;
import org.example.backend.entity.Department;
import org.example.backend.entity.TransferRequest;
import org.example.backend.entity.User;
import org.example.backend.enums.AssetStatus;
import org.example.backend.enums.TransferStatus;
import org.example.backend.exception.ConflictException;
import org.example.backend.exception.ResourceNotFoundException;
import org.example.backend.mapper.EntityMapper;
import org.example.backend.repository.AssetAllocationRepository;
import org.example.backend.repository.AssetRepository;
import org.example.backend.repository.DepartmentRepository;
import org.example.backend.repository.TransferRequestRepository;
import org.example.backend.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AssetAllocationService {

    private final AssetAllocationRepository assetAllocationRepository;
    private final AssetRepository assetRepository;
    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    private final TransferRequestRepository transferRequestRepository;
    private final NotificationService notificationService;

    @Transactional
    public AssetAllocationDto allocateAsset(AssetAllocationDto.Create request) {
        Asset asset = assetRepository.findById(request.getAssetId())
                .orElseThrow(() -> new ResourceNotFoundException("Asset not found with ID: " + request.getAssetId()));

        if (asset.getStatus() != AssetStatus.AVAILABLE) {
            throw new ConflictException("Asset cannot be allocated. Current status is: " + asset.getStatus());
        }

        User employee = userRepository.findById(request.getEmployeeId())
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with ID: " + request.getEmployeeId()));

        asset.setStatus(AssetStatus.ALLOCATED);
        assetRepository.save(asset);

        AssetAllocation allocation = AssetAllocation.builder()
                .asset(asset)
                .employee(employee)
                .allocatedDate(LocalDateTime.now())
                .expectedReturnDate(request.getExpectedReturnDate())
                .status("ALLOCATED")
                .remarks(request.getRemarks())
                .build();

        AssetAllocation saved = assetAllocationRepository.save(allocation);

        // Generate Notification
        notificationService.createNotification(
                "Asset Allocated",
                "Asset '" + asset.getAssetName() + "' (" + asset.getAssetTag() + ") has been allocated to you.",
                employee
        );

        return EntityMapper.toAssetAllocationDto(saved);
    }

    @Transactional
    public AssetAllocationDto returnAsset(Long id, AssetAllocationDto.Return request) {
        AssetAllocation allocation = assetAllocationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Allocation not found with ID: " + id));

        if (allocation.getReturnedDate() != null) {
            throw new ConflictException("Asset has already been returned for this allocation");
        }

        Asset asset = allocation.getAsset();
        asset.setStatus(AssetStatus.AVAILABLE);
        asset.setCondition(request.getCondition());
        assetRepository.save(asset);

        allocation.setReturnedDate(LocalDateTime.now());
        allocation.setStatus("RETURNED");
        if (request.getRemarks() != null) {
            allocation.setRemarks(request.getRemarks());
        }
        AssetAllocation saved = assetAllocationRepository.save(allocation);

        // Generate Notification
        notificationService.createNotification(
                "Asset Returned",
                "Asset '" + asset.getAssetName() + "' (" + asset.getAssetTag() + ") has been marked as returned.",
                allocation.getEmployee()
        );

        return EntityMapper.toAssetAllocationDto(saved);
    }

    @Transactional
    public TransferRequestDto requestTransfer(Long allocationId, AssetAllocationDto.TransferRequestInput input) {
        AssetAllocation allocation = assetAllocationRepository.findById(allocationId)
                .orElseThrow(() -> new ResourceNotFoundException("Allocation not found with ID: " + allocationId));

        if (allocation.getReturnedDate() != null) {
            throw new ConflictException("Cannot transfer asset from an already completed/returned allocation");
        }

        String requesterEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        User requester = userRepository.findByEmail(requesterEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + requesterEmail));

        Asset asset = allocation.getAsset();
        Department toDept = departmentRepository.findById(input.getToDepartmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Target department not found with ID: " + input.getToDepartmentId()));

        TransferRequest transferRequest = TransferRequest.builder()
                .asset(asset)
                .fromDepartment(asset.getDepartment())
                .toDepartment(toDept)
                .requestedBy(requester)
                .status(TransferStatus.PENDING)
                .remarks(input.getRemarks())
                .build();

        TransferRequest saved = transferRequestRepository.save(transferRequest);
        return EntityMapper.toTransferRequestDto(saved);
    }

    @Transactional(readOnly = true)
    public List<AssetAllocationDto> getOverdueAllocations() {
        return assetAllocationRepository.findOverdueAllocations(LocalDateTime.now()).stream()
                .map(EntityMapper::toAssetAllocationDto)
                .collect(Collectors.toList());
    }
}
