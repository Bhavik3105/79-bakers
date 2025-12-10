// pages/api/contact.js
import connectDB from '@/lib/mongodb';
import Contact from '@/models/Contact';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Connect to database
    await connectDB();

    const { name, email, phone, subject, message } = req.body;

    // Basic validation
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        fields: { name: !name, email: !email, subject: !subject, message: !message }
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email address' });
    }

    // Phone validation (if provided)
    if (phone && !phone.match(/^[0-9]{10}$/)) {
      return res.status(400).json({ error: 'Invalid phone number' });
    }

    // Save to database
    const contact = await Contact.create({
      name,
      email,
      phone,
      subject,
      message,
      status: 'new'
    });

    console.log('✅ Contact form saved to database:', contact._id);

    // TODO: Send email notifications
    // await sendEmailToAdmin({ name, email, phone, subject, message });
    // await sendAutoReplyToCustomer({ name, email });

    return res.status(200).json({ 
      success: true,
      message: 'Message received successfully',
      data: {
        id: contact._id,
        name,
        email,
        subject,
        timestamp: contact.createdAt
      }
    });

  } catch (error) {
    console.error('❌ Contact form error:', error);
    return res.status(500).json({ 
      error: 'Failed to process contact form',
      message: error.message 
    });
  }
}
