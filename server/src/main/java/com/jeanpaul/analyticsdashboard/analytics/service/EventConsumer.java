package com.jeanpaul.analyticsdashboard.analytics.service;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import com.jeanpaul.analyticsdashboard.analytics.model.EventMessage;
import com.jeanpaul.analyticsdashboard.analytics.repository.EventRepository;

@Service
public class EventConsumer {

    private final EventRepository eventRepository;

    public EventConsumer(EventRepository eventRepository) {
        this.eventRepository = eventRepository;
    }

    @KafkaListener(topics = "events", groupId = "analytics-group")
    public void consume(EventMessage message) {
        System.out.println("Consumed message: " + message);
        eventRepository.save(message); // Save to MongoDB
    }
}
