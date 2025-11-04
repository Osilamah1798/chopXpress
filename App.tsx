import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import { HashRouter, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { CartProvider } from './contexts/CartContext';
import { AuthProvider } from './contexts/AuthContext';
import { OrderProvider } from './contexts/OrderContext';
import { MenuProvider } from './contexts/MenuContext';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import MenuPage from './pages/MenuPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderStatusPage from './pages/OrderStatusPage';
import ContactPage from './pages/ContactPage';
import TrackOrderPage from './pages/TrackOrderPage';
import LoginPage from './pages/LoginPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import MenuManagementPage from './pages/admin/MenuManagementPage';
import StaffManagementPage from './pages/admin/StaffManagementPage';
import OrderManagementPage from './pages/admin/OrderManagementPage';
import CustomerManagementPage from './pages/admin/CustomerManagementPage';
import AdminLayout from './components/admin/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';
import CustomerDashboardPage from './pages/CustomerDashboardPage';
import ProfileSettingsPage from './pages/ProfileSettingsPage';

// --- Geolocation Context ---
interface Coordinates {
  latitude: number;
  longitude: number;
}

interface LocationContextType {
  userLocation: Coordinates | null;
  locationError: string | null;
  isLoadingLocation: boolean;
  requestLocation: () => void;
}

export const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);

  const requestLocation = () => {
    setIsLoadingLocation(true);
    setLocationError(null);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setIsLoadingLocation(false);
      },
      (error) => {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError("Geolocation permission was denied.");
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationError("Location information is unavailable.");
            break;
          case error.TIMEOUT:
            setLocationError("The request to get user location timed out.");
            break;
          default:
            setLocationError("An unknown error occurred while fetching location.");
            break;
        }
        setIsLoadingLocation(false);
      }
    );
  };
  
  useEffect(() => {
    requestLocation();
  }, []);

  return (
    <LocationContext.Provider value={{ userLocation, locationError, isLoadingLocation, requestLocation }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};
// --- End Geolocation Context ---


const App: React.FC = () => {
  return (
    <AuthProvider>
      <OrderProvider>
        <MenuProvider>
          <LocationProvider>
            <CartProvider>
              <HashRouter>
                <div className="flex flex-col min-h-screen font-sans">
                  <Header />
                  <main className="flex-grow container mx-auto px-4 py-8">
                    <Routes>
                      {/* Public Routes */}
                      <Route path="/" element={<HomePage />} />
                      <Route path="/login" element={<LoginPage />} />
                      <Route path="/menu" element={<MenuPage />} />
                      <Route path="/cart" element={<CartPage />} />
                      <Route path="/order-status/:orderId" element={<OrderStatusPage />} />
                      <Route path="/track-order" element={<TrackOrderPage />} />
                      <Route path="/contact" element={<ContactPage />} />
                      
                      {/* Customer Protected Routes */}
                      <Route 
                        path="/dashboard"
                        element={
                          <ProtectedRoute roles={['customer']}>
                            <CustomerDashboardPage />
                          </ProtectedRoute>
                        }
                      />
                       <Route 
                        path="/checkout"
                        element={
                          <ProtectedRoute roles={['customer']}>
                            <CheckoutPage />
                          </ProtectedRoute>
                        }
                      />

                      {/* Routes for both Customer and Admin */}
                       <Route 
                        path="/profile"
                        element={
                          <ProtectedRoute roles={['customer', 'admin', 'super-admin']}>
                            <ProfileSettingsPage />
                          </ProtectedRoute>
                        }
                      />

                      {/* Admin Protected Routes */}
                      <Route 
                        path="/admin" 
                        element={
                          <ProtectedRoute roles={['admin', 'super-admin']}>
                            <AdminLayout>
                              <Outlet />
                            </AdminLayout>
                          </ProtectedRoute>
                        }
                      >
                        <Route index element={<Navigate to="dashboard" replace />} />
                        <Route path="dashboard" element={<AdminDashboardPage />} />
                        <Route path="orders" element={<OrderManagementPage />} />
                        <Route path="menu" element={<MenuManagementPage />} />
                        <Route path="customers" element={<CustomerManagementPage />} />
                        <Route 
                          path="staff" 
                          element={
                            <ProtectedRoute roles={['super-admin']}>
                              <StaffManagementPage />
                            </ProtectedRoute>
                          } 
                        />
                      </Route>

                    </Routes>
                  </main>
                  <Footer />
                </div>
              </HashRouter>
            </CartProvider>
          </LocationProvider>
        </MenuProvider>
      </OrderProvider>
    </AuthProvider>
  );
};

export default App;