import { useState, useEffect } from 'react';
import { Event } from '../types'; // Adjust path as necessary

const useEventFilter = (type: Event["type"], dateRange: { start: Date; end: Date }) => {
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFilteredEvents = async () => {
      try {
        const response = await fetch(`http://localhost:8082/events/filter?type=${type}&start=${dateRange.start.toISOString()}&end=${dateRange.end.toISOString()}`);
        if (!response.ok) throw new Error('Failed to fetch filtered events');
        const data: Event[] = await response.json();
        setFilteredEvents(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        }
      }
    };

    fetchFilteredEvents();
  }, [type, dateRange]);

  return { filteredEvents, error };
};

export default useEventFilter;
