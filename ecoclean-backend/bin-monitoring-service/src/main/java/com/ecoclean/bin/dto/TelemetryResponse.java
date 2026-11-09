package com.ecoclean.bin.dto;

import java.time.LocalDateTime;

public class TelemetryResponse {
    private Long id;
    private String binId;
    private Integer fillPercentage;
    private Integer fillLevel; // alias
    private Integer batteryLevel;
    private Integer temperature;
    private LocalDateTime timestamp;

    public TelemetryResponse() {}

    public TelemetryResponse(Long id, String binId, Integer fillPercentage, Integer fillLevel,
                             Integer batteryLevel, Integer temperature, LocalDateTime timestamp) {
        this.id = id;
        this.binId = binId;
        this.fillPercentage = fillPercentage;
        this.fillLevel = fillLevel != null ? fillLevel : fillPercentage;
        this.batteryLevel = batteryLevel;
        this.temperature = temperature;
        this.timestamp = timestamp;
    }

    public static TelemetryResponseBuilder builder() {
        return new TelemetryResponseBuilder();
    }

    public static class TelemetryResponseBuilder {
        private Long id;
        private String binId;
        private Integer fillPercentage;
        private Integer fillLevel;
        private Integer batteryLevel;
        private Integer temperature;
        private LocalDateTime timestamp;

        public TelemetryResponseBuilder id(Long id) { this.id = id; return this; }
        public TelemetryResponseBuilder binId(String binId) { this.binId = binId; return this; }
        public TelemetryResponseBuilder fillPercentage(Integer fillPercentage) {
            this.fillPercentage = fillPercentage;
            if (this.fillLevel == null) this.fillLevel = fillPercentage;
            return this;
        }
        public TelemetryResponseBuilder fillLevel(Integer fillLevel) { this.fillLevel = fillLevel; return this; }
        public TelemetryResponseBuilder batteryLevel(Integer batteryLevel) { this.batteryLevel = batteryLevel; return this; }
        public TelemetryResponseBuilder temperature(Integer temperature) { this.temperature = temperature; return this; }
        public TelemetryResponseBuilder timestamp(LocalDateTime timestamp) { this.timestamp = timestamp; return this; }

        public TelemetryResponse build() {
            return new TelemetryResponse(id, binId, fillPercentage, fillLevel != null ? fillLevel : fillPercentage,
                    batteryLevel, temperature, timestamp);
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getBinId() { return binId; }
    public void setBinId(String binId) { this.binId = binId; }
    public Integer getFillPercentage() { return fillPercentage; }
    public void setFillPercentage(Integer fillPercentage) {
        this.fillPercentage = fillPercentage;
        if (this.fillLevel == null) this.fillLevel = fillPercentage;
    }
    public Integer getFillLevel() { return fillLevel != null ? fillLevel : fillPercentage; }
    public void setFillLevel(Integer fillLevel) { this.fillLevel = fillLevel; }
    public Integer getBatteryLevel() { return batteryLevel; }
    public void setBatteryLevel(Integer batteryLevel) { this.batteryLevel = batteryLevel; }
    public Integer getTemperature() { return temperature; }
    public void setTemperature(Integer temperature) { this.temperature = temperature; }
    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}
