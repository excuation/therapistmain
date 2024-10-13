import React from 'react';

const Tickets = () => {
  return (
    <div
      style={{
        width: '350px',
        margin: '20px auto',
        padding: '20px',
        border: '2px solid #28a745',
        borderRadius: '10px',
        backgroundColor: '#f8f9fa',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <h2 style={{ textAlign: 'center', color: '#28a745', marginBottom: '20px' }}>
        Appointment
      </h2>

      <div style={{ marginBottom: '15px' }}>
        <strong>Service:</strong> <span>Mental Counseling</span>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <strong>Date:</strong> <span>September 20, 2024</span>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <strong>Time:</strong> <span>2:00 PM - 3:00 PM</span>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <strong>Therapist:</strong> <span>Dr. Anurag sharma</span>
      </div>

      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <img
          src="https://via.placeholder.com/100"
          alt="QR Code"
          style={{ borderRadius: '5px' }}
        />
      </div>

      <p style={{ textAlign: 'center', marginTop: '15px', color: '#6c757d' }}>
        Present this ticket for your therapy session.
      </p>
    </div>
  );
};

export default Tickets;
