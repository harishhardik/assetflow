package org.example.backend.service;

import lombok.RequiredArgsConstructor;
import org.example.backend.dto.AssetDto;
import org.example.backend.entity.Asset;
import org.example.backend.entity.AssetAllocation;
import org.example.backend.entity.Category;
import org.example.backend.entity.Department;
import org.example.backend.entity.Maintenance;
import org.example.backend.entity.TransferRequest;
import org.example.backend.enums.AssetCondition;
import org.example.backend.enums.AssetStatus;
import org.example.backend.exception.ConflictException;
import org.example.backend.exception.ResourceNotFoundException;
import org.example.backend.mapper.EntityMapper;
import org.example.backend.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AssetService {

    private final AssetRepository assetRepository;
    private final DepartmentRepository departmentRepository;
    private final CategoryRepository categoryRepository;
    private final AssetAllocationRepository assetAllocationRepository;
    private final TransferRequestRepository transferRequestRepository;
    private final MaintenanceRepository maintenanceRepository;

    @Transactional(readOnly = true)
    public List<AssetDto> searchAssets(String search, String category, String department, AssetStatus status, String location) {
        return assetRepository.searchAssets(search, category, department, status, location).stream()
                .map(EntityMapper::toAssetDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public AssetDto getAssetById(Long id) {
        Asset asset = assetRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Asset not found with ID: " + id));
        return EntityMapper.toAssetDto(asset);
    }

    @Transactional(readOnly = true)
    public AssetDto.DetailWithHistory getAssetDetailWithHistory(Long id) {
        Asset asset = assetRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Asset not found with ID: " + id));

        List<AssetAllocation> allocations = assetAllocationRepository.findByAssetIdOrderByAllocatedDateDesc(id);
        List<TransferRequest> transfers = transferRequestRepository.findByAssetIdOrderByCreatedAtDesc(id);
        List<Maintenance> maintenanceLogs = maintenanceRepository.findByAssetIdOrderByCreatedAtDesc(id);

        return AssetDto.DetailWithHistory.builder()
                .asset(EntityMapper.toAssetDto(asset))
                .allocations(allocations.stream().map(EntityMapper::toAllocationHistory).collect(Collectors.toList()))
                .transfers(transfers.stream().map(EntityMapper::toTransferHistory).collect(Collectors.toList()))
                .maintenanceLogs(maintenanceLogs.stream().map(EntityMapper::toMaintenanceHistory).collect(Collectors.toList()))
                .build();
    }

    @Transactional
    public AssetDto createAsset(AssetDto.Create dto) {
        if (assetRepository.existsByAssetTag(dto.getAssetTag())) {
            throw new ConflictException("Asset tag already exists: " + dto.getAssetTag());
        }
        if (assetRepository.existsBySerialNumber(dto.getSerialNumber())) {
            throw new ConflictException("Serial number already exists: " + dto.getSerialNumber());
        }

        Department dept = departmentRepository.findById(dto.getDepartmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with ID: " + dto.getDepartmentId()));

        Category cat = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + dto.getCategoryId()));

        AssetStatus status = dto.getStatus() != null ? dto.getStatus() : AssetStatus.AVAILABLE;
        AssetCondition condition = dto.getCondition() != null ? dto.getCondition() : AssetCondition.GOOD;

        Asset asset = Asset.builder()
                .assetTag(dto.getAssetTag())
                .assetName(dto.getAssetName())
                .serialNumber(dto.getSerialNumber())
                .description(dto.getDescription())
                .purchaseDate(dto.getPurchaseDate())
                .purchasePrice(dto.getPurchasePrice())
                .vendor(dto.getVendor())
                .location(dto.getLocation())
                .status(status)
                .condition(condition)
                .department(dept)
                .category(cat)
                .build();

        Asset saved = assetRepository.save(asset);
        return EntityMapper.toAssetDto(saved);
    }

    @Transactional
    public AssetDto updateAsset(Long id, AssetDto.Create dto) {
        Asset asset = assetRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Asset not found with ID: " + id));

        assetRepository.findByAssetTag(dto.getAssetTag()).ifPresent(existing -> {
            if (!existing.getId().equals(id)) {
                throw new ConflictException("Asset tag already exists: " + dto.getAssetTag());
            }
        });

        assetRepository.findBySerialNumber(dto.getSerialNumber()).ifPresent(existing -> {
            if (!existing.getId().equals(id)) {
                throw new ConflictException("Serial number already exists: " + dto.getSerialNumber());
            }
        });

        Department dept = departmentRepository.findById(dto.getDepartmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with ID: " + dto.getDepartmentId()));

        Category cat = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + dto.getCategoryId()));

        asset.setAssetTag(dto.getAssetTag());
        asset.setAssetName(dto.getAssetName());
        asset.setSerialNumber(dto.getSerialNumber());
        asset.setDescription(dto.getDescription());
        asset.setPurchaseDate(dto.getPurchaseDate());
        asset.setPurchasePrice(dto.getPurchasePrice());
        asset.setVendor(dto.getVendor());
        asset.setLocation(dto.getLocation());
        if (dto.getStatus() != null) asset.setStatus(dto.getStatus());
        if (dto.getCondition() != null) asset.setCondition(dto.getCondition());
        asset.setDepartment(dept);
        asset.setCategory(cat);

        Asset saved = assetRepository.save(asset);
        return EntityMapper.toAssetDto(saved);
    }

    @Transactional
    public AssetDto updateAssetStatus(Long id, AssetStatus status) {
        Asset asset = assetRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Asset not found with ID: " + id));
        asset.setStatus(status);
        Asset saved = assetRepository.save(asset);
        return EntityMapper.toAssetDto(saved);
    }

    @Transactional
    public void deleteAsset(Long id) {
        if (!assetRepository.existsById(id)) {
            throw new ResourceNotFoundException("Asset not found with ID: " + id);
        }
        assetRepository.deleteById(id);
    }
}
