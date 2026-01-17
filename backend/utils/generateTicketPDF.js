import puppeteer from "puppeteer";

export const generateTicketPDF = async (booking) => {
  const htmlContent = `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; }
          .ticket { border: 1px solid #ddd; padding: 20px; border-radius: 8px; }
        </style>
      </head>
      <body>
        <h1 style="text-align: center;">Event Ticket</h1>
        <div class="ticket">
          <h2>${booking.activity.title}</h2>
          <p><strong>Location:</strong> ${booking.activity.location}</p>
          <p><strong>Date:</strong> ${new Date(
            booking.activity.date
          ).toLocaleDateString()}</p>
          <p><strong>Time:</strong> ${booking.activity.time}</p>
          <hr>
          <h3>Attendee Information</h3>
          <p><strong>Name:</strong> ${booking.user.name}</p>
          <p><strong>Tickets:</strong> ${booking.quantity}</p>
          <p><strong>Booking ID:</strong> ${booking._id}</p>
        </div>
      </body>
    </html>
  `;

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(htmlContent, { waitUntil: "networkidle0" });

  const pdfBuffer = await page.pdf({ format: "A4" });

  await browser.close();
  return pdfBuffer;
};
