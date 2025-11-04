export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
}

export interface MenuCategory {
  id: string;
  name:string;
  items: MenuItem[];
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface OrderDetails {
    name: string;
    phone: string;
    address: string;
    notes?: string;
}

// User and Auth Types
export type UserRole = 'customer' | 'admin' | 'super-admin';

export interface User {
    id: string; 
    email: string;
    username: string;
    role: UserRole;
    avatarUrl?: string;
}

// Order Management Types
export type OrderStatus = 'Order Received' | 'Preparing Your Meal' | 'Out for Delivery' | 'Delivered' | 'Cancelled';

export const ORDER_STATUSES: OrderStatus[] = [
    'Order Received',
    'Preparing Your Meal',
    'Out for Delivery',
    'Delivered',
    'Cancelled'
];

export interface Order {
    id: string; // e.g., CX-ABC123DEF 
    userId: string; // The ID of the user who placed the order
    customerDetails: OrderDetails;
    items: CartItem[];
    subtotal: number;
    deliveryFee: number;
    total: number;
    status: OrderStatus;
    createdAt: string; // ISO String
    paymentReference?: string; // Added for Paystack transaction reference
}


// Extend window type for Paystack
declare global {
  interface Window {
    PaystackPop: {
      setup(options: any): {
        openIframe(): void;
      };
    };
  }
}