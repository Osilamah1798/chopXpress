
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useMenu } from '../contexts/MenuContext';
import MenuItemCard from '../components/MenuItemCard';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../contexts/AuthContext';
import { MenuItem } from '../types';
import { Loader } from 'lucide-react';

const MenuPage: React.FC = () => {
  const { menuCategories, isLoading } = useMenu();
  const { dispatch } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleAddToCart = (item: MenuItem) => {
    if (!user) {
      // If not logged in, redirect to login, saving the current location
      // to redirect back to after a successful login.
      navigate('/login', { state: { from: { pathname: '/menu' } } });
    } else {
      // If logged in, add the item to the cart
      dispatch({ type: 'ADD_ITEM', payload: item });
    }
  };

  if (isLoading) {
    return (
        <div className="flex justify-center items-center h-64">
            <Loader className="w-12 h-12 animate-spin text-primary" />
        </div>
    );
  }

  return (
    <div className="space-y-12">
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-black text-secondary tracking-tight">Our Delicious Menu</h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
          Authentic Nigerian dishes, freshly prepared and delivered to your doorstep.
        </p>
      </div>
      
      <div className="space-y-16">
        {menuCategories.map((category) => (
          <section key={category.name}>
            <h2 className="text-3xl font-bold text-secondary mb-6 pb-2 border-b-4 border-primary inline-block">{category.name}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {category.items.map((item) => (
                <MenuItemCard key={item.id} item={item} onAddToCart={handleAddToCart} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};

export default MenuPage;
