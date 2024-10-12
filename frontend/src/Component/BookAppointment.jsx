import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import html2pdf from 'html2pdf.js';

const BookAppointment = () => {
  const { id } = useParams(); // Fetch therapist ID from the URL
  const [therapist, setTherapist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    userName: '',
    userEmail: '',
    doctorName: ''
  });

  // Fetch therapist data and set it
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

  // Fetch user details (from the token)
  useEffect(() => {
    const fetchUserDetails = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch('http://localhost:5000/api/users/me', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Generate PDF and send email with appointment details
    const element = document.getElementById('pdf-content');
    const pdfOptions = {
      margin: 1,
      filename: 'appointment.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    html2pdf().from(element).set(pdfOptions).save().then(() => {
      sendEmailWithPDF(); // Call after saving the PDF
    });
  };

  const sendEmailWithPDF = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:5000/api/appointments/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          userName: formData.userName,
          userEmail: formData.userEmail,
          doctorName: formData.doctorName,
          appointmentTime: new Date(),
          therapistId: id, // Use therapist ID from the URL params
          message: "Appointment details attached"
        })
      });
      if (!response.ok) throw new Error('Failed to book appointment');
      alert('Appointment booked successfully!');
    } catch (err) {
      console.error('Error:', err.message);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!therapist) return <p>Therapist not found</p>;

  return (
    <div>
      <h2>Book Appointment with {therapist.name}</h2>
      <form onSubmit={handleSubmit}>
        <p>Logged in as: {formData.userName} ({formData.userEmail})</p>
        <input type="hidden" name="doctorName" value={formData.doctorName} />
        <button type="submit">Submit</button>
      </form>

      {/* Hidden div for PDF generation */}
      <div id="pdf-content" style={{ display: 'none' }}>
        <h3>Appointment Details</h3>
        <p>Name: {formData.userName}</p>
        <p>Email: {formData.userEmail}</p>
        <p>Doctor Name: {formData.doctorName}</p>
      </div>
    </div>
  );
};

export default BookAppointment;
