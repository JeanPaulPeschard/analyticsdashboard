import React, { useState, useEffect } from 'react';

interface EventCountProps {
  eventType: string;
}

const EventCount: React.FC<EventCountProps> = ({ eventType }) => {
  const [eventCount, setEventCount] = useState<number | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchEventCount = async () => {
      try {
        const res = await fetch(`http://localhost:8082/event-count/${eventType}`);
        if (!res.ok) {
          throw new Error('Failed to fetch event count');
        }
        const data = await res.json();
        if (data.eventCount !== undefined) {
          setEventCount(data.eventCount);
        } else {
          setError(data.message || 'Unknown error');
        }
      } catch (err) {
        setError('Error fetching event count');
      }
    };

    if (eventType) {
      fetchEventCount();
    }
  }, [eventType]);

  return (
    <div>
      {error ? <p>{error}</p> : <p>Event Type: {eventType} - Count: {eventCount}</p>}
    </div>
  );
};

export default EventCount;
