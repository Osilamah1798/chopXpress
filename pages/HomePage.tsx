import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Loader, Utensils } from 'lucide-react';
import { useMenu } from '../contexts/MenuContext';
import { useAuth } from '../contexts/AuthContext';

const HomePage: React.FC = () => {
    const { menuCategories, isLoading } = useMenu();
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user?.role === 'admin' || user?.role === 'super-admin') {
            navigate('/admin/dashboard', { replace: true });
        }
    }, [user, navigate]);


    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader className="w-12 h-12 animate-spin text-primary" />
            </div>
        );
    }

    const featuredItems = [
        menuCategories[0]?.items[0],
        menuCategories[1]?.items[0],
        menuCategories[2]?.items[0],
    ].filter(Boolean);

  return (
    <div className="space-y-16 pb-12">
      {/* Hero Section */}
      <section className="relative text-center rounded-3xl overflow-hidden py-24 px-4">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 bg-secondary">
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{backgroundImage: `url(https://res.cloudinary.com/dq3wljhj9/image/upload/v1761905416/WhatsApp_Image_2025-10-31_at_11.09.39_947daccb_jhq2ep.jpg)`}}>
            </div>
            {/* Darkening overlay for better text readability */}
            <div className="absolute inset-0 bg-black/50"></div>
        </div>
        
        <div className="relative z-10">
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-tight">
            Authentic Nigerian Flavors,
            <br />
            <span className="text-primary">Delivered Fast.</span>
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-gray-200">
            From smoky Jollof to rich Egusi soup, experience the heart of Nigerian cuisine right at your doorstep. Freshly cooked, delivered with love.
          </p>
          <Link
            to="/menu"
            className="mt-10 inline-flex items-center gap-3 bg-primary text-white font-bold py-4 px-8 rounded-full text-lg hover:bg-primary-dark transition-all duration-300 transform hover:scale-105"
          >
            Explore Full Menu
            <ArrowRight size={22} />
          </Link>
        </div>
      </section>

      {/* Featured Items Section */}
      <section>
        <div className="text-center">
            <h2 className="text-4xl font-black text-secondary tracking-tight">Taste The Tradition</h2>
            <p className="mt-3 max-w-xl mx-auto text-gray-600">
                Here's a glimpse of our most-loved dishes, crafted with authentic recipes and the freshest ingredients.
            </p>
        </div>
        {featuredItems.length > 0 ? (
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
                {featuredItems.map(item => (
                    <div key={item.id} className="bg-white rounded-2xl shadow-lg overflow-hidden transform hover:-translate-y-2 transition-all duration-300">
                        <img src={item.imageUrl} alt={item.name} className="w-full h-56 object-cover" />
                        <div className="p-6">
                            <h3 className="text-xl font-bold text-secondary">{item.name}</h3>
                            <p className="text-gray-500 text-sm mt-1">{item.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        ) : (
             <div className="mt-12 text-center py-16 bg-gray-50 rounded-2xl">
                <Utensils className="mx-auto h-16 w-16 text-gray-400" />
                <h3 className="mt-4 text-xl font-bold text-secondary">Our Menu Is Being Prepared!</h3>
                <p className="mt-2 text-gray-500">Admins: Please go to the Menu Management page to add categories and items.</p>
             </div>
        )}
      </section>

      {/* How it works Section */}
       <section className="bg-white p-12 rounded-2xl shadow-lg">
        <div className="text-center mb-10">
            <h2 className="text-4xl font-black text-secondary tracking-tight">Quick & Easy Ordering</h2>
            <p className="mt-3 max-w-xl mx-auto text-gray-600">Get your favorite meal in just 3 simple steps.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
                <div className="flex items-center justify-center w-20 h-20 bg-primary/10 text-primary rounded-full mb-4">
                    <span className="text-3xl font-bold">1</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Browse The Menu</h3>
                <p className="text-gray-600">Explore our categories and pick your favorite dishes.</p>
            </div>
            <div className="flex flex-col items-center">
                <div className="flex items-center justify-center w-20 h-20 bg-primary/10 text-primary rounded-full mb-4">
                     <span className="text-3xl font-bold">2</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Place Your Order</h3>
                <p className="text-gray-600">Add items to your cart and provide your delivery details.</p>
            </div>
            <div className="flex flex-col items-center">
                <div className="flex items-center justify-center w-20 h-20 bg-primary/10 text-primary rounded-full mb-4">
                     <span className="text-3xl font-bold">3</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Enjoy Your Meal</h3>
                <p className="text-gray-600">We'll deliver your hot and fresh meal to your doorstep.</p>
            </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;