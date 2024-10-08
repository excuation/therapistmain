import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import html2pdf from 'html2pdf.js'; // Import html2pdf

const BookAppointment = () => {
  const { id } = useParams();  // Fetch therapist ID from the URL
  const [therapist, setTherapist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    userName: '',
    userEmail: '',
    doctorName: '' // Automatically set this based on the therapist's details
  });

  useEffect(() => {
    const fetchTherapist = async () => {
      try {
        console.log("hi");
        const response = await fetch(`http://localhost:5000/api/therapists/${id}`);  // Fetch therapist details using therapist ID
        if (!response.ok) throw new Error('Therapist not found');
        const data = await response.json();
        setTherapist(data);
        setFormData(prev => ({ ...prev, doctorName: data.name }));  // Set the therapist's name in the form data
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTherapist();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Generate PDF for appointment details
    const element = document.getElementById('pdf-content');
    const pdfOptions = {
      margin: 1,
      filename: 'appointment.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    // Generate the PDF
    html2pdf().from(element).set(pdfOptions).save().then(() => {
      // After saving the PDF, send it via email by calling the backend
      sendEmailWithPDF();
    });
  };

  const sendEmailWithPDF = async () => {
    // Sending the email with the appointment details to the backend
    await fetch('http://localhost:5000/api/appointments/book', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userName: formData.userName,
        userEmail: formData.userEmail,
        doctorName: formData.doctorName,
        appointmentTime: new Date(),  // You can get this from user input if needed
        message: "Appointment details attached"
      })
    });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!therapist) return <p>Therapist not found</p>;

  return (
    <div>
      <h2>Book Appointment with {therapist.name}</h2>
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          name="userName" 
          placeholder="Your Name" 
          value={formData.userName} 
          onChange={handleChange} 
          required 
        />
        <input 
          type="email" 
          name="userEmail" 
          placeholder="Your Email" 
          value={formData.userEmail} 
          onChange={handleChange} 
          required 
        />
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
