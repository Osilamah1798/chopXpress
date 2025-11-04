
import React, { useState } from 'react';
import { NavLink, useLocation, Link } from 'react-router-dom';
import { LayoutDashboard, Utensils, Users, Package, Menu, X, ChefHat, Briefcase } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();

  const navLinks = [
    { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin/orders', icon: Package, label: 'Orders' },
    { to: '/admin/menu', icon: Utensils, label: 'Menu' },
    { to: '/admin/customers', icon: Users, label: 'Customers' },
    ...(user?.role === 'super-admin' ? [{ to: '/admin/staff', icon: Briefcase, label: 'Staff' }] : []),
  ];

  const getNavLinkClass = (path: string) => {
    const isActive = location.pathname.startsWith(path);
    return `flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
      isActive
        ? 'bg-primary/10 text-primary font-bold'
        : 'text-gray-600 hover:bg-gray-100 hover:text-secondary'
    }`;
  };

  const SidebarContent = () => (
    <div className="flex h-full max-h-screen flex-col gap-2">
      <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <ChefHat className="h-6 w-6 text-primary" />
          <span className="">ChopXpress Admin</span>
        </Link>
      </div>
      <div className="flex-1">
        <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
          {navLinks.map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to} className={getNavLinkClass(to)} onClick={() => setSidebarOpen(false)}>
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );

  return (
    <div className="grid min-h-[calc(100vh-10rem)] w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      {/* Mobile Sidebar */}
      <div className={`fixed inset-0 z-40 bg-black/50 transition-opacity md:hidden ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setSidebarOpen(false)}></div>
      <div 
        className={`fixed top-0 left-0 h-full w-64 bg-white z-50 transform transition-transform duration-300 ease-in-out md:hidden ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <SidebarContent />
         <button onClick={() => setSidebarOpen(false)} className="absolute top-3 right-3 p-2 text-gray-500">
            <X size={20}/>
        </button>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden border-r bg-white md:block">
        <SidebarContent />
      </div>
      
      <div className="flex flex-col">
         {/* Mobile Header */}
        <header className="flex h-14 items-center gap-4 border-b bg-white px-4 lg:h-[60px] lg:px-6 md:hidden">
            <button
                className="p-2 text-gray-600"
                onClick={() => setSidebarOpen(true)}
            >
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open sidebar</span>
            </button>
            <div className="w-full flex-1">
                <h1 className="text-lg font-semibold">Admin Panel</h1>
            </div>
        </header>

        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-gray-50/50">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
