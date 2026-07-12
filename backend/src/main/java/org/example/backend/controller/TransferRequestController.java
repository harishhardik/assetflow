package org.example.backend.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.backend.dto.TransferRequestDto;
import org.example.backend.service.TransferRequestService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transfers")
@RequiredArgsConstructor
@Tag(name = "Transfer Requests", description = "Endpoints for department asset transfer requests CRUD, approve, and reject")
public class TransferRequestController {

    private final TransferRequestService transferRequestService;

    @GetMapping
    @Operation(summary = "Get list of all asset transfer requests")
    public ResponseEntity<List<TransferRequestDto>> getAllTransfers() {
        return ResponseEntity.ok(transferRequestService.getAllTransfers());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get transfer request by its ID")
    public ResponseEntity<TransferRequestDto> getTransferById(@PathVariable Long id) {
        return ResponseEntity.ok(transferRequestService.getTransferById(id));
    }

    @PostMapping
    @Operation(summary = "Create a new department asset transfer request")
    public ResponseEntity<TransferRequestDto> createTransferRequest(@Valid @RequestBody TransferRequestDto.Create request) {
        return ResponseEntity.ok(transferRequestService.createTransferRequest(request));
    }

    @PutMapping("/{id}/approve")
    @PreAuthorize("hasAnyRole('ADMIN', 'ASSET_MANAGER', 'DEPARTMENT_HEAD')")
    @Operation(summary = "Approve an asset transfer request (Admin/Manager/Head only)")
    public ResponseEntity<TransferRequestDto> approveTransfer(@PathVariable Long id) {
        return ResponseEntity.ok(transferRequestService.approveTransfer(id));
    }

    @PutMapping("/{id}/reject")
    @PreAuthorize("hasAnyRole('ADMIN', 'ASSET_MANAGER', 'DEPARTMENT_HEAD')")
    @Operation(summary = "Reject an asset transfer request (Admin/Manager/Head only)")
    public ResponseEntity<TransferRequestDto> rejectTransfer(
            @PathVariable Long id,
            @RequestParam(required = false) String remarks
    ) {
        return ResponseEntity.ok(transferRequestService.rejectTransfer(id, remarks));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete/Cancel a pending transfer request")
    public ResponseEntity<Void> deleteTransfer(@PathVariable Long id) {
        transferRequestService.deleteTransferRequest(id);
        return ResponseEntity.noContent().build();
    }
}
