package org.example.backend.repository;

import org.example.backend.entity.AuditItem;
import org.example.backend.enums.AuditItemStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AuditItemRepository extends JpaRepository<AuditItem, Long> {
    List<AuditItem> findByAuditCycleId(Long auditCycleId);
    Optional<AuditItem> findByAuditCycleIdAndAssetId(Long auditCycleId, Long assetId);
    List<AuditItem> findByAuditCycleIdAndStatusNot(Long auditCycleId, AuditItemStatus status);
}
