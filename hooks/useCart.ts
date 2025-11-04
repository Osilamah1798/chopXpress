
import { useContext } from 'react';
import { CartContext } from '../contexts/CartContext';
import { useLocation } from '../App';
import { useAuth } from '../contexts/AuthContext';
import { 
  RESTAURANT_LOCATION, 
  DELIVERY_FEE,
  MAX_DELIVERY_DISTANCE_KM 
} from '../constants';

interface Coordinates {
  latitude: number;
  longitude: number;
}

/**
 * Calculates the distance between two points in km using the Haversine formula.
 */
const calculateDistance = (point1: Coordinates, point2: Coordinates): number => {
  const R = 6371; // Radius of the Earth in km
  const dLat = (point2.latitude - point1.latitude) * Math.PI / 180;
  const dLon = (point2.longitude - point1.longitude) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(point1.latitude * Math.PI / 180) * Math.cos(point2.latitude * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
};


export const useCart = () => {
  const context = useContext(CartContext);
  const { user } = useAuth();

  if (user?.role === 'admin' || user?.role === 'super-admin') {
    return {
      cartItems: [],
      dispatch: () => {}, // No-op dispatch for admins
      totalItems: 0,
      subtotal: 0,
      total: 0,
      deliveryFee: 0,
      distance: null,
      deliveryMessage: 'Cart is disabled for administrators.',
      isOutOfZone: false,
    };
  }
  
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }

  const { state, dispatch } = context;
  const { userLocation, locationError, isLoadingLocation } = useLocation();

  const subtotal = state.items.reduce((total, item) => total + item.price * item.quantity, 0);
  const totalItems = state.items.reduce((total, item) => total + item.quantity, 0);

  let deliveryFee = DELIVERY_FEE;
  let distance: number | null = null;
  let deliveryMessage: string | null = null;
  let isOutOfZone = false;

  if (subtotal === 0) {
    deliveryFee = 0;
  } else if (isLoadingLocation) {
    deliveryFee = 0; // Don't show a fee while calculating
    deliveryMessage = "Calculating delivery fee based on your location...";
  } else if (locationError) {
    deliveryFee = DELIVERY_FEE;
    deliveryMessage = `Could not determine your location. A base delivery fee will be applied. Error: ${locationError}`;
  } else if (userLocation) {
    distance = calculateDistance(userLocation, RESTAURANT_LOCATION);
    if (distance <= MAX_DELIVERY_DISTANCE_KM) {
      deliveryFee = DELIVERY_FEE;
      deliveryMessage = `You are ${distance.toFixed(1)}km away. Delivery fee calculated.`;
    } else {
      isOutOfZone = true;
      deliveryFee = 0; // No fee since we can't deliver
      deliveryMessage = `Sorry, at ${distance.toFixed(1)}km away, you are outside our ${MAX_DELIVERY_DISTANCE_KM}km delivery zone.`;
    }
  }
  
  const total = subtotal + deliveryFee;

  return {
    cartItems: state.items,
    dispatch,
    totalItems,
    subtotal,
    total,
    deliveryFee,
    distance,
    deliveryMessage,
    isOutOfZone,
  };
};
