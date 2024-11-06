package com.jeanpaul.analyticsdashboard.analytics.controller;

import java.util.HashMap;
import java.util.Map;

import org.apache.kafka.streams.KafkaStreams;
import org.apache.kafka.streams.StoreQueryParameters;
import org.apache.kafka.streams.state.QueryableStoreTypes;
import org.apache.kafka.streams.state.ReadOnlyKeyValueStore;
import org.springframework.beans.factory.annotation.Autowired;
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

    // Endpoint to get the event count from Kafka store
    @GetMapping("/event-count/{type}")
    public ResponseEntity<Map<String, Object>> getEventCount(@PathVariable String type) {
        Map<String, Object> response = new HashMap<>();
        try {
            // Access the state store using StoreQueryParameters
            ReadOnlyKeyValueStore<String, Long> store =
                kafkaStreams.store(StoreQueryParameters.fromNameAndType("event-counts", QueryableStoreTypes.keyValueStore()));

            // Log the store to see if it's correctly initialized
            System.out.println("Fetching event count for type: " + type);

            Long count = store.get(type);

            // Log the result from the store
            System.out.println("Event count fetched: " + count);

            if (count != null) {
                response.put("eventType", type);
                response.put("eventCount", count);
            } else {
                response.put("message", "No events of this type");
            }

        } catch (Exception e) {
            System.err.println("Error fetching event count: " + e.getMessage());
            response.put("message", "Error fetching event count");
        }
        
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    // Endpoint to publish an event
    @PostMapping("/publish")
    public ResponseEntity<Map<String, String>> publishEvent(@RequestParam String type, @RequestParam String payload) {
        eventProducer.sendEvent(type, payload);

        // Create a response map with a success message
        Map<String, String> response = new HashMap<>();
        response.put("message", "Event published");

        // Return the map as a JSON response with HTTP status 200 (OK)
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
