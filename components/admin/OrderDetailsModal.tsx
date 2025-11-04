import React from 'react';
import { X, User, Phone, MapPin } from 'lucide-react';
import { Order } from '../../types';

interface OrderDetailsModalProps {
  order: Order;
  onClose: () => void;
}

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({ order, onClose }) => {
  return (
    <div 
        className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center" 
        onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 md:p-8" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center border-b pb-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-secondary">Order Details</h2>
            <p className="font-mono text-sm text-gray-500">{order.id}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full text-gray-500 hover:bg-gray-100">
            <X size={24} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-bold text-gray-600 mb-2">CUSTOMER DETAILS</h3>
                <div className="space-y-2 text-sm">
                    <p className="flex items-center gap-2"><User size={14} className="text-gray-500"/> {order.customerDetails.name}</p>
                    <p className="flex items-center gap-2"><Phone size={14} className="text-gray-500"/> {order.customerDetails.phone}</p>
                    <p className="flex items-center gap-2"><MapPin size={14} className="text-gray-500"/> {order.customerDetails.address}</p>
                </div>
            </div>
             <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-bold text-gray-600 mb-2">ORDER SUMMARY</h3>
                <div className="space-y-2 text-sm">
                    <p className="flex justify-between"><span>Subtotal:</span> <span>₦{order.subtotal.toLocaleString()}</span></p>
                    <p className="flex justify-between"><span>Delivery Fee:</span> <span>₦{order.deliveryFee.toLocaleString()}</span></p>
                    <p className="flex justify-between font-bold text-base border-t pt-2 mt-2"><span>Total:</span> <span>₦{order.total.toLocaleString()}</span></p>
                </div>
            </div>
        </div>

        <div>
          <h3 className="text-lg font-bold text-secondary mb-4">Items Ordered</h3>
          <div className="space-y-3">
            {order.items.map(item => (
              <div key={item.id} className="flex items-center gap-4 bg-white p-2 border rounded-lg">
                <img src={item.imageUrl} alt={item.name} className="w-16 h-16 rounded-md object-cover" />
                <div className="flex-grow">
                  <p className="font-bold">{item.name}</p>
                  <p className="text-sm text-gray-500">₦{item.price.toLocaleString()} x {item.quantity}</p>
                </div>
                <p className="font-semibold text-secondary">₦{(item.price * item.quantity).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;