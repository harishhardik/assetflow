package org.example.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import org.example.backend.enums.AuditItemStatus;

import java.time.LocalDateTime;

@Entity
@Table(name = "audit_items", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"audit_cycle_id", "asset_id"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuditItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "audit_cycle_id", nullable = false)
    private AuditCycle auditCycle;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "asset_id", nullable = false)
    private Asset asset;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AuditItemStatus status;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "verified_by_id", nullable = false)
    private User verifiedBy;

    @Column(name = "verification_date", nullable = false)
    private LocalDateTime verificationDate;

    private String remarks;
}
