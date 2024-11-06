package com.jeanpaul.analyticsdashboard.analytics.service;

import java.util.Properties;

import org.apache.kafka.common.serialization.Serdes;
import org.apache.kafka.streams.KafkaStreams;
import org.apache.kafka.streams.StreamsBuilder;
import org.apache.kafka.streams.StreamsConfig;
import org.apache.kafka.streams.kstream.KStream;
import org.apache.kafka.streams.kstream.Materialized;
import org.apache.kafka.streams.state.Stores;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class KafkaStreamConfig {

    @Bean
    public KafkaStreams kafkaStreams() {
        // Set up Kafka Streams configuration
        Properties streamsConfig = new Properties();
        streamsConfig.put(StreamsConfig.APPLICATION_ID_CONFIG, "kafka-streams-analytics");
        streamsConfig.put(StreamsConfig.BOOTSTRAP_SERVERS_CONFIG, "localhost:9092");
        streamsConfig.put(StreamsConfig.DEFAULT_KEY_SERDE_CLASS_CONFIG, Serdes.String().getClass().getName());
        streamsConfig.put(StreamsConfig.DEFAULT_VALUE_SERDE_CLASS_CONFIG, Serdes.String().getClass().getName());

        // Create a StreamsBuilder to define the processing logic
        StreamsBuilder builder = new StreamsBuilder();
        KStream<String, String> source = builder.stream("events");

        // Process the stream to count event types
        source
            .groupByKey()
            .count(Materialized.as(Stores.inMemoryKeyValueStore("event-counts")))  // Ensure this store name matches the one in the controller
            .toStream()
            .foreach((key, value) -> {
                System.out.println("Event Type: " + key + " Count: " + value);
            });

        // Build the topology from the StreamsBuilder
        org.apache.kafka.streams.Topology topology = builder.build();

        // Create and start the KafkaStreams instance with the topology and streamsConfig
        KafkaStreams streams = new KafkaStreams(topology, streamsConfig);
        streams.start();
        return streams;
    }
}
