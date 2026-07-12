package org.example.backend.repository;

import org.example.backend.entity.TransferRequest;
import org.example.backend.enums.TransferStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransferRequestRepository extends JpaRepository<TransferRequest, Long> {
    List<TransferRequest> findByAssetIdOrderByCreatedAtDesc(Long assetId);
    long countByStatus(TransferStatus status);
}
