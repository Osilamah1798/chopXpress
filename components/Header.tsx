
import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { ShoppingCart, ChefHat, LogIn, LogOut, UserCircle, LayoutDashboard, Package, Settings, ChevronDown, Menu, X } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../contexts/AuthContext';

const Header: React.FC = () => {
  const { totalItems } = useCart();
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isAdmin = user?.role === 'admin' || user?.role === 'super-admin';


  const desktopNavLinkClasses = ({ isActive }: { isActive: boolean }): string =>
    `flex items-center gap-2 text-sm font-semibold transition-colors duration-200 ${
      isActive ? 'text-primary' : 'text-gray-600 hover:text-primary'
    }`;
    
  const mobileNavLinkClasses = ({ isActive }: { isActive: boolean }): string =>
    `flex items-center gap-3 text-lg font-semibold transition-colors duration-200 p-3 rounded-lg ${
      isActive ? 'bg-primary/10 text-primary' : 'text-gray-700 hover:bg-gray-100'
    }`;
    
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  
  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMobileMenuOpen]);
  
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <>
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-20">
            <Link to="/" className="flex items-center gap-2">
              <ChefHat className="w-8 h-8 text-primary" />
              <span className="text-2xl font-black text-secondary tracking-tight">
                ChopXpress
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-8">
              {!isAdmin && (
                <>
                  <NavLink to="/menu" className={desktopNavLinkClasses}>Menu</NavLink>
                  {user && <NavLink to="/track-order" className={desktopNavLinkClasses}>Track Order</NavLink>}
                   {user?.role === 'customer' && (
                      <NavLink to="/dashboard" className={desktopNavLinkClasses}><Package size={16}/>My Orders</NavLink>
                  )}
                  <NavLink to="/contact" className={desktopNavLinkClasses}>Contact</NavLink>
                </>
              )}
            </nav>

            <div className="flex items-center gap-2 sm:gap-4">
              {user && user.role === 'customer' && (
                <Link to="/cart" className="relative p-2 rounded-full text-gray-600 hover:bg-gray-100 hover:text-primary transition-colors">
                  <ShoppingCart className="w-6 h-6" />
                  {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 bg-primary text-white text-xs font-bold rounded-full">
                      {totalItems}
                    </span>
                  )}
                </Link>
              )}
              
              {/* Desktop User Actions */}
              <div className="hidden md:flex items-center gap-4">
                {user && user.role === 'customer' && <div className="w-px h-6 bg-gray-200"></div>}
                {user ? (
                    <div className="relative" ref={dropdownRef}>
                        <button 
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="flex items-center gap-2 text-sm font-semibold text-secondary pl-2 pr-3 py-2 rounded-full hover:bg-gray-100 transition-colors"
                        >
                            {user.avatarUrl ? (
                                <img src={user.avatarUrl} alt="User Avatar" className="w-7 h-7 rounded-full object-cover" />
                            ) : (
                                <UserCircle size={24} className="text-gray-500" />
                            )}
                            {user.username}
                            <ChevronDown size={16} className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}/>
                        </button>
                        {isDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border py-2 z-50">
                               <Link to={isAdmin ? '/admin' : '/dashboard'} onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                    {isAdmin ? <LayoutDashboard size={16}/> : <Package size={16} />}
                                    <span>{isAdmin ? 'Admin Dashboard' : 'My Orders'}</span>
                               </Link>
                               <Link to="/profile" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                    <Settings size={16}/>
                                    <span>Profile Settings</span>
                               </Link>
                               <div className="my-1 h-px bg-gray-100"></div>
                               <button onClick={() => { logout(); setIsDropdownOpen(false); }} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                                   <LogOut size={16}/>
                                   <span>Logout</span>
                               </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <Link to="/login" className="flex items-center gap-2 text-sm font-semibold bg-primary/10 text-primary px-4 py-2 rounded-full hover:bg-primary/20 transition-colors">
                        <LogIn size={16} />
                        Login
                    </Link>
                )}
              </div>
              
              {/* Mobile Actions */}
              <div className="md:hidden">
                {!user ? (
                  <Link to="/login" className="flex items-center gap-2 text-sm font-semibold bg-primary/10 text-primary px-4 py-2 rounded-full hover:bg-primary/20 transition-colors">
                      <LogIn size={16} />
                      Login
                  </Link>
                ) : user.role === 'customer' ? (
                   <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 rounded-full text-gray-600 hover:bg-gray-100">
                      <Menu className="w-6 h-6" />
                  </button>
                ) : null }
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar */}
      <div className={`fixed inset-0 z-50 md:hidden transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-black/60" onClick={closeMobileMenu}></div>
        <div className={`relative z-10 h-full w-80 max-w-[calc(100%-3rem)] bg-white p-6 flex flex-col transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex justify-between items-center mb-10">
            <Link to="/" onClick={closeMobileMenu} className="flex items-center gap-2">
              <ChefHat className="w-7 h-7 text-primary" />
              <span className="text-xl font-black text-secondary">ChopXpress</span>
            </Link>
            <button onClick={closeMobileMenu} className="p-2 rounded-full text-gray-500 hover:bg-gray-100">
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <nav className="flex flex-col gap-2">
              {!isAdmin && (
                <>
                  <NavLink to="/menu" className={mobileNavLinkClasses} onClick={closeMobileMenu}>Menu</NavLink>
                  {user && <NavLink to="/track-order" className={mobileNavLinkClasses} onClick={closeMobileMenu}>Track Order</NavLink>}
                </>
              )}
               {user?.role === 'customer' && (
                  <NavLink to="/dashboard" className={mobileNavLinkClasses} onClick={closeMobileMenu}>My Orders</NavLink>
              )}
              {isAdmin && (
                  <NavLink to="/admin/dashboard" className={mobileNavLinkClasses} onClick={closeMobileMenu}>Dashboard</NavLink>
              )}
              <NavLink to="/contact" className={mobileNavLinkClasses} onClick={closeMobileMenu}>Contact</NavLink>
          </nav>
          
          <div className="mt-auto border-t pt-6">
            {user ? (
                 <div className="space-y-4">
                    <Link to="/profile" onClick={closeMobileMenu} className="flex items-center gap-3 text-left p-3 -m-3 rounded-lg hover:bg-gray-100">
                         {user.avatarUrl ? (
                            <img src={user.avatarUrl} alt="User Avatar" className="w-10 h-10 rounded-full object-cover" />
                        ) : (
                            <UserCircle size={40} className="text-gray-400" />
                        )}
                        <div>
                            <p className="font-bold text-secondary">{user.username}</p>
                            <p className="text-sm text-primary">View Profile</p>
                        </div>
                    </Link>
                   <button onClick={() => { logout(); closeMobileMenu(); }} className="w-full flex items-center gap-3 p-3 rounded-lg text-lg font-semibold text-red-600 hover:bg-red-50">
                       <LogOut size={20}/>
                       <span>Logout</span>
                   </button>
                </div>
            ) : (
                 <Link to="/login" onClick={closeMobileMenu} className="flex items-center justify-center gap-3 w-full bg-primary text-white font-bold py-3 px-6 rounded-full text-lg hover:bg-primary-dark transition-colors">
                    <LogIn size={20} />
                    <span>Login / Sign Up</span>
                </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
