import { useState, useEffect } from 'react';

const useAnalyticsSummary = () => {
  const [summary, setSummary] = useState({ totalEvents: 0, avgEventsPerMin: 0 });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await fetch('http://localhost:8082/event-summary');
        if (!response.ok) throw new Error('Failed to fetch analytics summary');
        const data = await response.json();
        setSummary(data);
      } catch (err) {
        if (err instanceof Error) {
        setError(err.message);
        }
      }
    };

    fetchSummary();
    const interval = setInterval(fetchSummary, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  return { summary, error };
};

export default useAnalyticsSummary;
