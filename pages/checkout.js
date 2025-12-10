import { useState } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import { 
  CreditCard, 
  Truck, 
  MapPin, 
  Phone, 
  Mail, 
  User,
  Calendar,
  Clock,
  MessageSquare,
  ShoppingBag,
  CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function Checkout() {
  const router = useRouter();
  const { cartItems, clearCart } = useCart();
  const [step, setStep] = useState(1); // 1: Details, 2: Payment, 3: Confirmation
  const [isProcessing, setIsProcessing] = useState(false);

  const [formData, setFormData] = useState({
    // Customer Details
    fullName: '',
    email: '',
    phone: '',
    
    // Delivery Address
    address: '',
    city: '',
    pincode: '',
    landmark: '',
    
    // Delivery Details
    deliveryDate: '',
    deliveryTime: 'morning',
    
    // Order Details
    specialInstructions: '',
    cakeMessage: '',
    
    // Payment
    paymentMethod: 'cod'
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateStep1 = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) newErrors.fullName = 'Name is required';
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newErrors.email = 'Valid email is required';
    }
    if (!formData.phone.match(/^[0-9]{10}$/)) {
      newErrors.phone = 'Valid 10-digit phone number required';
    }
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.pincode.match(/^[0-9]{6}$/)) {
      newErrors.pincode = 'Valid 6-digit pincode required';
    }
    if (!formData.deliveryDate) newErrors.deliveryDate = 'Delivery date is required';
    
    // Check if delivery date is not in the past
    const selectedDate = new Date(formData.deliveryDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      newErrors.deliveryDate = 'Delivery date cannot be in the past';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinueToPayment = () => {
    if (validateStep1()) {
      setStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      toast.error('Please fill in all required fields correctly');
    }
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    
    try {
      // Prepare order data
      const orderData = {
        items: cartItems.map(item => ({
          id: item._id || item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image
        })),
        customerInfo: {
          name: formData.fullName,
          email: formData.email,
          phone: formData.phone
        },
        deliveryAddress: {
          address: formData.address,
          city: formData.city,
          pincode: formData.pincode,
          landmark: formData.landmark
        },
        deliveryDate: formData.deliveryDate,
        deliveryTime: formData.deliveryTime,
        specialInstructions: formData.specialInstructions,
        cakeMessage: formData.cakeMessage,
        paymentMethod: formData.paymentMethod
      };

      // Send order to backend
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to place order');
      }

      // Success - clear cart and show confirmation
      setIsProcessing(false);
      setStep(3);
      clearCart();
      
      toast.success('Order placed successfully! 🎉');
      
      // Store order data in session storage for confirmation page
      sessionStorage.setItem('lastOrder', JSON.stringify({
        orderNumber: data.order.orderNumber,
        orderId: data.order.id,
        ...formData,
        items: cartItems,
        total: calculateTotal(),
        date: new Date().toISOString()
      }));

    } catch (error) {
      console.error('Order creation error:', error);
      toast.error(error.message || 'Failed to place order. Please try again.');
      setIsProcessing(false);
    }
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const calculateDelivery = () => {
    const subtotal = calculateSubtotal();
    return subtotal > 1000 ? 0 : 50; // Free delivery above ₹1000
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateDelivery();
  };

  // Get minimum delivery date (tomorrow)
  const getMinDeliveryDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  if (cartItems.length === 0 && step !== 3) {
    return (
      <div className="min-h-screen py-24 px-4 flex items-center justify-center bg-gradient-to-br from-pink-50 to-rose-50">
        <div className="text-center">
          <ShoppingBag className="w-24 h-24 text-pink-300 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-pink-900 mb-4">Your Cart is Empty</h1>
          <p className="text-gray-600 mb-8">Add some delicious cakes to your cart first!</p>
          <Link href="/">
            <Button>Browse Cakes</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Step 3: Order Confirmation
  if (step === 3) {
    const lastOrder = JSON.parse(sessionStorage.getItem('lastOrder') || '{}');
    
    return (
      <div className="min-h-screen py-24 px-4 bg-gradient-to-br from-pink-50 to-rose-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl mx-auto"
        >
          <div className="bg-white rounded-3xl shadow-2xl p-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            >
              <CheckCircle className="w-24 h-24 text-green-500 mx-auto mb-6" />
            </motion.div>
            
            <h1 className="text-4xl font-bold text-pink-900 mb-4">
              Order Confirmed! 🎉
            </h1>
            
            <p className="text-gray-600 mb-8">
              Thank you for your order! We'll start preparing your delicious cakes right away.
            </p>
            
            <div className="bg-pink-50 rounded-2xl p-6 mb-8">
              <div className="text-sm text-pink-700 mb-2">Order Number</div>
              <div className="text-3xl font-bold text-pink-900">
                {lastOrder.orderNumber}
              </div>
            </div>
            
            <div className="space-y-4 text-left mb-8">
              <div className="flex items-start gap-3">
                <Truck className="w-5 h-5 text-pink-600 mt-1" />
                <div>
                  <div className="font-semibold text-pink-900">Delivery Details</div>
                  <div className="text-gray-600">
                    {lastOrder.deliveryDate} - {lastOrder.deliveryTime === 'morning' ? 'Morning (9 AM - 12 PM)' : 
                     lastOrder.deliveryTime === 'afternoon' ? 'Afternoon (12 PM - 4 PM)' : 
                     'Evening (4 PM - 8 PM)'}
                  </div>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-pink-600 mt-1" />
                <div>
                  <div className="font-semibold text-pink-900">Confirmation Email</div>
                  <div className="text-gray-600">
                    Order confirmation sent to {lastOrder.email}
                  </div>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <CreditCard className="w-5 h-5 text-pink-600 mt-1" />
                <div>
                  <div className="font-semibold text-pink-900">Payment Method</div>
                  <div className="text-gray-600">
                    {lastOrder.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/" className="flex-1">
                <Button variant="outline" className="w-full">
                  Continue Shopping
                </Button>
              </Link>
              <Link href={`/orders/${lastOrder.orderId}`} className="flex-1">
                <Button className="w-full">
                  View Order Details
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-24 px-4 bg-gradient-to-br from-pink-50 to-rose-50">
      <div className="max-w-7xl mx-auto">
        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-center gap-4">
            <div className={`flex items-center gap-2 ${step >= 1 ? 'text-pink-600' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                step >= 1 ? 'bg-pink-600 text-white' : 'bg-gray-200'
              }`}>
                1
              </div>
              <span className="hidden sm:inline font-medium">Details</span>
            </div>
            
            <div className={`h-1 w-16 ${step >= 2 ? 'bg-pink-600' : 'bg-gray-300'}`} />
            
            <div className={`flex items-center gap-2 ${step >= 2 ? 'text-pink-600' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                step >= 2 ? 'bg-pink-600 text-white' : 'bg-gray-200'
              }`}>
                2
              </div>
              <span className="hidden sm:inline font-medium">Payment</span>
            </div>
            
            <div className={`h-1 w-16 ${step >= 3 ? 'bg-pink-600' : 'bg-gray-300'}`} />
            
            <div className={`flex items-center gap-2 ${step >= 3 ? 'text-pink-600' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                step >= 3 ? 'bg-pink-600 text-white' : 'bg-gray-200'
              }`}>
                3
              </div>
              <span className="hidden sm:inline font-medium">Confirm</span>
              </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Form */}
          <div className="lg:col-span-2">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-3xl shadow-lg p-8"
            >
              {step === 1 && (
                <div className="space-y-8">
                  <h2 className="text-3xl font-bold text-pink-900 mb-6">
                    Delivery Details
                  </h2>

                  {/* Customer Information */}
                  <div>
                    <h3 className="text-xl font-semibold text-pink-800 mb-4 flex items-center gap-2">
                      <User className="w-5 h-5" />
                      Customer Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 rounded-lg border-2 transition ${
                            errors.fullName ? 'border-red-500' : 'border-gray-300 focus:border-pink-500'
                          } focus:outline-none`}
                          placeholder="John Doe"
                        />
                        {errors.fullName && (
                          <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 rounded-lg border-2 transition ${
                            errors.phone ? 'border-red-500' : 'border-gray-300 focus:border-pink-500'
                          } focus:outline-none`}
                          placeholder="9876543210"
                          maxLength={10}
                        />
                        {errors.phone && (
                          <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                        )}
                      </div>
                      
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 rounded-lg border-2 transition ${
                            errors.email ? 'border-red-500' : 'border-gray-300 focus:border-pink-500'
                          } focus:outline-none`}
                          placeholder="john@example.com"
                        />
                        {errors.email && (
                          <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Delivery Address */}
                  <div>
                    <h3 className="text-xl font-semibold text-pink-800 mb-4 flex items-center gap-2">
                      <MapPin className="w-5 h-5" />
                      Delivery Address
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Complete Address *
                        </label>
                        <textarea
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          rows={3}
                          className={`w-full px-4 py-3 rounded-lg border-2 transition ${
                            errors.address ? 'border-red-500' : 'border-gray-300 focus:border-pink-500'
                          } focus:outline-none`}
                          placeholder="House/Flat No., Street, Area"
                        />
                        {errors.address && (
                          <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            City *
                          </label>
                          <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 rounded-lg border-2 transition ${
                              errors.city ? 'border-red-500' : 'border-gray-300 focus:border-pink-500'
                            } focus:outline-none`}
                            placeholder="Mumbai"
                          />
                          {errors.city && (
                            <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                          )}
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Pincode *
                          </label>
                          <input
                            type="text"
                            name="pincode"
                            value={formData.pincode}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 rounded-lg border-2 transition ${
                              errors.pincode ? 'border-red-500' : 'border-gray-300 focus:border-pink-500'
                            } focus:outline-none`}
                            placeholder="400001"
                            maxLength={6}
                          />
                          {errors.pincode && (
                            <p className="text-red-500 text-sm mt-1">{errors.pincode}</p>
                          )}
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Landmark
                          </label>
                          <input
                            type="text"
                            name="landmark"
                            value={formData.landmark}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-pink-500 focus:outline-none transition"
                            placeholder="Near park"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Delivery Schedule */}
                  <div>
                    <h3 className="text-xl font-semibold text-pink-800 mb-4 flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      Delivery Schedule
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Delivery Date *
                        </label>
                        <input
                          type="date"
                          name="deliveryDate"
                          value={formData.deliveryDate}
                          onChange={handleChange}
                          min={getMinDeliveryDate()}
                          className={`w-full px-4 py-3 rounded-lg border-2 transition ${
                            errors.deliveryDate ? 'border-red-500' : 'border-gray-300 focus:border-pink-500'
                          } focus:outline-none`}
                        />
                        {errors.deliveryDate && (
                          <p className="text-red-500 text-sm mt-1">{errors.deliveryDate}</p>
                        )}
                        <p className="text-sm text-gray-500 mt-1">
                          Minimum 24 hours advance notice required
                        </p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Delivery Time *
                        </label>
                        <select
                          name="deliveryTime"
                          value={formData.deliveryTime}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-pink-500 focus:outline-none transition"
                        >
                          <option value="morning">Morning (9 AM - 12 PM)</option>
                          <option value="afternoon">Afternoon (12 PM - 4 PM)</option>
                          <option value="evening">Evening (4 PM - 8 PM)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Special Instructions */}
                  <div>
                    <h3 className="text-xl font-semibold text-pink-800 mb-4 flex items-center gap-2">
                      <MessageSquare className="w-5 h-5" />
                      Additional Details
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Message on Cake (Optional)
                        </label>
                        <input
                          type="text"
                          name="cakeMessage"
                          value={formData.cakeMessage}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-pink-500 focus:outline-none transition"
                          placeholder="Happy Birthday!"
                          maxLength={50}
                        />
                        <p className="text-sm text-gray-500 mt-1">
                          Max 50 characters
                        </p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Special Instructions (Optional)
                        </label>
                        <textarea
                          name="specialInstructions"
                          value={formData.specialInstructions}
                          onChange={handleChange}
                          rows={3}
                          className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-pink-500 focus:outline-none transition"
                          placeholder="Any special requests or instructions..."
                        />
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={handleContinueToPayment}
                    className="w-full py-6 text-lg"
                  >
                    Continue to Payment
                  </Button>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-8">
                  <h2 className="text-3xl font-bold text-pink-900 mb-6">
                    Payment Method
                  </h2>

                  <div className="space-y-4">
                    <label className="flex items-start gap-4 p-6 border-2 border-gray-300 rounded-xl cursor-pointer hover:border-pink-500 transition">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cod"
                        checked={formData.paymentMethod === 'cod'}
                        onChange={handleChange}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 font-semibold text-pink-900 mb-2">
                          <Truck className="w-5 h-5" />
                          Cash on Delivery
                        </div>
                        <p className="text-gray-600 text-sm">
                          Pay with cash when your order is delivered
                        </p>
                      </div>
                    </label>

                    <label className="flex items-start gap-4 p-6 border-2 border-gray-300 rounded-xl cursor-pointer hover:border-pink-500 transition opacity-50">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="online"
                        disabled
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 font-semibold text-pink-900 mb-2">
                          <CreditCard className="w-5 h-5" />
                          Online Payment
                          <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">
                            Coming Soon
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm">
                          Pay securely using UPI, Cards, or Net Banking
                        </p>
                      </div>
                    </label>
                  </div>

                  <div className="bg-pink-50 rounded-2xl p-6">
                    <h3 className="font-semibold text-pink-900 mb-4">Order Summary</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>₹{calculateSubtotal()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Delivery Charges</span>
                        <span>{calculateDelivery() === 0 ? 'FREE' : `₹${calculateDelivery()}`}</span>
                      </div>
                      <div className="border-t border-pink-200 pt-2 mt-2 flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span className="text-pink-600">₹{calculateTotal()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button
                      onClick={() => setStep(1)}
                      variant="outline"
                      className="flex-1 py-6"
                    >
                      Back
                    </Button>
                    <Button
                      onClick={handlePlaceOrder}
                      disabled={isProcessing}
                      className="flex-1 py-6 text-lg"
                    >
                      {isProcessing ? 'Processing...' : 'Place Order'}
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-lg p-6 sticky top-24">
              <h3 className="text-xl font-bold text-pink-900 mb-6">Your Order</h3>
              
              <div className="space-y-4 mb-6">
                {cartItems.map((item, index) => (
                  <div key={index} className="flex gap-4 pb-4 border-b border-gray-200 last:border-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-pink-900 mb-1">{item.name}</h4>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                      <p className="text-pink-600 font-medium">₹{item.price * item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 text-sm border-t border-gray-200 pt-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">₹{calculateSubtotal()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery</span>
                  <span className="font-medium text-green-600">
                    {calculateDelivery() === 0 ? 'FREE' : `₹${calculateDelivery()}`}
                  </span>
                </div>
                {calculateDelivery() > 0 && (
                  <p className="text-xs text-gray-500">
                    Add ₹{1000 - calculateSubtotal()} more for free delivery
                  </p>
                )}
                <div className="border-t border-gray-200 pt-3 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-pink-600">₹{calculateTotal()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
