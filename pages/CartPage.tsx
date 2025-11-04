
import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const CartPage: React.FC = () => {
  const { cartItems, dispatch, subtotal, total, deliveryFee, deliveryMessage, isOutOfZone } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role === 'admin' || user?.role === 'super-admin') {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [user, navigate]);

  // FIX: Changed id parameter type from number to string to match the CartItem type.
  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  // FIX: Changed id parameter type from number to string to match the CartItem type.
  const removeItem = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  };

  if (cartItems.length === 0) {
    return (
      <div className="text-center py-20">
        <ShoppingBag className="mx-auto h-24 w-24 text-gray-300" />
        <h2 className="mt-4 text-2xl font-bold text-secondary">Your Cart is Empty</h2>
        <p className="mt-2 text-gray-500">Looks like you haven't added anything to your cart yet.</p>
        <Link 
          to="/menu" 
          className="mt-6 inline-block bg-primary text-white font-bold py-3 px-6 rounded-full hover:bg-primary-dark transition-colors duration-300"
        >
          Browse Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-black text-secondary mb-8">Your Cart</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-lg space-y-4">
          {cartItems.map((item) => (
            <div key={item.id} className="flex items-center gap-4 border-b pb-4 last:border-b-0 last:pb-0">
              <img src={item.imageUrl} alt={item.name} className="w-20 h-20 rounded-lg object-cover" />
              <div className="flex-grow">
                <h3 className="font-bold">{item.name}</h3>
                <p className="text-sm text-gray-500">₦{item.price.toLocaleString()}</p>
              </div>
              <div className="flex items-center gap-2 border rounded-full p-1">
                <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1 rounded-full hover:bg-gray-100"><Minus size={16} /></button>
                <span className="w-8 text-center font-bold">{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1 rounded-full hover:bg-gray-100"><Plus size={16} /></button>
              </div>
              <p className="font-bold w-24 text-right">₦{(item.price * item.quantity).toLocaleString()}</p>
              <button onClick={() => removeItem(item.id)} className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50"><Trash2 size={20} /></button>
            </div>
          ))}
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg h-fit sticky top-24">
          <h2 className="text-xl font-bold border-b pb-4 mb-4">Order Summary</h2>
          <div className="space-y-3 text-gray-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold">₦{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span className="font-semibold">
                 {isOutOfZone ? 'N/A' : (deliveryFee > 0 ? `₦${deliveryFee.toLocaleString()}`: '...')}
              </span>
            </div>
            {deliveryMessage && <p className={`text-xs pt-2 ${isOutOfZone ? 'text-red-600 font-semibold' : 'text-gray-500'}`}>{deliveryMessage}</p>}
          </div>
          <div className="flex justify-between font-black text-xl text-secondary mt-4 pt-4 border-t">
            <span>Total</span>
            <span>₦{total.toLocaleString()}</span>
          </div>
          <Link 
            to="/checkout"
            onClick={(e) => { if (isOutOfZone) e.preventDefault(); }}
            className={`mt-6 w-full text-center block bg-primary text-white font-bold py-3 px-6 rounded-full hover:bg-primary-dark transition-colors duration-300 ${isOutOfZone ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CartPage;