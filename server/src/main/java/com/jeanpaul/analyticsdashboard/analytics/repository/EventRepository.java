package com.jeanpaul.analyticsdashboard.analytics.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.jeanpaul.analyticsdashboard.analytics.model.EventMessage;

public interface EventRepository extends MongoRepository<EventMessage, String> {
}
