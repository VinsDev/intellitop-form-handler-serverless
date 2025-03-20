const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*'); // Allow all origins
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS'); // Allow POST and OPTIONS methods
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type'); // Allow Content-Type header

    // Handle preflight OPTIONS request
    if (req.method === 'OPTIONS') {
        return res.status(200).end(); // Respond to preflight with 200 OK
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { fullName, email, phone, interest, message } = req.body;

    // Validate required fields
    if (!fullName || !email || !phone || !interest) {
        return res.status(400).json({ message: 'All required fields must be filled' });
    }

    // Set up Nodemailer with SendGrid
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        secure: true,
        auth: {
            user: "axisglobalenterprise01@gmail.com",
            pass: "ibmhsqhbrxbaobri",
        },
    });

    // Email options
    const mailOptions = {
        from: 'intellitopglobalconsult@gmail.com',
        to: 'intellitopglobalconsult@gmail.com',
        subject: `New Registration from ${fullName}`,
        text: `Full Name: ${fullName}\nEmail: ${email}\nPhone: ${phone}\nInterest: ${interest}\nMessage: ${message || 'N/A'}`,
        html: `<p><strong>Full Name:</strong> ${fullName}</p>
           <p><strong>Email:</strong> ${email}</p>
           <p><strong>Phone:</strong> ${phone}</p>
           <p><strong>Interest:</strong> ${interest}</p>
           <p><strong>Message:</strong> ${message || 'N/A'}</p>`,
    };

    try {
        await transporter.sendMail(mailOptions);
        return res.status(200).json({ message: 'Form submitted successfully' });
    } catch (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ message: 'Failed to send email' });
    }
};