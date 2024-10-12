import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import html2pdf from 'html2pdf.js';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FiCalendar, FiClock } from 'react-icons/fi';

const BookAppointment = () => {
  const { id } = useParams(); // Therapist ID from URL params
  const [therapist, setTherapist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    userName: '',
    userEmail: '',
    doctorName: '',
    location: '',
    disease: '',
    appointmentDate: new Date(), // For date picker
    appointmentTime: new Date() // For time picker
  });

  useEffect(() => {
    const fetchTherapist = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/therapists/${id}`);
        if (!response.ok) throw new Error('Therapist not found');
        const data = await response.json();
        setTherapist(data);
        setFormData(prev => ({ ...prev, doctorName: data.name }));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTherapist();
  }, [id]);

  useEffect(() => {
    const fetchUserDetails = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch('http://localhost:5000/api/users/me', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        });
        if (!response.ok) throw new Error('User not found');
        const data = await response.json();
        setFormData(prev => ({
          ...prev,
          userName: data.name,
          userEmail: data.email
        }));
      } catch (err) {
        setError(err.message);
      }
    };
    fetchUserDetails();
  }, []);

  const handleDateChange = (date) => setFormData(prev => ({ ...prev, appointmentDate: date }));
  const handleTimeChange = (time) => setFormData(prev => ({ ...prev, appointmentTime: time }));

  // Updated formatting functions
  const formatAppointmentDate = (date) => {
    return date.toLocaleString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatAppointmentTime = (time) => {
    return time.toLocaleString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.disease.trim()) {
      alert('Please fill in the disease field.');
      return; // Stop the submission if the disease field is empty
    }
    if (!formData.location.trim()) {
      alert('Please fill in the location field.');
      return; // Stop the submission if the location field is empty
    }

    const element = document.getElementById('pdf-content');
    const pdfOptions = {
      margin: 1,
      filename: 'appointment.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    // Generate PDF
    html2pdf().from(element).set(pdfOptions).save().then(() => {
      sendEmailWithPDF();
    });
  };

  const sendEmailWithPDF = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:5000/api/appointments/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          therapistId: id,
          appointmentTime: formData.appointmentTime.toLocaleDateString(),
          appointmentDate: formData.appointmentDate.toLocaleTimeString(),
          location: formData.location,
          disease: formData.disease,
        })
      });
      console.log(formData.appointmentTime);
      if (!response.ok) throw new Error('Failed to book appointment');
      alert('Appointment booked successfully!');
    } catch (err) {
      console.error('Error:', err.message);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div style={{
      backgroundColor: '#121212',
      color: '#fff',
      padding: '2rem',
      borderRadius: '10px',
      maxWidth: '600px',
      margin: 'auto',
      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)'
    }}>
      <h2>Book Appointment with {therapist.name}</h2>
      <form onSubmit={handleSubmit} style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem'
      }}>
        <p>Logged in as: {formData.userName} ({formData.userEmail})</p>

        <label style={{ fontSize: '1.2rem', color: '#b3b3b3' }}>Location</label>
        <input 
          type="text" 
          value={formData.location} 
          onChange={e => setFormData({ ...formData, location: e.target.value })} 
          placeholder="Enter your location"
          style={{
            padding: '0.5rem',
            fontSize: '1rem',
            borderRadius: '5px',
            border: '1px solid #555',
            backgroundColor: '#222',
            color: '#fff'
          }}
        />

        <label style={{ fontSize: '1.2rem', color:'#b3b3b3' }}>Disease</label>
        <input 
          type="text" 
          value={formData.disease} 
          onChange={e => setFormData({ ...formData, disease:e.target.value })} 
          placeholder="Enter your disease"
          style={{
            padding:'0.5rem',
            fontSize:'1rem',
            borderRadius:'5px',
            border:'1px solid #555',
            backgroundColor:'#222',
            color:'#fff'
          }}
        />

        <label style={{ fontSize:'1.2rem', color:'#b3b3b3' }}>Appointment Date</label>
        <div style={{
          position:'relative',
          display:'flex',
          alignItems:'center'
        }}>
          <FiCalendar style={{
            position:'absolute',
            left:'10px',
            fontSize:'1.5rem',
            color:'#b3b3b3'
          }} />
          <DatePicker 
            selected={formData.appointmentDate} 
            onChange={handleDateChange} 
            dateFormat="MMMM d, yyyy"
            style={{
              width:'100%',
              padding:'0.5rem 0.5rem 0.5rem 2rem',
              borderRadius:'5px',
              border:'1px solid #555',
              backgroundColor:'#222',
              color:'#fff'
            }}
          />
        </div>

        <label style={{ fontSize:'1.2rem', color:'#b3b3b3' }}>Appointment Time</label>
        <div style={{
          position:'relative',
          display:'flex',
          alignItems:'center'
        }}>
          <FiClock style={{
            position:'absolute',
            left:'10px',
            fontSize:'1.5rem',
            color:'#b3b3b3'
          }} />
          <DatePicker 
            selected={formData.appointmentTime} 
            onChange={handleTimeChange} 
            showTimeSelect 
            showTimeSelectOnly 
            timeIntervals={15} 
            timeCaption="Time" 
            dateFormat="h:mm aa"
            style={{
              width:'100%',
              padding:'0.5rem 0.5rem 0.5rem 2rem',
              borderRadius:'5px',
              border:'1px solid #555',
              backgroundColor:'#222',
              color:'#fff'
            }}
          />
        </div>

        <button type="submit" style={{
          backgroundColor:'#1a73e8',
          color:'white',
          border:'none',
          padding:'0.75rem 1.5rem',
          borderRadius:'5px',
          fontSize:'1.2rem',
          cursor:'pointer',
          textAlign:'center',
          transition:'background-color 0.3s'
        }}>Submit</button>
      </form>

      {/* Hidden div for PDF generation */}
      <div id="pdf-content" style={{ display:'none' }}>
        <h3>Appointment Details</h3>
        <p>Name:{formData.userName}</p>
        <p>Email:{formData.userEmail}</p>
        <p>Doctor Name:{formData.doctorName}</p>
        <p>Location:{formData.location}</p>
        <p>Disease:{formData.disease}</p>
        
        {/* Use updated formatting functions */}
        <p>Appointment Date:{formatAppointmentDate(new Date(formData.appointmentDate))}</p>
        
        {/* Use updated formatting functions */}
        <p>Appointment Time:{formatAppointmentTime(new Date(formData.appointmentTime))}</p>
        
      </div>
    </div>
   );
};

export default BookAppointment;