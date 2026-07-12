package org.example.backend.controller;

import lombok.RequiredArgsConstructor;
import org.example.backend.dto.ActivityLogDto;
import org.example.backend.mapper.EntityMapper;
import org.example.backend.service.ActivityLogService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/activity-logs")
@RequiredArgsConstructor
public class ActivityLogController {

    private final ActivityLogService activityLogService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'ASSET_MANAGER')")
    public ResponseEntity<List<ActivityLogDto>> getAllLogs() {
        List<ActivityLogDto> logs = activityLogService.getAllLogs().stream()
                .map(EntityMapper::toActivityLogDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(logs);
    }
}
