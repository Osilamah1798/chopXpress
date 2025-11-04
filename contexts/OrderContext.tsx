import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { Order, OrderDetails, CartItem, OrderStatus } from '../types';
import { useAuth } from './AuthContext';


interface OrderContextType {
  orders: Order[];
  createOrder: (customerDetails: OrderDetails, items: CartItem[], deliveryFee: number, paymentReference?: string) => Promise<Order | null>;
  getOrderById: (orderId: string) => Promise<Order | undefined>;
  getOrdersByUserId: (userId: string) => Promise<Order[]>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  listenToOrderById: (orderId: string, callback: (order: Order | null) => void) => () => void;
}

export const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const { user } = useAuth();

  // For admins, listen to all orders in real-time
  useEffect(() => {
    if (user && (user.role === 'admin' || user.role === 'super-admin')) {
        // In a real app, this would fetch orders.
        setOrders([]);
    } else {
      setOrders([]); // Clear orders if not an admin
    }
  }, [user]);

  const createOrder = async (customerDetails: OrderDetails, items: CartItem[], deliveryFee: number, paymentReference?: string): Promise<Order | null> => {
    if (!user) {
      console.error("Cannot create order: no user is logged in.");
      return null;
    }

    alert("Order creation functionality is disabled.");
    return null;
  };

  const getOrderById = async (orderId: string): Promise<Order | undefined> => {
     return undefined;
  };
  
  const getOrdersByUserId = async (userId: string): Promise<Order[]> => {
     return [];
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    alert("Order status update functionality is disabled.");
  };
  
  const listenToOrderById = (orderId: string, callback: (order: Order | null) => void) => {
    callback(null);
    // Return an empty unsubscribe function
    return () => {};
  };


  return (
    <OrderContext.Provider value={{ orders, createOrder, getOrderById, getOrdersByUserId, updateOrderStatus, listenToOrderById }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};