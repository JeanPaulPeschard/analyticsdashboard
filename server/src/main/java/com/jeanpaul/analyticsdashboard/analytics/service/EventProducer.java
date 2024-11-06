package com.jeanpaul.analyticsdashboard.analytics.service;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jeanpaul.analyticsdashboard.analytics.model.EventMessage;
import com.jeanpaul.analyticsdashboard.analytics.repository.EventRepository;

@Service
public class EventProducer {

    private static final String TOPIC = "events";

    @Autowired
    private KafkaTemplate<String, String> kafkaTemplate; // Use String for JSON

    @Autowired
    private EventRepository eventRepository;

    private final ObjectMapper objectMapper = new ObjectMapper();

    public void sendEvent(String type, String payload) {
        try {
            // Create EventMessage instance
            EventMessage message = new EventMessage(
                    UUID.randomUUID().toString(),
                    type,
                    System.currentTimeMillis(),
                    payload
            );

            // Convert EventMessage to JSON
            String messageJson = objectMapper.writeValueAsString(message);

            // Send JSON string to Kafka
            kafkaTemplate.send(TOPIC, messageJson);
            eventRepository.save(message); // Persist to MongoDB
            // Send to a specific partition based on the event type
            kafkaTemplate.send(TOPIC, type.hashCode() % 3, type, messageJson); // Assuming 3 partitions
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
