import React, { useState } from 'react';
import { useMenu } from '../../contexts/MenuContext';
import { MenuCategory, MenuItem } from '../../types';
import { Plus, Edit, Trash2, FolderPlus } from 'lucide-react';
import MenuItemFormModal from '../../components/admin/MenuItemFormModal';
import CategoryFormModal from '../../components/admin/CategoryFormModal';

const MenuManagementPage: React.FC = () => {
  const { menuCategories, deleteMenuItem, deleteCategory } = useMenu();
  const [isItemModalOpen, setItemModalOpen] = useState(false);
  const [isCategoryModalOpen, setCategoryModalOpen] = useState(false);
  
  const [editingItem, setEditingItem] = useState<{ categoryId: string, item?: MenuItem } | null>(null);
  const [editingCategory, setEditingCategory] = useState<MenuCategory | null>(null);

  const handleOpenItemModal = (categoryId: string, item?: MenuItem) => {
    setEditingItem({ categoryId, item });
    setItemModalOpen(true);
  };

  const handleCloseItemModal = () => {
    setEditingItem(null);
    setItemModalOpen(false);
  };

  const handleOpenCategoryModal = (category?: MenuCategory) => {
    setEditingCategory(category || null);
    setCategoryModalOpen(true);
  };

  const handleCloseCategoryModal = () => {
    setEditingCategory(null);
    setCategoryModalOpen(false);
  };

  const handleDeleteItem = async (categoryId: string, itemId: string) => {
    if (window.confirm('Are you sure you want to delete this item? This action cannot be undone.')) {
      try {
        await deleteMenuItem(categoryId, itemId);
      } catch (error) {
        console.error("Failed to delete item:", error);
        alert("There was an error deleting the item. Please try again.");
      }
    }
  };

  const handleDeleteCategory = async (categoryId: string, categoryName: string) => {
    if (window.confirm(`Are you sure you want to delete the "${categoryName}" category? All items within it will also be deleted. This action requires a Cloud Function to be fully effective in production.`)) {
      try {
        await deleteCategory(categoryId);
      } catch (error) {
        console.error("Failed to delete category:", error);
        alert("There was an error deleting the category. Please try again.");
      }
    }
  };


  return (
    <div>
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <div>
            <h1 className="text-3xl font-black text-secondary">Menu Management</h1>
            <p className="text-gray-600">Add, edit, or remove dishes and categories from the menu.</p>
        </div>
        <div className="flex gap-2">
            <button
            onClick={() => handleOpenCategoryModal()}
            className="flex items-center gap-2 bg-secondary text-white font-bold py-2 px-4 rounded-full hover:bg-gray-700 transition-colors"
            >
            <FolderPlus size={20} /> Add Category
            </button>
            <button
            onClick={() => handleOpenItemModal(menuCategories[0]?.id || '')}
            disabled={menuCategories.length === 0}
            className="flex items-center gap-2 bg-primary text-white font-bold py-2 px-4 rounded-full hover:bg-primary-dark transition-colors disabled:bg-primary/50 disabled:cursor-not-allowed"
            >
            <Plus size={20} /> Add New Item
            </button>
        </div>
      </div>

      <div className="space-y-10">
        {menuCategories.map((category: MenuCategory) => (
          <div key={category.id} className="bg-white p-6 rounded-2xl shadow-lg">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-secondary">{category.name}</h2>
                <div className="flex items-center gap-2">
                    <button 
                        onClick={() => handleOpenCategoryModal(category)}
                        className="p-2 text-gray-500 hover:text-primary hover:bg-gray-100 rounded-full"
                    >
                      <Edit size={18} />
                    </button>
                    <button 
                        onClick={() => handleDeleteCategory(category.id, category.name)}
                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full"
                    >
                      <Trash2 size={18} />
                    </button>
                </div>
            </div>
            
            <div className="space-y-3">
              {category.items.map((item: MenuItem) => (
                <div key={item.id} className="flex items-center gap-4 p-2 border rounded-lg hover:bg-gray-50">
                  <img src={item.imageUrl} alt={item.name} className="w-16 h-16 rounded-md object-cover" />
                  <div className="flex-grow">
                    <p className="font-bold">{item.name}</p>
                    <p className="text-sm text-gray-500">₦{item.price.toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                        onClick={() => handleOpenItemModal(category.id, item)}
                        className="p-2 text-gray-500 hover:text-primary hover:bg-gray-100 rounded-full"
                    >
                      <Edit size={18} />
                    </button>
                    <button 
                        onClick={() => handleDeleteItem(category.id, item.id)}
                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
              {category.items.length === 0 && <p className="text-sm text-gray-500 text-center py-4">No items in this category. You can add one using the "Add New Item" button.</p>}
            </div>
          </div>
        ))}
         {menuCategories.length === 0 && (
             <div className="text-center py-12 bg-gray-50 rounded-lg">
                <p className="font-semibold text-gray-700">No categories found.</p>
                <p className="text-sm text-gray-500">Get started by adding a new category.</p>
             </div>
         )}
      </div>

      {isItemModalOpen && editingItem && (
        <MenuItemFormModal
          isOpen={isItemModalOpen}
          onClose={handleCloseItemModal}
          itemToEdit={editingItem.item}
          initialCategoryId={editingItem.categoryId}
          allCategories={menuCategories.map(c => ({id: c.id, name: c.name}))}
        />
      )}

      {isCategoryModalOpen && (
          <CategoryFormModal 
            isOpen={isCategoryModalOpen}
            onClose={handleCloseCategoryModal}
            categoryToEdit={editingCategory || undefined}
          />
      )}
    </div>
  );
};

export default MenuManagementPage;