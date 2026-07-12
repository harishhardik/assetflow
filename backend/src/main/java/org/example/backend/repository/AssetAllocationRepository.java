package org.example.backend.repository;

import org.example.backend.entity.AssetAllocation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface AssetAllocationRepository extends JpaRepository<AssetAllocation, Long> {

    @Query("SELECT aa FROM AssetAllocation aa WHERE aa.asset.id = :assetId AND aa.returnedDate IS NULL")
    Optional<AssetAllocation> findActiveAllocationByAssetId(@Param("assetId") Long assetId);

    @Query("SELECT aa FROM AssetAllocation aa WHERE aa.returnedDate IS NULL AND aa.expectedReturnDate < :now")
    List<AssetAllocation> findOverdueAllocations(@Param("now") LocalDateTime now);

    List<AssetAllocation> findByAssetIdOrderByAllocatedDateDesc(Long assetId);
}
