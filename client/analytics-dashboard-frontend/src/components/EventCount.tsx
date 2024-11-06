import React, { useState, useEffect } from 'react';
import { Event } from '../types'; // Adjust the path as needed

const EventCount: React.FC = () => {
  const [eventType, setEventType] = useState<Event['type'] | ''>(''); // Using Event type for eventType
  const [eventCount, setEventCount] = useState<number | null>(null);
  const [error, setError] = useState<string>('');

  // Define available event types based on the Event type
  const eventTypes: Event['type'][] = ['userActivity', 'systemLog', 'errorReport'];

  useEffect(() => {
    const fetchEventCount = async () => {
      if (!eventType) return;

      try {
        const res = await fetch(`http://localhost:8082/event-count/${eventType}`);
        if (!res.ok) {
          throw new Error('Failed to fetch event count');
        }
        const data = await res.json();
        if (data.eventCount !== undefined) {
          setEventCount(data.eventCount);
          setError('');
        } else {
          setError(data.message || 'Unknown error');
        }
      } catch (err) {
        setError('Error fetching event count');
      }
    };

    fetchEventCount();
  }, [eventType]);

  return (
    <div>
      <label htmlFor="event-type">Select Event Type: </label>
      <select
        id="event-type"
        value={eventType}
        onChange={(e) => setEventType(e.target.value as Event['type'])}
      >
        <option value="" disabled>Select event type</option>
        {eventTypes.map((type) => (
          <option key={type} value={type}>
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </option>
        ))}
      </select>

      {error ? (
        <p>{error}</p>
      ) : eventType ? (
        <p>Event Type: {eventType} - Count: {eventCount}</p>
      ) : (
        <p>Please select an event type</p>
      )}
    </div>
  );
};

export default EventCount;
