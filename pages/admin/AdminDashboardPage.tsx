import React, { useMemo } from 'react';
import { useOrders } from '../../contexts/OrderContext';
import { useMenu } from '../../contexts/MenuContext';
import { useAuth } from '../../contexts/AuthContext';
import { DollarSign, Package, Users, Utensils } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Order } from '../../types';

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ElementType }> = ({ title, value, icon: Icon }) => (
    <div className="bg-white p-6 rounded-2xl shadow-lg flex items-center justify-between">
        <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-3xl font-black text-secondary">{value}</p>
        </div>
        <div className="p-3 bg-primary/10 rounded-full">
            <Icon className="w-6 h-6 text-primary" />
        </div>
    </div>
);

const AdminDashboardPage: React.FC = () => {
    const { orders } = useOrders();
    const { menuCategories } = useMenu();
    const { users } = useAuth();

    const totalRevenue = useMemo(() => 
        orders.reduce((sum, order) => sum + order.total, 0),
    [orders]);

    const totalOrders = orders.length;

    const totalMenuItems = useMemo(() =>
        menuCategories.reduce((sum, category) => sum + category.items.length, 0),
    [menuCategories]);
    
    const totalCustomers = useMemo(() => 
        users.filter(u => u.role === 'customer').length,
    [users]);

    const recentOrders = useMemo(() =>
        [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5),
    [orders]);

    const topSellingItems = useMemo(() => {
        // FIX: Changed Map key type from number to string to match MenuItem.id type.
        const itemCounts = new Map<string, { name: string; count: number; imageUrl: string }>();
        orders.forEach(order => {
            order.items.forEach(item => {
                const existing = itemCounts.get(item.id);
                if (existing) {
                    itemCounts.set(item.id, { ...existing, count: existing.count + item.quantity });
                } else {
                    itemCounts.set(item.id, { name: item.name, count: item.quantity, imageUrl: item.imageUrl });
                }
            });
        });
        return Array.from(itemCounts.values()).sort((a, b) => b.count - a.count).slice(0, 5);
    }, [orders]);

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
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-black text-secondary">Dashboard</h1>
                <p className="text-gray-600">An overview of your restaurant's performance.</p>
            </div>
            
            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Revenue" value={`₦${totalRevenue.toLocaleString()}`} icon={DollarSign} />
                <StatCard title="Total Orders" value={totalOrders} icon={Package} />
                <StatCard title="Total Customers" value={totalCustomers} icon={Users} />
                <StatCard title="Menu Items" value={totalMenuItems} icon={Utensils} />
            </div>

            {/* Recent Orders and Top Items */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-lg">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-secondary">Recent Orders</h2>
                        <Link to="/admin/orders" className="text-sm font-semibold text-primary hover:underline">View All</Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="text-left text-gray-500">
                                <tr>
                                    <th className="py-2 px-3 font-semibold">Order ID</th>
                                    <th className="py-2 px-3 font-semibold">Customer</th>
                                    <th className="py-2 px-3 font-semibold">Total</th>
                                    <th className="py-2 px-3 font-semibold">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentOrders.map(order => (
                                    <tr key={order.id} className="border-t hover:bg-gray-50">
                                        <td className="py-3 px-3 font-mono text-secondary font-semibold">{order.id}</td>
                                        <td className="py-3 px-3">{order.customerDetails.name}</td>
                                        <td className="py-3 px-3 font-bold">₦{order.total.toLocaleString()}</td>
                                        <td className="py-3 px-3">
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                         {recentOrders.length === 0 && <p className="text-center py-8 text-gray-500">No orders have been placed yet.</p>}
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-lg">
                    <h2 className="text-xl font-bold text-secondary mb-4">Top Selling Items</h2>
                    <div className="space-y-4">
                        {topSellingItems.map(item => (
                            <div key={item.name} className="flex items-center gap-4">
                                <img src={item.imageUrl} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
                                <div className="flex-grow">
                                    <p className="font-semibold text-secondary">{item.name}</p>
                                    <p className="text-sm text-gray-500">{item.count} sold</p>
                                </div>
                            </div>
                        ))}
                        {topSellingItems.length === 0 && <p className="text-center py-8 text-gray-500">No sales data available yet.</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboardPage;