package org.example.backend.repository;

import org.example.backend.entity.Asset;
import org.example.backend.enums.AssetStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AssetRepository extends JpaRepository<Asset, Long> {
    Optional<Asset> findByAssetTag(String assetTag);
    Optional<Asset> findBySerialNumber(String serialNumber);
    boolean existsByAssetTag(String assetTag);
    boolean existsBySerialNumber(String serialNumber);

    @Query("SELECT a FROM Asset a WHERE " +
           "(:search IS NULL OR LOWER(a.assetName) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(a.assetTag) LIKE LOWER(CONCAT('%', :search, '%'))) AND " +
           "(:categoryName IS NULL OR LOWER(a.category.name) = LOWER(:categoryName)) AND " +
           "(:departmentName IS NULL OR LOWER(a.department.name) = LOWER(:departmentName)) AND " +
           "(:status IS NULL OR a.status = :status) AND " +
           "(:location IS NULL OR LOWER(a.location) LIKE LOWER(CONCAT('%', :location, '%')))")
    List<Asset> searchAssets(
        @Param("search") String search,
        @Param("categoryName") String categoryName,
        @Param("departmentName") String departmentName,
        @Param("status") AssetStatus status,
        @Param("location") String location
    );

    long countByStatus(AssetStatus status);
}
