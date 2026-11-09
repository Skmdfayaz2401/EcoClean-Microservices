package com.ecoclean.bin.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "telemetry_records")
public class Telemetry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String binId;

    @Column(nullable = false)
    private Integer fillPercentage;

    private Integer batteryLevel;
    private Integer temperature;

    @Column(nullable = false)
    private LocalDateTime timestamp;

    public Telemetry() {}

    public Telemetry(Long id, String binId, Integer fillPercentage, Integer batteryLevel, Integer temperature, LocalDateTime timestamp) {
        this.id = id;
        this.binId = binId;
        this.fillPercentage = fillPercentage;
        this.batteryLevel = batteryLevel;
        this.temperature = temperature;
        this.timestamp = timestamp;
    }

    public static TelemetryBuilder builder() {
        return new TelemetryBuilder();
    }

    public static class TelemetryBuilder {
        private Long id;
        private String binId;
        private Integer fillPercentage;
        private Integer batteryLevel;
        private Integer temperature;
        private LocalDateTime timestamp;

        public TelemetryBuilder id(Long id) { this.id = id; return this; }
        public TelemetryBuilder binId(String binId) { this.binId = binId; return this; }
        public TelemetryBuilder fillPercentage(Integer fillPercentage) { this.fillPercentage = fillPercentage; return this; }
        public TelemetryBuilder batteryLevel(Integer batteryLevel) { this.batteryLevel = batteryLevel; return this; }
        public TelemetryBuilder temperature(Integer temperature) { this.temperature = temperature; return this; }
        public TelemetryBuilder timestamp(LocalDateTime timestamp) { this.timestamp = timestamp; return this; }

        public Telemetry build() {
            return new Telemetry(id, binId, fillPercentage, batteryLevel, temperature, timestamp);
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getBinId() { return binId; }
    public void setBinId(String binId) { this.binId = binId; }
    public Integer getFillPercentage() { return fillPercentage; }
    public void setFillPercentage(Integer fillPercentage) { this.fillPercentage = fillPercentage; }
    public Integer getBatteryLevel() { return batteryLevel; }
    public void setBatteryLevel(Integer batteryLevel) { this.batteryLevel = batteryLevel; }
    public Integer getTemperature() { return temperature; }
    public void setTemperature(Integer temperature) { this.temperature = temperature; }
    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}
