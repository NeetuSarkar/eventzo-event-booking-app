// utils/emailService.js
import nodemailer from "nodemailer";

// Create transporter
const transporter = nodemailer.createTransport({
  service: "Gmail", // or your email service
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendTicketEmail = async ({ email, name, booking, pdfBuffer }) => {
  try {
    const mailOptions = {
      from: `"Event Platform" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Your Ticket for ${booking.activity.title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2c3e50;">Hello ${name},</h2>
          <p>Thank you for your booking! Here are your ticket details:</p>
          
          <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="margin-top: 0;">${booking.activity.title}</h3>
            <p><strong>Date:</strong> ${new Date(
              booking.activity.date
            ).toLocaleDateString()}</p>
            <p><strong>Time:</strong> ${booking.activity.time}</p>
            <p><strong>Location:</strong> ${booking.activity.location}</p>
            <p><strong>Tickets:</strong> ${booking.quantity}</p>
            <p><strong>Booking ID:</strong> ${booking._id}</p>
          </div>
          
          <p>Your ticket PDF is attached to this email. Please present it at the event entrance.</p>
          
          <p>If you have any questions, please contact our support team.</p>
          
          <p>Best regards,<br>The Event Platform Team</p>
        </div>
      `,
      attachments: [
        {
          filename: `ticket-${booking._id}.pdf`,
          content: Buffer.from(pdfBuffer),
          contentType: "application/pdf",
        },
      ],
    };

    await transporter.sendMail(mailOptions);
    console.log(`Ticket email sent to ${email}`);
  } catch (error) {
    console.error("Error sending ticket email:", error);
    throw error;
  }
};
