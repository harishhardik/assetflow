package org.example.backend.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.backend.dto.BookingDto;
import org.example.backend.service.BookingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
@Tag(name = "Bookings", description = "Endpoints for scheduling bookable resource reservations and checking calendar availability")
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    @Operation(summary = "Create a booking for a resource (checks for slot overlaps)")
    public ResponseEntity<BookingDto> createBooking(@Valid @RequestBody BookingDto.Create request) {
        return ResponseEntity.ok(bookingService.createBooking(request));
    }

    @GetMapping("/{asset_id}/calendar")
    @Operation(summary = "Get calendar view of all bookings for a given resource/asset ID")
    public ResponseEntity<List<BookingDto>> getCalendar(@PathVariable("asset_id") Long resourceId) {
        return ResponseEntity.ok(bookingService.getBookingsByResourceId(resourceId));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Cancel / Delete a booking")
    public ResponseEntity<Void> cancelBooking(@PathVariable Long id) {
        bookingService.cancelBooking(id);
        return ResponseEntity.noContent().build();
    }
}
