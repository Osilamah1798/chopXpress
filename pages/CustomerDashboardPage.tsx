import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useOrders } from '../contexts/OrderContext';
import { useCart } from '../hooks/useCart';
import { Order, CartItem } from '../types';
import { useNavigate, Link } from 'react-router-dom';
import { Package, RefreshCw, Loader } from 'lucide-react';

const CustomerDashboardPage: React.FC = () => {
    const { user } = useAuth();
    const { getOrdersByUserId } = useOrders();
    const { dispatch } = useCart();
    const navigate = useNavigate();
    const [userOrders, setUserOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUserOrders = async () => {
            if (user) {
                setIsLoading(true);
                const orders = await getOrdersByUserId(user.id);
                setUserOrders(orders);
                setIsLoading(false);
            }
        };
        fetchUserOrders();
    }, [user, getOrdersByUserId]);
    
    // This check is belt-and-suspenders, as the route is protected.
    if (!user) {
        return <p>Please log in to see your dashboard.</p>;
    }

    const handleReorder = (items: CartItem[]) => {
        if (window.confirm('This will clear your current cart and add items from this past order. Are you sure?')) {
            dispatch({ type: 'CLEAR_CART' });
            items.forEach(item => {
                // The item from the order already has a quantity. We need to add it one by one.
                const menuItem = { ...item }; // create a copy to avoid mutation issues
                for (let i = 0; i < item.quantity; i++) {
                    dispatch({ type: 'ADD_ITEM', payload: menuItem });
                }
            });
            navigate('/cart');
        }
    };
    
    const getStatusColor = (status: Order['status']) => {
        switch (status) {
            case 'Order Received': return 'bg-blue-100 text-blue-800';
            case 'Preparing Your Meal': return 'bg-yellow-100 text-yellow-800';
            case 'Out for Delivery': return 'bg-purple-100 text-purple-800';
            case 'Delivered': return 'bg-green-100 text-green-800';
            case 'Cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-black text-secondary mb-2">Welcome, {user.username}!</h1>
            <p className="text-gray-600 mb-8">Here are your past orders. You can easily re-order your favorites.</p>

            {isLoading ? (
                 <div className="flex justify-center items-center h-64">
                    <Loader className="w-12 h-12 animate-spin text-primary" />
                </div>
            ) : userOrders.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl shadow-lg">
                    <Package className="mx-auto h-24 w-24 text-gray-300" />
                    <h2 className="mt-4 text-2xl font-bold text-secondary">No Past Orders Found</h2>
                    <p className="mt-2 text-gray-500">You haven't placed any orders with us yet.</p>
                    <Link to="/menu" className="mt-6 inline-block bg-primary text-white font-bold py-3 px-6 rounded-full hover:bg-primary-dark transition-colors duration-300">
                        Start Your First Order
                    </Link>
                </div>
            ) : (
                <div className="bg-white p-4 md:p-6 rounded-2xl shadow-lg space-y-6">
                    <h2 className="text-2xl font-bold text-secondary px-2">Your Order History</h2>
                    {userOrders.map(order => (
                        <div key={order.id} className="border rounded-lg p-4 transition-shadow hover:shadow-md">
                            <div className="flex flex-col md:flex-row justify-between md:items-center gap-2 mb-4">
                                <div>
                                    <p className="font-bold text-secondary">Order ID: <span className="font-mono">{order.id}</span></p>
                                    <p className="text-sm text-gray-500">
                                        Placed on: {new Date(order.createdAt).toLocaleString()}
                                    </p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                                        {order.status}
                                    </span>
                                    <p className="font-bold text-lg text-secondary">₦{order.total.toLocaleString()}</p>
                                </div>
                            </div>

                            <div className="space-y-2 border-t pt-4 mb-4">
                                {order.items.map(item => (
                                    <div key={item.id} className="flex items-center gap-3 text-sm">
                                        <img src={item.imageUrl} alt={item.name} className="w-10 h-10 rounded-md object-cover"/>
                                        <p className="font-semibold text-gray-700">{item.name}</p>
                                        <p className="text-gray-500">x {item.quantity}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="flex flex-col md:flex-row justify-end items-center gap-3 pt-4 border-t">
                                <Link to={`/order-status/${order.id}`} className="w-full md:w-auto text-center font-semibold text-primary py-2 px-4 rounded-full hover:bg-primary/10 transition-colors">
                                    View Details
                                </Link>
                                <button 
                                    onClick={() => handleReorder(order.items)}
                                    className="w-full md:w-auto flex items-center justify-center gap-2 bg-primary text-white font-bold py-2 px-4 rounded-full hover:bg-primary-dark transition-colors"
                                >
                                    <RefreshCw size={16} />
                                    Re-order
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CustomerDashboardPage;