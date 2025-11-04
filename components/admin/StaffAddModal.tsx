import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { X, AlertCircle } from 'lucide-react';

interface StaffAddModalProps {
  onClose: () => void;
}

const StaffAddModal: React.FC<StaffAddModalProps> = ({ onClose }) => {
  const { createStaff } = useAuth();
  const [formState, setFormState] = useState({
    email: '',
    username: '',
    password: '',
    role: 'admin' as 'admin' | 'super-admin',
  });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
    if(error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!formState.email.trim() || !formState.username.trim() || !formState.password.trim()) {
        setError("Email, username, and password are required.");
        return;
    }
     if (formState.password.length < 6) {
        setError('Password must be at least 6 characters long.');
        return;
    }

    const result = await createStaff(formState.email, formState.password, formState.username, formState.role);
    
    if (result.success) {
        onClose();
    } else {
        setError(result.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md" onClick={e => e.stopPropagation()}>
        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-4">
          <div className="flex justify-between items-center pb-4 border-b">
            <h2 className="text-2xl font-bold text-secondary">Add New Staff</h2>
            <button type="button" onClick={onClose} className="p-2 rounded-full text-gray-500 hover:bg-gray-100">
              <X size={24} />
            </button>
          </div>
          
           <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Email</label>
            <input type="email" name="email" value={formState.email} onChange={handleChange} 
                className={`w-full px-3 py-2 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-lg`} />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Username</label>
            <input type="text" name="username" value={formState.username} onChange={handleChange} 
                className={`w-full px-3 py-2 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-lg`} />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Password</label>
            <input type="password" name="password" value={formState.password} onChange={handleChange} 
                className={`w-full px-3 py-2 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-lg`} />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Role</label>
            <select name="role" value={formState.role} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white">
                <option value="admin">Admin</option>
                <option value="super-admin">Super Admin</option>
            </select>
          </div>
          {error && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={14}/>{error}</p>}
          
          <div className="flex justify-end gap-4 pt-4 border-t">
            <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 font-bold py-2 px-6 rounded-full hover:bg-gray-300">
              Cancel
            </button>
            <button type="submit" className="bg-primary text-white font-bold py-2 px-6 rounded-full hover:bg-primary-dark">
              Create Staff
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StaffAddModal;