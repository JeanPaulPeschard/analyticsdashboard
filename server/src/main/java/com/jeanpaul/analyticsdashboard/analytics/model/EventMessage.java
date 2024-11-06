package com.jeanpaul.analyticsdashboard.analytics.model;

public class EventMessage {
    private String eventId;
    private String eventType;
    private long timestamp;
    private String payload;

    // Constructor with parameters matching the usage in EventProducer
    public EventMessage(String eventId, String eventType, long timestamp, String payload) {
        this.eventId = eventId;
        this.eventType = eventType;
        this.timestamp = timestamp;
        this.payload = payload;
    }

    // No-argument constructor
    public EventMessage() {
    }

    // Getters and Setters
    public String getEventId() {
        return eventId;
    }

    public void setEventId(String eventId) {
        this.eventId = eventId;
    }

    public String getEventType() {
        return eventType;
    }

    public void setEventType(String eventType) {
        this.eventType = eventType;
    }

    public long getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(long timestamp) {
        this.timestamp = timestamp;
    }

    public String getPayload() {
        return payload;
    }

    public void setPayload(String payload) {
        this.payload = payload;
    }

    @Override
    public String toString() {
        return "EventMessage{" +
                "eventId='" + eventId + '\'' +
                ", eventType='" + eventType + '\'' +
                ", timestamp=" + timestamp +
                ", payload='" + payload + '\'' +
                '}';
    }
}

