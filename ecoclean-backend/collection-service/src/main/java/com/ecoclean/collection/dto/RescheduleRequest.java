package com.ecoclean.collection.dto;

public class RescheduleRequest {
    private String date;
    private String time;
    private String scheduledTime;

    public RescheduleRequest() {}

    public RescheduleRequest(String date, String time, String scheduledTime) {
        this.date = date;
        this.time = time;
        this.scheduledTime = scheduledTime;
    }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }
    public String getTime() { return time; }
    public void setTime(String time) { this.time = time; }
    public String getScheduledTime() { return scheduledTime; }
    public void setScheduledTime(String scheduledTime) { this.scheduledTime = scheduledTime; }
}
