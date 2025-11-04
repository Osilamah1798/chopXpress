import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { User } from '../../types';
import { X, AlertCircle } from 'lucide-react';

interface CustomerEditModalProps {
  customer: User;
  onClose: () => void;
}

const CustomerEditModal: React.FC<CustomerEditModalProps> = ({ customer, onClose }) => {
  const { updateUser } = useAuth();
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (customer) {
      setUsername(customer.username);
    }
  }, [customer]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setError('Username cannot be empty.');
      return;
    }

    if (username.trim() !== customer.username) {
        updateUser(customer.id, { username: username.trim() });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md" onClick={e => e.stopPropagation()}>
        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-4">
          <div className="flex justify-between items-center pb-4 border-b">
            <h2 className="text-2xl font-bold text-secondary">Edit Customer</h2>
            <button type="button" onClick={onClose} className="p-2 rounded-full text-gray-500 hover:bg-gray-100">
              <X size={24} />
            </button>
          </div>
          
          <div>
            <label htmlFor="username" className="block text-sm font-bold text-gray-700 mb-1">Username</label>
            <input 
                type="text" 
                name="username" 
                value={username} 
                onChange={(e) => {
                    setUsername(e.target.value);
                    if (error) setError('');
                }} 
                className={`w-full px-3 py-2 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-lg`} 
            />
            {error && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={14}/>{error}</p>}
          </div>
          
          <div className="flex justify-end gap-4 pt-4 border-t">
            <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 font-bold py-2 px-6 rounded-full hover:bg-gray-300">
              Cancel
            </button>
            <button type="submit" className="bg-primary text-white font-bold py-2 px-6 rounded-full hover:bg-primary-dark">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomerEditModal;