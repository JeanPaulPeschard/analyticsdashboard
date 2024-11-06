import React, { useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import EventCount from './components/EventCount';
import EventList from './components/EventList';
import EventFilter from './components/EventFilter';
import EventAnalyticsSummary from './components/EventAnalyticsSummary';
import EventPublisher from './components/EventPublisher';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Event } from './types'; // Import the Event type

const App: React.FC = () => {
  const [message, setMessage] = useState<string>(''); // This is the message field in the Event type
  const [response, setResponse] = useState<any>(''); 
  const [eventType, setEventType] = useState<Event['type']>('userActivity'); // Using Event type for eventType

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  };

  const handleFilterChange = (type: Event['type'], dateRange: { start: Date; end: Date }) => {
    setEventType(type);
    // You can also handle dateRange here if needed for additional functionality
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    // Construct the payload to match the Event type
    const payload: Event = { 
      type: eventType, 
      data: message, // Use message as the data, or you can set it to something else
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
        const data = await res.json();
        setResponse(data);
      } else {
        setResponse('Error: ' + res.status);
      }
    } catch (error) {
      setResponse('Error: ' + error);
    }
  };

  const renderResponse = (response: any) => {
    if (typeof response === 'string') {
      return response;
    } else if (response && response.message) {
      return response.message;
    } else {
      return 'No message available';
    }
  };

  return (
    <Router>
      <div className="container mt-4">
        {/* Navigation Bar */}
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <a className="navbar-brand" href="/">Analytics Dashboard</a>
          <div className="collapse navbar-collapse">
            <ul className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/">Home</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/publish">Publish Event</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/analytics">Event Analytics</Link>
              </li>
            </ul>
          </div>
        </nav>

        {/* Main Content */}
        <Routes>
          <Route path="/" element={
            <div>
              <h1 className="text-center mb-4">Analytics Dashboard</h1>

              {/* Event Publisher Form */}
              <div className="card mb-4">
                <div className="card-body">
                  <h5 className="card-title">Publish Event</h5>
                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label htmlFor="message" className="form-label">Enter a message to send:</label>
                      <input
                        type="text"
                        id="message"
                        className="form-control"
                        value={message}
                        onChange={handleChange}
                        placeholder="Enter message"
                      />
                    </div>
                    <button type="submit" className="btn btn-primary">Send Event</button>
                  </form>
                  {response && (
                    <div className="alert alert-info mt-3" role="alert">
                      Response: {renderResponse(response)}
                    </div>
                  )}
                </div>
              </div>

              {/* Event List and Filter */}
              <div className="row">
                <div className="col-md-6">
                  <div className="card mb-4">
                    <div className="card-body">
                      <h5 className="card-title">Event List</h5>
                      <EventList />
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="card mb-4">
                    <div className="card-body">
                      <h5 className="card-title">Filter Events</h5>
                      <EventFilter onFilterChange={handleFilterChange} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          } />
          
          <Route path="/publish" element={<EventPublisher />} />
          
          <Route path="/analytics" element={
            <div className="row">
              <div className="col-md-6">
                <div className="card mb-4">
                  <div className="card-body">
                    <h5 className="card-title">Event Count for {eventType}</h5>
                    <EventCount/>
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="card mb-4">
                  <div className="card-body">
                    <h5 className="card-title">Event Analytics Summary</h5>
                    <EventAnalyticsSummary />
                  </div>
                </div>
              </div>
            </div>
          } />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
