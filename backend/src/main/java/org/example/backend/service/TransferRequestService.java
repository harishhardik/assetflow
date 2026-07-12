package org.example.backend.service;

import lombok.RequiredArgsConstructor;
import org.example.backend.dto.TransferRequestDto;
import org.example.backend.entity.Asset;
import org.example.backend.entity.Department;
import org.example.backend.entity.TransferRequest;
import org.example.backend.entity.User;
import org.example.backend.enums.TransferStatus;
import org.example.backend.exception.ConflictException;
import org.example.backend.exception.ResourceNotFoundException;
import org.example.backend.mapper.EntityMapper;
import org.example.backend.repository.AssetRepository;
import org.example.backend.repository.DepartmentRepository;
import org.example.backend.repository.TransferRequestRepository;
import org.example.backend.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TransferRequestService {

    private final TransferRequestRepository transferRequestRepository;
    private final AssetRepository assetRepository;
    private final DepartmentRepository departmentRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    @Transactional(readOnly = true)
    public List<TransferRequestDto> getAllTransfers() {
        return transferRequestRepository.findAll().stream()
                .map(EntityMapper::toTransferRequestDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public TransferRequestDto getTransferById(Long id) {
        TransferRequest tr = transferRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Transfer request not found with ID: " + id));
        return EntityMapper.toTransferRequestDto(tr);
    }

    @Transactional
    public TransferRequestDto createTransferRequest(TransferRequestDto.Create dto) {
        Asset asset = assetRepository.findById(dto.getAssetId())
                .orElseThrow(() -> new ResourceNotFoundException("Asset not found with ID: " + dto.getAssetId()));

        Department toDept = departmentRepository.findById(dto.getToDepartmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Target department not found with ID: " + dto.getToDepartmentId()));

        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User requester = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

        TransferRequest tr = TransferRequest.builder()
                .asset(asset)
                .fromDepartment(asset.getDepartment())
                .toDepartment(toDept)
                .requestedBy(requester)
                .status(TransferStatus.PENDING)
                .remarks(dto.getRemarks())
                .build();

        TransferRequest saved = transferRequestRepository.save(tr);
        return EntityMapper.toTransferRequestDto(saved);
    }

    @Transactional
    public TransferRequestDto approveTransfer(Long id) {
        TransferRequest tr = transferRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Transfer request not found with ID: " + id));

        if (tr.getStatus() != TransferStatus.PENDING) {
            throw new ConflictException("Transfer request is already resolved: " + tr.getStatus());
        }

        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User approver = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

        Asset asset = tr.getAsset();
        asset.setDepartment(tr.getToDepartment());
        assetRepository.save(asset);

        tr.setStatus(TransferStatus.APPROVED);
        tr.setApprovedBy(approver);
        TransferRequest saved = transferRequestRepository.save(tr);

        // Notify requester
        notificationService.createNotification(
                "Transfer Approved",
                "Your request to transfer '" + asset.getAssetName() + "' to " + tr.getToDepartment().getName() + " department has been approved.",
                tr.getRequestedBy()
        );

        return EntityMapper.toTransferRequestDto(saved);
    }

    @Transactional
    public TransferRequestDto rejectTransfer(Long id, String remarks) {
        TransferRequest tr = transferRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Transfer request not found with ID: " + id));

        if (tr.getStatus() != TransferStatus.PENDING) {
            throw new ConflictException("Transfer request is already resolved: " + tr.getStatus());
        }

        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User approver = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

        tr.setStatus(TransferStatus.REJECTED);
        tr.setApprovedBy(approver);
        if (remarks != null) {
            tr.setRemarks(tr.getRemarks() != null ? tr.getRemarks() + " | Rejection: " + remarks : "Rejection: " + remarks);
        }
        TransferRequest saved = transferRequestRepository.save(tr);

        // Notify requester
        notificationService.createNotification(
                "Transfer Rejected",
                "Your request to transfer '" + tr.getAsset().getAssetName() + "' to " + tr.getToDepartment().getName() + " department has been rejected.",
                tr.getRequestedBy()
        );

        return EntityMapper.toTransferRequestDto(saved);
    }

    @Transactional
    public void deleteTransferRequest(Long id) {
        TransferRequest tr = transferRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Transfer request not found with ID: " + id));
        if (tr.getStatus() == TransferStatus.PENDING) {
            transferRequestRepository.deleteById(id);
        } else {
            throw new ConflictException("Cannot delete transfer requests that are already approved or rejected");
        }
    }
}
