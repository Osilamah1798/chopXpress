
import React from 'react';
import { ChefHat } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-secondary text-gray-300">
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="flex justify-center items-center gap-2 mb-4">
            <ChefHat className="w-7 h-7 text-primary" />
            <span className="text-xl font-bold text-white">ChopXpress</span>
        </div>
        <p className="text-sm">Delivering happiness, one meal at a time.</p>
        <p className="text-xs mt-1 text-gray-400">Fast local delivery.</p>
        <div className="mt-4 text-xs text-gray-500">
          &copy; {new Date().getFullYear()} ChopXpress. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
