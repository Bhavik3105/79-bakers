import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, MapPin, Send, CheckCircle, Loader, User, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Phone validation (optional but must be valid if provided)
    if (formData.phone && !formData.phone.match(/^[0-9]{10}$/)) {
      newErrors.phone = 'Phone number must be 10 digits';
    }

    // Subject validation
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }

    // Message validation
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setIsSubmitting(true);

    try {
      // Send data to API endpoint
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message');
      }

      // Success!
      setIsSuccess(true);
      toast.success('Message sent successfully! We\'ll get back to you soon. 📧');

      // Reset form after 3 seconds
      setTimeout(() => {
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        });
        setIsSuccess(false);
      }, 3000);

    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error(error.message || 'Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-24 px-4 bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold text-pink-900 mb-4">Get in Touch</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Have a question or want to order a custom cake? We'd love to hear from you! 
            Send us a message and we'll respond as soon as possible.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1 space-y-6"
          >
            {/* Contact Cards */}
            <div className="bg-white rounded-3xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-start gap-4">
                <div className="bg-gradient-to-br from-pink-500 to-rose-500 p-3 rounded-xl">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-pink-900 mb-2">Phone</h3>
                  <p className="text-gray-600">+91 98765 43210</p>
                  <p className="text-sm text-gray-500 mt-1">Mon-Sat, 9 AM - 8 PM</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-start gap-4">
                <div className="bg-gradient-to-br from-pink-500 to-rose-500 p-3 rounded-xl">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-pink-900 mb-2">Email</h3>
                  <p className="text-gray-600">hello@79bakers.com</p>
                  <p className="text-sm text-gray-500 mt-1">We reply within 24 hours</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-start gap-4">
                <div className="bg-gradient-to-br from-pink-500 to-rose-500 p-3 rounded-xl">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-pink-900 mb-2">Location</h3>
                  <p className="text-gray-600">Mumbai, Maharashtra</p>
                  <p className="text-sm text-gray-500 mt-1">Delivery across the city</p>
                </div>
              </div>
            </div>

            {/* Business Hours */}
            <div className="bg-gradient-to-br from-pink-600 to-rose-600 rounded-3xl shadow-lg p-6 text-white">
              <h3 className="font-bold text-xl mb-4">Business Hours</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Monday - Friday</span>
                  <span className="font-semibold">9:00 AM - 8:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday</span>
                  <span className="font-semibold">10:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday</span>
                  <span className="font-semibold">Closed</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-3xl shadow-xl p-8 relative overflow-hidden">
              {/* Success Overlay */}
              <AnimatePresence>
                {isSuccess && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="absolute inset-0 bg-white z-10 flex flex-col items-center justify-center"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                    >
                      <CheckCircle className="w-24 h-24 text-green-500 mb-6" />
                    </motion.div>
                    <h3 className="text-3xl font-bold text-pink-900 mb-2">Message Sent!</h3>
                    <p className="text-gray-600">We'll get back to you soon 🎂</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Form Header */}
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-pink-900 mb-2">Send us a Message</h2>
                <p className="text-gray-600">Fill out the form below and we'll respond within 24 hours</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name & Email Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-pink-900 mb-2">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 transition ${
                          errors.name 
                            ? 'border-red-500 focus:border-red-500' 
                            : 'border-gray-300 focus:border-pink-500'
                        } focus:outline-none`}
                        placeholder="John Doe"
                      />
                    </div>
                    {errors.name && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-500 text-sm mt-1"
                      >
                        {errors.name}
                      </motion.p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-pink-900 mb-2">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 transition ${
                          errors.email 
                            ? 'border-red-500 focus:border-red-500' 
                            : 'border-gray-300 focus:border-pink-500'
                        } focus:outline-none`}
                        placeholder="john@example.com"
                      />
                    </div>
                    {errors.email && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-500 text-sm mt-1"
                      >
                        {errors.email}
                      </motion.p>
                    )}
                  </div>
                </div>

                {/* Phone & Subject Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-pink-900 mb-2">
                      Phone Number (Optional)
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 transition ${
                          errors.phone 
                            ? 'border-red-500 focus:border-red-500' 
                            : 'border-gray-300 focus:border-pink-500'
                        } focus:outline-none`}
                        placeholder="9876543210"
                        maxLength={10}
                      />
                    </div>
                    {errors.phone && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-500 text-sm mt-1"
                      >
                        {errors.phone}
                      </motion.p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-pink-900 mb-2">
                      Subject *
                    </label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-xl border-2 transition ${
                        errors.subject 
                          ? 'border-red-500 focus:border-red-500' 
                          : 'border-gray-300 focus:border-pink-500'
                      } focus:outline-none`}
                    >
                      <option value="">Select a subject</option>
                      <option value="custom-order">Custom Cake Order</option>
                      <option value="general">General Inquiry</option>
                      <option value="delivery">Delivery Question</option>
                      <option value="feedback">Feedback</option>
                      <option value="complaint">Complaint</option>
                      <option value="other">Other</option>
                    </select>
                    {errors.subject && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-500 text-sm mt-1"
                      >
                        {errors.subject}
                      </motion.p>
                    )}
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-semibold text-pink-900 mb-2">
                    Your Message *
                  </label>
                  <div className="relative">
                    <MessageSquare className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={6}
                      className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 transition ${
                        errors.message 
                          ? 'border-red-500 focus:border-red-500' 
                          : 'border-gray-300 focus:border-pink-500'
                      } focus:outline-none resize-none`}
                      placeholder="Tell us about your inquiry or custom cake requirements..."
                    />
                  </div>
                  {errors.message && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-sm mt-1"
                    >
                      {errors.message}
                    </motion.p>
                  )}
                  <p className="text-sm text-gray-500 mt-1">
                    {formData.message.length} / 500 characters
                  </p>
                </div>

                {/* Submit Button */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 text-lg flex items-center justify-center gap-2 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader className="w-5 h-5 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Send Message
                      </>
                    )}
                  </Button>
                </motion.div>

                <p className="text-center text-sm text-gray-500">
                  By submitting this form, you agree to our privacy policy.
                </p>
              </form>
            </div>
          </motion.div>
        </div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-16"
        >
          <div className="bg-white rounded-3xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-pink-900 mb-8 text-center">
              Frequently Asked Questions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-pink-50 rounded-2xl">
                <h3 className="font-semibold text-pink-900 mb-2">How far in advance should I order?</h3>
                <p className="text-gray-600 text-sm">
                  We recommend ordering at least 24-48 hours in advance for standard cakes. 
                  Custom designs may require 3-5 days.
                </p>
              </div>
              <div className="p-6 bg-pink-50 rounded-2xl">
                <h3 className="font-semibold text-pink-900 mb-2">Do you deliver?</h3>
                <p className="text-gray-600 text-sm">
                  Yes! We deliver across Mumbai. Delivery is free for orders above ₹1000.
                </p>
              </div>
              <div className="p-6 bg-pink-50 rounded-2xl">
                <h3 className="font-semibold text-pink-900 mb-2">Can I customize my cake?</h3>
                <p className="text-gray-600 text-sm">
                  Absolutely! We specialize in custom cakes. Just tell us your requirements.
                </p>
              </div>
              <div className="p-6 bg-pink-50 rounded-2xl">
                <h3 className="font-semibold text-pink-900 mb-2">What payment methods do you accept?</h3>
                <p className="text-gray-600 text-sm">
                  We accept Cash on Delivery (COD). Online payment options coming soon!
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
