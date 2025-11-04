import React, { createContext, useState, useEffect, useContext, ReactNode, useCallback } from 'react';
import { MenuCategory, MenuItem } from '../types';


interface MenuContextType {
  menuCategories: MenuCategory[];
  isLoading: boolean;
  addMenuItem: (categoryId: string, item: Omit<MenuItem, 'id'>) => Promise<void>;
  updateMenuItem: (updatedItem: MenuItem, fromCategoryId: string, toCategoryId: string) => Promise<void>;
  deleteMenuItem: (categoryId: string, itemId: string) => Promise<void>;
  addCategory: (name: string) => Promise<void>;
  updateCategory: (id: string, name: string) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
}

export const MenuContext = createContext<MenuContextType | undefined>(undefined);

export const MenuProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [menuCategories, setMenuCategories] = useState<MenuCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMenu = useCallback(async () => {
    setIsLoading(true);
    // Data fetching logic is removed. App will show an empty menu.
    setMenuCategories([]);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchMenu();
  }, [fetchMenu]);

  const addMenuItem = async (categoryId: string, item: Omit<MenuItem, 'id'>) => {
    alert("Menu item functionality is disabled.");
  };
  
  const updateMenuItem = async (updatedItem: MenuItem, fromCategoryId: string, toCategoryId: string) => {
     alert("Menu item functionality is disabled.");
  };
  
  const deleteMenuItem = async (categoryId: string, itemId: string) => {
    alert("Menu item functionality is disabled.");
  };

  const addCategory = async (name: string) => {
    alert("Category functionality is disabled.");
  };

  const updateCategory = async (id: string, name: string) => {
    alert("Category functionality is disabled.");
  };

  const deleteCategory = async (id: string) => {
    alert("Category functionality is disabled.");
  };


  return (
    <MenuContext.Provider value={{ 
        menuCategories, 
        isLoading, 
        addMenuItem, 
        updateMenuItem, 
        deleteMenuItem,
        addCategory,
        updateCategory,
        deleteCategory
    }}>
      {children}
    </MenuContext.Provider>
  );
};

export const useMenu = () => {
  const context = useContext(MenuContext);
  if (context === undefined) {
    throw new Error('useMenu must be used within a MenuProvider');
  }
  return context;
};