const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointmentdatabase');
const History = require('../models/history');
const Therapist = require('../models/theripest'); // Ensure you're using the correct model name
const authMiddleware = require('../middleware/authMiddleware'); // Middleware for authentication
const PDFDocument = require('pdfkit'); // Make sure you have this installed
const fs = require('fs');
const nodemailer = require('nodemailer');
const path = require('path'); // <-- Import path module

// Route to book an appointment
router.post('/book', authMiddleware, async (req, res) => {
    try {
        const { therapistId, appointmentTime, message } = req.body;
        const pdfPath = path.join(__dirname, '../uploads', `appointment-${Date.now()}.pdf`);

        // Fetch the therapist details from the database
        const therapist = await Therapist.findById(therapistId);
        if (!therapist) {
            return res.status(404).json({ msg: 'Therapist not found' });
        }

        // Use authenticated user's details (from the auth middleware)
        const userId = req.user.id;
        const userName = req.user.name;
        const userEmail = req.user.email;

        // Create a new appointment
        const newAppointment = new Appointment({
            userId, // Reference to the logged-in user
            userName, // Name of the logged-in user
            userEmail, // Email of the logged-in user
            therapistId: therapist._id, // ID of the therapist
            doctorName: therapist.name, // Name of the therapist
            appointmentTime, // Appointment time from the request body
            message // Optional message from the request body
        });

        // Save the appointment to the database
        await newAppointment.save();

        // Save the action in the history collection
        const newHistory = new History({
            userId,
            action: 'Appointment booked',
            therapistId: therapist._id,
            therapistName: therapist.name,
            username: userName,
            email: userEmail,
            date: new Date(),
        });

        await newHistory.save();

        // Generate the PDF
        await generatePDF(pdfPath, userName, therapist.name, appointmentTime);

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
const generatePDF = (pdfPath, userName, doctorName, appointmentTime) => {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument();
        const writeStream = fs.createWriteStream(pdfPath);

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
