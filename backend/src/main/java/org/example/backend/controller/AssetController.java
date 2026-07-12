package org.example.backend.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.backend.dto.AssetDto;
import org.example.backend.enums.AssetStatus;
import org.example.backend.service.AssetService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/assets")
@RequiredArgsConstructor
@Tag(name = "Assets", description = "Endpoints for asset cataloging, status updates, and lifecycle details")
public class AssetController {

    private final AssetService assetService;

    @GetMapping
    @Operation(summary = "Search/Filter assets by keyword, tag, category, status, department, and location")
    public ResponseEntity<List<AssetDto>> searchAssets(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String department,
            @RequestParam(required = false) AssetStatus status,
            @RequestParam(required = false) String location
    ) {
        return ResponseEntity.ok(assetService.searchAssets(search, category, department, status, location));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get detailed asset information along with its allocation, transfer, and maintenance histories")
    public ResponseEntity<AssetDto.DetailWithHistory> getAssetDetail(@PathVariable Long id) {
        return ResponseEntity.ok(assetService.getAssetDetailWithHistory(id));
    }

    @PostMapping
    @Operation(summary = "Register a new asset in the system")
    public ResponseEntity<AssetDto> createAsset(@Valid @RequestBody AssetDto.Create request) {
        return ResponseEntity.ok(assetService.createAsset(request));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update asset details")
    public ResponseEntity<AssetDto> updateAsset(@PathVariable Long id, @Valid @RequestBody AssetDto.Create request) {
        return ResponseEntity.ok(assetService.updateAsset(id, request));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'ASSET_MANAGER')")
    @Operation(summary = "Update the status of an asset (Admin/Manager only)")
    public ResponseEntity<AssetDto> updateAssetStatus(
            @PathVariable Long id,
            @Valid @RequestBody AssetDto.UpdateStatus request
    ) {
        return ResponseEntity.ok(assetService.updateAssetStatus(id, request.getStatus()));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete an asset (Admin only)")
    public ResponseEntity<Void> deleteAsset(@PathVariable Long id) {
        assetService.deleteAsset(id);
        return ResponseEntity.noContent().build();
    }
}
