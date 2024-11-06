import React, { useState } from 'react';
import useEventFilter from '../hooks/useEventFilter';
import { Event } from '../types'; // Adjust path as necessary

interface EventFilterProps {
  onFilterChange: (type: Event["type"], dateRange: { start: Date; end: Date }) => void;
}

const EventFilter: React.FC<EventFilterProps> = ({ onFilterChange }) => {
  const [type, setType] = useState<Event["type"]>('userActivity'); // Allows for initial undefined state
  const [dateRange, setDateRange] = useState({ start: new Date(), end: new Date() });

  const { filteredEvents, error } = useEventFilter(type, dateRange);

  // Update parent component with the filter criteria
  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedType = e.target.value as Event["type"];
    setType(selectedType);
    onFilterChange(selectedType, dateRange);  // Notify parent component
  };

  const handleDateChange = (start: Date, end: Date) => {
    setDateRange({ start, end });
    if (type) { // Only call onFilterChange if type is defined
      onFilterChange(type, { start, end });  // Notify parent component
    }
  };

  // Ensure type is always a valid value before calling onFilterChange
  const handleSubmit = () => {
    if (type) {
      onFilterChange(type, dateRange); // Call only if type is valid
    } else {
      // Handle case where type is undefined, for example, set a default or show an error
      console.log("Please select a valid event type.");
    }
  };

  return (
    <div className="event-filter">
      <h2>Filter Events</h2>
      <div className="form-group">
        <label htmlFor="type">Event Type:</label>
        <select
          id="type"
          value={type || ''} // Ensure empty string when undefined
          onChange={handleTypeChange}
          className="form-control"
        >
          <option value="">Select event type</option>
          <option value="userActivity">User Activity</option>
          <option value="systemLog">System Log</option>
          <option value="errorReport">Error Report</option>
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="start-date">Start Date:</label>
        <input
          type="date"
          id="start-date"
          value={dateRange.start.toISOString().split('T')[0]}
          onChange={(e) => handleDateChange(new Date(e.target.value), dateRange.end)}
          className="form-control"
        />
      </div>
      <div className="form-group">
        <label htmlFor="end-date">End Date:</label>
        <input
          type="date"
          id="end-date"
          value={dateRange.end.toISOString().split('T')[0]}
          onChange={(e) => handleDateChange(dateRange.start, new Date(e.target.value))}
          className="form-control"
        />
      </div>
      {error && <p className="text-danger">{error}</p>}
      <ul className="list-group mt-3">
        {filteredEvents.map((event, index) => (
          <li key={index} className="list-group-item">{event.data}</li>
        ))}
      </ul>
    </div>
  );
};

export default EventFilter;
