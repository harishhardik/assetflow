package org.example.backend.repository;

import org.example.backend.entity.AuditCycle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AuditCycleRepository extends JpaRepository<AuditCycle, Long> {
}
