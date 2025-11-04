import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, Circle, CookingPot, Bike, Home, Map, ClipboardCopy, Check, AlertTriangle } from 'lucide-react';
import { useOrders } from '../contexts/OrderContext';
import { Order, OrderStatus } from '../types';

interface StatusInfo {
  name: OrderStatus;
  icon: React.ElementType;
}

const STATUS_MAP: StatusInfo[] = [
  { name: 'Order Received', icon: CheckCircle },
  { name: 'Preparing Your Meal', icon: CookingPot },
  { name: 'Out for Delivery', icon: Bike },
  { name: 'Delivered', icon: Home },
];

const OrderStatusPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { listenToOrderById } = useOrders();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCopied, setIsCopied] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!orderId) {
        setError("No Order ID provided.");
        setIsLoading(false);
        return;
    };
    
    // Set up a real-time listener for the order
    const unsubscribe = listenToOrderById(orderId, (updatedOrder) => {
        if (updatedOrder) {
            setOrder(updatedOrder);
            setError('');
        } else {
            setError("Order not found. Please check the ID and try again.");
            setOrder(null);
        }
        setIsLoading(false);
    });

    // Clean up the listener when the component unmounts
    return () => {
      unsubscribe();
    };
  }, [orderId, listenToOrderById]);
  
  const handleCopy = () => {
    if (order?.id) {
        navigator.clipboard.writeText(order.id);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2500);
    }
  };
  
  if (isLoading) {
    return <div className="text-center p-12">Loading order details...</div>;
  }
  
  if (error) {
    return (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-lg text-center">
            <AlertTriangle className="mx-auto h-20 w-20 text-red-500" />
            <h1 className="mt-4 text-3xl font-black text-secondary">Order Not Found</h1>
            <p className="mt-2 text-gray-600">{error}</p>
            <Link 
                to="/track-order" 
                className="mt-8 inline-block w-full bg-primary text-white font-bold py-3 px-6 rounded-full hover:bg-primary-dark transition-colors duration-300"
            >
                Track Another Order
            </Link>
        </div>
    );
  }

  if (!order) {
    return null; // Should be covered by error state, but good for safety
  }
  
  const currentStatusIndex = STATUS_MAP.findIndex(s => s.name === order.status);

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-lg text-center">
      <CheckCircle className="mx-auto h-20 w-20 text-green-500" />
      <h1 className="mt-4 text-3xl font-black text-secondary">Thank You For Your Order!</h1>
      <p className="mt-2 text-gray-600">Your order is confirmed and its status is being updated below.</p>
      
      <div className="mt-6 text-center">
        <label className="text-sm font-bold text-gray-600">YOUR ORDER ID</label>
        <div className="mt-2 flex items-center justify-center gap-2 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-3">
          <span className="text-2xl font-mono font-bold text-secondary tracking-widest">{order.id}</span>
          <button
            onClick={handleCopy}
            className="relative p-2 rounded-full text-gray-500 hover:bg-gray-200 transition-colors"
            aria-label="Copy Order ID"
          >
            {isCopied ? <Check className="w-5 h-5 text-green-600" /> : <ClipboardCopy className="w-5 h-5" />}
          </button>
        </div>
        {isCopied && <p className="text-green-600 text-sm mt-2 animate-pulse">Copied to clipboard!</p>}
        <p className="text-xs text-gray-500 mt-2">Use this ID to track your order on the "Track Order" page.</p>
      </div>

      <div className="mt-8 bg-primary/10 border border-primary/20 rounded-lg p-4">
        <p className="font-semibold text-primary-dark">Estimated Delivery Time</p>
        <p className="text-2xl font-bold text-secondary">30-40 minutes</p>
      </div>

      <div className="mt-10 text-left">
        <h2 className="font-bold text-lg mb-4">Order Tracking</h2>
        <div className="relative">
            <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-gray-200" aria-hidden="true"></div>
            <ul className="space-y-8">
                {STATUS_MAP.map((statusInfo, index) => {
                    const isActive = index <= currentStatusIndex;
                    const isCurrent = index === currentStatusIndex;
                    const Icon = statusInfo.icon;
                    return (
                        <li key={statusInfo.name} className="relative flex items-center gap-4">
                            <div className={`flex items-center justify-center w-8 h-8 rounded-full z-10 ${isActive ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'}`}>
                                {isActive ? <Icon size={20} /> : <Circle size={20} />}
                            </div>
                            <div className="flex-grow flex justify-between items-center">
                                <span className={`font-semibold ${isActive ? 'text-secondary' : 'text-gray-500'}`}>{statusInfo.name}</span>
                            </div>
                            {isCurrent && order.status !== 'Delivered' && <div className="absolute left-12 -bottom-5 text-xs text-primary font-bold animate-pulse">In Progress...</div>}
                        </li>
                    )
                })}
            </ul>
        </div>
      </div>
      
       <div className="mt-12 text-left">
        <h2 className="font-bold text-lg mb-4 flex items-center gap-2"><Map size={20} /> Live Map (Coming Soon)</h2>
        <div className="relative rounded-lg overflow-hidden bg-gray-200">
            <img 
                src="https://i.imgur.com/7gXg3H2.png" 
                alt="Map placeholder showing a delivery route" 
                className="w-full h-48 object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                <p className="text-white text-center font-bold bg-black/40 px-4 py-2 rounded-md">Real-time driver tracking will appear here</p>
            </div>
        </div>
      </div>
      
      <Link 
        to="/menu" 
        className="mt-12 inline-block w-full bg-secondary text-white font-bold py-3 px-6 rounded-full hover:bg-gray-800 transition-colors duration-300"
      >
        Back to Menu
      </Link>
    </div>
  );
};

export default OrderStatusPage;