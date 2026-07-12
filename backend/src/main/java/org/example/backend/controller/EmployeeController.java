package org.example.backend.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.backend.dto.AuthDto;
import org.example.backend.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/employees")
@RequiredArgsConstructor
@Tag(name = "Employees / Admin", description = "Endpoints for administrator actions regarding employees")
public class EmployeeController {

    private final UserService userService;

    @PostMapping("/{id}/promote")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Promote an employee to a higher role like MANAGER, DEPARTMENT_HEAD, or ADMIN (Admin only)")
    public ResponseEntity<AuthDto.UserDto> promoteEmployee(
            @PathVariable Long id,
            @Valid @RequestBody AuthDto.UserPromoteDto request
    ) {
        return ResponseEntity.ok(userService.promoteEmployee(id, request.getRole()));
    }
}
