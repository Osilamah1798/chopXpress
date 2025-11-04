
import React from 'react';
import { PlusCircle } from 'lucide-react';
import { MenuItem } from '../types';

interface MenuItemCardProps {
  item: MenuItem;
  onAddToCart: (item: MenuItem) => void;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({ item, onAddToCart }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden transform hover:-translate-y-1 transition-all duration-300 flex flex-col">
      <img src={item.imageUrl} alt={item.name} className="w-full h-48 object-cover" />
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-secondary mb-2">{item.name}</h3>
        <p className="text-gray-600 text-sm flex-grow mb-4">{item.description}</p>
        <div className="flex justify-between items-center mt-auto">
          <span className="text-2xl font-black text-secondary">
            ₦{item.price.toLocaleString()}
          </span>
          <button
            onClick={() => onAddToCart(item)}
            className="flex items-center gap-2 bg-primary text-white font-bold py-2 px-4 rounded-full hover:bg-primary-dark transition-colors duration-300"
          >
            <PlusCircle size={20} />
            <span>Add</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuItemCard;
