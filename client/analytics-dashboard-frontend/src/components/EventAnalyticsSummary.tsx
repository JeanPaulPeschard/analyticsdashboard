import React from 'react';
import useAnalyticsSummary from '../hooks/useAnalyticsSummary';

const EventAnalyticsSummary: React.FC = () => {
  const { summary, error } = useAnalyticsSummary();

  return (
    <div>
      <h2>Event Analytics Summary</h2>
      {error && <p>{error}</p>}
      <p>Total Events: {summary.totalEvents}</p>
      <p>Average Events per Minute: {summary.avgEventsPerMin}</p>
    </div>
  );
};

export default EventAnalyticsSummary;
