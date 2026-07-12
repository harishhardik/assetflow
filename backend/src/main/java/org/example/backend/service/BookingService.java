package org.example.backend.service;

import lombok.RequiredArgsConstructor;
import org.example.backend.dto.BookingDto;
import org.example.backend.entity.Booking;
import org.example.backend.entity.Resource;
import org.example.backend.entity.User;
import org.example.backend.enums.BookingStatus;
import org.example.backend.exception.ConflictException;
import org.example.backend.exception.ResourceNotFoundException;
import org.example.backend.mapper.EntityMapper;
import org.example.backend.repository.BookingRepository;
import org.example.backend.repository.ResourceRepository;
import org.example.backend.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final ResourceRepository resourceRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    @Transactional
    public BookingDto createBooking(BookingDto.Create request) {
        Resource resource = resourceRepository.findById(request.getResourceId())
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found with ID: " + request.getResourceId()));

        if (request.getStartTime().isAfter(request.getEndTime()) || request.getStartTime().isEqual(request.getEndTime())) {
            throw new ConflictException("Start time must be before end time");
        }

        // Validate overlap
        boolean hasOverlap = bookingRepository.existsOverlappingBooking(
                request.getResourceId(),
                request.getStartTime(),
                request.getEndTime()
        );

        if (hasOverlap) {
            throw new ConflictException("Booking failed: Selected time slot overlaps with an existing booking for resource '" + resource.getName() + "'");
        }

        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User employee = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with email: " + email));

        Booking booking = Booking.builder()
                .resource(resource)
                .employee(employee)
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .purpose(request.getPurpose())
                .status(BookingStatus.APPROVED) // Auto approved if no overlap
                .build();

        Booking saved = bookingRepository.save(booking);

        // Generate Notification
        notificationService.createNotification(
                "Booking Approved",
                "Your booking for '" + resource.getName() + "' from " + booking.getStartTime() + " to " + booking.getEndTime() + " has been approved.",
                employee
        );

        return EntityMapper.toBookingDto(saved);
    }

    @Transactional(readOnly = true)
    public List<BookingDto> getBookingsByResourceId(Long resourceId) {
        return bookingRepository.findByResourceId(resourceId).stream()
                .map(EntityMapper::toBookingDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public void cancelBooking(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with ID: " + id));
        bookingRepository.delete(booking);
    }
}
