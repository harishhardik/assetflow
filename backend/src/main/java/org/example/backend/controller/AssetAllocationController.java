package org.example.backend.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.backend.dto.AssetAllocationDto;
import org.example.backend.dto.TransferRequestDto;
import org.example.backend.service.AssetAllocationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/allocations")
@RequiredArgsConstructor
@Tag(name = "Asset Allocations", description = "Endpoints for allocating assets, processing returns, and requesting transfers")
public class AssetAllocationController {

    private final AssetAllocationService assetAllocationService;

    @PostMapping
    @Operation(summary = "Allocate an asset to an employee")
    public ResponseEntity<AssetAllocationDto> allocateAsset(@Valid @RequestBody AssetAllocationDto.Create request) {
        return ResponseEntity.ok(assetAllocationService.allocateAsset(request));
    }

    @PostMapping("/{id}/return")
    @Operation(summary = "Mark an allocated asset as returned, capturing its condition")
    public ResponseEntity<AssetAllocationDto> returnAsset(
            @PathVariable Long id,
            @Valid @RequestBody AssetAllocationDto.Return request
    ) {
        return ResponseEntity.ok(assetAllocationService.returnAsset(id, request));
    }

    @PostMapping("/{id}/transfer")
    @Operation(summary = "Request department transfer for the allocated asset (checks conflicts)")
    public ResponseEntity<TransferRequestDto> requestTransfer(
            @PathVariable Long id,
            @Valid @RequestBody AssetAllocationDto.TransferRequestInput request
    ) {
        return ResponseEntity.ok(assetAllocationService.requestTransfer(id, request));
    }

    @GetMapping
    @Operation(summary = "List overdue allocations (allocations where expected return date is passed)")
    public ResponseEntity<List<AssetAllocationDto>> getOverdueAllocations(
            @RequestParam(name = "status", required = false) String status
    ) {
        // If status is passed as overdue, filter accordingly. Defaulting to overdue list.
        return ResponseEntity.ok(assetAllocationService.getOverdueAllocations());
    }
}
