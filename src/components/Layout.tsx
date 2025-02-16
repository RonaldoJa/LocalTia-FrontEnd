import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../core/auth/AuthContext'; 
import {
  Store,
  Package,
  BarChart3,
  ShoppingCart,
  LogOut,
  Users,
  Warehouse,
  CreditCard,
  Box
} from 'lucide-react';

function Layout() {
  const { isAuthenticated, logout } = useAuth(); 
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await logout();
    navigate('/login');
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link to="/" className="flex items-center px-4 font-semibold text-gray-700">
                Sistema de Gestión
              </Link>
              <div className="flex space-x-4 ml-10">
                <Link
                  to="/Products"
                  className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-900"
                >
                  <Package className="w-5 h-5 mr-1" />
                  Productos
                </Link>
                <Link
                  to="/locales"
                  className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-900"
                >
                  <Store className="w-5 h-5 mr-1" />
                  Locales
                </Link>
                <Link
                  to="/clients"
                  className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-900"
                >
                  <Users className="w-5 h-5 mr-1" />
                  Clientes
                </Link>
                <Link
                  to="/stocks"
                  className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-900"
                >
                  <Warehouse className="w-5 h-5 mr-1" />
                  Stocks
                </Link>
                <Link
                  to="/sales"
                  className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-900"
                >
                  <CreditCard className="w-5 h-5 mr-1" />
                  Ventas
                </Link>
                <Link
                  to="/"
                  className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-900"
                >
                  <BarChart3 className="w-5 h-5 mr-1" />
                  Dashboard
                </Link>
              </div>
            </div>
            <div className="flex items-center">
              <button
                onClick={handleSignOut}
                className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-900"
              >
                <LogOut className="w-5 h-5 mr-1" />
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 px-4">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;