package org.example.backend.repository;

import org.example.backend.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    @Query("SELECT COUNT(b) > 0 FROM Booking b WHERE b.resource.id = :resourceId AND b.status <> 'CANCELLED' AND b.status <> 'REJECTED' AND b.startTime < :endTime AND b.endTime > :startTime")
    boolean existsOverlappingBooking(
        @Param("resourceId") Long resourceId,
        @Param("startTime") LocalDateTime startTime,
        @Param("endTime") LocalDateTime endTime
    );

    @Query("SELECT COUNT(b) > 0 FROM Booking b WHERE b.resource.id = :resourceId AND b.status <> 'CANCELLED' AND b.status <> 'REJECTED' AND b.startTime < :endTime AND b.endTime > :startTime AND b.id <> :excludeBookingId")
    boolean existsOverlappingBookingExcludeSelf(
        @Param("resourceId") Long resourceId,
        @Param("startTime") LocalDateTime startTime,
        @Param("endTime") LocalDateTime endTime,
        @Param("excludeBookingId") Long excludeBookingId
    );

    List<Booking> findByResourceId(Long resourceId);

    @Query("SELECT b FROM Booking b WHERE b.resource.id = :resourceId AND b.startTime >= :start AND b.endTime <= :end")
    List<Booking> findBookingsInPeriod(
        @Param("resourceId") Long resourceId,
        @Param("start") LocalDateTime start,
        @Param("end") LocalDateTime end
    );

    @Query("SELECT COUNT(b) FROM Booking b WHERE b.startTime >= :startOfDay AND b.startTime <= :endOfDay AND b.status <> 'CANCELLED' AND b.status <> 'REJECTED'")
    long countBookingsOnDate(@Param("startOfDay") LocalDateTime startOfDay, @Param("endOfDay") LocalDateTime endOfDay);
}
