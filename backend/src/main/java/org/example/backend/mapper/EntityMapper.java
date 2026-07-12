package org.example.backend.mapper;

import org.example.backend.dto.*;
import org.example.backend.entity.*;

public class EntityMapper {

    public static DepartmentDto toDepartmentDto(Department dept) {
        if (dept == null) return null;
        return DepartmentDto.builder()
                .id(dept.getId())
                .name(dept.getName())
                .description(dept.getDescription())
                .status(dept.getStatus())
                .createdAt(dept.getCreatedAt())
                .build();
    }

    public static Department toDepartment(DepartmentDto dto) {
        if (dto == null) return null;
        return Department.builder()
                .id(dto.getId())
                .name(dto.getName())
                .description(dto.getDescription())
                .status(dto.getStatus())
                .build();
    }

    public static CategoryDto toCategoryDto(Category cat) {
        if (cat == null) return null;
        return CategoryDto.builder()
                .id(cat.getId())
                .name(cat.getName())
                .description(cat.getDescription())
                .build();
    }

    public static Category toCategory(CategoryDto dto) {
        if (dto == null) return null;
        return Category.builder()
                .id(dto.getId())
                .name(dto.getName())
                .description(dto.getDescription())
                .build();
    }

    public static AuthDto.UserDto toUserDto(User user) {
        if (user == null) return null;
        return AuthDto.UserDto.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .department(toDepartmentDto(user.getDepartment()))
                .role(user.getRole())
                .active(user.isActive())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }

    public static AssetDto toAssetDto(Asset asset) {
        if (asset == null) return null;
        return AssetDto.builder()
                .id(asset.getId())
                .assetTag(asset.getAssetTag())
                .assetName(asset.getAssetName())
                .serialNumber(asset.getSerialNumber())
                .description(asset.getDescription())
                .purchaseDate(asset.getPurchaseDate())
                .purchasePrice(asset.getPurchasePrice())
                .vendor(asset.getVendor())
                .location(asset.getLocation())
                .status(asset.getStatus())
                .condition(asset.getCondition())
                .department(toDepartmentDto(asset.getDepartment()))
                .category(toCategoryDto(asset.getCategory()))
                .createdAt(asset.getCreatedAt())
                .updatedAt(asset.getUpdatedAt())
                .build();
    }

    public static AssetAllocationDto toAssetAllocationDto(AssetAllocation aa) {
        if (aa == null) return null;
        return AssetAllocationDto.builder()
                .id(aa.getId())
                .asset(toAssetDto(aa.getAsset()))
                .employee(toUserDto(aa.getEmployee()))
                .allocatedDate(aa.getAllocatedDate())
                .expectedReturnDate(aa.getExpectedReturnDate())
                .returnedDate(aa.getReturnedDate())
                .status(aa.getStatus())
                .remarks(aa.getRemarks())
                .build();
    }

    public static TransferRequestDto toTransferRequestDto(TransferRequest tr) {
        if (tr == null) return null;
        return TransferRequestDto.builder()
                .id(tr.getId())
                .asset(toAssetDto(tr.getAsset()))
                .fromDepartment(toDepartmentDto(tr.getFromDepartment()))
                .toDepartment(toDepartmentDto(tr.getToDepartment()))
                .requestedBy(toUserDto(tr.getRequestedBy()))
                .approvedBy(toUserDto(tr.getApprovedBy()))
                .status(tr.getStatus())
                .remarks(tr.getRemarks())
                .createdAt(tr.getCreatedAt())
                .build();
    }

    public static ResourceDto toResourceDto(Resource res) {
        if (res == null) return null;
        return ResourceDto.builder()
                .id(res.getId())
                .name(res.getName())
                .type(res.getType())
                .capacity(res.getCapacity())
                .location(res.getLocation())
                .status(res.getStatus())
                .build();
    }

    public static Resource toResource(ResourceDto dto) {
        if (dto == null) return null;
        return Resource.builder()
                .id(dto.getId())
                .name(dto.getName())
                .type(dto.getType())
                .capacity(dto.getCapacity())
                .location(dto.getLocation())
                .status(dto.getStatus())
                .build();
    }

    public static BookingDto toBookingDto(Booking bk) {
        if (bk == null) return null;
        return BookingDto.builder()
                .id(bk.getId())
                .resource(toResourceDto(bk.getResource()))
                .employee(toUserDto(bk.getEmployee()))
                .startTime(bk.getStartTime())
                .endTime(bk.getEndTime())
                .purpose(bk.getPurpose())
                .status(bk.getStatus())
                .build();
    }

    public static MaintenanceDto toMaintenanceDto(Maintenance mt) {
        if (mt == null) return null;
        return MaintenanceDto.builder()
                .id(mt.getId())
                .asset(toAssetDto(mt.getAsset()))
                .issue(mt.getIssue())
                .description(mt.getDescription())
                .priority(mt.getPriority())
                .status(mt.getStatus())
                .reportedBy(toUserDto(mt.getReportedBy()))
                .assignedTo(toUserDto(mt.getAssignedTo()))
                .createdAt(mt.getCreatedAt())
                .completedAt(mt.getCompletedAt())
                .build();
    }

    public static NotificationDto toNotificationDto(Notification nt) {
        if (nt == null) return null;
        return NotificationDto.builder()
                .id(nt.getId())
                .title(nt.getTitle())
                .message(nt.getMessage())
                .userId(nt.getUser() != null ? nt.getUser().getId() : null)
                .isRead(nt.isRead())
                .createdAt(nt.getCreatedAt())
                .build();
    }

    public static AuditCycleDto toAuditCycleDto(AuditCycle ac) {
        if (ac == null) return null;
        return AuditCycleDto.builder()
                .id(ac.getId())
                .name(ac.getName())
                .startDate(ac.getStartDate())
                .endDate(ac.getEndDate())
                .status(ac.getStatus())
                .createdBy(toUserDto(ac.getCreatedBy()))
                .createdAt(ac.getCreatedAt())
                .build();
    }

    public static AuditCycleDto.Item toAuditItemDto(AuditItem ai) {
        if (ai == null) return null;
        return AuditCycleDto.Item.builder()
                .id(ai.getId())
                .auditCycleId(ai.getAuditCycle().getId())
                .asset(toAssetDto(ai.getAsset()))
                .status(ai.getStatus())
                .verifiedBy(toUserDto(ai.getVerifiedBy()))
                .verificationDate(ai.getVerificationDate())
                .remarks(ai.getRemarks())
                .build();
    }

    // Mapping history
    public static AssetDto.AllocationHistory toAllocationHistory(AssetAllocation aa) {
        if (aa == null) return null;
        return AssetDto.AllocationHistory.builder()
                .id(aa.getId())
                .employeeId(aa.getEmployee().getId())
                .employeeName(aa.getEmployee().getFullName())
                .employeeEmail(aa.getEmployee().getEmail())
                .allocatedDate(aa.getAllocatedDate())
                .expectedReturnDate(aa.getExpectedReturnDate())
                .returnedDate(aa.getReturnedDate())
                .status(aa.getStatus())
                .remarks(aa.getRemarks())
                .build();
    }

    public static AssetDto.TransferHistory toTransferHistory(TransferRequest tr) {
        if (tr == null) return null;
        return AssetDto.TransferHistory.builder()
                .id(tr.getId())
                .fromDepartmentName(tr.getFromDepartment().getName())
                .toDepartmentName(tr.getToDepartment().getName())
                .requestedByName(tr.getRequestedBy().getFullName())
                .approvedByName(tr.getApprovedBy() != null ? tr.getApprovedBy().getFullName() : null)
                .status(tr.getStatus().name())
                .remarks(tr.getRemarks())
                .createdAt(tr.getCreatedAt())
                .build();
    }

    public static AssetDto.MaintenanceHistory toMaintenanceHistory(Maintenance mt) {
        if (mt == null) return null;
        return AssetDto.MaintenanceHistory.builder()
                .id(mt.getId())
                .issue(mt.getIssue())
                .description(mt.getDescription())
                .priority(mt.getPriority())
                .status(mt.getStatus().name())
                .reportedByName(mt.getReportedBy().getFullName())
                .assignedToName(mt.getAssignedTo() != null ? mt.getAssignedTo().getFullName() : null)
                .createdAt(mt.getCreatedAt())
                .completedAt(mt.getCompletedAt())
                .build();
    }
}
