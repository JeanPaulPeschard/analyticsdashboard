import React, { useState } from 'react';
import './App.css';
import EventCount from './components/EventCount';

const App: React.FC = () => {
  const [message, setMessage] = useState<string>('');
  const [response, setResponse] = useState<any>('');  // Allow response to be any type
  const [eventType, setEventType] = useState<string>('event');  // Default event type

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const payload = { message };
    try {
      const res = await fetch('http://localhost:8082/publish?type=event&payload=' + message, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        setResponse(data);  // Store the response
      } else {
        setResponse('Error: ' + res.status);
      }
    } catch (error) {
      setResponse('Error: ' + error);
    }
  };

  // Utility function to handle the response for rendering
  const renderResponse = (response: any) => {
    if (typeof response === 'string') {
      return response;
    } else if (response && response.message) {
      return response.message;  // Access the message property of response
    } else {
      return 'No message available';
    }
  };

  return (
    <div className="App">
      <h1>Event Publisher</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="message">Enter a message to send:</label>
        <input
          type="text"
          id="message"
          value={message}
          onChange={handleChange}
          placeholder="Enter message"
        />
        <button type="submit">Send Event</button>
      </form>
      <div>
        {response && <p>Response: {renderResponse(response)}</p>}
      </div>
      
      {/* Add the EventCount component */}
      <div>
        <h2>Event Count for {eventType}:</h2>
        <EventCount eventType={eventType} />
      </div>
    </div>
  );
};

export default App;
