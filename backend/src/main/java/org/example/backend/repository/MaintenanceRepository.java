package org.example.backend.repository;

import org.example.backend.entity.Maintenance;
import org.example.backend.enums.MaintenanceStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;

@Repository
public interface MaintenanceRepository extends JpaRepository<Maintenance, Long> {
    List<Maintenance> findByStatus(MaintenanceStatus status);
    List<Maintenance> findByAssetIdOrderByCreatedAtDesc(Long assetId);
    long countByStatusIn(Collection<MaintenanceStatus> statuses);
    long countByStatus(MaintenanceStatus status);
}
