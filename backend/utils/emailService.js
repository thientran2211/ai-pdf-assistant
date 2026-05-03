import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
  // Setup transporter (Use Gmail SMTP)
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: `Awesome PDF <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    html: options.html,
    text: options.text || 'Please use an email client that supports HTML to view this message.'
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Email sending failed:', error);
    throw new Error('Email could not be sent');
  }
};

export default sendEmail;