import { useState, useEffect } from 'react';

const useFetchEvents = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('http://localhost:8082/events');
        if (!response.ok) throw new Error(`Failed to fetch events: ${response.statusText}`);
        const data = await response.json();
        setEvents(data);
      } catch (err) {
        if (err instanceof Error) {
        setError(err.message);
        }
      }
    };
    fetchEvents();
  }, []);

  return { events, error };
};

export default useFetchEvents;
