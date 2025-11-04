
import React, { useState, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { User, UserRole } from '../../types';
import { Edit, Trash2, UserCircle, Plus, KeyRound } from 'lucide-react';
import StaffAddModal from '../../components/admin/StaffAddModal';
import StaffEditModal from '../../components/admin/StaffEditModal';

const StaffManagementPage: React.FC = () => {
    const { user, users, deleteUser } = useAuth();
    const [isAddModalOpen, setAddModalOpen] = useState(false);
    const [editingStaff, setEditingStaff] = useState<User | null>(null);

    const staffMembers = useMemo(() => users.filter(u => u.role === 'admin' || u.role === 'super-admin'), [users]);
    
    const handleDelete = (staff: User) => {
        if (window.confirm(`Are you sure you want to delete the staff member "${staff.username}"? This action is permanent.`)) {
            deleteUser(staff.id);
        }
    };
    
    const handleResetPassword = (username: string) => {
        alert(`Password for "${username}" has been reset to 'password123'.\n(This is a simulated action).`);
    };
    
    const getRoleStyles = (role: UserRole) => {
        if (role === 'super-admin') return 'bg-red-100 text-red-800 border-red-200';
        if (role === 'admin') return 'bg-blue-100 text-blue-800 border-blue-200';
        return 'bg-gray-100 text-gray-800';
    };

    return (
        <div>
            <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
                <div>
                    <h1 className="text-3xl font-black text-secondary">Staff Management</h1>
                    <p className="text-gray-600">Create, edit, or remove administrator accounts.</p>
                </div>
                 <button
                    onClick={() => setAddModalOpen(true)}
                    className="flex items-center gap-2 bg-primary text-white font-bold py-2 px-4 rounded-full hover:bg-primary-dark transition-colors"
                    >
                    <Plus size={20} /> Add New Staff
                </button>
            </div>
            
            <div className="bg-white rounded-2xl shadow-lg overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="text-left text-gray-500 bg-gray-50">
                        <tr>
                            <th className="py-3 px-4 font-semibold">Staff Member</th>
                            <th className="py-3 px-4 font-semibold">Role</th>
                            <th className="py-3 px-4 font-semibold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {staffMembers.map(staff => (
                             <tr key={staff.id} className="border-t hover:bg-gray-50">
                                <td className="py-3 px-4 flex items-center gap-3">
                                    {staff.avatarUrl ? (
                                        <img src={staff.avatarUrl} alt={staff.username} className="w-10 h-10 rounded-full object-cover" />
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                                            <UserCircle className="text-gray-400" />
                                        </div>
                                    )}
                                    <span className="font-semibold text-secondary">{staff.username}</span>
                                </td>
                                <td className="py-3 px-4">
                                     <span className={`px-2 py-1 text-xs font-bold rounded-md border ${getRoleStyles(staff.role)}`}>
                                        {staff.role.replace('-', ' ').toUpperCase()}
                                    </span>
                                </td>
                                <td className="py-3 px-4">
                                    <div className="flex justify-end items-center gap-1 sm:gap-2">
                                        <button 
                                            onClick={() => handleResetPassword(staff.username)}
                                            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-gray-100 rounded-full"
                                            title="Reset Password"
                                        >
                                            <KeyRound size={16} />
                                        </button>
                                        <button 
                                            onClick={() => setEditingStaff(staff)}
                                            className="p-2 text-gray-500 hover:text-primary hover:bg-gray-100 rounded-full"
                                            title="Edit Staff"
                                        >
                                          <Edit size={16} />
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(staff)}
                                            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full"
                                            title="Delete Staff"
                                            disabled={user?.id === staff.id || staff.role === 'super-admin'}
                                        >
                                          <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                 {staffMembers.length === 0 && <p className="text-center py-12 text-gray-500">No staff members found.</p>}
            </div>

            {isAddModalOpen && (
                <StaffAddModal
                    onClose={() => setAddModalOpen(false)}
                />
            )}
            
            {editingStaff && (
                <StaffEditModal
                    staff={editingStaff}
                    onClose={() => setEditingStaff(null)}
                />
            )}
        </div>
    );
};

export default StaffManagementPage;
