import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, AlertCircle } from 'lucide-react';

const TrackOrderPage: React.FC = () => {
  const [orderId, setOrderId] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim()) {
      setError('Please enter your Order ID.');
      return;
    }
    // Simple validation for the order ID format generated in checkout
    if (!/^CX-[A-Z0-9]{9}$/i.test(orderId.trim())) {
        setError('Please enter a valid Order ID format (e.g., CX-ABC123DEF).');
        return;
    }
    setError('');
    navigate(`/order-status/${orderId.trim().toUpperCase()}`);
  };

  return (
    <div className="max-w-md mx-auto text-center py-10">
      <Search className="mx-auto h-20 w-20 text-primary mb-4" />
      <h1 className="text-4xl font-black text-secondary mb-4">Track Your Order</h1>
      <p className="text-gray-600 mb-8">Enter your Order ID below to see the status of your delivery.</p>
      
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-lg flex flex-col gap-4">
        <div>
          <label htmlFor="orderId" className="sr-only">Order ID</label>
          <div className="relative">
             <input
                type="text"
                id="orderId"
                value={orderId}
                onChange={(e) => {
                    setOrderId(e.target.value);
                    if (error) setError('');
                }}
                placeholder="e.g., CX-ABC123DEF"
                className={`w-full px-4 py-3 text-lg border ${error ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-primary focus:border-primary uppercase placeholder:normal-case`}
            />
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
          {error && <p className="text-red-500 text-sm mt-2 text-left flex items-center gap-1"><AlertCircle size={16}/>{error}</p>}
        </div>
       
        <button 
          type="submit" 
          className="w-full bg-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-primary-dark transition-colors duration-300"
        >
          Track Order
        </button>
      </form>
    </div>
  );
};

export default TrackOrderPage;
