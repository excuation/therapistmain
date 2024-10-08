const express = require('express');
const nodemailer = require('nodemailer');
const fs = require('fs');
const PDFDocument = require('pdfkit');
const Appointment = require('../models/Appointmentdatabase');
const Therapist = require('../models/theripest'); // Import the correct Therapist model
const path = require('path');
const router = express.Router();

// Route to book an appointment
router.post('/book', async (req, res) => {
    const { userName, userEmail, doctorName, appointmentTime, message } = req.body;
    const pdfPath = path.join(__dirname, `../uploads/${userName}_appointment.pdf`);

    try {
        console.log('Received data:', req.body);

        // Save the appointment in the database
        const newAppointment = new Appointment({
            userName,
            userEmail,
            doctorName,
            appointmentTime,
            message
        });
        await newAppointment.save();

        // Generate the PDF
        await generatePDF(pdfPath, userName, doctorName, appointmentTime);

        // Send the email with the PDF attachment
        await sendEmail(userEmail, pdfPath);

        // Respond to the client
        res.status(200).json({ message: 'Appointment booked and email sent successfully!' });
    } catch (error) {
        console.error('Error booking appointment:', error);
        res.status(500).json({ message: 'Error booking appointment or sending email', error });
    }
});

// Function to generate PDF
const generatePDF = (path, userName, doctorName, appointmentTime) => {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument();
        const writeStream = fs.createWriteStream(path);

        doc.pipe(writeStream);
        doc.fontSize(25).text('Appointment Confirmation', { align: 'center' });
        doc.moveDown();
        doc.fontSize(16).text(`Name: ${userName}`);
        doc.text(`Doctor Name: ${doctorName}`);
        doc.text(`Appointment Time: ${appointmentTime}`);
        
        // End the document properly
        doc.end();

        writeStream.on('finish', () => {
            resolve();
        });

        writeStream.on('error', (err) => {
            reject(err);
        });
    });
};

// Function to send email with PDF attachment
const sendEmail = async (toEmail, pdfPath) => {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: "anuragsharma07575@gmail.com",  
            pass: "cpwo hjxb xfmx wrgg",  
        },
    });

    let mailOptions = {
        from: process.env.EMAIL_USER,
        to: toEmail,
        subject: 'Your Appointment Confirmation',
        text: 'Please find attached your appointment details.',
        attachments: [
            {
                path: pdfPath,
            },
        ],
    };

    // Send the email
    await transporter.sendMail(mailOptions);
};

// Export the router
module.exports = router;
