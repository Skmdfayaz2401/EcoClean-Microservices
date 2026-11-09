package com.ecoclean.bin.repository;

import com.ecoclean.bin.entity.Telemetry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TelemetryRepository extends JpaRepository<Telemetry, Long> {
    List<Telemetry> findByBinIdOrderByTimestampAsc(String binId);
    List<Telemetry> findTop24ByBinIdOrderByTimestampDesc(String binId);
}
