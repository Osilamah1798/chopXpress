
import React, { useState, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { User } from '../../types';
import { Edit, Trash2, UserCircle } from 'lucide-react';
import CustomerEditModal from '../../components/admin/CustomerEditModal';

const CustomerManagementPage: React.FC = () => {
    const { users, deleteUser } = useAuth();
    const [editingCustomer, setEditingCustomer] = useState<User | null>(null);

    const customers = useMemo(() => users.filter(u => u.role === 'customer'), [users]);
    
    const handleDelete = (userId: string, username: string) => {
        if (window.confirm(`Are you sure you want to delete the customer "${username}"? This action is permanent.`)) {
            deleteUser(userId);
        }
    };
    
    const handleResetPassword = (username: string) => {
        alert(`Password for "${username}" has been reset to 'password123'.\n(This is a simulated action).`);
    };

    return (
        <div>
            <h1 className="text-3xl font-black text-secondary">Customer Management</h1>
            <p className="text-gray-600 mb-6">View, edit, or remove customer accounts.</p>
            
            <div className="bg-white rounded-2xl shadow-lg overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="text-left text-gray-500 bg-gray-50">
                        <tr>
                            <th className="py-3 px-4 font-semibold">Customer</th>
                            <th className="py-3 px-4 font-semibold">User ID</th>
                            <th className="py-3 px-4 font-semibold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {customers.map(customer => (
                             <tr key={customer.id} className="border-t hover:bg-gray-50">
                                <td className="py-3 px-4 flex items-center gap-3">
                                    {customer.avatarUrl ? (
                                        <img src={customer.avatarUrl} alt={customer.username} className="w-10 h-10 rounded-full object-cover" />
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                                            <UserCircle className="text-gray-400" />
                                        </div>
                                    )}
                                    <span className="font-semibold text-secondary">{customer.username}</span>
                                </td>
                                <td className="py-3 px-4 font-mono text-xs">{customer.id}</td>
                                <td className="py-3 px-4">
                                    <div className="flex justify-end items-center gap-2">
                                        <button 
                                            onClick={() => handleResetPassword(customer.username)}
                                            className="font-semibold text-sm text-blue-600 hover:underline"
                                        >
                                            Reset Password
                                        </button>
                                        <button 
                                            onClick={() => setEditingCustomer(customer)}
                                            className="p-2 text-gray-500 hover:text-primary hover:bg-gray-100 rounded-full"
                                        >
                                          <Edit size={16} />
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(customer.id, customer.username)}
                                            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full"
                                        >
                                          <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                 {customers.length === 0 && <p className="text-center py-12 text-gray-500">No customers have registered yet.</p>}
            </div>

            {editingCustomer && (
                <CustomerEditModal
                    customer={editingCustomer}
                    onClose={() => setEditingCustomer(null)}
                />
            )}
        </div>
    );
};

export default CustomerManagementPage;
