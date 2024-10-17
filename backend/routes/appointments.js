const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointmentdatabase');
const History = require('../models/history');
const Therapist = require('../models/theripest'); // Ensure you're using the correct model name
const Ticket = require('../models/ticket'); // Import Ticket model
const authMiddleware = require('../middleware/authMiddleware'); // Middleware for authentication
const PDFDocument = require('pdfkit');
const fs = require('fs');
const nodemailer = require('nodemailer');
const path = require('path');

// Route to book an appointment and save ticket info
router.post('/book', authMiddleware, async (req, res) => {
    try {
        const { therapistId, appointmentTime, message, location, disease } = req.body;
        const pdfPath = path.join(__dirname, '../uploads', `appointment-${Date.now()}.pdf`);
        console.log(req.body); // Log the request body to verify input values

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
            userId,
            userName,
            userEmail,
            therapistId: therapist._id,
            doctorName: therapist.name,
            appointmentTime,
            message,
            location, // Add location field
            disease,  // Add disease field
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

        // Create a new ticket with the relevant details
        const newTicket = new Ticket({
            therapistId: therapist._id,
            service: "Mental Counseling",
            date: appointmentTime,
            time: appointmentTime,
            therapistName: therapist.name,
            userName,
            location,
            disease,
            userId
        });
        await newTicket.save();

        // Save the ticket to the database
        await newTicket.save();

        // Generate the PDF and pass location and disease to the function
        await generatePDF(pdfPath, userName, therapist.name, appointmentTime, location, disease);

        // Send the email with the PDF attachment
        await sendEmail(userEmail, pdfPath);

        // Respond to the client
        res.status(200).json({ message: 'Appointment booked, ticket saved, and email sent successfully!' });
    } catch (error) {
        console.error('Error booking appointment:', error);
        res.status(500).json({ message: 'Error booking appointment or sending email', error });
    }
});

// Function to generate PDF
const generatePDF = (pdfPath, userName, doctorName, appointmentTime, location, disease) => {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument();
        const writeStream = fs.createWriteStream(pdfPath);

        doc.pipe(writeStream);
        doc.fontSize(30).text('Appointment Confirmation', { align: 'center' });
        doc.moveDown();
        doc.fontSize(20).text(`Name: ${userName}`);
        doc.text(`Doctor Name: ${doctorName}`);
        doc.text(`Appointment Date: ${appointmentTime}`);
        doc.text(`Location: ${location}`); // Add location to PDF content
        doc.text(`Disease: ${disease}`); // Add disease to PDF content

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
        host: 'smtp.gmail.com',
        port: 465, // or 587 for TLS
        secure: true, // use SSL
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