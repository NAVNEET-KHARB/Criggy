import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async ({ to, subject, html }) => {
  try {
    console.log("Resend API Key:", process.env.RESEND_API_KEY); // Log the Resend API Key
    console.log("Sending email to:", to); // Log the recipient email

    const data = await resend.emails.send({
      from: 'onboarding@resend.dev', // Ensure this email is verified with Resend
      to : 'example202444@gmail.com',
      subject,
      html,
    });

    console.log('Email sent successfully:', data); // Log success message
  } catch (error) {
    console.error('Failed to send email:', error.message || error); // Log detailed error message
  }
};

export default sendEmail;