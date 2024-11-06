package com.jeanpaul.analyticsdashboard.analytics.controller;

import java.time.Instant;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.kafka.streams.KafkaStreams;
import org.apache.kafka.streams.KeyValue;
import org.apache.kafka.streams.StoreQueryParameters;
import org.apache.kafka.streams.state.KeyValueIterator;
import org.apache.kafka.streams.state.QueryableStoreTypes;
import org.apache.kafka.streams.state.ReadOnlyKeyValueStore;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.jeanpaul.analyticsdashboard.analytics.service.EventProducer;

@RestController
public class EventController {

    private final EventProducer eventProducer;

    @Autowired
    private KafkaStreams kafkaStreams;

    public EventController(EventProducer eventProducer) {
        this.eventProducer = eventProducer;
    }

    /**
     * Publish an event to the Kafka topic.
     */
    @PostMapping("/publish")
    public ResponseEntity<Map<String, String>> publishEvent(@RequestParam String type, @RequestParam String payload) {
        eventProducer.sendEvent(type, payload);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Event published");
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    /**
     * Get the count of events by type from Kafka store.
     */
    @GetMapping("/event-count/{type}")
    public ResponseEntity<Map<String, Object>> getEventCount(@PathVariable String type) {
        Map<String, Object> response = new HashMap<>();
        try {
            ReadOnlyKeyValueStore<String, Long> store =
                kafkaStreams.store(StoreQueryParameters.fromNameAndType("event-counts", QueryableStoreTypes.keyValueStore()));

            Long count = store.get(type);
            if (count != null) {
                response.put("eventType", type);
                response.put("eventCount", count);
            } else {
                response.put("message", "No events of this type");
            }
        } catch (Exception e) {
            response.put("message", "Error fetching event count: " + e.getMessage());
        }
        
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    /**
     * Get a list of recent events.
     */
    @GetMapping("/events")
    public ResponseEntity<List<Map<String, Object>>> getRecentEvents() {
        ReadOnlyKeyValueStore<String, String> store = 
            kafkaStreams.store(StoreQueryParameters.fromNameAndType("events-store", QueryableStoreTypes.keyValueStore()));

        List<Map<String, Object>> recentEvents = new ArrayList<>();
        store.all().forEachRemaining(record -> recentEvents.add(parseEvent(record.value)));
        
        return new ResponseEntity<>(recentEvents, HttpStatus.OK);
    }

    /**
     * Get events filtered by type and date range.
     */
    @GetMapping(value = "/events/filter", params = {"type", "start", "end"})
    public ResponseEntity<List<Map<String, Object>>> getFilteredEvents(
        @RequestParam String type,
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant start,
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant end) {

        ReadOnlyKeyValueStore<String, String> store =
            kafkaStreams.store(StoreQueryParameters.fromNameAndType("events-store", QueryableStoreTypes.keyValueStore()));

        List<Map<String, Object>> filteredEvents = new ArrayList<>();
        store.all().forEachRemaining(record -> {
            Map<String, Object> event = parseEvent(record.value);
            if (type.equals(event.get("eventType")) &&
                ((Instant) event.get("timestamp")).isAfter(start) &&
                ((Instant) event.get("timestamp")).isBefore(end)) {
                filteredEvents.add(event);
            }
        });

        return new ResponseEntity<>(filteredEvents, HttpStatus.OK);
    }

    /**
     * Get a summary of total events and average events per minute.
     */
    @GetMapping("/event-summary")
public ResponseEntity<Map<String, Object>> getEventSummary() {
    ReadOnlyKeyValueStore<String, Long> eventCountStore = 
        kafkaStreams.store(StoreQueryParameters.fromNameAndType("event-counts", QueryableStoreTypes.keyValueStore()));

    long totalEvents = 0;
    long eventStartTime = System.currentTimeMillis();

    // Iterate over all entries in the store
    try (KeyValueIterator<String, Long> iterator = eventCountStore.all()) {
        while (iterator.hasNext()) {
            KeyValue<String, Long> entry = iterator.next();
            totalEvents += entry.value;
        }
    }

    long elapsedTimeMinutes = (System.currentTimeMillis() - eventStartTime) / (1000 * 60);
    double avgEventsPerMin = (elapsedTimeMinutes > 0) ? (double) totalEvents / elapsedTimeMinutes : 0;

    Map<String, Object> summary = new HashMap<>();
    summary.put("totalEvents", totalEvents);
    summary.put("avgEventsPerMin", avgEventsPerMin);

    return new ResponseEntity<>(summary, HttpStatus.OK);
}

    /**
     * Helper method to parse event JSON.
     */
    private Map<String, Object> parseEvent(String eventJson) {
        // Parse JSON string to Map<String, Object> (using Jackson, Gson, etc.)
        // Example: return new ObjectMapper().readValue(eventJson, new TypeReference<Map<String, Object>>() {});
        return new HashMap<>(); // Placeholder implementation
    }
}
