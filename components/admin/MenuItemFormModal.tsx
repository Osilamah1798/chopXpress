import React, { useState, useEffect } from 'react';
import { useMenu } from '../../contexts/MenuContext';
import { MenuItem } from '../../types';
import { X, AlertCircle, UploadCloud } from 'lucide-react';


interface MenuItemFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemToEdit?: MenuItem;
  initialCategoryId: string;
  allCategories: { id: string, name: string }[];
}

const MenuItemFormModal: React.FC<MenuItemFormModalProps> = ({ isOpen, onClose, itemToEdit, initialCategoryId, allCategories }) => {
  const { addMenuItem, updateMenuItem } = useMenu();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formState, setFormState] = useState({
    name: '',
    description: '',
    price: 0,
    imageUrl: '',
    categoryId: initialCategoryId,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageError, setImageError] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [errors, setErrors] = useState({ name: '', price: '', imageUrl: '' });

  useEffect(() => {
    if (itemToEdit) {
      setFormState({
        name: itemToEdit.name,
        description: itemToEdit.description,
        price: itemToEdit.price,
        imageUrl: itemToEdit.imageUrl,
        categoryId: initialCategoryId,
      });
      setImagePreview(itemToEdit.imageUrl);
    } else {
      setFormState({ name: '', description: '', price: 0, imageUrl: '', categoryId: initialCategoryId || allCategories[0]?.id });
      setImagePreview(null);
    }
    // Reset errors on open
    setErrors({ name: '', price: '', imageUrl: ''});
    setImageError('');
    setIsUploading(false);
  }, [itemToEdit, initialCategoryId, allCategories, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let parsedValue: string | number = value;

    if (name === 'price') {
        parsedValue = parseFloat(value) || 0;
    }
    
    setFormState(prev => ({ ...prev, [name]: parsedValue }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
          setImageError("File is too large. Max size is 2MB.");
          return;
      }
      setIsUploading(true);
      setImageError('');
      
      const previewUrl = URL.createObjectURL(file);
      
      // Simulate upload delay
      setTimeout(() => {
        setFormState(prev => ({ ...prev, imageUrl: previewUrl }));
        setImagePreview(previewUrl);
        setIsUploading(false);
        if (errors.imageUrl) {
          setErrors(prev => ({ ...prev, imageUrl: '' }));
        }
      }, 1000);
    }
  };
  
  const validate = () => {
      let isValid = true;
      const newErrors = { name: '', price: '', imageUrl: ''};
      if (!formState.name.trim()) {
          newErrors.name = "Name is required.";
          isValid = false;
      }
      if (formState.price <= 0) {
          newErrors.price = "Price must be greater than zero.";
          isValid = false;
      }
      if (!formState.imageUrl) {
          newErrors.imageUrl = "An image must be uploaded.";
          isValid = false;
      }
      setErrors(newErrors);
      return isValid;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || isSubmitting || isUploading) return;
    
    setIsSubmitting(true);
    const { categoryId, ...itemData } = formState;

    try {
      if (itemToEdit) {
        await updateMenuItem({ ...itemData, id: itemToEdit.id }, initialCategoryId, categoryId);
      } else {
        await addMenuItem(categoryId, itemData);
      }
      onClose();
    } catch (error) {
      console.error("Failed to save menu item:", error);
      alert("An error occurred while saving the item. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-4">
          <div className="flex justify-between items-center pb-4 border-b">
            <h2 className="text-2xl font-bold text-secondary">{itemToEdit ? 'Edit Menu Item' : 'Add New Item'}</h2>
            <button type="button" onClick={onClose} className="p-2 rounded-full text-gray-500 hover:bg-gray-100">
              <X size={24} />
            </button>
          </div>
          
          <div>
            <label htmlFor="name" className="block text-sm font-bold text-gray-700 mb-1">Name</label>
            <input type="text" name="name" value={formState.name} onChange={handleChange} className={`w-full px-3 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg`} />
            {errors.name && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={14}/>{errors.name}</p>}
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-bold text-gray-700 mb-1">Description</label>
            <textarea name="description" value={formState.description} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" rows={3}></textarea>
          </div>
           <div>
            <label htmlFor="price" className="block text-sm font-bold text-gray-700 mb-1">Price (₦)</label>
            <input type="number" name="price" value={formState.price} onChange={handleChange} className={`w-full px-3 py-2 border ${errors.price ? 'border-red-500' : 'border-gray-300'} rounded-lg`} />
            {errors.price && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={14}/>{errors.price}</p>}
          </div>
          <div>
            <label htmlFor="image" className="block text-sm font-bold text-gray-700 mb-1">Image</label>
            <div className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 ${errors.imageUrl ? 'border-red-500' : 'border-gray-300'} border-dashed rounded-md`}>
                <div className="space-y-1 text-center">
                    {imagePreview ? (
                         <img src={imagePreview} alt="Preview" className="mx-auto h-24 w-24 object-cover rounded-lg" />
                    ) : (
                        <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                    )}
                    <div className="flex text-sm text-gray-600">
                        <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-primary-dark focus-within:outline-none">
                            <span>{isUploading ? 'Uploading...' : 'Upload a file'}</span>
                            <input id="file-upload" name="image" type="file" className="sr-only" accept="image/*" onChange={handleImageChange} disabled={isUploading}/>
                        </label>
                        <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 2MB</p>
                </div>
            </div>
            {errors.imageUrl && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={14}/>{errors.imageUrl}</p>}
            {imageError && <p className="text-orange-500 text-xs mt-1">{imageError}</p>}
          </div>
          <div>
            <label htmlFor="categoryId" className="block text-sm font-bold text-gray-700 mb-1">Category</label>
            <select name="categoryId" value={formState.categoryId} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white">
                {allCategories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
            </select>
          </div>
          
          <div className="flex justify-end gap-4 pt-4 border-t">
            <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 font-bold py-2 px-6 rounded-full hover:bg-gray-300">
              Cancel
            </button>
            <button 
                type="submit"
                disabled={isSubmitting || isUploading}
                className="bg-primary text-white font-bold py-2 px-6 rounded-full hover:bg-primary-dark disabled:bg-primary/50 disabled:cursor-wait"
            >
              {isSubmitting ? 'Saving...' : (itemToEdit ? 'Save Changes' : 'Add Item')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MenuItemFormModal;