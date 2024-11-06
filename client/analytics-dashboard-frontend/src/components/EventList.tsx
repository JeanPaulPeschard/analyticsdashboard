import React from 'react';
import useFetchEvents from '../hooks/useFetchEvents';

const EventList: React.FC = () => {
  const { events, error } = useFetchEvents();

  return (
    <div>
      <h2>Recent Events</h2>
      {error && <p>{error}</p>}
      <ul>
        {events.map((event, index) => (
          <li key={index}>{event.message}</li>
        ))}
      </ul>
    </div>
  );
};

export default EventList;
