import React, { useState } from 'react';
import { Event } from '../types'; // Adjust the path if needed

const EventPublisher: React.FC = () => {
  const [eventType, setEventType] = useState<Event['type']>('userActivity');
  const [eventData, setEventData] = useState<string>(''); // For data (activity details, system log, etc.)

  const handleEventTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setEventType(e.target.value as Event['type']);
    setEventData(''); // Clear previous data when switching types
  };

  const handleEventDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEventData(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload: Event = { 
      type: eventType,
      data: eventData, // The data (details) based on the selected event type
    };

    try {
      const res = await fetch('http://localhost:8082/publish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload), // Send the payload as JSON
      });

      if (res.ok) {
        alert('Event sent successfully');
      } else {
        alert('Failed to send event');
      }
    } catch (error) {
      console.error('Error sending event:', error);
      alert('Error sending event');
    }
  };

  return (
    <div className="event-publisher">
      <h1>Event Publisher</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="event-type">Select Event Type:</label>
          <select
            id="event-type"
            value={eventType}
            onChange={handleEventTypeChange}
            className="form-control"
          >
            <option value="userActivity">User Activity</option>
            <option value="systemLog">System Log</option>
            <option value="errorReport">Error Report</option>
          </select>
        </div>

        {/* Conditional Sections for Different Event Types */}
        {eventType === 'userActivity' && (
          <div className="form-group">
            <label htmlFor="user-activity">User Activity Details:</label>
            <input
              type="text"
              id="user-activity"
              value={eventData}
              onChange={handleEventDataChange}
              placeholder="Enter user activity details"
              className="form-control"
            />
          </div>
        )}

        {eventType === 'systemLog' && (
          <div className="form-group">
            <label htmlFor="system-log">System Log Details:</label>
            <input
              type="text"
              id="system-log"
              value={eventData}
              onChange={handleEventDataChange}
              placeholder="Enter system log details"
              className="form-control"
            />
          </div>
        )}

        {eventType === 'errorReport' && (
          <div className="form-group">
            <label htmlFor="error-report">Error Report Details:</label>
            <input
              type="text"
              id="error-report"
              value={eventData}
              onChange={handleEventDataChange}
              placeholder="Enter error report details"
              className="form-control"
            />
          </div>
        )}

        {/* Submit Button */}
        <button type="submit" className="btn btn-primary">Send Event</button>
      </form>
    </div>
  );
};

export default EventPublisher;
