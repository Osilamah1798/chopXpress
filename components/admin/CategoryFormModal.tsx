import React, { useState, useEffect } from 'react';
import { useMenu } from '../../contexts/MenuContext';
import { MenuCategory } from '../../types';
import { X, AlertCircle } from 'lucide-react';

interface CategoryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  categoryToEdit?: MenuCategory;
}

const CategoryFormModal: React.FC<CategoryFormModalProps> = ({ isOpen, onClose, categoryToEdit }) => {
  const { addCategory, updateCategory } = useMenu();
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (categoryToEdit) {
      setName(categoryToEdit.name);
    } else {
      setName('');
    }
    setError('');
  }, [categoryToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Category name is required.');
      return;
    }

    if (categoryToEdit) {
      updateCategory(categoryToEdit.id, name);
    } else {
      addCategory(name);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md" onClick={e => e.stopPropagation()}>
        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-4">
          <div className="flex justify-between items-center pb-4 border-b">
            <h2 className="text-2xl font-bold text-secondary">{categoryToEdit ? 'Edit Category' : 'Add New Category'}</h2>
            <button type="button" onClick={onClose} className="p-2 rounded-full text-gray-500 hover:bg-gray-100">
              <X size={24} />
            </button>
          </div>
          
          <div>
            <label htmlFor="name" className="block text-sm font-bold text-gray-700 mb-1">Category Name</label>
            <input 
                type="text" 
                name="name" 
                value={name} 
                onChange={(e) => {
                    setName(e.target.value);
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
              {categoryToEdit ? 'Save Changes' : 'Add Category'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryFormModal;
