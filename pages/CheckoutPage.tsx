import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useOrders } from '../contexts/OrderContext';
import { useAuth } from '../contexts/AuthContext';
import { usePaystack } from '../hooks/usePaystack';
import { MapPin, AlertCircle, Lock } from 'lucide-react';
import { OrderDetails } from '../types';

const CheckoutPage: React.FC = () => {
  const { cartItems, total, deliveryFee, deliveryMessage, isOutOfZone, dispatch: cartDispatch } = useCart();
  const { user } = useAuth();
  const { createOrder } = useOrders();
  const { initializePayment } = usePaystack();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<OrderDetails>({
    name: '',
    phone: '',
    address: '',
  });
  const [errors, setErrors] = useState({ name: '', phone: '', address: '' });
  const [isProcessing, setIsProcessing] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { name: '', phone: '', address: '' };
    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required.';
      isValid = false;
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required.';
      isValid = false;
    } else if (!/^\d{11}$/.test(formData.phone)) {
        newErrors.phone = 'Please enter a valid 11-digit phone number.';
        isValid = false;
    }
    if (!formData.address.trim()) {
      newErrors.address = 'Delivery address is required.';
      isValid = false;
    }
    setErrors(newErrors);
    return isValid;
  };

  const handlePaymentSuccess = async (response: any) => {
      try {
        const newOrder = await createOrder(formData, cartItems, deliveryFee, response.reference);
        if (newOrder) {
          cartDispatch({ type: 'CLEAR_CART' });
          navigate(`/order-status/${newOrder.id}`);
        } else {
           alert("Payment was successful, but we could not create your order. Please contact support with your payment reference.");
        }
      } catch (error) {
        console.error("Order creation failed after payment:", error);
        alert("Payment was successful, but there was an error creating your order. Please contact support.");
      } finally {
        setIsProcessing(false);
      }
  };
  
  const handlePaymentClose = () => {
      setIsProcessing(false); // Re-enable the button if user closes the modal
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isOutOfZone || isProcessing || cartItems.length === 0 || !user) return;

    if (validateForm()) {
      setIsProcessing(true);
      initializePayment({
        email: user.email,
        amount: total * 100, // Paystack amount is in kobo
        onSuccess: handlePaymentSuccess,
        onClose: handlePaymentClose,
      });
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
      <h1 className="text-3xl font-black text-secondary mb-2">Checkout</h1>
      <p className="text-gray-600 mb-6">Please fill in your details to complete your order.</p>

      <div className={`border-l-4 p-4 rounded-md mb-8 ${isOutOfZone ? 'bg-red-50 border-red-500 text-red-800' : 'bg-orange-50 border-primary text-primary-dark'}`} role="alert">
        <div className="flex items-start">
          <MapPin className="h-5 w-5 mr-3 mt-1 flex-shrink-0" />
          <div>
            <p className="font-bold">Delivery Details</p>
            {deliveryMessage && <p className="text-sm">{deliveryMessage}</p>}
          </div>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} noValidate>
        <fieldset disabled={isOutOfZone}>
          <div className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-bold text-gray-700 mb-1">Full Name</label>
              <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className={`w-full px-4 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-primary focus:border-primary`} required />
              {errors.name && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={14}/>{errors.name}</p>}
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-bold text-gray-700 mb-1">Phone Number</label>
              <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} className={`w-full px-4 py-2 border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-primary focus:border-primary`} required />
              {errors.phone && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={14}/>{errors.phone}</p>}
            </div>
            <div>
              <label htmlFor="address" className="block text-sm font-bold text-gray-700 mb-1">Delivery Address</label>
              <input id="address" name="address" value={formData.address} onChange={handleChange} className={`w-full px-4 py-2 border ${errors.address ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-primary focus:border-primary`} required />
              {errors.address && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={14}/>{errors.address}</p>}
            </div>
            
            <div className="pt-4 border-t">
              <div className="p-4 bg-gray-50 rounded-lg border">
                  <h3 className="text-lg font-bold text-secondary mb-2">Secure Payment</h3>
                   <p className="text-sm text-gray-500 mb-4">
                      All transactions are secure and encrypted. Complete your purchase with our trusted payment partner.
                  </p>
                  <img src="https://assets.paystack.com/assets/img/logos/merchants/header-logo.svg" alt="Paystack logo" className="h-8 mb-4"/>
                  <div className="flex justify-between items-center text-xl font-bold mb-6">
                      <span>Total to Pay:</span>
                      <span>₦{total.toLocaleString()}</span>
                  </div>
                  <button 
                    type="submit" 
                    disabled={isProcessing || isOutOfZone || cartItems.length === 0}
                    className="w-full flex justify-center items-center gap-3 text-center bg-primary text-white font-bold py-3 px-6 rounded-full hover:bg-primary-dark transition-colors duration-300 disabled:bg-primary/50 disabled:cursor-not-allowed"
                  >
                    <Lock size={18} />
                    {isProcessing ? 'Connecting to payment...' : `Pay ₦${total.toLocaleString()}`}
                  </button>
              </div>
            </div>
          </div>
        </fieldset>
      </form>
    </div>
  );
};

export default CheckoutPage;